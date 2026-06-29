using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace CoupleHub.Bff.Middlewares;

public class ClaimsTransformationMiddleware
{
    private readonly RequestDelegate _next;

    public ClaimsTransformationMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // Segurança: Remove quaisquer headers de usuário que possam ter sido injetados externamente (spoofing)
        context.Request.Headers.Remove("X-User-Id");
        context.Request.Headers.Remove("X-User-Role");
        context.Request.Headers.Remove("X-User-Email");

        if (context.User.Identity?.IsAuthenticated == true)
        {
            // Extrai as claims do token JWT validado
            var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                         ?? context.User.FindFirst("sub")?.Value;
            
            var role = context.User.FindFirst(ClaimTypes.Role)?.Value 
                       ?? context.User.FindFirst("role")?.Value;

            var email = context.User.FindFirst(ClaimTypes.Email)?.Value 
                        ?? context.User.FindFirst("email")?.Value;

            // Injeta os dados limpos e autenticados nos headers para os microsserviços downstream
            if (!string.IsNullOrEmpty(userId))
            {
                context.Request.Headers["X-User-Id"] = userId;
            }

            if (!string.IsNullOrEmpty(role))
            {
                context.Request.Headers["X-User-Role"] = role;
            }

            if (!string.IsNullOrEmpty(email))
            {
                context.Request.Headers["X-User-Email"] = email;
            }
        }

        await _next(context);
    }
}
