using System.ComponentModel.DataAnnotations;

namespace GigMarketplace.Api.DTOs.Users;

public class UserProfileResponse
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public string? Bio { get; set; }
    public string? AvatarUrl { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<UserSkillDto> SkillsOffered { get; set; } = new();
}

public class UserSkillDto
{
    public Guid SkillId { get; set; }
    public string SkillName { get; set; } = string.Empty;
    public string? ProficiencyLevel { get; set; }
}

public class UpdateProfileRequest
{
    [MaxLength(100)]
    public string? DisplayName { get; set; }

    [MaxLength(500)]
    public string? Bio { get; set; }

    [MaxLength(500)]
    public string? AvatarUrl { get; set; }
}

public class AddSkillRequest
{
    [Required]
    public Guid SkillId { get; set; }

    public string? ProficiencyLevel { get; set; }
}
