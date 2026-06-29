namespace identity_service.Infra.Security
{
    public static class CorsPolicies
    {
        public const string DefaultCorsPolicy = "DefaultCorsPolicy";

        public static IServiceCollection AddDefaultCors(this IServiceCollection services, IConfiguration configuration)
        {
            var allowedOrigins = configuration.GetSection("CorsSettings:AllowedOrigins").Get<string[]>()
                                 ?? new[] { "http://localhost:5070" };

            services.AddCors(options =>
            {
                options.AddPolicy(DefaultCorsPolicy, policy =>
                {
                    policy.WithOrigins(allowedOrigins)
                          .AllowAnyMethod()
                          .AllowAnyHeader()
                          .AllowCredentials();
                });
            });

            return services;
        }
    }
}
