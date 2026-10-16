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

        // Get all existing system cards (OwnerId == null)
        var existingSystemCards = await db.Flashcards
            .Where(f => f.OwnerId == null)
            .ToDictionaryAsync(f => f.ExternalId, f => f);

        // Get all new seed ExternalIds for quick lookup
        var newSeedExternalIds = cards.Select(c => c.ExternalId).ToHashSet();

        // Retire old system cards that are NOT in new seed data (Oxford 3000 legacy)
        // These are old cards with ExternalId not matching new v2- hash pattern
        var cardsToRetire = existingSystemCards.Values
            .Where(f => !newSeedExternalIds.Contains(f.ExternalId))
            .ToList();

        foreach (var oldCard in cardsToRetire)
        {
            // Soft-delete: mark as retired by setting OwnerId to -1 (special marker)
            // Or hard-delete if no CardProgress references exist
            var hasProgress = await db.CardProgresses.AnyAsync(cp => cp.FlashcardId == oldCard.Id);
            if (!hasProgress)
            {
                db.Flashcards.Remove(oldCard);
            }
            else
            {
                // Keep but mark as retired system card (hide from UI)
                oldCard.OwnerId = -1; // Special marker for retired system cards
            }
        }

        // Upsert new seed cards
        foreach (var c in cards)
        {
            if (existingSystemCards.TryGetValue(c.ExternalId, out var existing))
            {
                // Update existing system card
                existing.Category = c.Category;
                existing.SubCategory = c.SubCategory;
                existing.Question = c.Question;
                existing.Answer = c.Answer;
                existing.Example = c.Example;
                existing.OwnerId = null; // Ensure it's a system card
            }
            else
            {
                // Add new system card
                db.Flashcards.Add(new Flashcard
                {
                    ExternalId = c.ExternalId,
                    Category = c.Category,
                    SubCategory = c.SubCategory,
                    Question = c.Question,
                    Answer = c.Answer,
                    Example = c.Example,
                    OwnerId = null
                });
            }
        }
        await db.SaveChangesAsync();
    }
}
