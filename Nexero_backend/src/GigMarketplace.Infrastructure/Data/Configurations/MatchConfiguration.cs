using GigMarketplace.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GigMarketplace.Infrastructure.Data.Configurations;

public class MatchConfiguration : IEntityTypeConfiguration<Match>
{
    public void Configure(EntityTypeBuilder<Match> builder)
    {
        builder.HasKey(m => m.Id);
        builder.Property(m => m.Score).IsRequired();
        builder.Property(m => m.Status).HasConversion<string>().HasMaxLength(20);
        builder.Property(m => m.CreatedAt).HasDefaultValueSql("NOW()");

        builder.HasOne(m => m.GigRequest)
            .WithMany(g => g.Matches)
            .HasForeignKey(m => m.GigRequestId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(m => m.CandidateUser)
            .WithMany(u => u.MatchesAsCandidate)
            .HasForeignKey(m => m.CandidateUserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(m => m.CandidateUserId);
        builder.HasIndex(m => m.GigRequestId);
        builder.HasIndex(m => new { m.CandidateUserId, m.Status });
    }
}
