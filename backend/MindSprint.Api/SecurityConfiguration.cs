namespace MindSprint.Api;

public static class SecurityConfiguration
{
    public static bool IsSelfHost(IConfiguration configuration) =>
        configuration.GetValue<bool>("SelfHost") ||
        configuration.GetValue<bool>("ServeFrontend") ||
        string.Equals(Environment.GetEnvironmentVariable("SELF_HOST"), "true", StringComparison.OrdinalIgnoreCase) ||
        string.Equals(Environment.GetEnvironmentVariable("SERVE_FRONTEND"), "true", StringComparison.OrdinalIgnoreCase);

    public static string GetConnectionString(IConfiguration configuration, bool isProduction)
    {
        var connectionString = configuration.GetConnectionString("Default");
        if (string.IsNullOrWhiteSpace(connectionString))
            throw new InvalidOperationException("ConnectionStrings:Default must be configured.");
        if (isProduction && !IsSelfHost(configuration) && connectionString.Contains("localhost", StringComparison.OrdinalIgnoreCase))
            throw new InvalidOperationException("Set ConnectionStrings__Default to the production PostgreSQL URL or connection string.");
        return connectionString;
    }

    public static string GetJwtKey(IConfiguration configuration, bool isProduction)
    {
        var jwtKey = configuration["Jwt:Key"];
        if (string.IsNullOrWhiteSpace(jwtKey) || jwtKey.Length < 32 ||
            (isProduction && jwtKey.Contains("DOI_KHOA_NAY", StringComparison.OrdinalIgnoreCase)))
            throw new InvalidOperationException("Set Jwt__Key to a secret value with at least 32 characters.");
        return jwtKey;
    }

    public static string[] GetCorsOrigins(IConfiguration configuration, bool isProduction)
    {
        var isSelfHost = IsSelfHost(configuration);
        var defaults = isProduction ? Array.Empty<string>() : configuration.GetSection("Cors:Origins").Get<string[]>() ?? [];
        var origins = defaults
            .Concat((configuration["Cors:AllowedOrigins"] ?? "").Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries))
            .Where(origin => Uri.TryCreate(origin, UriKind.Absolute, out var uri) &&
                (uri.Scheme is "http" or "https") && uri.AbsolutePath == "/" && string.IsNullOrEmpty(uri.Query) && string.IsNullOrEmpty(uri.Fragment))
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToArray();

        if (isSelfHost)
        {
            // Self-host serves frontend and API on the same origin (e.g. http://127.0.0.1:8080).
            // CORS origins are optional; if configured, local HTTP origins are allowed without requiring HTTPS cloud domains.
            return origins;
        }

        if (isProduction && origins.Any(origin => !Uri.TryCreate(origin, UriKind.Absolute, out var uri) || uri.Scheme != "https"))
            throw new InvalidOperationException("Cors__AllowedOrigins must use HTTPS origins in Production.");
        if (isProduction && origins.Length == 0)
            throw new InvalidOperationException("Set Cors__AllowedOrigins to the public frontend origin(s), separated by commas.");
        return origins;
    }
}
