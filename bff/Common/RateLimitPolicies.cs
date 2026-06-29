using System.Threading.RateLimiting;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.Extensions.DependencyInjection;

namespace CoupleHub.Bff.Common;

public static class RateLimitPolicies
{
    public const string FixedWindowPolicy = "FixedWindow";

    public static IServiceCollection AddRateLimitPolicies(this IServiceCollection services)
    {
        services.AddRateLimiter(options =>
        {
            options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

            options.AddFixedWindowLimiter(FixedWindowPolicy, opt =>
            {
                opt.PermitLimit = 100; // Limite de 100 requisições
                opt.Window = TimeSpan.FromSeconds(60); // Janela de 60 segundos
                opt.QueueLimit = 5; // Fila de espera de até 5 requisições
                opt.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
            });
        });

        return services;
    }
}
