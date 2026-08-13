using GigMarketplace.Domain.Entities;
using GigMarketplace.Domain.Interfaces;
using GigMarketplace.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace GigMarketplace.Infrastructure.Repositories;

public class GigRequestRepository : IGigRequestRepository
{
    private readonly AppDbContext _db;

    public GigRequestRepository(AppDbContext db) => _db = db;

    public async Task<GigRequest?> GetByIdAsync(Guid id)
        => await _db.GigRequests
            .Include(g => g.Author)
            .Include(g => g.RequiredSkills).ThenInclude(rs => rs.Skill)
            .FirstOrDefaultAsync(g => g.Id == id);

    public async Task<GigRequest?> GetByIdWithSkillsAsync(Guid id)
        => await _db.GigRequests
            .Include(g => g.RequiredSkills).ThenInclude(rs => rs.Skill)
            .FirstOrDefaultAsync(g => g.Id == id);

    public async Task<List<GigRequest>> GetByAuthorIdAsync(Guid authorId)
        => await _db.GigRequests
            .Where(g => g.AuthorId == authorId)
            .Include(g => g.RequiredSkills).ThenInclude(rs => rs.Skill)
            .Include(g => g.Matches)
            .OrderByDescending(g => g.CreatedAt)
            .ToListAsync();

    public async Task<GigRequest> CreateAsync(GigRequest gigRequest)
    {
        _db.GigRequests.Add(gigRequest);
        await _db.SaveChangesAsync();
        return gigRequest;
    }

    public async Task UpdateAsync(GigRequest gigRequest)
    {
        _db.GigRequests.Update(gigRequest);
        await _db.SaveChangesAsync();
    }
}
