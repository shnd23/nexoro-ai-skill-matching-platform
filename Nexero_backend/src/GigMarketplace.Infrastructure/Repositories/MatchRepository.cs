using GigMarketplace.Domain.Entities;
using GigMarketplace.Domain.Enums;
using GigMarketplace.Domain.Interfaces;
using GigMarketplace.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace GigMarketplace.Infrastructure.Repositories;

public class MatchRepository : IMatchRepository
{
    private readonly AppDbContext _db;

    public MatchRepository(AppDbContext db) => _db = db;

    public async Task<Match?> GetByIdAsync(Guid id)
        => await _db.Matches
            .Include(m => m.GigRequest).ThenInclude(g => g.Author)
            .Include(m => m.GigRequest).ThenInclude(g => g.RequiredSkills).ThenInclude(rs => rs.Skill)
            .Include(m => m.CandidateUser)
            .FirstOrDefaultAsync(m => m.Id == id);

    public async Task<List<Match>> GetByGigRequestIdAsync(Guid gigRequestId)
        => await _db.Matches
            .Where(m => m.GigRequestId == gigRequestId)
            .Include(m => m.CandidateUser).ThenInclude(u => u.SkillsOffered).ThenInclude(us => us.Skill)
            .OrderByDescending(m => m.Score)
            .ToListAsync();

    public async Task<List<Match>> GetByCandidateUserIdAsync(Guid userId, MatchStatus? statusFilter = null)
    {
        var query = _db.Matches
            .Where(m => m.CandidateUserId == userId);

        if (statusFilter.HasValue)
            query = query.Where(m => m.Status == statusFilter.Value);

        return await query
            .Include(m => m.GigRequest).ThenInclude(g => g.Author)
            .Include(m => m.GigRequest).ThenInclude(g => g.RequiredSkills).ThenInclude(rs => rs.Skill)
            .OrderByDescending(m => m.Score)
            .ToListAsync();
    }

    public async Task<Match> CreateAsync(Match match)
    {
        _db.Matches.Add(match);
        await _db.SaveChangesAsync();
        return match;
    }

    public async Task CreateRangeAsync(IEnumerable<Match> matches)
    {
        _db.Matches.AddRange(matches);
        await _db.SaveChangesAsync();
    }

    public async Task UpdateAsync(Match match)
    {
        _db.Matches.Update(match);
        await _db.SaveChangesAsync();
    }
}
