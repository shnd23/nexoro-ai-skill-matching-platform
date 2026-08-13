namespace GigMarketplace.Api.DTOs.Skills;

public class SkillDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
}

public class CreateSkillRequest
{
    public string Name { get; set; } = string.Empty;
}
