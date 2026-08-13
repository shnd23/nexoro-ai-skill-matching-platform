using GigMarketplace.Domain.Enums;

namespace GigMarketplace.Domain.Entities;

public class Match
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid GigRequestId { get; set; }
    public GigRequest GigRequest { get; set; } = null!;

    public Guid CandidateUserId { get; set; }
    public User CandidateUser { get; set; } = null!;

    public float Score { get; set; }
    public MatchStatus Status { get; set; } = MatchStatus.Suggested;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
