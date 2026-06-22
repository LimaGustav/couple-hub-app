    namespace LoveSync.IdentityGateway.Options;

public sealed class JwtOptions
{
    public const string SectionName = "Jwt";

    public string Issuer { get; init; } = "LoveSync.IdentityGateway";
    public string Audience { get; init; } = "LoveSync.Services";
    public string SigningKey { get; init; } = "#oihgo@#dfajASg923jgo82#@$";
    public int ExpirationHours { get; init; } = 24;
}
