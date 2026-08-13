using GigMarketplace.Domain.Entities;
using GigMarketplace.Domain.Enums;

namespace GigMarketplace.Domain.Interfaces;

public interface IMatchRepository
{
    Task<Match?> GetByIdAsync(Guid id);
    Task<List<Match>> GetByGigRequestIdAsync(Guid gigRequestId);
    Task<List<Match>> GetByCandidateUserIdAsync(Guid userId, MatchStatus? statusFilter = null);
    Task<Match> CreateAsync(Match match);
    Task CreateRangeAsync(IEnumerable<Match> matches);
    Task UpdateAsync(Match match);
}
