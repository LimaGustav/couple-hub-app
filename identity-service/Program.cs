using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using identity_service.Infra.Data;
using identity_service.Infra.Security;
using identity_service.Features.Users.RegisterUser;
using identity_service.Features.Users.Login;
using identity_service.Features.Couples.CreateCouple;
using identity_service.Features.Couples.JoinCouple;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddOpenApi();

// Register DbContext with SQL Server connection string
builder.Services.AddDbContext<IdentityDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection") 
        ?? "Server=.\\sqlexpress;Database=couple_identity_db;Trusted_Connection=True;TrustServerCertificate=True;"));

// Register security utility services
builder.Services.AddSingleton<PasswordHasher>();
builder.Services.AddTransient<TokenService>();
builder.Services.AddDefaultCors(builder.Configuration);

// Configure JWT Authentication and Authorization
var jwtKey = builder.Configuration["Jwt:Key"] ?? "SuperSecretDefaultKeyForDevelopmentOnly123!";
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "couple-hub-identity-service";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "couple-hub-app";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtIssuer,
        ValidAudience = jwtAudience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
    };
});

builder.Services.AddAuthorization();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseAuthentication();
app.UseAuthorization();

// Minimal API Endpoint Maps
app.MapRegisterUser();
app.MapLogin();
app.MapCreateCouple();
app.MapJoinCouple();

app.Run();
