namespace LoveSync.IdentityGateway.Dtos;

public sealed record RegisterRequest(string Name, string Email, string Password);
