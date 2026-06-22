using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace LoveSync.IdentityGateway.Data;

public sealed class LoveSyncDbContextFactory : IDesignTimeDbContextFactory<LoveSyncDbContext>
{
    public LoveSyncDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<LoveSyncDbContext>();
        optionsBuilder.UseSqlServer(
            "Server=.\\sqlexpress;Database=LoveSyncIdentity;Trusted_Connection=True;TrustServerCertificate=True");

        return new LoveSyncDbContext(optionsBuilder.Options);
    }
}
