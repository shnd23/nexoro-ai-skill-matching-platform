namespace GigMarketplace.Domain.Entities;

public class GigRequestSkill
{
    public Guid GigRequestId { get; set; }
    public GigRequest GigRequest { get; set; } = null!;

    public Guid SkillId { get; set; }
    public Skill Skill { get; set; } = null!;
}
