using GigMarketplace.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GigMarketplace.Infrastructure.Data.Configurations;

public class GigRequestConfiguration : IEntityTypeConfiguration<GigRequest>
{
    public void Configure(EntityTypeBuilder<GigRequest> builder)
    {
        builder.HasKey(g => g.Id);
        builder.Property(g => g.Title).HasMaxLength(120).IsRequired();
        builder.Property(g => g.Description).HasMaxLength(2000).IsRequired();
        builder.Property(g => g.Status).HasConversion<string>().HasMaxLength(20);
        builder.Property(g => g.Budget).HasColumnType("decimal(18,2)");
        builder.Property(g => g.Timeframe).HasMaxLength(100);
        builder.Property(g => g.CreatedAt).HasDefaultValueSql("NOW()");

        builder.HasOne(g => g.Author)
            .WithMany(u => u.GigRequests)
            .HasForeignKey(g => g.AuthorId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(g => g.AuthorId);
        builder.HasIndex(g => g.Status);
    }
}
