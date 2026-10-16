using System.Text;
using System.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MindSprint.Api.Data;
using MindSprint.Api.Models;
using MindSprint.Api.Services;
using UglyToad.PdfPig;
using UglyToad.PdfPig.DocumentLayoutAnalysis.TextExtractor;

namespace MindSprint.Api.Controllers;

public record TitleDto(string Title);
public record TextSourceDto(string Title, string Text);
public record UrlSourceDto(string Url);
public record ChatDto(string Question, List<ChatTurn>? History);
public record GenDto(string Type, string? Focus, int Count = 10);
public record NoteDto(string Title, string Content);
public record SaveCardsDto(List<GeneratedCard> Cards);

/// <summary>Sổ tay học tập kiểu NotebookLM: nguồn tài liệu, hỏi đáp có trích dẫn, tạo tài liệu ôn tập, ghi chú.</summary>
[Authorize, Route("api/notebooks")]
public class NotebooksController(AppDbContext db, NotebookAi ai, IHttpClientFactory httpFactory, NotebookUrlImporter urlImporter) : ApiBase
{
    private const int MaxSources = 20;
    private const int MaxCharsPerSource = 200_000;
    private const long MaxFileBytes = TutorFileReader.MaxFileBytes;

    private Task<Notebook?> Own(int id) => db.Notebooks.FirstOrDefaultAsync(n => n.Id == id && n.UserId == UserId);
    private Task<List<NotebookSource>> SourcesOf(int id) => db.NotebookSources.AsNoTracking().Where(s => s.NotebookId == id).OrderBy(s => s.Id).ToListAsync();

    // ---------- Notebook ----------
    [HttpGet]
    public async Task<IActionResult> List() => Ok(await db.Notebooks.Where(n => n.UserId == UserId)
        .OrderByDescending(n => n.Id).Select(n => new { n.Id, n.Title, sources = n.Sources.Count }).ToListAsync());

    [HttpPost]
    public async Task<IActionResult> Create(TitleDto dto)
    {
        var n = new Notebook { UserId = UserId, Title = string.IsNullOrWhiteSpace(dto.Title) ? "Sổ tay mới" : dto.Title.Trim() };
        db.Notebooks.Add(n);
        await db.SaveChangesAsync();
        return Ok(new { n.Id, n.Title, sources = 0 });
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var n = await Own(id);
        if (n is null) return NotFound();
        db.Notebooks.Remove(n);
        await db.SaveChangesAsync();
        return NoContent();
    }

    // ---------- Sources ----------
    [HttpGet("{id:int}/sources")]
    public async Task<IActionResult> Sources(int id)
    {
        if (await Own(id) is null) return NotFound();
        return Ok(await db.NotebookSources.AsNoTracking().Where(s => s.NotebookId == id).OrderBy(s => s.Id)
            .Select(s => new { s.Id, s.Title, s.Type, s.Origin, chars = s.Content.Length, hasFile = s.FileBytes != null, bytes = s.FileBytes == null ? 0 : s.FileBytes.Length }).ToListAsync());
    }

    [HttpPost("{id:int}/sources/text")]
    public async Task<IActionResult> AddText(int id, TextSourceDto dto)
    {
        if (await Own(id) is null) return NotFound();
        if (string.IsNullOrWhiteSpace(dto.Text)) return BadRequest(new { message = "Nội dung trống." });
        return await Store(id, string.IsNullOrWhiteSpace(dto.Title) ? "Văn bản dán" : dto.Title.Trim(), "text", null, dto.Text);
    }

