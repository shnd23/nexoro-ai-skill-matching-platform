using Microsoft.AspNetCore.Identity;

namespace GigMarketplace.Domain.Entities;

public class User : IdentityUser<Guid>
{
    public string DisplayName { get; set; } = string.Empty;
    public string? Bio { get; set; }
    public string? AvatarUrl { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public bool IsExternalLogin { get; set; } = false;

    public ICollection<UserSkill> SkillsOffered { get; set; } = new List<UserSkill>();
    public ICollection<GigRequest> GigRequests { get; set; } = new List<GigRequest>();
    public ICollection<Match> MatchesAsCandidate { get; set; } = new List<Match>();
}
