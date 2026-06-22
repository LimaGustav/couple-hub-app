namespace LoveSync.IdentityGateway.Models;

public sealed class User
{
    public Guid Id { get; set; }
    public required string Name { get; set; }
    public required string Email { get; set; }
    public string PasswordHash { get; set; } = string.Empty;
    public required string InvitationCode { get; set; }
    public Guid? CoupleId { get; set; }
    public int AccessLevelId { get; set; }
    public AccessLevel AccessLevel { get; set; } = null!;
    public DateTime CreatedAtUtc { get; set; }
}
