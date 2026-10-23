using GigMarketplace.Domain.Entities;
using GigMarketplace.Domain.Interfaces;
using GigMarketplace.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace GigMarketplace.Infrastructure.Services;

public class TagOverlapMatchingService : IMatchingService
{
    private readonly AppDbContext _db;
    private const int MaxCandidates = 10;

    public TagOverlapMatchingService(AppDbContext db) => _db = db;

    public async Task<List<MatchCandidate>> FindCandidatesAsync(GigRequest request)
    {

        var requiredSkillIds = request.RequiredSkills
            .Select(rs => rs.SkillId)
            .ToHashSet();

        if (requiredSkillIds.Count == 0)
            return new List<MatchCandidate>();

        var candidates = await _db.Users
            .Where(u => u.Id != request.AuthorId)
            .Where(u => u.SkillsOffered.Any(us => requiredSkillIds.Contains(us.SkillId)))
            .Select(u => new
            {
                UserId = u.Id,
                OverlapCount = u.SkillsOffered.Count(us => requiredSkillIds.Contains(us.SkillId))
            })
            .ToListAsync();

        return candidates
            .Select(c => new MatchCandidate(c.UserId, (float)c.OverlapCount / requiredSkillIds.Count))
            .OrderByDescending(c => c.Score)
            .Take(MaxCandidates)
            .ToList();
    }
}
