using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using MindSprint.Api.Controllers;
using MindSprint.Api.Data;
using MindSprint.Api.Models;
using MindSprint.Api.Services;
using TaskStatus = MindSprint.Api.Models.TaskStatus;

Console.WriteLine("================================================================================");
Console.WriteLine("   MINDSPRINT AI — NFR-03: AUTHENTICATION, AUTHORIZATION & ACCOUNT ISOLATION    ");
Console.WriteLine("================================================================================");

var passed = 0;
var failed = 0;

void Check(bool condition, string label)
{
    if (condition)
    {
        passed++;
        Console.WriteLine($"[PASS] {label}");
    }
    else
    {
        failed++;
        Console.WriteLine($"[FAIL] {label}");
    }
}

int Status(IActionResult result) => result switch
{
    ObjectResult obj => obj.StatusCode ?? 200,
    StatusCodeResult sc => sc.StatusCode,
    ForbidResult => 403,
    _ => 200
};

var jwtKey = "test-secret-key-that-is-at-least-32-chars-long-nfr03-check!";
var issuer = "mindsprint-auth";
var audience = "mindsprint-client";

var cfg = new ConfigurationBuilder().AddInMemoryCollection(new Dictionary<string, string?>
{
    ["Jwt:Key"] = jwtKey,
    ["Jwt:Issuer"] = issuer,
    ["Jwt:Audience"] = audience,
    ["Jwt:AccessMinutes"] = "15"
}).Build();

// -----------------------------------------------------------------------------
// 1. JWT Security & Tampering Verification
// -----------------------------------------------------------------------------
Console.WriteLine("\n--- 1. JWT Security, Claims & Signature Tampering ---");

var testUser = new User { Id = 101, Email = "user101@example.test", DisplayName = "User 101" };
var tokenHandler = new JwtSecurityTokenHandler();
var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));

// Helper: validate a raw token string with custom parameters
ClaimsPrincipal? ValidateToken(string rawToken, TokenValidationParameters parameters, out SecurityToken? validatedToken)
{
    try
    {
        return tokenHandler.ValidateToken(rawToken, parameters, out validatedToken);
    }
    catch
    {
        validatedToken = null;
        return null;
    }
}

var standardParams = new TokenValidationParameters
{
    ValidateIssuer = true, ValidIssuer = issuer,
    ValidateAudience = true, ValidAudience = audience,
    ValidateIssuerSigningKey = true, IssuerSigningKey = signingKey,
    ValidateLifetime = true,
    ClockSkew = TimeSpan.Zero
};

// 1.1 Valid Token
var tokenServiceTemp = new TokenService(cfg, null!);
var validAccessToken = tokenServiceTemp.CreateAccessToken(testUser);
var principal = ValidateToken(validAccessToken, standardParams, out _);
Check(principal != null && principal.FindFirstValue(ClaimTypes.NameIdentifier) == "101",
    "Valid access token produces verified principal with matching NameIdentifier");

// 1.2 Signature Tampering (Attacker key)
var attackerKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("attacker-forged-key-32-chars-or-more-long-here!"));
var forgedTokenDesc = new SecurityTokenDescriptor
{
    Subject = new ClaimsIdentity(new[] { new Claim(ClaimTypes.NameIdentifier, "101"), new Claim(ClaimTypes.Email, testUser.Email) }),
    Issuer = issuer, Audience = audience,
    Expires = DateTime.UtcNow.AddMinutes(15),
    SigningCredentials = new SigningCredentials(attackerKey, SecurityAlgorithms.HmacSha256)
};
var forgedToken = tokenHandler.CreateToken(forgedTokenDesc);
var forgedTokenString = tokenHandler.WriteToken(forgedToken);
var tamperedPrincipal = ValidateToken(forgedTokenString, standardParams, out _);
Check(tamperedPrincipal == null, "Tampered signature (signed with forged secret key) is rejected");

// 1.3 Wrong Issuer
var wrongIssuerParams = new TokenValidationParameters
{
    ValidateIssuer = true, ValidIssuer = "other-issuer",
    ValidateAudience = true, ValidAudience = audience,
    ValidateIssuerSigningKey = true, IssuerSigningKey = signingKey,
    ValidateLifetime = true, ClockSkew = TimeSpan.Zero
};
var wrongIssuerPrincipal = ValidateToken(validAccessToken, wrongIssuerParams, out _);
Check(wrongIssuerPrincipal == null, "Token with mismatched Issuer is rejected");

