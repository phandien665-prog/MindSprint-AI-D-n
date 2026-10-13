using Npgsql;

namespace MindSprint.Api.Services;

/// <summary>Accepts either a regular Npgsql connection string or Render's PostgreSQL URL.</summary>
public static class PostgresConnectionString
{
    public static string Normalize(string connectionString)
    {
        if (!Uri.TryCreate(connectionString, UriKind.Absolute, out var uri) ||
            (uri.Scheme is not ("postgres" or "postgresql")))
            return connectionString;

        var credentials = uri.UserInfo.Split(':', 2);
        if (credentials.Length != 2 || string.IsNullOrWhiteSpace(uri.Host) ||
            string.IsNullOrWhiteSpace(uri.AbsolutePath.Trim('/')))
            throw new InvalidOperationException("ConnectionStrings:Default must be a valid PostgreSQL URL.");

        var builder = new NpgsqlConnectionStringBuilder
        {
            Host = uri.Host,
            Port = uri.Port > 0 ? uri.Port : 5432,
            Database = Uri.UnescapeDataString(uri.AbsolutePath.Trim('/')),
            Username = Uri.UnescapeDataString(credentials[0]),
            Password = Uri.UnescapeDataString(credentials[1]),
            SslMode = SslMode.Require,
            Timeout = 15,
            CommandTimeout = 30
        };

        return builder.ConnectionString;
    }
}
