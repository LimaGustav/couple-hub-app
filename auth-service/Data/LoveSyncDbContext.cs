using LoveSync.IdentityGateway.Data.Configurations;
using LoveSync.IdentityGateway.Models;
using Microsoft.EntityFrameworkCore;

namespace LoveSync.IdentityGateway.Data;

public sealed class LoveSyncDbContext(DbContextOptions<LoveSyncDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<AccessLevel> AccessLevels => Set<AccessLevel>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfiguration(new AccessLevelConfiguration());
        modelBuilder.ApplyConfiguration(new UserConfiguration());
    }
}
