using System.Security.Claims;
using LoveSync.IdentityGateway.Data;
using LoveSync.IdentityGateway.Dtos;
using LoveSync.IdentityGateway.Models;
using Microsoft.EntityFrameworkCore;

namespace LoveSync.IdentityGateway.Endpoints;

public static class PairingEndpoints
{
    public static RouteGroupBuilder MapPairingEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/auth")
            .RequireAuthorization()
            .WithTags("Pairing");

        group.MapPost("/pair", PairAsync);

        return group;
    }

    private static async Task<IResult> PairAsync(
        PairRequest request,
        ClaimsPrincipal principal,
        LoveSyncDbContext dbContext,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.InvitationCode))
        {
            return Results.BadRequest(new ErrorResponse("InvitationCode é obrigatório."));
        }

        if (!TryGetUserId(principal, out var currentUserId))
        {
            return Results.Unauthorized();
        }

        var currentUser = await dbContext.Users
            .FirstOrDefaultAsync(user => user.Id == currentUserId, cancellationToken);

        if (currentUser is null)
        {
            return Results.Unauthorized();
        }

        if (currentUser.CoupleId.HasValue)
        {
            return Results.Conflict(new ErrorResponse("Usuário já está pareado."));
        }

        var normalizedCode = request.InvitationCode.Trim().ToUpperInvariant();

        var partner = await dbContext.Users
            .FirstOrDefaultAsync(user => user.InvitationCode == normalizedCode, cancellationToken);

        if (partner is null)
        {
            return Results.NotFound(new ErrorResponse("InvitationCode inválido."));
        }

        if (partner.Id == currentUser.Id)
        {
            return Results.BadRequest(new ErrorResponse("Não é possível parear consigo mesmo."));
        }

        if (partner.CoupleId.HasValue)
        {
            return Results.Conflict(new ErrorResponse("Parceiro já está pareado."));
        }

        var coupleId = Guid.NewGuid();
        currentUser.CoupleId = coupleId;
        partner.CoupleId = coupleId;

        await dbContext.SaveChangesAsync(cancellationToken);

        return Results.Ok(new PairResponse(coupleId));
    }

    private static bool TryGetUserId(ClaimsPrincipal principal, out Guid userId)
    {
        var claimValue = principal.FindFirstValue(LoveSyncClaimTypes.UserId);

        return Guid.TryParse(claimValue, out userId);
    }
}
