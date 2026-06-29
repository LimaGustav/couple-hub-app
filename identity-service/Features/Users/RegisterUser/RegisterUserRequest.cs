using System;

namespace identity_service.Features.Users.RegisterUser;

public record RegisterUserRequest(string Username, string Password, string Name, DateOnly? Birthday);
