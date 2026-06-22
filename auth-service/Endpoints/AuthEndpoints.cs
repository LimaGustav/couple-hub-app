using System.Security.Claims;
using LoveSync.IdentityGateway.Data;
using LoveSync.IdentityGateway.Dtos;
using LoveSync.IdentityGateway.Models;
using LoveSync.IdentityGateway.Services;
using Microsoft.EntityFrameworkCore;

namespace LoveSync.IdentityGateway.Endpoints;

public static class AuthEndpoints
{
    public static RouteGroupBuilder MapAuthEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/auth")
            .WithTags("Auth");

        group.MapPost("/register", RegisterAsync);
        group.MapPost("/login", LoginAsync);

        return group;
    }

    private static async Task<IResult> RegisterAsync(
        RegisterRequest request,
        LoveSyncDbContext dbContext,
        PasswordService passwordService,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Name) ||
            string.IsNullOrWhiteSpace(request.Email) ||
            string.IsNullOrWhiteSpace(request.Password))
        {
            return Results.BadRequest(new ErrorResponse("Nome, e-mail e senha são obrigatórios."));
        }

        if (request.Password.Length < 8)
        {
            return Results.BadRequest(new ErrorResponse("A senha deve conter ao menos 8 caracteres."));
        }

        var normalizedEmail = request.Email.Trim().ToLowerInvariant();

        var emailExists = await dbContext.Users
            .AsNoTracking()
            .AnyAsync(user => user.Email == normalizedEmail, cancellationToken);

        if (emailExists)
        {
            return Results.Conflict(new ErrorResponse("E-mail já cadastrado."));
        }

        var invitationCode = await InvitationCodeGenerator.GenerateUniqueAsync(dbContext, cancellationToken);

        var user = new User
        {
            Id = Guid.NewGuid(),
            Name = request.Name.Trim(),
            Email = normalizedEmail,
            InvitationCode = invitationCode,
            AccessLevelId = AccessLevelIds.Member,
            CreatedAtUtc = DateTime.UtcNow
        };

        user.PasswordHash = passwordService.HashPassword(user, request.Password);

        dbContext.Users.Add(user);
        await dbContext.SaveChangesAsync(cancellationToken);

        return Results.Created(
            $"/auth/users/{user.Id}",
            new RegisterResponse(user.Id, user.Email, user.InvitationCode, user.AccessLevelId));
    }

    private static async Task<IResult> LoginAsync(
        LoginRequest request,
        LoveSyncDbContext dbContext,
        PasswordService passwordService,
        TokenService tokenService,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
        {
            return Results.BadRequest(new ErrorResponse("E-mail e senha são obrigatórios."));
        }

        var normalizedEmail = request.Email.Trim().ToLowerInvariant();

        var user = await dbContext.Users
            .FirstOrDefaultAsync(existingUser => existingUser.Email == normalizedEmail, cancellationToken);

        if (user is null || !passwordService.VerifyPassword(user, user.PasswordHash, request.Password))
        {
            return Results.Unauthorized();
        }

        var (accessToken, expiresAtUtc) = tokenService.CreateAccessToken(user);

        return Results.Ok(new LoginResponse(
            accessToken,
            expiresAtUtc,
            user.Id,
            user.CoupleId,
            user.AccessLevelId));
    }
}
