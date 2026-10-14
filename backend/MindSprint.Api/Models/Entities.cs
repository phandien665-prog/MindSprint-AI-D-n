namespace MindSprint.Api.Models;

// ─────────────────────────────────────────
// #5 – Refresh Token & thu hồi phiên
// ─────────────────────────────────────────
/// <summary>Lưu refresh token (1 hàng = 1 thiết bị/tab). Thu hồi bằng cách set IsRevoked = true.</summary>
public class RefreshToken
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User? User { get; set; }
    public string Token { get; set; } = "";
    public DateTime ExpiresAt { get; set; }
    public bool IsRevoked { get; set; }
    public string? DeviceHint { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}


public class User
{
    public int Id { get; set; }
    public string Email { get; set; } = "";
    public string DisplayName { get; set; } = "";
    public string PasswordHash { get; set; } = "";
    // Stable Google identity; never use the email alone to authenticate/link accounts.
    public string? GoogleSubject { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

/// <summary>Thẻ học. OwnerId = null nghĩa là thẻ hệ thống (seed Oxford), dùng chung cho mọi người.</summary>
public class Flashcard
{
    public int Id { get; set; }
    public string ExternalId { get; set; } = Guid.NewGuid().ToString("N"); // khớp id phía frontend, vd "oxford-1"
    public string Category { get; set; } = "general"; // english | programming | general
    public string? SubCategory { get; set; }
    public string Question { get; set; } = "";
    public string Answer { get; set; } = "";
    public string? Example { get; set; }
    public int? OwnerId { get; set; }
    public User? Owner { get; set; }
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow; // #9 – optimistic locking
    public int Version { get; set; } = 1;                     // #9 – optimistic locking
}

/// <summary>Trạng thái Spaced Repetition của từng người dùng trên từng thẻ.</summary>
public class CardProgress
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int FlashcardId { get; set; }
    public Flashcard? Flashcard { get; set; }
    public int Repetition { get; set; }
    public int IntervalDays { get; set; } = 1;
    public double EFactor { get; set; } = 2.5;
    public DateTime? NextReviewDate { get; set; }
    public string Status { get; set; } = "new"; // new | known | review
}

public enum TaskStatus { Todo = 0, Doing = 1, Done = 2 }

/// <summary>Task trên bảng Kanban.</summary>
public class KanbanTask
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Title { get; set; } = "";
    public string? Description { get; set; }
    public string Priority { get; set; } = "Medium";
    public TaskStatus Status { get; set; } = TaskStatus.Todo;
    public int Position { get; set; }
    public DateTime? DueDate { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

/// <summary>Sổ tay học tập kiểu NotebookLM: gom nhiều nguồn tài liệu để hỏi đáp và tạo tài liệu ôn tập.</summary>
public class Notebook
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Title { get; set; } = "";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public List<NotebookSource> Sources { get; set; } = [];
    public List<NotebookNote> Notes { get; set; } = [];
}

public class NotebookSource
{
    public int Id { get; set; }
    public int NotebookId { get; set; }
    public string Title { get; set; } = "";
    public string Type { get; set; } = "text"; // text | pdf | image | url | file
    public string? Origin { get; set; }         // URL hoặc tên file gốc
    public string Content { get; set; } = "";   // văn bản đã trích xuất
    public byte[]? FileBytes { get; set; }       // ảnh/PDF gốc, không trả trong danh sách nguồn
    public string? FileMediaType { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

/// <summary>Ghi chú: lưu câu trả lời của AI hoặc tài liệu đã tạo (tóm tắt, study guide...).</summary>
public class NotebookNote
{
    public int Id { get; set; }
    public int NotebookId { get; set; }
    public string Title { get; set; } = "";
    public string Content { get; set; } = "";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

/// <summary>Persistent cache for AI answers and generated study materials, scoped to one notebook.</summary>
public class NotebookGenerationCache
{
    public int Id { get; set; }
    public int NotebookId { get; set; }
    public string Type { get; set; } = "";
    public string RequestHash { get; set; } = "";
    public string SourcesHash { get; set; } = "";
    public bool IsJson { get; set; }
    public string ContentJson { get; set; } = "";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

// ─────────────────────────────────────────
// #14 – Đồng bộ streak, lịch học, thống kê
// ─────────────────────────────────────────
/// <summary>
/// Lưu streak và thống kê học tập theo ngày của mỗi người dùng.
/// DateUtc được chuẩn hoá về UTC-0 (ngày theo múi giờ Việt Nam xử lý ở tầng API).
/// </summary>
public class UserStudyDay
{
    public int Id { get; set; }
    public int UserId { get; set; }
    /// <summary>Ngày học (chỉ date, không giờ), theo UTC+7 đã chuyển sang DateOnly.</summary>
    public DateOnly StudyDate { get; set; }
    public int CardsReviewed { get; set; }
    public int MinutesStudied { get; set; }
    public DateTime LastUpdatedUtc { get; set; } = DateTime.UtcNow;
}

/// <summary>Lịch học tuần: mỗi hàng là 1 slot (ngày trong tuần + giờ học).</summary>
public class StudySchedule
{
    public int Id { get; set; }
    public int UserId { get; set; }
    /// <summary>0 = Chủ nhật … 6 = Thứ 7 (khớp JS Date.getDay()).</summary>
    public int DayOfWeek { get; set; }
    public TimeOnly StartTime { get; set; }
    public int DurationMinutes { get; set; } = 30;
    public string Label { get; set; } = ""; // "Ôn từ vựng", "Review SRS"…
    public bool IsActive { get; set; } = true;
}
