using System.Security.Claims;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using identity_service.Infra.Data;
using identity_service.Infra.Data.Models;
using identity_service.Common.Errors;

namespace identity_service.Features.Couples.CreateCouple;

public static class CreateCoupleEndpoint
{
    public static void MapCreateCouple(this IEndpointRouteBuilder app)
    {
        app.MapPost("/v1/couples", async (
            ClaimsPrincipal userPrincipal,
            IdentityDbContext db) =>
        {
            var userIdClaim = userPrincipal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            {
                return Results.Unauthorized();
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

            var couple = new Couple
            {
                CoupleId = Guid.NewGuid(),
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            // Associate user to couple
            user.CoupleId = couple.CoupleId;

            db.Couples.Add(couple);
            await db.SaveChangesAsync();

            return Results.Created($"/v1/couples/{couple.CoupleId}", new
            {
                CoupleId = couple.CoupleId,
                IsActive = couple.IsActive,
                CreatedAt = couple.CreatedAt
            });
        })
        .WithName("CreateCouple")
        .WithTags("Couples")
        .RequireAuthorization();
    }
}
