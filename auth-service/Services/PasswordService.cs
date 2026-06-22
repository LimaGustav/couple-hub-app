using LoveSync.IdentityGateway.Models;
using Microsoft.AspNetCore.Identity;

namespace LoveSync.IdentityGateway.Services;

public sealed class PasswordService
{
    private readonly PasswordHasher<User> _hasher = new();

    public string HashPassword(User user, string password) =>
        _hasher.HashPassword(user, password);

    public bool VerifyPassword(User user, string passwordHash, string password) =>
        _hasher.VerifyHashedPassword(user, passwordHash, password) != PasswordVerificationResult.Failed;
}