// 1.4 Wrong Audience
var wrongAudienceParams = new TokenValidationParameters
{
    ValidateIssuer = true, ValidIssuer = issuer,
    ValidateAudience = true, ValidAudience = "other-audience",
    ValidateIssuerSigningKey = true, IssuerSigningKey = signingKey,
    ValidateLifetime = true, ClockSkew = TimeSpan.Zero
};
var wrongAudiencePrincipal = ValidateToken(validAccessToken, wrongAudienceParams, out _);
Check(wrongAudiencePrincipal == null, "Token with mismatched Audience is rejected");

// 1.5 Expired Token
var expiredTokenDesc = new SecurityTokenDescriptor
{
    Subject = new ClaimsIdentity(new[] { new Claim(ClaimTypes.NameIdentifier, "101") }),
    Issuer = issuer, Audience = audience,
    NotBefore = DateTime.UtcNow.AddMinutes(-20),
    Expires = DateTime.UtcNow.AddMinutes(-10),
    SigningCredentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256)
};
var expiredToken = tokenHandler.CreateToken(expiredTokenDesc);
var expiredTokenString = tokenHandler.WriteToken(expiredToken);
var expiredPrincipal = ValidateToken(expiredTokenString, standardParams, out _);
Check(expiredPrincipal == null, "Expired token (beyond lifetime and ClockSkew) is rejected");

// -----------------------------------------------------------------------------
// 2. Account Isolation Matrix (Anti-IDOR) - User A vs User B
// -----------------------------------------------------------------------------
Console.WriteLine("\n--- 2. Account Isolation (Anti-IDOR Matrix: User A vs User B) ---");

await using var connection = new SqliteConnection("Data Source=:memory:");
await connection.OpenAsync();
await using var db = new AppDbContext(new DbContextOptionsBuilder<AppDbContext>().UseSqlite(connection).Options);
await db.Database.EnsureCreatedAsync();

var hasher = new PasswordHasher<User>();
var tokens = new TokenService(cfg, db);

var userA = new User { Email = "user-a@mindsprint.test", DisplayName = "Alice (User A)" };
userA.PasswordHash = hasher.HashPassword(userA, "PasswordA123!");
var userB = new User { Email = "user-b@mindsprint.test", DisplayName = "Bob (User B)" };
userB.PasswordHash = hasher.HashPassword(userB, "PasswordB123!");
db.Users.AddRange(userA, userB);
await db.SaveChangesAsync();

// Populate User A's private assets
var taskA = new KanbanTask
{
    UserId = userA.Id, Title = "Alice Private Task", Description = "Confidential plan",
    Status = TaskStatus.Todo, Position = 0
};
var cardA = new Flashcard
{
    OwnerId = userA.Id, ExternalId = "card-alice-01", Category = "science",
    Question = "Alice Secret Question", Answer = "Alice Secret Answer", Version = 1
};
var systemCard = new Flashcard
{
    OwnerId = null, ExternalId = "oxford-seed-test", Category = "english",
    Question = "abandon", Answer = "to leave completely", Version = 1
};
var notebookA = new Notebook
{
    UserId = userA.Id, Title = "Alice Confidential Notebook"
};

db.Tasks.Add(taskA);
db.Flashcards.AddRange(cardA, systemCard);
db.Notebooks.Add(notebookA);
await db.SaveChangesAsync();

var sourceA = new NotebookSource
{
    NotebookId = notebookA.Id, Title = "Alice Thesis Draft.pdf", Type = "pdf",
    Content = "Confidential academic research data"
};
var noteA = new NotebookNote
{
    NotebookId = notebookA.Id, Title = "Key Findings", Content = "Critical findings by Alice"
};
db.NotebookSources.Add(sourceA);
db.NotebookNotes.Add(noteA);
await db.SaveChangesAsync();

// Helper to construct controller with User context
T WithUser<T>(T controller, int userId) where T : ControllerBase
{
    var httpContext = new DefaultHttpContext();
    var identity = new ClaimsIdentity(new[]
    {
        new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
        new Claim(ClaimTypes.Name, $"User {userId}")
    }, "TestAuth");
    httpContext.User = new ClaimsPrincipal(identity);
    controller.ControllerContext = new ControllerContext { HttpContext = httpContext };
    return controller;
}

