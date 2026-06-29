using System;
using System.Collections.Generic;

namespace identity_service.Infra.Data.Models;

public partial class Couple
{
    public Guid CoupleId { get; set; }

    public bool IsActive { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
