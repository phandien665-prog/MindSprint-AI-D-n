using System.Text.Json;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using MindSprint.Api;
using MindSprint.Api.Controllers;
using MindSprint.Api.Data;
using MindSprint.Api.Models;
using MindSprint.Api.Services;

var passed = 0;
void Check(bool condition, string label)
{
    if (!condition) throw new Exception("FAIL: " + label);
    passed++;
    Console.WriteLine("PASS: " + label);
}
void Rejects(Action action, string message, string label)
{
    try { action(); }
    catch (InvalidOperationException exception) when (exception.Message.Contains(message, StringComparison.Ordinal))
    { Check(true, label); return; }
    Check(false, label);
}
var configuration = new ConfigurationBuilder().AddInMemoryCollection(new Dictionary<string, string?> {
    ["ConnectionStrings:Default"] = "Host=postgres.example;Database=mindsprint;Username=test",
    ["Jwt:Key"] = new string('k', 40),
    ["Cors:AllowedOrigins"] = "https://study.example"
}).Build();

Check(SecurityConfiguration.GetConnectionString(configuration, true).StartsWith("Host=postgres.example", StringComparison.Ordinal), "production accepts configured remote database");
configuration["ConnectionStrings:Default"] = "Host=localhost;Database=mindsprint";
Rejects(() => SecurityConfiguration.GetConnectionString(configuration, true), "production PostgreSQL", "production rejects localhost database");
configuration["ConnectionStrings:Default"] = null;
Rejects(() => SecurityConfiguration.GetConnectionString(configuration, true), "must be configured", "missing database configuration fails clearly");
configuration["ConnectionStrings:Default"] = "Host=postgres.example;Database=mindsprint";
Check(SecurityConfiguration.GetJwtKey(configuration, true).Length >= 32, "production accepts sufficiently long JWT key");
configuration["Jwt:Key"] = null;
Rejects(() => SecurityConfiguration.GetJwtKey(configuration, true), "at least 32", "missing JWT key fails clearly");
configuration["Jwt:Key"] = "short";
Rejects(() => SecurityConfiguration.GetJwtKey(configuration, true), "at least 32", "short JWT key fails clearly");
configuration["Jwt:Key"] = "DOI_KHOA_NAY_THANH_CHUOI_BI_MAT_DAI_IT_NHAT_32_KY_TU";
Rejects(() => SecurityConfiguration.GetJwtKey(configuration, true), "at least 32", "production rejects placeholder JWT key");
configuration["Jwt:Key"] = new string('k', 40);
Check(SecurityConfiguration.GetCorsOrigins(configuration, true).SequenceEqual(["https://study.example"]), "production uses explicit HTTPS CORS allowlist");
configuration["Cors:AllowedOrigins"] = "http://study.example";
Rejects(() => SecurityConfiguration.GetCorsOrigins(configuration, true), "HTTPS", "production rejects HTTP CORS origin");
configuration["Cors:AllowedOrigins"] = null;
Rejects(() => SecurityConfiguration.GetCorsOrigins(configuration, true), "Cors__AllowedOrigins", "missing production CORS allowlist fails clearly");
configuration["Cors:Origins:0"] = "http://localhost:5500";
Check(SecurityConfiguration.GetCorsOrigins(configuration, false).SequenceEqual(["http://localhost:5500"]), "development retains local HTTP CORS origin");

await using var connection = new SqliteConnection("Data Source=:memory:");
await connection.OpenAsync();
await using var db = new AppDbContext(new DbContextOptionsBuilder<AppDbContext>().UseSqlite(connection).Options);
await db.Database.EnsureCreatedAsync();
var hasher = new PasswordHasher<User>();
var tokens = new TokenService(configuration, db);
var environment = new TestEnvironment { EnvironmentName = Environments.Production };
AuthController Controller() => new(db, hasher, tokens, environment);
var denied = await Controller().DemoLogin();
Check(denied is NotFoundResult && !await db.Users.AnyAsync(), "production demo endpoint returns 404 without creating a fixed-password account");
environment.EnvironmentName = Environments.Development;
var allowed = await Controller().DemoLogin();
var body = JsonSerializer.Serialize(((ObjectResult)allowed).Value);
Check(allowed is OkObjectResult && await db.Users.AnyAsync(u => u.Email == "notebookai@demo.local"), "development demo login remains available");
Check(!body.Contains("password", StringComparison.OrdinalIgnoreCase), "demo response does not disclose a password");
environment.EnvironmentName = Environments.Production;
var legacyLogin = await Controller().Login(new LoginDto("demo", "not-the-demo-password"));
Check(legacyLogin is UnauthorizedObjectResult, "production rejects fixed demo credentials through regular login");

Console.WriteLine($"Security checks: {passed} passed. SQLite in memory; no production data or provider calls.");

sealed class TestEnvironment : IHostEnvironment
{
    public string EnvironmentName { get; set; } = Environments.Development;
    public string ApplicationName { get; set; } = "SecurityChecks";
    public string ContentRootPath { get; set; } = Directory.GetCurrentDirectory();
    public IFileProvider ContentRootFileProvider { get; set; } = new NullFileProvider();
}