namespace GigMarketplace.Api.DTOs.Matches;

public class MatchResponse
{
    public Guid Id { get; set; }
    public Guid GigRequestId { get; set; }
    public string GigRequestTitle { get; set; } = string.Empty;
    public Guid CandidateUserId { get; set; }
    public string CandidateDisplayName { get; set; } = string.Empty;
    public float Score { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
