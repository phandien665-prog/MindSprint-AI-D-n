using System.Text.Json;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using MindSprint.Api.Models;

namespace MindSprint.Api.Data;

public static class DataSeeder
{
    private record SeedCard(string ExternalId, string Category, string? SubCategory, string Question, string Answer, string? Example);

    public static async Task SeedAsync(AppDbContext db, IPasswordHasher<User> hasher, bool includeDemoUser = true)
    {
        const string demoEmail = "notebookai@demo.local";
        const string demoPassword = "MindSprint123!";
        const string demoDisplayName = "Notebook AI Demo";

        if (includeDemoUser && !await db.Users.AnyAsync(u => u.Email == demoEmail))
        {
            var demoUser = new User
            {
                Email = demoEmail,
                DisplayName = demoDisplayName,
            };
            demoUser.PasswordHash = hasher.HashPassword(demoUser, demoPassword);
            db.Users.Add(demoUser);
            await db.SaveChangesAsync();
        }

        var path = Path.Combine(AppContext.BaseDirectory, "Data", "vocab_seed.json");
        if (!File.Exists(path)) return;

        var cards = JsonSerializer.Deserialize<List<SeedCard>>(await File.ReadAllTextAsync(path),
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? [];

        var existingById = await db.Flashcards
            .Where(f => f.OwnerId == null)
            .ToDictionaryAsync(f => f.ExternalId, f => f);

        foreach (var c in cards)
        {
            if (existingById.TryGetValue(c.ExternalId, out var existing))
            {
                existing.Category = c.Category;
                existing.SubCategory = c.SubCategory;
                existing.Question = c.Question;
                existing.Answer = c.Answer;
                existing.Example = c.Example;
            }
            else
            {
                db.Flashcards.Add(new Flashcard
                {
                    ExternalId = c.ExternalId, Category = c.Category, SubCategory = c.SubCategory,
                    Question = c.Question, Answer = c.Answer, Example = c.Example
                });
            }
        }
        await db.SaveChangesAsync();
    }
}
