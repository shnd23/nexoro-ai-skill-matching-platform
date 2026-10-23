namespace GigMarketplace.Domain.Entities;

public class Skill
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;

    public ICollection<UserSkill> UserSkills { get; set; } = new List<UserSkill>();
    public ICollection<GigRequestSkill> GigRequestSkills { get; set; } = new List<GigRequestSkill>();
}
