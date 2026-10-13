using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Abstractions;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Routing;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
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
JsonElement Body(IActionResult result) => JsonSerializer.SerializeToElement(((ObjectResult)result).Value);
int Status(IActionResult result) => ((ObjectResult)result).StatusCode ?? 200;
var cfg = new ConfigurationBuilder().AddInMemoryCollection(new Dictionary<string, string?> {
    ["Google:ClientId"] = "google-check.apps.googleusercontent.com",
    ["Jwt:Key"] = "test-only-key-012345678901234567890123456789",
    ["Jwt:Issuer"] = "auth-check", ["Jwt:Audience"] = "auth-check"
}).Build();
var clock = new TestClock();
var challenges = new GoogleLoginChallenges(clock);
var nonce = challenges.Create()!;
Check(nonce.Length == 64 && challenges.IsValid(nonce), "nonce is random and live");
Check(challenges.Consume(nonce) && !challenges.Consume(nonce), "nonce can be consumed only once");
nonce = challenges.Create()!;
clock.Now = clock.Now.AddMinutes(5);
Check(!challenges.IsValid(nonce) && !challenges.Consume(nonce), "nonce expires after five minutes");
nonce = challenges.Create()!;
var successes = 0;
Parallel.For(0, 20, _ => { if (challenges.Consume(nonce)) Interlocked.Increment(ref successes); });
Check(successes == 1, "parallel requests cannot reuse a nonce");

await using var connection = new SqliteConnection("Data Source=:memory:");
await connection.OpenAsync();
await using var db = new AppDbContext(new DbContextOptionsBuilder<AppDbContext>().UseSqlite(connection).Options);
await db.Database.EnsureCreatedAsync();
var hasher = new PasswordHasher<User>();
var validator = new StubValidator();
var accounts = new GoogleAccountService(db, hasher);
var tokens = new TokenService(cfg, db);
GoogleAuthController Controller() => new(cfg, db, tokens, validator, challenges, accounts) {
    ControllerContext = new ControllerContext { HttpContext = new DefaultHttpContext() }
};
async Task<IActionResult> Login(string subject, string email, string nonceValue, string? password = null)
{
    db.ChangeTracker.Clear();
    validator.Identity = new(subject, email, "Người dùng Google");
    return await Controller().Login(new("check-credential", nonceValue, password), CancellationToken.None);
}

Check(Body(Controller().Config()).GetProperty("enabled").GetBoolean(), "configured client ID is publicly available");
cfg["Google:ClientId"] = null;
Check(!Body(Controller().Config()).GetProperty("enabled").GetBoolean(), "missing client ID disables Google login");
Check(Status(Controller().CreateChallenge()) == 503, "missing config does not issue challenges");
try {
    await new GoogleTokenValidator(cfg).ValidateAsync("invalid", "invalid", CancellationToken.None);
    Check(false, "disabled validator rejects tokens");
} catch (GoogleSignInException ex) { Check(ex.Code == "google_not_configured", "disabled validator rejects tokens"); }
cfg["Google:ClientId"] = "google-check.apps.googleusercontent.com";
try {
    await new GoogleTokenValidator(cfg).ValidateAsync("not-a-jwt", "invalid", CancellationToken.None);
    Check(false, "real Google validator rejects malformed credentials");
} catch (GoogleSignInException ex) { Check(ex.Status == 401, "real Google validator rejects malformed credentials"); }

using var signingKey = RSA.Create(2048);
string ForgedToken(string audience, string issuer, bool expired = false)
{
    var now = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
    var header = Base64UrlEncoder.Encode(JsonSerializer.Serialize(new { alg = "RS256", typ = "JWT" }));
    var payload = Base64UrlEncoder.Encode(JsonSerializer.Serialize(new {
        aud = audience, iss = issuer, sub = "forged-subject", email = "forged@example.test", email_verified = true,
        nonce = "nonce", iat = now - 3600, exp = expired ? now - 60 : now + 3600
    }));
    var unsigned = header + "." + payload;
    return unsigned + "." + Base64UrlEncoder.Encode(signingKey.SignData(Encoding.UTF8.GetBytes(unsigned), HashAlgorithmName.SHA256, RSASignaturePadding.Pkcs1));
}
foreach (var (token, label) in new[] {
    (ForgedToken("different-client.apps.googleusercontent.com", "https://accounts.google.com"), "real validator rejects wrong audience"),
    (ForgedToken(cfg["Google:ClientId"]!, "https://attacker.example"), "real validator rejects wrong issuer"),
    (ForgedToken(cfg["Google:ClientId"]!, "https://accounts.google.com", true), "real validator rejects expired token")
}) {
    try { await new GoogleTokenValidator(cfg).ValidateAsync(token, "nonce", CancellationToken.None); Check(false, label); }
    catch (GoogleSignInException ex) { Check(ex.Status == 401, label); }
}
if (args.Contains("--live-keys")) {
    const string label = "real validator rejects forged signature using Google's public keys";
    try {
        await new GoogleTokenValidator(cfg).ValidateAsync(ForgedToken(cfg["Google:ClientId"]!, "https://accounts.google.com"), "nonce", CancellationToken.None);
        Check(false, label);
    } catch (GoogleSignInException ex) { Check(ex.Status == 401, label); }
}

