using GigMarketplace.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GigMarketplace.Infrastructure.Data.Configurations;

public class GigRequestSkillConfiguration : IEntityTypeConfiguration<GigRequestSkill>
{
    public void Configure(EntityTypeBuilder<GigRequestSkill> builder)
    {
        builder.HasKey(gs => new { gs.GigRequestId, gs.SkillId });

        builder.HasOne(gs => gs.GigRequest)
            .WithMany(g => g.RequiredSkills)
            .HasForeignKey(gs => gs.GigRequestId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(gs => gs.Skill)
            .WithMany(s => s.GigRequestSkills)
            .HasForeignKey(gs => gs.SkillId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
