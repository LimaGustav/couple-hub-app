using LoveSync.IdentityGateway.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LoveSync.IdentityGateway.Data.Configurations;

public sealed class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("Users");

        builder.HasKey(user => user.Id);

        builder.Property(user => user.Name)
            .HasMaxLength(120)
            .IsRequired();

        builder.Property(user => user.Email)
            .HasMaxLength(256)
            .IsRequired();

        builder.HasIndex(user => user.Email)
            .IsUnique();

        builder.Property(user => user.PasswordHash)
            .HasMaxLength(512)
            .IsRequired();

        builder.Property(user => user.InvitationCode)
            .HasMaxLength(12)
            .IsRequired();

        builder.HasIndex(user => user.InvitationCode)
            .IsUnique();

        builder.Property(user => user.CoupleId);

        builder.HasIndex(user => user.CoupleId);

        builder.Property(user => user.AccessLevelId)
            .IsRequired();

        builder.HasIndex(user => user.AccessLevelId);

        builder.HasOne(user => user.AccessLevel)
            .WithMany(accessLevel => accessLevel.Users)
            .HasForeignKey(user => user.AccessLevelId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Property(user => user.CreatedAtUtc)
            .IsRequired();
    }
}