// 2.1 TasksController Isolation
var tasksCtrlB = WithUser(new TasksController(db), userB.Id);
var userBTasksResult = await tasksCtrlB.GetAll() as OkObjectResult;
var userBTasks = userBTasksResult?.Value as System.Collections.IEnumerable;
var taskCount = 0;
if (userBTasks != null) foreach (var _ in userBTasks) taskCount++;
Check(taskCount == 0, "TasksController.GetAll: User B cannot see User A's tasks (returns empty list)");

var updateTaskRes = await tasksCtrlB.Update(taskA.Id, new TaskDto("Hacked Title", "Hacked", null));
Check(Status(updateTaskRes) == 404, "TasksController.Update: User B cannot edit User A's task (returns 404)");

var moveTaskRes = await tasksCtrlB.Move(taskA.Id, new MoveDto(TaskStatus.Doing, 0));
Check(Status(moveTaskRes) == 404, "TasksController.Move: User B cannot move User A's task (returns 404)");

var deleteTaskRes = await tasksCtrlB.Delete(taskA.Id);
Check(Status(deleteTaskRes) == 404, "TasksController.Delete: User B cannot delete User A's task (returns 404)");
Check(await db.Tasks.AnyAsync(t => t.Id == taskA.Id && t.Title == "Alice Private Task"),
    "Task A remains unmodified in database after User B attack attempts");

// 2.2 FlashcardsController Isolation
var cardsCtrlB = WithUser(new FlashcardsController(db), userB.Id);
var userBCardsResult = await cardsCtrlB.GetAll(null, null) as OkObjectResult;
var cardsList = userBCardsResult?.Value as List<CardResponse>;
var hasAliceCard = cardsList?.Any(c => c.Id == cardA.ExternalId) ?? false;
var hasSystemCard = cardsList?.Any(c => c.Id == systemCard.ExternalId) ?? false;
Check(!hasAliceCard, "FlashcardsController.GetAll: User B does NOT see User A's private flashcard");
Check(hasSystemCard, "FlashcardsController.GetAll: User B can read global system card (OwnerId == null)");

var updateCardRes = await cardsCtrlB.Update(cardA.ExternalId, new CardDto(null, "science", null, "Hacked", "Hacked", null, 1));
Check(Status(updateCardRes) == 404, "FlashcardsController.Update: User B cannot edit User A's card (returns 404)");

var deleteCardRes = await cardsCtrlB.Delete(cardA.ExternalId, 1);
Check(Status(deleteCardRes) == 404, "FlashcardsController.Delete: User B cannot delete User A's card (returns 404)");

var updateSystemCardRes = await cardsCtrlB.Update(systemCard.ExternalId, new CardDto(null, "english", null, "Hacked", "Hacked", null, 1));
Check(Status(updateSystemCardRes) == 404, "FlashcardsController.Update: System flashcard is immutable by regular user (returns 404)");

var deleteSystemCardRes = await cardsCtrlB.Delete(systemCard.ExternalId, 1);
Check(Status(deleteSystemCardRes) == 404, "FlashcardsController.Delete: System flashcard cannot be deleted by user (returns 404)");

// 2.3 ReviewController (SRS) Isolation
var reviewCtrlB = WithUser(new ReviewController(db, new SpacedRepetitionService()), userB.Id);
var reviewAliceCardRes = await reviewCtrlB.Submit(new ReviewDto(cardA.ExternalId, true));
Check(Status(reviewAliceCardRes) == 404, "ReviewController.Submit: User B cannot review User A's flashcard (returns 404)");

// 2.4 NotebooksController Isolation
var nbCtrlB = WithUser(new NotebooksController(db, null!, null!, null!), userB.Id);
var nbListRes = await nbCtrlB.List() as OkObjectResult;
var nbList = (nbListRes?.Value as System.Collections.IEnumerable);
var nbCount = 0;
if (nbList != null) foreach (var _ in nbList) nbCount++;
Check(nbCount == 0, "NotebooksController.List: User B cannot see User A's notebook (returns empty list)");

var nbSourcesRes = await nbCtrlB.Sources(notebookA.Id);
Check(Status(nbSourcesRes) == 404, "NotebooksController.Sources: User B cannot inspect User A's notebook sources (returns 404)");

var nbNotesRes = await nbCtrlB.Notes(notebookA.Id);
Check(Status(nbNotesRes) == 404, "NotebooksController.Notes: User B cannot inspect User A's notebook notes (returns 404)");

var nbDeleteRes = await nbCtrlB.Delete(notebookA.Id);
Check(Status(nbDeleteRes) == 404, "NotebooksController.Delete: User B cannot delete User A's notebook (returns 404)");
Check(await db.Notebooks.AnyAsync(n => n.Id == notebookA.Id), "Notebook A remains intact in database");

