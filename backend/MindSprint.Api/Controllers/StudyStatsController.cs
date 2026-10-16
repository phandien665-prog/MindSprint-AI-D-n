using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MindSprint.Api.Data;
using MindSprint.Api.Models;

namespace MindSprint.Api.Controllers;

[Authorize, Route("api/study")]
public class StudyStatsController(AppDbContext db) : ApiBase
{
    private static readonly TimeZoneInfo VnTz = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");

    // Helper: convert UTC now to VN date (DateOnly)
    private static DateOnly UtcNowToVnDate() => DateOnly.FromDateTime(TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, VnTz));

    // Helper: convert VN date to UTC midnight for storage/query
    private static DateTime VnDateToUtcMidnight(DateOnly d) => TimeZoneInfo.ConvertTimeToUtc(d.ToDateTime(TimeOnly.MinValue), VnTz);

    // ──────────────────────────────────────────────────────────────
    // Study Days (daily stats)
    // ──────────────────────────────────────────────────────────────

    [HttpGet("days")]
    public async Task<IActionResult> GetStudyDays([FromQuery] DateOnly? from, [FromQuery] DateOnly? to)
    {
        var uid = UserId;
        var q = db.UserStudyDays.Where(s => s.UserId == uid);
        if (from.HasValue) q = q.Where(s => s.StudyDate >= from.Value);
        if (to.HasValue) q = q.Where(s => s.StudyDate <= to.Value);
        var days = await q.OrderBy(s => s.StudyDate).ToListAsync();
        return Ok(days.Select(d => new { d.StudyDate, d.CardsReviewed, d.MinutesStudied }));
    }

    [HttpPost("days")]
    public async Task<IActionResult> UpsertStudyDay([FromBody] StudyDayDto dto)
    {
        var uid = UserId;
        var vnDate = dto.StudyDate; // expect DateOnly from client (already VN date)
        var utcDate = VnDateToUtcMidnight(vnDate);

        var day = await db.UserStudyDays.FirstOrDefaultAsync(s => s.UserId == uid && s.StudyDate == vnDate);
        if (day is null)
        {
            day = new UserStudyDay { UserId = uid, StudyDate = vnDate };
            db.UserStudyDays.Add(day);
        }
        day.CardsReviewed = dto.CardsReviewed;
        day.MinutesStudied = dto.MinutesStudied;
        day.LastUpdatedUtc = DateTime.UtcNow;
        await db.SaveChangesAsync();
        return Ok(new { day.StudyDate, day.CardsReviewed, day.MinutesStudied });
    }

    // ──────────────────────────────────────────────────────────────
    // Streak
    // ──────────────────────────────────────────────────────────────

    [HttpGet("streak")]
    public async Task<IActionResult> GetStreak()
    {
        var uid = UserId;
        var today = UtcNowToVnDate();

        var days = await db.UserStudyDays
            .Where(s => s.UserId == uid && s.CardsReviewed > 0)
            .OrderByDescending(s => s.StudyDate)
            .ToListAsync();

        int currentStreak = 0, longestStreak = 0, temp = 0;
        DateOnly? prev = null;

        foreach (var d in days)
        {
            if (prev is null)
            {
                temp = 1;
            }
            else if (prev.Value.DayNumber - d.StudyDate.DayNumber == 1)
            {
                temp++;
            }
            else
            {
                temp = 1;
            }
            longestStreak = Math.Max(longestStreak, temp);
            prev = d.StudyDate;
        }

        // current streak: check from today backwards
        var daySet = days.Select(d => d.StudyDate).ToHashSet();
        var check = today;
        while (daySet.Contains(check))
        {
            currentStreak++;
            check = check.AddDays(-1);
        }

        return Ok(new { currentStreak, longestStreak, lastStudyDate = days.FirstOrDefault()?.StudyDate });
    }

    // ──────────────────────────────────────────────────────────────
    // Study Schedule (weekly recurring slots)
    // ──────────────────────────────────────────────────────────────

    [HttpGet("schedule")]
    public async Task<IActionResult> GetSchedule()
    {
        var uid = UserId;
        var slots = await db.StudySchedules
            .Where(s => s.UserId == uid && s.IsActive)
            .OrderBy(s => s.DayOfWeek).ThenBy(s => s.StartTime)
            .ToListAsync();
        return Ok(slots.Select(s => new { s.Id, s.DayOfWeek, s.StartTime, s.DurationMinutes, s.Label, s.IsActive }));
    }

    [HttpPost("schedule")]
    public async Task<IActionResult> CreateSchedule([FromBody] ScheduleDto dto)
    {
        if (!TimeOnly.TryParse(dto.StartTime, out var startTime))
            return BadRequest(new { message = "Invalid time format. Use HH:mm or HH:mm:ss" });
        
        var uid = UserId;
        var slot = new StudySchedule
        {
            UserId = uid,
            DayOfWeek = dto.DayOfWeek,
            StartTime = startTime,
            DurationMinutes = dto.DurationMinutes,
            Label = dto.Label,
            IsActive = true
        };
        db.StudySchedules.Add(slot);
        await db.SaveChangesAsync();
        return Ok(new { slot.Id, slot.DayOfWeek, slot.StartTime, slot.DurationMinutes, slot.Label, slot.IsActive });
    }

    [HttpPut("schedule/{id:int}")]
    public async Task<IActionResult> UpdateSchedule(int id, [FromBody] ScheduleDto dto)
    {
        if (!TimeOnly.TryParse(dto.StartTime, out var startTime))
            return BadRequest(new { message = "Invalid time format. Use HH:mm or HH:mm:ss" });
        
        var uid = UserId;
        var slot = await db.StudySchedules.FirstOrDefaultAsync(s => s.Id == id && s.UserId == uid);
        if (slot is null) return NotFound();
        slot.DayOfWeek = dto.DayOfWeek;
        slot.StartTime = startTime;
        slot.DurationMinutes = dto.DurationMinutes;
        slot.Label = dto.Label;
        await db.SaveChangesAsync();
        return Ok(new { slot.Id, slot.DayOfWeek, slot.StartTime, slot.DurationMinutes, slot.Label, slot.IsActive });
    }

    [HttpPatch("schedule/{id:int}/toggle")]
    public async Task<IActionResult> ToggleSchedule(int id)
    {
        var uid = UserId;
        var slot = await db.StudySchedules.FirstOrDefaultAsync(s => s.Id == id && s.UserId == uid);
        if (slot is null) return NotFound();
        slot.IsActive = !slot.IsActive;
        await db.SaveChangesAsync();
        return Ok(new { slot.Id, slot.IsActive });
    }

    [HttpDelete("schedule/{id:int}")]
    public async Task<IActionResult> DeleteSchedule(int id)
    {
        var uid = UserId;
        var slot = await db.StudySchedules.FirstOrDefaultAsync(s => s.Id == id && s.UserId == uid);
        if (slot is null) return NotFound();
        db.StudySchedules.Remove(slot);
        await db.SaveChangesAsync();
        return NoContent();
    }
}

public record StudyDayDto(DateOnly StudyDate, int CardsReviewed, int MinutesStudied);
public record ScheduleDto(int DayOfWeek, string StartTime, int DurationMinutes, string Label);