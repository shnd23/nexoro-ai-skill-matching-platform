using GigMarketplace.Domain.Entities;
using GigMarketplace.Domain.Interfaces;
using GigMarketplace.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace GigMarketplace.Infrastructure.Repositories;

public class SkillRepository : ISkillRepository
{
    private readonly AppDbContext _db;

    public SkillRepository(AppDbContext db) => _db = db;

    public async Task<Skill?> GetByIdAsync(Guid id)
        => await _db.Skills.FindAsync(id);

    public async Task<Skill?> GetByNameAsync(string name)
        => await _db.Skills.FirstOrDefaultAsync(s => s.Name.ToLower() == name.ToLower());

    public async Task<List<Skill>> SearchAsync(string query, int limit = 20)
        => await _db.Skills
            .Where(s => EF.Functions.ILike(s.Name, $"%{query}%"))
            .OrderBy(s => s.Name)
            .Take(limit)
            .ToListAsync();

    public async Task<Skill> CreateAsync(Skill skill)
    {
        _db.Skills.Add(skill);
        await _db.SaveChangesAsync();
        return skill;
    }

    public async Task<List<Skill>> GetByIdsAsync(IEnumerable<Guid> ids)
        => await _db.Skills.Where(s => ids.Contains(s.Id)).ToListAsync();
}
