namespace LoveSync.IdentityGateway.Dtos;

public sealed record RegisterResponse(
    Guid UserId,
    string Email,
    string InvitationCode,
    int AccessLevelId);
