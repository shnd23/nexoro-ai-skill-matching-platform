using GigMarketplace.Domain.Entities;

namespace GigMarketplace.Domain.Interfaces;

public interface IGigRequestRepository
{
    Task<GigRequest?> GetByIdAsync(Guid id);
    Task<GigRequest?> GetByIdWithSkillsAsync(Guid id);
    Task<List<GigRequest>> GetByAuthorIdAsync(Guid authorId);
    Task<GigRequest> CreateAsync(GigRequest gigRequest);
    Task UpdateAsync(GigRequest gigRequest);
}
