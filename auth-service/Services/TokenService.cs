using System.Security.Claims;
using System.Text;
using LoveSync.IdentityGateway.Models;
using LoveSync.IdentityGateway.Options;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;

namespace LoveSync.IdentityGateway.Services;

public sealed class TokenService(IOptions<JwtOptions> jwtOptions)
{
    private readonly JwtOptions _options = jwtOptions.Value;
    private readonly JsonWebTokenHandler _tokenHandler = new();

    public (string AccessToken, DateTime ExpiresAtUtc) CreateAccessToken(User user)
    {
        var expiresAtUtc = DateTime.UtcNow.AddHours(_options.ExpirationHours);
        var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_options.SigningKey));

        var claims = new List<Claim>
        {
            new(LoveSyncClaimTypes.UserId, user.Id.ToString()),
            new(LoveSyncClaimTypes.CoupleId, (user.CoupleId ?? Guid.Empty).ToString()),
            new(LoveSyncClaimTypes.AccessLevelId, user.AccessLevelId.ToString()),
            new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new(JwtRegisteredClaimNames.Email, user.Email)
        };

        var descriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = expiresAtUtc,
            Issuer = _options.Issuer,
            Audience = _options.Audience,
            SigningCredentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256)
        };

        return (_tokenHandler.CreateToken(descriptor), expiresAtUtc);
    }
}
