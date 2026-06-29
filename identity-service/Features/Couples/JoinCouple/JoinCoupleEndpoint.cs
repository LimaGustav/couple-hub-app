using System.Security.Claims;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using identity_service.Infra.Data;
using identity_service.Infra.Data.Models;
using identity_service.Common.Errors;

namespace identity_service.Features.Couples.JoinCouple;

public static class JoinCoupleEndpoint
{
    public static void MapJoinCouple(this IEndpointRouteBuilder app)
    {
        app.MapPost("/v1/couples/join", async (
            JoinCoupleRequest request,
            ClaimsPrincipal userPrincipal,
            IdentityDbContext db) =>
        {
            var userIdClaim = userPrincipal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            {
                return Results.Unauthorized();
            }

            if (string.IsNullOrWhiteSpace(request.PartnerUsername) && !request.CoupleId.HasValue)
            {
                return ProblemDetailsExtensions.ToBadRequestProblem("Either PartnerUsername or CoupleId is required.");
            }

            var user = await db.Users.FindAsync(userId);
            if (user == null)
            {
                return ProblemDetailsExtensions.ToNotFoundProblem("User not found.");
            }

            if (user.CoupleId.HasValue)
            {
                return ProblemDetailsExtensions.ToBadRequestProblem("User is already in a couple.");
            }

            Guid? targetCoupleId = request.CoupleId;

            if (!targetCoupleId.HasValue && !string.IsNullOrWhiteSpace(request.PartnerUsername))
            {
                var partnerUsernameNormalized = request.PartnerUsername.Trim().ToLowerInvariant();
                var partner = await db.Users.FirstOrDefaultAsync(u => u.Username == partnerUsernameNormalized);
                if (partner == null)
                {
                    return ProblemDetailsExtensions.ToNotFoundProblem("Partner user not found.");
                }

                if (!partner.CoupleId.HasValue)
                {
                    return ProblemDetailsExtensions.ToBadRequestProblem("Partner user is not in a couple. They must create a couple first.");
                }

                targetCoupleId = partner.CoupleId.Value;
            }

            if (!targetCoupleId.HasValue)
            {
                return ProblemDetailsExtensions.ToBadRequestProblem("Invalid target couple.");
            }

            var couple = await db.Couples.Include(c => c.Users).FirstOrDefaultAsync(c => c.CoupleId == targetCoupleId.Value);
            if (couple == null)
            {
                return ProblemDetailsExtensions.ToNotFoundProblem("Couple not found.");
            }

            if (!couple.IsActive)
            {
                return ProblemDetailsExtensions.ToBadRequestProblem("This couple is not active.");
            }

            if (couple.Users.Count >= 2)
            {
                return ProblemDetailsExtensions.ToBadRequestProblem("This couple already has two members.");
            }

            // Associate the current user with the couple
            user.CoupleId = couple.CoupleId;
            await db.SaveChangesAsync();

            return Results.Ok(new
            {
                CoupleId = couple.CoupleId,
                Message = "Successfully joined the couple."
            });
        })
        .WithName("JoinCouple")
        .WithTags("Couples")
        .RequireAuthorization();
    }
}
