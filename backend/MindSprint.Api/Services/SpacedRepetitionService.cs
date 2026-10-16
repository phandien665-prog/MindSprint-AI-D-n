using MindSprint.Api.Models;

namespace MindSprint.Api.Services;

/// <summary>Lặp lại ngắt quãng, tính NextReviewDate. Giữ đúng logic đang chạy ở frontend:
/// nhớ -> 1 ngày, 3 ngày, rồi interval * EFactor; quên -> reset và đến hạn ngay.</summary>
public class SpacedRepetitionService
{
    public void Apply(CardProgress p, bool remembered)
    {
        var now = DateTime.UtcNow;
        if (remembered)
        {
            p.IntervalDays = p.Repetition switch { 0 => 1, 1 => 3, _ => (int)Math.Round(p.IntervalDays * p.EFactor) };
            p.Repetition++;
            p.EFactor = Math.Max(1.3, p.EFactor + 0.1);
            p.NextReviewDate = now.AddDays(p.IntervalDays);
            p.Status = "known";
        }
        else
        {
            p.Repetition = 0;
            p.IntervalDays = 1;
            p.EFactor = Math.Max(1.3, p.EFactor - 0.2);
            p.NextReviewDate = now;
            p.Status = "review";
        }
    }
}
