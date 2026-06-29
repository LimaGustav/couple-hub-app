using System;
using System.Collections.Generic;

namespace identity_service.Infra.Data.Models;

public partial class Role
{
    public Guid RoleId { get; set; }

    public string Role1 { get; set; } = null!;

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
