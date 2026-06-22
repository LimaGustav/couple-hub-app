using System.Text;
using LoveSync.IdentityGateway.Data;
using LoveSync.IdentityGateway.Endpoints;
using LoveSync.IdentityGateway.Gateway;
using LoveSync.IdentityGateway.Options;
using LoveSync.IdentityGateway.Serialization;
using LoveSync.IdentityGateway.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

using Scalar.AspNetCore;

var builder = WebApplication.CreateSlimBuilder(args);

builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.TypeInfoResolverChain.Insert(0, LoveSyncJsonContext.Default);
});

builder.Services.Configure<JwtOptions>(builder.Configuration.GetSection(JwtOptions.SectionName));
builder.Services.Configure<GatewayOptions>(builder.Configuration.GetSection(GatewayOptions.SectionName));

var jwtOptions = builder.Configuration.GetSection(JwtOptions.SectionName).Get<JwtOptions>()
    ?? throw new InvalidOperationException("Configuração JWT ausente.");

if (string.IsNullOrWhiteSpace(jwtOptions.SigningKey) || jwtOptions.SigningKey.Length < 32)
{
    throw new InvalidOperationException("Jwt:SigningKey deve conter ao menos 32 caracteres.");
}

var gatewayOptions = builder.Configuration.GetSection(GatewayOptions.SectionName).Get<GatewayOptions>()
    ?? new GatewayOptions();

builder.Services.AddDbContext<LoveSyncDbContext>(options =>
    options
        .UseModel(LoveSync.IdentityGateway.Data.CompiledModels.LoveSyncDbContextModel.Instance)
        .UseSqlServer(builder.Configuration.GetConnectionString("LoveSyncDb")));

builder.Services.AddSingleton<PasswordService>();
builder.Services.AddSingleton<TokenService>();

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.MapInboundClaims = false;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtOptions.Issuer,
            ValidAudience = jwtOptions.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.SigningKey)),
            ClockSkew = TimeSpan.FromMinutes(1)
        };
    });

builder.Services.AddAuthorizationBuilder()
    .AddPolicy("Bearer", policy =>
        policy.AddAuthenticationSchemes(JwtBearerDefaults.AuthenticationScheme)
              .RequireAuthenticatedUser())
    .SetDefaultPolicy(new AuthorizationPolicyBuilder()
        .AddAuthenticationSchemes(JwtBearerDefaults.AuthenticationScheme)
        .RequireAuthenticatedUser()
        .Build());

builder.Services
    .AddReverseProxy()
    .AddLoveSyncGateway(gatewayOptions);

builder.Services.AddOpenApi();

var app = builder.Build();

app.MapOpenApi();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<LoveSyncDbContext>();

    if (app.Environment.IsDevelopment())
    {
        await dbContext.Database.MigrateAsync();
    }
}

if (app.Environment.IsDevelopment())
{
    app.MapScalarApiReference(options =>
    {
        options.WithTitle("LoveSync - Identity & Gateway API")
               .WithTheme(ScalarTheme.DeepSpace); // Escolhe o teu tema visual favorito
    });
}

app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/health", () => Results.Text("healthy"));

app.MapAuthEndpoints();
app.MapPairingEndpoints();

app.MapReverseProxy();

app.Run();
