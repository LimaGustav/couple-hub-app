using System;
using System.Collections.Generic;

namespace CoupleHub.Bff.Features.TimelineSummary;

public class TimelineSummaryDto
{
    public string PartnerName { get; set; } = string.Empty;
    public string PartnerPhotoUrl { get; set; } = string.Empty;
    public List<TaskSummaryItemDto> RecentTasks { get; set; } = new();
}

public class TaskSummaryItemDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime? DueDate { get; set; }
}
