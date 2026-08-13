using System.ComponentModel.DataAnnotations;
using GigMarketplace.Api.DTOs.Skills;

namespace GigMarketplace.Api.DTOs.GigRequests;

public class CreateGigRequestDto
{
    [Required, MaxLength(120)]
    public string Title { get; set; } = string.Empty;

    [Required, MaxLength(2000)]
    public string Description { get; set; } = string.Empty;

    [Required, MinLength(1)]
    public List<Guid> RequiredSkillIds { get; set; } = new();

    public decimal? Budget { get; set; }

    [MaxLength(100)]
    public string? Timeframe { get; set; }
}

public class GigRequestResponse
{
    public Guid Id { get; set; }
    public Guid AuthorId { get; set; }
    public string AuthorName { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public decimal? Budget { get; set; }
    public string? Timeframe { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<SkillDto> RequiredSkills { get; set; } = new();
    public int MatchCount { get; set; }
}

public class UpdateStatusRequest
{
    [Required]
    public string Status { get; set; } = string.Empty;
}
