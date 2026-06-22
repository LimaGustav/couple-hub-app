using System.Security.Claims;
using LoveSync.IdentityGateway.Models;
using LoveSync.IdentityGateway.Options;
using Yarp.ReverseProxy.Configuration;
using Yarp.ReverseProxy.Transforms;
using Yarp.ReverseProxy.Transforms.Builder;

namespace LoveSync.IdentityGateway.Gateway;

public static class GatewayConfiguration
{
    public static IReverseProxyBuilder AddLoveSyncGateway(
        this IReverseProxyBuilder reverseProxyBuilder,
        GatewayOptions options)
    {

        var routes = new[]
        {
            CreateRoute("tasks-route", "tasks-cluster", "/api/tasks/{**catch-all}"),
            CreateRoute("tokens-route", "tokens-cluster", "/api/tokens/{**catch-all}"),
            CreateRoute("timeline-route", "timeline-cluster", "/api/timeline/{**catch-all}")
        };

        var clusters = new[]
        {
            CreateCluster("tasks-cluster", options.TasksServiceAddress),
            CreateCluster("tokens-cluster", options.TokensServiceAddress),
            CreateCluster("timeline-cluster", options.TimelineServiceAddress)
        };

        return reverseProxyBuilder
            .LoadFromMemory(routes, clusters)
            .AddTransforms(ConfigureIdentityHeaders);
    }

    private static RouteConfig CreateRoute(string routeId, string clusterId, string path) =>
        new()
        {
            RouteId = routeId,
            ClusterId = clusterId,
            Match = new RouteMatch { Path = path },
            AuthorizationPolicy = "Bearer"
        };

    private static ClusterConfig CreateCluster(string clusterId, string address) =>
        new()
        {
            ClusterId = clusterId,
            Destinations = new Dictionary<string, DestinationConfig>(StringComparer.Ordinal)
            {
                ["primary"] = new() { Address = address }
            }
        };

    private static void ConfigureIdentityHeaders(TransformBuilderContext context)
    {
        context.AddRequestTransform(static transformContext =>
        {
            var user = transformContext.HttpContext.User;

            var userId = user.FindFirstValue(LoveSyncClaimTypes.UserId);
            if (!string.IsNullOrEmpty(userId))
            {
                transformContext.ProxyRequest.Headers.Remove("X-User-Id");
                transformContext.ProxyRequest.Headers.Add("X-User-Id", userId);
            }

            var coupleId = user.FindFirstValue(LoveSyncClaimTypes.CoupleId);
            if (!string.IsNullOrEmpty(coupleId) && coupleId != Guid.Empty.ToString())
            {
                transformContext.ProxyRequest.Headers.Remove("X-Couple-Id");
                transformContext.ProxyRequest.Headers.Add("X-Couple-Id", coupleId);
            }

            var accessLevelId = user.FindFirstValue(LoveSyncClaimTypes.AccessLevelId);
            if (!string.IsNullOrEmpty(accessLevelId))
            {
                transformContext.ProxyRequest.Headers.Remove("X-Access-Level-Id");
                transformContext.ProxyRequest.Headers.Add("X-Access-Level-Id", accessLevelId);
            }

            return ValueTask.CompletedTask;
        });
    }
}
