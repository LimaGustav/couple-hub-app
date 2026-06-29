using System;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using CoupleHub.Bff.Extensions;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace CoupleHub.Bff.Features.Auth;

public class RegisterEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        // We map both routes to cover all frontend integration scenarios.
        var group = app.MapGroup(string.Empty)
            .WithTags("Auth");

        group.MapPost("/api/auth/register", RegisterHandler);
        group.MapPost("/api/v1/auth/register", RegisterHandler);
    }

    private static async Task<IResult> RegisterHandler(
        RegisterRequestDto request,
        IHttpClientFactory httpClientFactory)
    {
        if (request == null)
        {
            return Results.BadRequest("Request body cannot be null.");
        }

        if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
        {
            return Results.BadRequest("Username and password are required.");
        }

        if (string.IsNullOrWhiteSpace(request.Name))
        {
            return Results.BadRequest("Name is required.");
        }

        // Parse Birthday to DateOnly? if present
        DateOnly? birthday = null;
        if (!string.IsNullOrWhiteSpace(request.Birthday))
        {
            if (DateOnly.TryParse(request.Birthday, out var parsedDate))
            {
                birthday = parsedDate;
            }
            else
            {
                return Results.BadRequest("Birthday must be a valid date (YYYY-MM-DD).");
            }
        }

        var identityClient = httpClientFactory.CreateClient("IdentityService");

        // Step 1: Account Creation in Identity Service
        var registerPayload = new RegisterUserRequestDto(request.Username, request.Password, request.Name, birthday);
        
        HttpResponseMessage registerResponse;
        try
        {
            registerResponse = await identityClient.PostAsJsonAsync("/v1/auth/register", registerPayload);
        }
        catch (Exception ex)
        {
            return Results.Problem($"Failed to contact Identity Service during registration: {ex.Message}", statusCode: 502);
        }

        if (!registerResponse.IsSuccessStatusCode)
        {
            var errorContent = await registerResponse.Content.ReadAsStringAsync();
            var contentType = registerResponse.Content.Headers.ContentType?.ToString() ?? "application/json";
            return Results.Content(errorContent, contentType, statusCode: (int)registerResponse.StatusCode);
        }

        var registerResult = await registerResponse.Content.ReadFromJsonAsync<RegisterUserResponseDto>();
        if (registerResult == null)
        {
            return Results.Problem("Identity Service returned an empty response on registration.", statusCode: 502);
        }

        // Step 2: Immediate Authentication
        var loginPayload = new LoginRequestDto(request.Username, request.Password);
        HttpResponseMessage loginResponse;
        try
        {
            loginResponse = await identityClient.PostAsJsonAsync("/v1/auth/login", loginPayload);
        }
        catch (Exception ex)
        {
            return Results.Problem($"Failed to contact Identity Service during login: {ex.Message}", statusCode: 502);
        }

        if (!loginResponse.IsSuccessStatusCode)
        {
            var errorContent = await loginResponse.Content.ReadAsStringAsync();
            var contentType = loginResponse.Content.Headers.ContentType?.ToString() ?? "application/json";
            return Results.Content(errorContent, contentType, statusCode: (int)loginResponse.StatusCode);
        }

        var loginResult = await loginResponse.Content.ReadFromJsonAsync<LoginResponseDto>();
        if (loginResult == null || string.IsNullOrWhiteSpace(loginResult.Token))
        {
            return Results.Problem("Identity Service returned an invalid or empty token.", statusCode: 502);
        }

        // Step 3: Consolidated response mapping
        var userDto = new BffUserDto(
            Id: registerResult.UserId.ToString(),
            Email: registerResult.Username,
            Name: registerResult.Name,
            CoupleId: null,
            Role: "User"
        );

        var bffResponse = new BffRegisterResponseDto(loginResult.Token, userDto);

        return Results.Json(bffResponse, statusCode: StatusCodes.Status201Created);
    }
}

// Data Contracts
public record RegisterRequestDto(string Name, string Username, string Birthday, string Password);
public record RegisterUserRequestDto(string Username, string Password, string Name, DateOnly? Birthday);
public record RegisterUserResponseDto(Guid UserId, string Username, string Name);
public record LoginRequestDto(string Username, string Password);
public record LoginResponseDto(string Token);
public record BffUserDto(string Id, string Email, string Name, string? CoupleId, string Role);
public record BffRegisterResponseDto(string Token, BffUserDto User);