    [HttpPost("{id:int}/sources/file"), RequestSizeLimit(MaxFileBytes + 64 * 1024)]
    public async Task<IActionResult> AddFile(int id, IFormFile file)
    {
        if (await Own(id) is null) return NotFound();
        try
        {
            var uploaded = await TutorFileReader.ReadAsync(file, HttpContext.RequestAborted, allowText: true);
            string text = "", type = "image";
            if (uploaded.MimeType == "application/pdf")
            {
                using var pdf = PdfDocument.Open(uploaded.Bytes);
                text = string.Join("\n\n", pdf.GetPages().Select(page => ContentOrderTextExtractor.GetText(page)));
                type = "pdf";
            }
            else if (uploaded.MimeType == "text/plain")
            {
                text = Encoding.UTF8.GetString(uploaded.Bytes).Trim('\uFEFF');
                type = "file";
            }
            return await Store(id, Path.GetFileNameWithoutExtension(file.FileName), type, Path.GetFileName(file.FileName), text,
                uploaded.MimeType == "text/plain" ? null : uploaded.Bytes, uploaded.MimeType);
        }
        catch (OperationCanceledException) when (HttpContext.RequestAborted.IsCancellationRequested) { throw; }
        catch (ArgumentException error) { return BadRequest(new { message = error.Message }); }
        catch (Exception) { return BadRequest(new { message = "Không lưu được nguồn này. Tệp được giữ để bạn thử lại." }); }
    }

    [HttpPost("{id:int}/sources/url")]
    public async Task<IActionResult> AddUrl(int id, UrlSourceDto dto)
    {
        if (await Own(id) is null) return NotFound();
        try
        {
            var http = httpFactory.CreateClient("web");
            var source = await urlImporter.ImportAsync(http, dto.Url, HttpContext.RequestAborted);
            return await Store(id, source.Title ?? source.Url.Host, "url", source.Url.ToString(), source.Content);
        }
        catch (NotebookUrlException ex) { return BadRequest(new { message = ex.Message, code = ex.Code, upstreamStatus = ex.UpstreamStatus }); }
        catch (OperationCanceledException) when (HttpContext.RequestAborted.IsCancellationRequested) { throw; }
        catch (Exception) { return BadRequest(new { message = "Không tải được URL." }); }
    }

    [HttpDelete("{id:int}/sources/{sid:int}")]
    public async Task<IActionResult> DeleteSource(int id, int sid)
    {
        if (await Own(id) is null) return NotFound();
        var s = await db.NotebookSources.FirstOrDefaultAsync(x => x.Id == sid && x.NotebookId == id);
        if (s is null) return NotFound();
        db.NotebookSources.Remove(s);
        await db.SaveChangesAsync();
        return NoContent();
    }

    // ---------- AI ----------
    [HttpPost("{id:int}/chat")]
    public async Task<IActionResult> Chat(int id, ChatDto dto)
    {
        if (await Own(id) is null) return NotFound();
        var src = await SourcesOf(id);
        if (src.Count == 0) return BadRequest(new { message = "Hãy thêm ít nhất một nguồn trước khi hỏi." });
        if (string.IsNullOrWhiteSpace(dto.Question)) return BadRequest(new { message = "Câu hỏi trống." });
        return await Guard(() => ai.ChatAsync(src, dto.Question.Trim(), dto.History));
    }

    [HttpGet("{id:int}/suggestions")]
    public async Task<IActionResult> Suggestions(int id)
    {
        if (await Own(id) is null) return NotFound();
        var src = await SourcesOf(id);
        if (src.Count == 0) return Ok(Array.Empty<string>());
        return await Guard(() => ai.SuggestQuestionsAsync(src));
    }

    [HttpPost("{id:int}/generate")]
    public async Task<IActionResult> Generate(int id, GenDto dto)
    {
        if (await Own(id) is null) return NotFound();
        var src = await SourcesOf(id);
        if (src.Count == 0) return BadRequest(new { message = "Hãy thêm ít nhất một nguồn trước." });
        return await Guard(async () =>
        {
            var (isJson, content) = await ai.GenerateAsync(id, src, dto.Type, dto.Focus, dto.Count);
            return new { type = dto.Type, isJson, content };
        });
    }

    // Lưu flashcard AI tạo vào thư viện thẻ (cùng hệ thống SRS)
    [HttpPost("{id:int}/save-cards")]
    public async Task<IActionResult> SaveCards(int id, SaveCardsDto dto)
    {
        var nb = await Own(id);
        if (nb is null) return NotFound();
        var cards = dto.Cards.Where(c => !string.IsNullOrWhiteSpace(c.Question) && !string.IsNullOrWhiteSpace(c.Answer)).Take(50).ToList();
        db.Flashcards.AddRange(cards.Select(c => new Flashcard
        {
            Category = "general", SubCategory = nb.Title, Question = c.Question, Answer = c.Answer, Example = c.Example, OwnerId = UserId
        }));
        await db.SaveChangesAsync();
        return Ok(new { saved = cards.Count });
    }

