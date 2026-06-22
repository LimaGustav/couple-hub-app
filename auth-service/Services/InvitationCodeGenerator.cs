using System.Security.Cryptography;
using LoveSync.IdentityGateway.Data;
using Microsoft.EntityFrameworkCore;

namespace LoveSync.IdentityGateway.Services;

public static class InvitationCodeGenerator
{
    private const string Alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private const int CodeLength = 8;

    public static async Task<string> GenerateUniqueAsync(
        LoveSyncDbContext dbContext,
        CancellationToken cancellationToken)
    {
        while (true)
        {
            var code = CreateCode();
            var exists = await dbContext.Users
                .AsNoTracking()
                .AnyAsync(user => user.InvitationCode == code, cancellationToken);

            if (!exists)
            {
                return code;
            }
        }
    }

    private static string CreateCode()
    {
        Span<char> buffer = stackalloc char[CodeLength];
        Span<byte> randomBytes = stackalloc byte[CodeLength];

        RandomNumberGenerator.Fill(randomBytes);

        for (var index = 0; index < CodeLength; index++)
        {
            buffer[index] = Alphabet[randomBytes[index] % Alphabet.Length];
        }

        return new string(buffer);
    }
}
