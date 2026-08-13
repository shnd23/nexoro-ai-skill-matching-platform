using GigMarketplace.Domain.Entities;
using GigMarketplace.Domain.Interfaces;
using GigMarketplace.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace GigMarketplace.Infrastructure.Services;

/// <summary>
/// Placeholder matching service that scores candidates by tag overlap only.
/// Will be replaced by HybridMatchingService (ML-based) in a future phase.
/// </summary>
public class TagOverlapMatchingService : IMatchingService
{
    private readonly AppDbContext _db;
    private const int MaxCandidates = 10;

    public TagOverlapMatchingService(AppDbContext db) => _db = db;

    public async Task<List<MatchCandidate>> FindCandidatesAsync(GigRequest request)
    {
        // Get the required skill IDs for this gig
        var requiredSkillIds = request.RequiredSkills
            .Select(rs => rs.SkillId)
            .ToHashSet();

        if (requiredSkillIds.Count == 0)
            return new List<MatchCandidate>();

        // Find all users (excluding the gig author) who have at least one overlapping skill
        var candidates = await _db.Users
            .Where(u => u.Id != request.AuthorId)
            .Where(u => u.SkillsOffered.Any(us => requiredSkillIds.Contains(us.SkillId)))
            .Select(u => new
            {
                UserId = u.Id,
                OverlapCount = u.SkillsOffered.Count(us => requiredSkillIds.Contains(us.SkillId))
            })
            .ToListAsync();

        // Score = overlapping / required (0.0 to 1.0)
        return candidates
            .Select(c => new MatchCandidate(c.UserId, (float)c.OverlapCount / requiredSkillIds.Count))
            .OrderByDescending(c => c.Score)
            .Take(MaxCandidates)
            .ToList();
    }
}
