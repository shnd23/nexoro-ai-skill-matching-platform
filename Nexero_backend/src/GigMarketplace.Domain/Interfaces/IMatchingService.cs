using GigMarketplace.Domain.Entities;

namespace GigMarketplace.Domain.Interfaces;

public record MatchCandidate(Guid UserId, float Score);

public interface IMatchingService
{
    Task<List<MatchCandidate>> FindCandidatesAsync(GigRequest request);
}
