using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace CoupleHub.Bff.Extensions;

public static class DependencyInjection
{
    public static IServiceCollection AddBffServices(this IServiceCollection services, IConfiguration configuration)
    {
        // 1. Configuração de Validação de Token JWT
        var jwtSettings = configuration.GetSection("JwtSettings");
        var secretKey = jwtSettings.GetValue<string>("SecretKey");

        if (string.IsNullOrEmpty(secretKey))
        {
            throw new InvalidOperationException("A chave JWT SecretKey não está configurada no appsettings.json.");
        }

        var key = Encoding.ASCII.GetBytes(secretKey);

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.RequireHttpsMetadata = false; // Em prod, alterar para true
            options.SaveToken = true;
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = true,
                ValidIssuer = jwtSettings.GetValue<string>("Issuer"),
                ValidateAudience = true,
                ValidAudience = jwtSettings.GetValue<string>("Audience"),
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            };
        });

        // 2. Configuração de HttpClients para Microsserviços (para Agregações/Features)
        var microservices = configuration.GetSection("Microservices");

        services.AddHttpClient("IdentityService", client =>
        {
            var url = microservices.GetValue<string>("IdentityUrl") ?? "http://localhost:5013";
            client.BaseAddress = new Uri(url);
        });

        services.AddHttpClient("TasksService", client =>
        {
            var url = microservices.GetValue<string>("TasksUrl") ?? "http://localhost:5002";
            client.BaseAddress = new Uri(url);
        });

        services.AddHttpClient("MatchService", client =>
        {
            var url = microservices.GetValue<string>("MatchUrl") ?? "http://localhost:5003";
            client.BaseAddress = new Uri(url);
        });

        return services;
    }
}
