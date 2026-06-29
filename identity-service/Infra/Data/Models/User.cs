using System;
using System.Collections.Generic;

namespace identity_service.Infra.Data.Models;

public partial class User
{
    public Guid UserId { get; set; }

    public string Name { get; set; } = null!;

    public DateOnly? Birthday { get; set; }

    public Guid? CoupleId { get; set; }

    public string Username { get; set; } = null!;

    public string Password { get; set; } = null!;

    public bool IsActive { get; set; }

    public Guid RoleId { get; set; }

    public virtual Couple? Couple { get; set; }

    public virtual Role Role { get; set; } = null!;
}
