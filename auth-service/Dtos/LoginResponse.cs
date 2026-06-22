namespace LoveSync.IdentityGateway.Dtos;

public sealed record LoginResponse(
    string AccessToken,
    DateTime ExpiresAtUtc,
    Guid UserId,
    Guid? CoupleId,
    int AccessLevelId);
