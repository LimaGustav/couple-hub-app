namespace LoveSync.IdentityGateway.Dtos;

public sealed record JwtClaimsDto(Guid UserId, Guid CoupleId, int AccessLevelId);
