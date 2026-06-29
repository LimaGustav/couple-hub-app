using CoupleHub.Bff.Common;
using CoupleHub.Bff.Extensions;
using CoupleHub.Bff.Middlewares;

var builder = WebApplication.CreateBuilder(args);

// 1. Configurações Globais
builder.Services.AddDefaultCors(builder.Configuration);
builder.Services.AddRateLimitPolicies();

// 2. JWT e Clientes HTTP para microsserviços
builder.Services.AddBffServices(builder.Configuration);

// 3. YARP Reverse Proxy
builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

// 4. Registrar endpoints dinâmicos de Features
builder.Services.AddEndpoints();

builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// 5. Middleware Pipeline
app.UseCors(CorsPolicies.DefaultCorsPolicy);
app.UseRateLimiter();

app.UseAuthentication();
app.UseAuthorization();

// Middleware para transformar claims JWT em Headers Downstream
app.UseMiddleware<ClaimsTransformationMiddleware>();

// 6. Mapeamento de rotas e YARP
app.MapEndpoints();
app.MapReverseProxy();

app.Run();

