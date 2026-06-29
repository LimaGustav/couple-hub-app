using System;

namespace identity_service.Features.Users.RegisterUser;

public record RegisterUserResponse(Guid UserId, string Username, string Name);
