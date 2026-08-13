using GigMarketplace.Api.DTOs.GigRequests;

namespace GigMarketplace.Api.DTOs.Feed;

public class FeedItemResponse
{
    public Guid MatchId { get; set; }
    public float Score { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime MatchedAt { get; set; }
    public GigRequestResponse GigRequest { get; set; } = null!;
}
