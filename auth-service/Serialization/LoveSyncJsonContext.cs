using System.Text.Json.Serialization;
using LoveSync.IdentityGateway.Dtos;

namespace LoveSync.IdentityGateway.Serialization;

[JsonSerializable(typeof(RegisterRequest))]
[JsonSerializable(typeof(RegisterResponse))]
[JsonSerializable(typeof(LoginRequest))]
[JsonSerializable(typeof(LoginResponse))]
[JsonSerializable(typeof(PairRequest))]
[JsonSerializable(typeof(PairResponse))]
[JsonSerializable(typeof(ErrorResponse))]
[JsonSerializable(typeof(JwtClaimsDto))]
[JsonSourceGenerationOptions(
    PropertyNamingPolicy = JsonKnownNamingPolicy.CamelCase,
    DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
    WriteIndented = false)]
public partial class LoveSyncJsonContext : JsonSerializerContext;
