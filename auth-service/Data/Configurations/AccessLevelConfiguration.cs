using LoveSync.IdentityGateway.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LoveSync.IdentityGateway.Data.Configurations;

public sealed class AccessLevelConfiguration : IEntityTypeConfiguration<AccessLevel>
{
    public void Configure(EntityTypeBuilder<AccessLevel> builder)
    {
        builder.ToTable("AccessLevels");

        builder.HasKey(accessLevel => accessLevel.Id);

        builder.Property(accessLevel => accessLevel.Id)
            .ValueGeneratedNever();

        builder.Property(accessLevel => accessLevel.Name)
            .HasMaxLength(64)
            .IsRequired();

        builder.HasIndex(accessLevel => accessLevel.Name)
            .IsUnique();

        builder.Property(accessLevel => accessLevel.Level)
            .IsRequired();

        builder.HasIndex(accessLevel => accessLevel.Level);

        builder.Property(accessLevel => accessLevel.Description)
            .HasMaxLength(256);

        builder.HasData(
            new AccessLevel
            {
                Id = AccessLevelIds.Member,
                Name = "Member",
                Level = 1,
                Description = "Usuário padrão do casal"
            },
            new AccessLevel
            {
                Id = AccessLevelIds.Admin,
                Name = "Admin",
                Level = 100,
                Description = "Administrador da plataforma"
            });
    }
}
