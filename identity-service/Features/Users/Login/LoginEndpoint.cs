using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using identity_service.Infra.Data;
using identity_service.Infra.Security;
using identity_service.Common.Errors;

namespace identity_service.Features.Users.Login;

public static class LoginEndpoint
{
    public static void MapLogin(this IEndpointRouteBuilder app)
    {
        app.MapPost("/v1/auth/login", async (
            LoginRequest request,
            IdentityDbContext db,
            PasswordHasher passwordHasher,
            TokenService tokenService) =>
        {
            if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
            {
                return ProblemDetailsExtensions.ToBadRequestProblem("Username and password are required.");
            }

            var usernameNormalized = request.Username.Trim().ToLowerInvariant();
            var user = await db.Users
            .Include(b => b.Role)
            .FirstOrDefaultAsync(u => u.Username == usernameNormalized);
            
            if (user == null || !user.IsActive || !passwordHasher.VerifyPassword(request.Password, user.Password))
            {
                return Results.Unauthorized();
            }

            var token = tokenService.GenerateToken(user);
            return Results.Ok(new LoginResponse(token));
        })
        .WithName("Login")
        .WithTags("Auth");
    }
}