ActionExecutingContext OriginContext(string? origin, string action = "Login")
{
    var http = new DefaultHttpContext();
    if (origin is not null) http.Request.Headers.Origin = origin;
    var descriptor = new ActionDescriptor { RouteValues = new Dictionary<string, string?> { ["action"] = action } };
    var controller = Controller();
    controller.ControllerContext = new ControllerContext { HttpContext = http };
    var context = new ActionExecutingContext(new ActionContext(http, new RouteData(), descriptor), [], new Dictionary<string, object?>(), controller);
    controller.OnActionExecuting(context);
    return context;
}
Check(OriginContext("http://127.0.0.1:5500").Result is null, "frontend origin is accepted");
Check(OriginContext("https://untrusted.example").Result is ObjectResult { StatusCode: 403 }, "foreign browser origin is rejected");
Check(OriginContext(null).Result is ObjectResult { StatusCode: 403 }, "missing origin is rejected for login");
Check(OriginContext(null, "Config").Result is null, "public config requires no origin");
cfg["Google:AllowedOrigins:0"] = "https://study.example";
Check(OriginContext("https://study.example").Result is null && OriginContext("http://127.0.0.1:5500").Result is not null,
    "deployment origin config replaces local defaults");
cfg["Google:AllowedOrigins:0"] = null;

nonce = challenges.Create()!;
var result = await Login("subject-one", "google@example.test", nonce);
Check(Status(result) == 200, "new Google identity can sign in");
var response = Body(result);
var userId = response.GetProperty("user").GetProperty("Id").GetInt32();
var access = response.GetProperty("token").GetString()!;
var principal = new JwtSecurityTokenHandler().ValidateToken(access, new TokenValidationParameters {
    ValidateIssuer = true, ValidIssuer = "auth-check", ValidateAudience = true, ValidAudience = "auth-check",
    ValidateLifetime = true, ValidateIssuerSigningKey = true,
    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(cfg["Jwt:Key"]!))
}, out _);
Check(principal.FindFirstValue(ClaimTypes.NameIdentifier) == userId.ToString(), "Google login issues a valid app JWT for the correct user");
Check(await db.RefreshTokens.AnyAsync(r => r.UserId == userId && r.Token == response.GetProperty("refreshToken").GetString()),
    "Google login has the same revocable refresh session as password login");
Check(!challenges.IsValid(nonce) && Status(await Login("subject-one", "google@example.test", nonce)) == 401,
    "successful credential cannot be replayed");
Check(await db.Users.CountAsync() == 1, "replay does not create another user");
result = await Login("subject-one", "renamed@example.test", challenges.Create()!);
Check(Status(result) == 200 && Body(result).GetProperty("user").GetProperty("Id").GetInt32() == userId,
    "Google subject keeps the same account even if Google email changes");
Check(await db.Users.CountAsync() == 1, "repeat sign-in does not duplicate the account");

var existing = new User { Email = "existing@example.test", DisplayName = "Tài khoản hiện tại" };
existing.PasswordHash = hasher.HashPassword(existing, "existing-password");
db.Users.Add(existing); await db.SaveChangesAsync();
var existingId = existing.Id;
db.Notebooks.Add(new Notebook { UserId = existingId, Title = "Dữ liệu cần giữ" });
await db.SaveChangesAsync();
nonce = challenges.Create()!;
result = await Login("subject-existing", existing.Email, nonce);
Check(Status(result) == 409 && Body(result).GetProperty("code").GetString() == "google_link_required", "existing email requires account proof");
Check(challenges.IsValid(nonce) && (await db.Users.FindAsync(existingId))!.GoogleSubject is null, "link request preserves nonce and account");
result = await Login("subject-existing", existing.Email, nonce, "wrong-password");
Check(Status(result) == 401 && Body(result).GetProperty("code").GetString() == "google_link_password_invalid", "wrong linking password is rejected");
Check((await db.Users.FindAsync(existingId))!.GoogleSubject is null, "wrong proof cannot link the account");
result = await Login("subject-existing", existing.Email, nonce, "existing-password");
Check(Status(result) == 200 && Body(result).GetProperty("user").GetProperty("Id").GetInt32() == existingId, "verified link reuses existing user ID");
Check(await db.Notebooks.AnyAsync(n => n.UserId == existingId && n.Title == "Dữ liệu cần giữ") && await db.Users.CountAsync() == 2,
    "linking preserves notebooks and avoids duplicate users");
result = await Login("another-subject", existing.Email, challenges.Create()!, "existing-password");
Check(Status(result) == 409, "email already linked to another Google identity is not reassigned");
validator.Failure = new GoogleSignInException(401, "google_invalid_credential", "Invalid credential");
result = await Login("fake", "fake@example.test", challenges.Create()!);
Check(Status(result) == 401 && !await db.Users.AnyAsync(u => u.Email == "fake@example.test"), "unverified credentials never create accounts");
validator.Failure = null;

db.ChangeTracker.Clear();
db.Users.Add(new User { Email = "duplicate@example.test", GoogleSubject = "subject-one" });
try { await db.SaveChangesAsync(); Check(false, "database prevents duplicate Google subjects"); }
catch (DbUpdateException) { Check(true, "database prevents duplicate Google subjects"); }
Console.WriteLine($"Google auth checks: {passed} passed. Isolated SQLite database; no live users modified.");

class TestClock : TimeProvider
{
    public DateTimeOffset Now { get; set; } = DateTimeOffset.UtcNow;
    public override DateTimeOffset GetUtcNow() => Now;
}
class StubValidator : IGoogleTokenValidator
{
    public GoogleIdentity Identity { get; set; } = new("subject", "user@example.test", "Test");
    public GoogleSignInException? Failure { get; set; }
    public Task<GoogleIdentity> ValidateAsync(string credential, string nonce, CancellationToken ct) =>
        Failure is null ? Task.FromResult(Identity) : Task.FromException<GoogleIdentity>(Failure);
}
