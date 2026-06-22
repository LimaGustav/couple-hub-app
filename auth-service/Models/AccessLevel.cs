namespace LoveSync.IdentityGateway.Models;

public sealed class AccessLevel
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public int Level { get; set; }
    public string? Description { get; set; }

    public ICollection<User> Users { get; set; } = [];
}
