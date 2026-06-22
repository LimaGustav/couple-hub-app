namespace LoveSync.IdentityGateway.Options;

public sealed class GatewayOptions
{
    public const string SectionName = "Gateway";

    public string TasksServiceAddress { get; init; } = "http://localhost:5001/";
    public string TokensServiceAddress { get; init; } = "http://localhost:5002/";
    public string TimelineServiceAddress { get; init; } = "http://localhost:5003/";
}
