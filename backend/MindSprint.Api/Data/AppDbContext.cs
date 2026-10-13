using Microsoft.EntityFrameworkCore;
using MindSprint.Api.Models;

namespace MindSprint.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Flashcard> Flashcards => Set<Flashcard>();
    public DbSet<CardProgress> CardProgresses => Set<CardProgress>();
    public DbSet<KanbanTask> Tasks => Set<KanbanTask>();
    public DbSet<Notebook> Notebooks => Set<Notebook>();
    public DbSet<NotebookSource> NotebookSources => Set<NotebookSource>();
    public DbSet<NotebookNote> NotebookNotes => Set<NotebookNote>();
    public DbSet<NotebookGenerationCache> NotebookGenerationCaches => Set<NotebookGenerationCache>();

    // #5 – Refresh token
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();

    // #14 – Streak & lịch học
    public DbSet<UserStudyDay> UserStudyDays => Set<UserStudyDay>();
    public DbSet<StudySchedule> StudySchedules => Set<StudySchedule>();

    // #5 – Refresh token
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();

    // #14 – Streak & lịch học
    public DbSet<UserStudyDay> UserStudyDays => Set<UserStudyDay>();
    public DbSet<StudySchedule> StudySchedules => Set<StudySchedule>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.Entity<User>().HasIndex(u => u.Email).IsUnique();
        b.Entity<User>().Property(u => u.GoogleSubject).HasMaxLength(255);
        b.Entity<User>().HasIndex(u => u.GoogleSubject).IsUnique().HasFilter("\"GoogleSubject\" IS NOT NULL");
        b.Entity<Flashcard>().HasIndex(f => f.ExternalId).IsUnique();
        b.Entity<Flashcard>().HasOne(f => f.Owner).WithMany().HasForeignKey(f => f.OwnerId).OnDelete(DeleteBehavior.Cascade);
        b.Entity<CardProgress>().HasIndex(p => new { p.UserId, p.FlashcardId }).IsUnique();
        b.Entity<CardProgress>().HasOne(p => p.Flashcard).WithMany().HasForeignKey(p => p.FlashcardId).OnDelete(DeleteBehavior.Cascade);
        b.Entity<Notebook>().HasIndex(n => n.UserId);
        b.Entity<Notebook>().HasMany(n => n.Sources).WithOne().HasForeignKey(x => x.NotebookId).OnDelete(DeleteBehavior.Cascade);
        b.Entity<Notebook>().HasMany(n => n.Notes).WithOne().HasForeignKey(x => x.NotebookId).OnDelete(DeleteBehavior.Cascade);
        b.Entity<NotebookGenerationCache>().HasOne<Notebook>().WithMany()
            .HasForeignKey(x => x.NotebookId).OnDelete(DeleteBehavior.Cascade);
        b.Entity<NotebookGenerationCache>().Property(x => x.Type).HasMaxLength(32);
        b.Entity<NotebookGenerationCache>().Property(x => x.RequestHash).HasMaxLength(64);
        b.Entity<NotebookGenerationCache>().Property(x => x.SourcesHash).HasMaxLength(64);
        b.Entity<NotebookGenerationCache>().HasIndex(x => new { x.NotebookId, x.Type, x.RequestHash, x.SourcesHash }).IsUnique();
        b.Entity<KanbanTask>().HasIndex(t => new { t.UserId, t.Status, t.Position });

        // #5 – Refresh token: unique index để lookup nhanh và thu hồi
        b.Entity<RefreshToken>().HasIndex(r => r.Token).IsUnique();
        b.Entity<RefreshToken>().HasOne(r => r.User).WithMany()
            .HasForeignKey(r => r.UserId).OnDelete(DeleteBehavior.Cascade);

        // #14 – Ngày học không trùng trên cùng 1 user; index lịch học
        b.Entity<UserStudyDay>().HasIndex(d => new { d.UserId, d.StudyDate }).IsUnique();
        b.Entity<StudySchedule>().HasIndex(s => new { s.UserId, s.DayOfWeek });
    }
}
