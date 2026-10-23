using System.Net.Http.Json;
using GigMarketplace.Domain.Entities;
using GigMarketplace.Domain.Interfaces;
using GigMarketplace.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace GigMarketplace.Infrastructure.Services;

file record PyCandidate(string user_id, string profile_text);
file record PyRankRequest(string query_text, List<PyCandidate> candidates);
file record PyRankedCandidate(string user_id, float similarity);
file record PyRankResponse(List<PyRankedCandidate> results);

public class HybridMatchingService : IMatchingService
{
    private readonly AppDbContext _db;
    private readonly HttpClient _http;
    private readonly ILogger<HybridMatchingService> _logger;
    private readonly string _matchingServiceUrl;
    private const int MaxCandidates = 10;

    public HybridMatchingService(
        AppDbContext db,
        IHttpClientFactory httpClientFactory,
        IConfiguration config,
        ILogger<HybridMatchingService> logger)
    {
        _db = db;
        _http = httpClientFactory.CreateClient("MatchingService");
        _logger = logger;
        _matchingServiceUrl = config["MatchingService:BaseUrl"] ?? "http://localhost:8000";
    }

    public async Task<List<MatchCandidate>> FindCandidatesAsync(GigRequest request)
    {

        var requiredSkillIds = request.RequiredSkills
            .Select(rs => rs.SkillId)
            .ToHashSet();

        if (requiredSkillIds.Count == 0)
            return new List<MatchCandidate>();

        var dbCandidates = await _db.Users
            .Where(u => u.Id != request.AuthorId)
            .Where(u => u.SkillsOffered.Any(us => requiredSkillIds.Contains(us.SkillId)))
            .Select(u => new
            {
                UserId = u.Id,
                Bio = u.Bio ?? "",
                Skills = u.SkillsOffered
                    .Where(us => requiredSkillIds.Contains(us.SkillId))
                    .Select(us => us.Skill.Name)
                    .ToList(),
                AllSkills = u.SkillsOffered.Select(us => us.Skill.Name).ToList(),
                OverlapCount = u.SkillsOffered.Count(us => requiredSkillIds.Contains(us.SkillId))
            })
            .ToListAsync();

        if (dbCandidates.Count == 0)
            return new List<MatchCandidate>();

        var overlapScores = dbCandidates.ToDictionary(
            c => c.UserId,
            c => (float)c.OverlapCount / requiredSkillIds.Count
        );

        var pyRequest = new PyRankRequest(
            query_text: $"{request.Title} {request.Description}",
            candidates: dbCandidates.Select(c => new PyCandidate(
                user_id: c.UserId.ToString(),
                profile_text: $"{c.Bio} {string.Join(" ", c.AllSkills)}".Trim()
            )).ToList()
        );

        Dictionary<Guid, float> semanticScores;
        try
        {
            var response = await _http.PostAsJsonAsync($"{_matchingServiceUrl}/rank", pyRequest);
            response.EnsureSuccessStatusCode();
            var pyResponse = await response.Content.ReadFromJsonAsync<PyRankResponse>();

            semanticScores = pyResponse!.results.ToDictionary(
                r => Guid.Parse(r.user_id),
                r => r.similarity
            );

            _logger.LogInformation(
                "[HybridMatchingService] Got {Count} semantic scores from matching service",
                semanticScores.Count);
        }
        catch (Exception ex)
        {

            _logger.LogWarning(
                "[HybridMatchingService] ML service unavailable ({Error}), falling back to tag-overlap only",
                ex.Message);

            return dbCandidates
                .Select(c => new MatchCandidate(c.UserId, overlapScores[c.UserId]))
                .OrderByDescending(c => c.Score)
                .Take(MaxCandidates)
                .ToList();
        }

        return dbCandidates
            .Select(c =>
            {
                var tagScore = overlapScores[c.UserId];
                var semScore = semanticScores.TryGetValue(c.UserId, out var s) ? s : 0f;
                var blended = 0.4f * tagScore + 0.6f * semScore;
                return new MatchCandidate(c.UserId, blended);
            })
            .OrderByDescending(c => c.Score)
            .Take(MaxCandidates)
            .ToList();
    }
}