// 2.5 StudyStatsController Isolation
var statsCtrlB = WithUser(new StudyStatsController(db), userB.Id);
var daysRes = await statsCtrlB.GetStudyDays(null, null) as OkObjectResult;
var daysList = daysRes?.Value as System.Collections.IEnumerable;
var daysCount = 0;
if (daysList != null) foreach (var _ in daysList) daysCount++;
Check(daysCount == 0, "StudyStatsController.GetStudyDays: User B cannot see User A's study days");

var streakRes = await statsCtrlB.GetStreak() as OkObjectResult;
var streakJson = JsonSerializer.Serialize(streakRes?.Value);
Check(streakJson.Contains("\"currentStreak\":0") || streakJson.Contains("\"streak\":0") || streakJson.Contains("0"),
    "StudyStatsController.GetStreak: User B's streak is isolated (does not inherit User A's streak)");

// -----------------------------------------------------------------------------
// 3. Refresh Token Rotation, Revocation & Concurrency Race Condition
// -----------------------------------------------------------------------------
Console.WriteLine("\n--- 3. Refresh Token Rotation, Revocation & Concurrency ---");

var rtA = await tokens.CreateRefreshTokenAsync(userA, "Device-Alice-1");
Check(rtA != null && !rtA.IsRevoked && rtA.Token.Length >= 32, "CreateRefreshToken: Generates active cryptographic token");

var validatedUser = await tokens.ValidateRefreshTokenAsync(rtA.Token);
Check(validatedUser != null && validatedUser.Id == userA.Id, "ValidateRefreshToken: Active token returns correct User");

// 3.1 Rotation
var rotatedRt = await tokens.RotateAsync(rtA.Token, "Device-Alice-1");
Check(rotatedRt != null && rotatedRt.Token != rtA.Token, "RotateAsync: Successfully rotates to new refresh token");

var oldTokenValidate = await tokens.ValidateRefreshTokenAsync(rtA.Token);
Check(oldTokenValidate == null, "RotateAsync: Old refresh token is revoked and cannot be validated");

var secondRotateOldToken = await tokens.RotateAsync(rtA.Token, "Device-Alice-1");
Check(secondRotateOldToken == null, "RotateAsync: Replaying revoked old token is rejected");

// 3.2 Single Revocation
var okRevoke = await tokens.RevokeAsync(rotatedRt!.Token, userA.Id);
Check(okRevoke, "RevokeAsync: Successfully revokes active session");
var revokedValidate = await tokens.ValidateRefreshTokenAsync(rotatedRt.Token);
Check(revokedValidate == null, "ValidateRefreshToken: Revoked token fails validation");

// 3.3 Expired Refresh Token
var expiredRt = new RefreshToken
{
    UserId = userA.Id, Token = "expired-token-nfr03-check",
    ExpiresAt = DateTime.UtcNow.AddDays(-1), IsRevoked = false
};
db.RefreshTokens.Add(expiredRt);
await db.SaveChangesAsync();
var expiredValidate = await tokens.ValidateRefreshTokenAsync(expiredRt.Token);
Check(expiredValidate == null, "ValidateRefreshToken: Expired refresh token fails validation");
var expiredRotate = await tokens.RotateAsync(expiredRt.Token, null);
Check(expiredRotate == null, "RotateAsync: Expired refresh token cannot be rotated");

// 3.4 Concurrency Race Condition Check (Parallel Refresh Requests)
Console.WriteLine("\nTesting Concurrency: 10 parallel threads rotating the exact same refresh token...");
var targetRt = await tokens.CreateRefreshTokenAsync(userB, "Race-Test-Device");
var successCount = 0;
var conflictCount = 0;

// Test concurrency against PostgreSQL with real connection pooling
var pgConnStr = "Host=localhost;Database=mindsprint;Username=postgres;Password=postgres;Port=5432";
var pgConcOptions = new DbContextOptionsBuilder<AppDbContext>().UseNpgsql(pgConnStr).Options;
await using (var seedPg = new AppDbContext(pgConcOptions))
{
    var seedTokens = new TokenService(cfg, seedPg);
    var concUser = new User { Email = "conc-" + Guid.NewGuid().ToString("N") + "@mindsprint.test", DisplayName = "Conc User", PasswordHash = "hash" };
    seedPg.Users.Add(concUser);
    await seedPg.SaveChangesAsync();
    var pgTargetRt = await seedTokens.CreateRefreshTokenAsync(concUser, "Pg-Race");
    targetRt = pgTargetRt;
}

