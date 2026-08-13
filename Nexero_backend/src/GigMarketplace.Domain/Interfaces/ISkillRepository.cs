using GigMarketplace.Domain.Entities;

namespace GigMarketplace.Domain.Interfaces;

public interface ISkillRepository
{
    Task<Skill?> GetByIdAsync(Guid id);
    Task<Skill?> GetByNameAsync(string name);
    Task<List<Skill>> SearchAsync(string query, int limit = 20);
    Task<Skill> CreateAsync(Skill skill);
    Task<List<Skill>> GetByIdsAsync(IEnumerable<Guid> ids);
}
