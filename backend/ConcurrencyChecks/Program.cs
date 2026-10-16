using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using MindSprint.Api.Controllers;
using MindSprint.Api.Data;
using MindSprint.Api.Models;
using MindSprint.Api.Services;

var directory = Path.GetFullPath("artifacts/concurrency-checks");
Directory.CreateDirectory(directory);
var connection = "Data Source=" + Path.Combine(directory, Guid.NewGuid().ToString("N") + ".db");
DbContextOptions<AppDbContext> Options(SaveGate? gate = null) {
    var builder = new DbContextOptionsBuilder<AppDbContext>().UseSqlite(connection);
    if (gate is not null) builder.AddInterceptors(gate);
    return builder.Options;
}
var passed = 0;
void Check(bool value, string name) { if (!value) throw new Exception("FAIL " + name); passed++; Console.WriteLine("PASS " + name); }
static int Status(IActionResult result) => result is ObjectResult o ? o.StatusCode ?? 200 : ((StatusCodeResult)result).StatusCode;
static JsonElement Body(IActionResult result) => JsonSerializer.SerializeToElement(((ObjectResult)result).Value, new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase });
FlashcardsController Controller(AppDbContext db, int user = 1) => new(db) { ControllerContext = new() { HttpContext = new DefaultHttpContext {
    User = new ClaimsPrincipal(new ClaimsIdentity([new Claim(ClaimTypes.NameIdentifier, user.ToString())], "check"))
} } };
await using (var seed = new AppDbContext(Options())) {
    await seed.Database.EnsureCreatedAsync();
    seed.Users.AddRange(new User { Id = 1, Email = "owner@example.test" }, new User { Id = 2, Email = "other@example.test" });
    seed.RefreshTokens.AddRange(
        new RefreshToken { UserId = 1, Token = "synthetic-live", ExpiresAt = DateTime.UtcNow.AddDays(1) },
        new RefreshToken { UserId = 1, Token = "synthetic-expired", ExpiresAt = DateTime.UtcNow.AddDays(-1) },
        new RefreshToken { UserId = 1, Token = "synthetic-revoked", ExpiresAt = DateTime.UtcNow.AddDays(1), IsRevoked = true });
    seed.Flashcards.Add(new Flashcard { OwnerId = 1, ExternalId = "synthetic-card", Question = "Original", Answer = "Answer", Version = 1 });
    await seed.SaveChangesAsync();
}

if (!args.Contains("--cards")) {
    var gate = new SaveGate();
    await using var one = new AppDbContext(Options(gate));
    await using var two = new AppDbContext(Options(gate));
    var cfg = new ConfigurationBuilder().Build();
    var results = await Task.WhenAll(new TokenService(cfg, one).RotateAsync("synthetic-live", "tab A"), new TokenService(cfg, two).RotateAsync("synthetic-live", "tab B"));
    Check(results.Count(r => r is not null) == 1, "one old refresh token can issue only one replacement under concurrency");
    await using var inspect = new AppDbContext(Options());
    Check(await inspect.RefreshTokens.CountAsync(r => !r.IsRevoked && r.ExpiresAt > DateTime.UtcNow) == 1, "losing rotation does not leave an active token");
    Check(await inspect.RefreshTokens.CountAsync() == 4, "losing rotation insert is rolled back with the revoked-token update");
    Check(!one.ChangeTracker.Entries<RefreshToken>().Any(e => e.State == EntityState.Added) && !two.ChangeTracker.Entries<RefreshToken>().Any(e => e.State == EntityState.Added), "loser does not leave a pending replacement in the scoped context");
    var tokens = new TokenService(cfg, inspect);
    foreach (var invalid in new[] { "synthetic-live", "synthetic-expired", "synthetic-revoked", "missing" })
        Check(await tokens.RotateAsync(invalid, null) is null, "refresh rejects replay/expired/revoked/missing: " + invalid);
    var winningToken = results.Single(r => r is not null)!;
    Check(await tokens.RotateAsync(winningToken.Token, null) is not null, "the winning replacement can rotate normally");

    await using var seedRevoke = new AppDbContext(Options());
    seedRevoke.RefreshTokens.Add(new RefreshToken { UserId = 1, Token = "synthetic-logout", ExpiresAt = DateTime.UtcNow.AddDays(1) });
    await seedRevoke.SaveChangesAsync();
    var revokeGate = new SaveGate();
    await using var rotating = new AppDbContext(Options(revokeGate));
    await using var revoking = new AppDbContext(Options(revokeGate));
    var rotation = new TokenService(cfg, rotating).RotateAsync("synthetic-logout", null);
    var revocation = new TokenService(cfg, revoking).RevokeAsync("synthetic-logout", 1);
    await Task.WhenAll(rotation, (Task)revocation);
    Check(await revocation, "revoking concurrently with rotation remains an idempotent success");
    Check(await seedRevoke.RefreshTokens.AsNoTracking().Where(r => r.Token == "synthetic-logout").AllAsync(r => r.IsRevoked), "concurrent logout leaves the old token revoked");
}