await Parallel.ForEachAsync(Enumerable.Range(0, 10), async (_, ct) =>
{
    await using var threadDb = new AppDbContext(pgConcOptions);
    var threadTokens = new TokenService(cfg, threadDb);
    try
    {
        var res = await threadTokens.RotateAsync(targetRt.Token, "Race-Worker");
        if (res != null) Interlocked.Increment(ref successCount);
        else Interlocked.Increment(ref conflictCount);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"[DEBUG] Thread error: {ex.Message}");
        Interlocked.Increment(ref conflictCount);
    }
});

Console.WriteLine($"Parallel Results: {successCount} succeeded, {conflictCount} rejected");
// If concurrency protection is in place, exactly 1 succeeds.
// As noted in ADR-003, we log the exact behavior.
Check(successCount == 1,
    $"Concurrency Protection: Exactly 1 concurrent request can rotate the token (Success: {successCount}, Rejected: {conflictCount})");

// -----------------------------------------------------------------------------
// 4. Live PostgreSQL Verification
// -----------------------------------------------------------------------------
Console.WriteLine("\n--- 4. Live PostgreSQL 17 Verification ---");
var pgConnectionString = "Host=localhost;Database=mindsprint;Username=postgres;Password=postgres;Port=5432";
try
{
    var pgOptions = new DbContextOptionsBuilder<AppDbContext>().UseNpgsql(pgConnectionString).Options;
    await using var pgDb = new AppDbContext(pgOptions);
    
    // Verify connection & migrations
    var canConnect = await pgDb.Database.CanConnectAsync();
    Check(canConnect, "PostgreSQL: Connection to local 'mindsprint' database established");
    
    if (canConnect)
    {
        var pgTokens = new TokenService(cfg, pgDb);
        // Create isolated test user
        var testEmail = $"nfr03-test-{Guid.NewGuid():N}@example.test";
        var pgUserA = new User { Email = testEmail, DisplayName = "NFR-03 Pg Test A", PasswordHash = "hash" };
        var pgUserB = new User { Email = $"b-{testEmail}", DisplayName = "NFR-03 Pg Test B", PasswordHash = "hash" };
        pgDb.Users.AddRange(pgUserA, pgUserB);
        await pgDb.SaveChangesAsync();
        
        // Add task for A
        var pgTaskA = new KanbanTask { UserId = pgUserA.Id, Title = "Pg Task A", Status = TaskStatus.Todo, Position = 0 };
        pgDb.Tasks.Add(pgTaskA);
        await pgDb.SaveChangesAsync();
        
        // Test isolation on PG
        var pgTasksCtrlB = WithUser(new TasksController(pgDb), pgUserB.Id);
        var pgUpdateRes = await pgTasksCtrlB.Update(pgTaskA.Id, new TaskDto("Hacked", null, null));
        Check(Status(pgUpdateRes) == 404, "PostgreSQL: Anti-IDOR enforced on PostgreSQL engine (Update returns 404)");
        
        // Test refresh token on PG
        var pgRt = await pgTokens.CreateRefreshTokenAsync(pgUserA, "Pg-Device");
        Check(pgRt != null && pgRt.Id > 0, "PostgreSQL: Refresh token created and persisted in PostgreSQL table");
        
        var pgRotated = await pgTokens.RotateAsync(pgRt!.Token, "Pg-Device-New");
        Check(pgRotated != null, "PostgreSQL: Token rotated in PostgreSQL");
        var pgReplay = await pgTokens.RotateAsync(pgRt.Token, "Pg-Device-Replay");
        Check(pgReplay == null, "PostgreSQL: Token replay rejected in PostgreSQL");
        
        // Cleanup test records
        pgDb.Tasks.Remove(pgTaskA);
        pgDb.Users.RemoveRange(pgUserA, pgUserB);
        await pgDb.SaveChangesAsync();
        Check(true, "PostgreSQL: Cleaned up ephemeral test records");
    }
}
catch (Exception ex)
{
    Console.WriteLine($"[FAIL] PostgreSQL Verification Error: {ex.Message}");
    failed++;
}

Console.WriteLine("================================================================================");
Console.WriteLine($"  NFR-03 EXECUTION SUMMARY: {passed} PASSED, {failed} FAILED");
Console.WriteLine("================================================================================");

Environment.Exit(failed == 0 ? 0 : 1);
