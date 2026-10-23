using GigMarketplace.Domain.Enums;

namespace GigMarketplace.Domain.Entities;

public class GigRequest
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid AuthorId { get; set; }
    public User Author { get; set; } = null!;

    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public GigRequestStatus Status { get; set; } = GigRequestStatus.Open;
    public decimal? Budget { get; set; }
    public string? Timeframe { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<GigRequestSkill> RequiredSkills { get; set; } = new List<GigRequestSkill>();
    public ICollection<Match> Matches { get; set; } = new List<Match>();
}