if (!args.Contains("--tokens")) {
    var gate = new SaveGate();
    await using (var one = new AppDbContext(Options(gate)))
    await using (var two = new AppDbContext(Options(gate))) {
        var results = await Task.WhenAll(
            Controller(one).Update("synthetic-card", new(null, "general", null, "Edit A", "Answer", null, 1)),
            Controller(two).Update("synthetic-card", new(null, "general", null, "Edit B", "Answer", null, 1)));
        Check(results.Select(Status).Order().SequenceEqual(new[] { 200, 409 }), "two updates from the same version return one success and one conflict");
        await using var inspect = new AppDbContext(Options());
        var card = await inspect.Flashcards.SingleAsync();
        Check(card.Version == 2, "winning update advances the version exactly once");
        var conflict = Body(results.Single(r => Status(r) == 409));
        Check(conflict.GetProperty("serverVersion").GetInt32() == 2 && conflict.GetProperty("serverCard").GetProperty("question").GetString() == card.Question, "conflict includes the actual winning card for the client to reload");
        Check(Status(await Controller(inspect).Update("synthetic-card", new(null, "general", null, "Stale", "Answer", null, 1))) == 409, "later stale updates are rejected");
        Check(Status(await Controller(inspect, 2).Update("synthetic-card", new(null, "general", null, "Foreign", "Answer", null, 2))) == 404, "concurrency handling retains card ownership checks");
        Check(Status(await Controller(inspect).Update("synthetic-card", new(null, "general", null, "Next", "Answer", null, 2))) == 200, "retrying with the current version succeeds");
    }
    gate = new SaveGate();
    await using (var editing = new AppDbContext(Options(gate)))
    await using (var deleting = new AppDbContext(Options(gate))) {
        var results = await Task.WhenAll(
            Controller(editing).Update("synthetic-card", new(null, "general", null, "Last edit", "Answer", null, 3)),
            Controller(deleting).Delete("synthetic-card", 3));
        var editStatus = Status(results[0]); var deleteStatus = Status(results[1]);
        Check((editStatus == 200 && deleteStatus == 409) || (editStatus == 404 && deleteStatus == 204), "edit/delete races return a conflict or not-found instead of a server error");
    }
}
Console.WriteLine($"{passed} concurrency checks passed; isolated SQLite only.");

sealed class SaveGate : SaveChangesInterceptor
{
    private readonly TaskCompletionSource release = new(TaskCreationOptions.RunContinuationsAsynchronously);
    private int waiting;
    public override async ValueTask<InterceptionResult<int>> SavingChangesAsync(DbContextEventData eventData, InterceptionResult<int> result, CancellationToken cancellationToken = default) {
        if (Interlocked.Increment(ref waiting) == 2) release.TrySetResult();
        await release.Task.WaitAsync(TimeSpan.FromSeconds(10), cancellationToken);
        return result;
    }
}
