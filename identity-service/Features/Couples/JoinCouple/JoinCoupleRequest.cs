using System;

namespace identity_service.Features.Couples.JoinCouple;

public record JoinCoupleRequest(string? PartnerUsername, Guid? CoupleId);
