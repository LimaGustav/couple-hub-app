using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using identity_service.Infra.Data;
using identity_service.Infra.Data.Models;
using identity_service.Infra.Security;
using identity_service.Common.Errors;

namespace identity_service.Features.Users.RegisterUser;

public static class RegisterUserEndpoint
{
    public static void MapRegisterUser(this IEndpointRouteBuilder app)
    {
        app.MapPost("/v1/auth/register", async (
            RegisterUserRequest request,
            IdentityDbContext db,
            PasswordHasher passwordHasher) =>
        {
            if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
            {
                return ProblemDetailsExtensions.ToBadRequestProblem("Username and password are required.");
            }

            if (string.IsNullOrWhiteSpace(request.Name))
            {
                return ProblemDetailsExtensions.ToBadRequestProblem("Name is required.");
            }

            var usernameNormalized = request.Username.Trim().ToLowerInvariant();
            var exists = await db.Users.AnyAsync(u => u.Username == usernameNormalized);
            if (exists)
            {
                return ProblemDetailsExtensions.ToBadRequestProblem("Username is already registered.");
            }

            // Find or seed User role
            var userRole = await db.Roles.FirstOrDefaultAsync(r => r.Role1 == "User");
            if (userRole == null)
            {
                userRole = new Role { RoleId = Guid.NewGuid(), Role1 = "User" };
                db.Roles.Add(userRole);
                await db.SaveChangesAsync();
            }

            var hashedPassword = passwordHasher.HashPassword(request.Password);
            var user = new User
            {
                UserId = Guid.NewGuid(),
                Username = usernameNormalized,
                Password = hashedPassword,
                Name = request.Name,
                Birthday = request.Birthday,
                IsActive = true,
                RoleId = userRole.RoleId
            };

            db.Users.Add(user);
            await db.SaveChangesAsync();

            var response = new RegisterUserResponse(user.UserId, user.Username, user.Name);
            return Results.Created($"/v1/users/{user.UserId}", response);
        })
        .WithName("RegisterUser")
        .WithTags("Auth");
    }
}