    // ---------- Notes ----------
    [HttpGet("{id:int}/notes")]
    public async Task<IActionResult> Notes(int id)
    {
        if (await Own(id) is null) return NotFound();
        return Ok(await db.NotebookNotes.Where(n => n.NotebookId == id).OrderByDescending(n => n.Id).ToListAsync());
    }

    [HttpPost("{id:int}/notes")]
    public async Task<IActionResult> AddNote(int id, NoteDto dto)
    {
        if (await Own(id) is null) return NotFound();
        var n = new NotebookNote { NotebookId = id, Title = string.IsNullOrWhiteSpace(dto.Title) ? "Ghi chú" : dto.Title.Trim(), Content = dto.Content };
        db.NotebookNotes.Add(n);
        await db.SaveChangesAsync();
        return Ok(n);
    }

    [HttpDelete("{id:int}/notes/{nid:int}")]
    public async Task<IActionResult> DeleteNote(int id, int nid)
    {
        if (await Own(id) is null) return NotFound();
        var n = await db.NotebookNotes.FirstOrDefaultAsync(x => x.Id == nid && x.NotebookId == id);
        if (n is null) return NotFound();
        db.NotebookNotes.Remove(n);
        await db.SaveChangesAsync();
        return NoContent();
    }

    // ---------- helpers ----------
    private async Task<IActionResult> Store(int id, string title, string type, string? origin, string text, byte[]? fileBytes = null, string? fileMediaType = null)
    {
        await using var transaction = await db.Database.BeginTransactionAsync(IsolationLevel.Serializable, HttpContext.RequestAborted);
        if (await db.NotebookSources.CountAsync(s => s.NotebookId == id) >= MaxSources)
            return BadRequest(new { message = $"Tối đa {MaxSources} nguồn mỗi sổ tay." });
        text = text.Trim();
        if (text.Length > MaxCharsPerSource) return BadRequest(new { message = "Nguồn vượt 200.000 ký tự. Hãy chọn phần cần học; nội dung chưa được cắt hoặc lưu." });
        if (fileBytes is not null)
        {
            var used = await db.NotebookSources.Where(s => s.NotebookId == id)
                .SumAsync(s => (long)(s.FileBytes == null ? 0 : s.FileBytes.Length));
            if (used + fileBytes.LongLength > GeminiService.MaxAttachmentBytes)
                return BadRequest(new { message = "Tổng ảnh/PDF trong sổ tay tối đa 10 MB để AI đọc đủ các nguồn. Hãy bớt nguồn hoặc dùng tệp nhỏ hơn." });
        }
        var s = new NotebookSource { NotebookId = id, Title = title.Length > 200 ? title[..200] : title, Type = type, Origin = origin, Content = text, FileBytes = fileBytes, FileMediaType = fileMediaType };
        db.NotebookSources.Add(s);
        await db.SaveChangesAsync();
        await transaction.CommitAsync(HttpContext.RequestAborted);
        return Ok(new { s.Id, s.Title, s.Type, s.Origin, chars = s.Content.Length, hasFile = s.FileBytes != null, bytes = s.FileBytes?.Length ?? 0 });
    }

    private static async Task<IActionResult> GuardImpl<T>(Func<Task<T>> work)
    {
        try { return new OkObjectResult(await work()); }
        catch (GeminiUnavailableException ex)
        { return new ObjectResult(new { message = ex.Message, code = ex.Code, retryAfterSeconds = ex.RetryAfterSeconds }) { StatusCode = ex.StatusCode }; }
        catch (Exception ex) when (ex is HttpRequestException or InvalidOperationException or System.Text.Json.JsonException or ArgumentException or TaskCanceledException)
        { return new ObjectResult(new { message = "AI gặp lỗi: " + ex.Message }) { StatusCode = 502 }; }
    }
    private Task<IActionResult> Guard<T>(Func<Task<T>> work) => GuardImpl(work);

}
