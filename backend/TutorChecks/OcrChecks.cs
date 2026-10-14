using System.Net;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging.Abstractions;
using MindSprint.Api.Controllers;
using MindSprint.Api.Data;
using MindSprint.Api.Models;
using MindSprint.Api.Services;
using UglyToad.PdfPig.Core;
using UglyToad.PdfPig.Fonts.Standard14Fonts;
using UglyToad.PdfPig.Writer;

internal static class OcrChecks
{
    public static async Task Live(string imagePath)
    {
        var apiDir = Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "../../../../MindSprint.Api"));
        var cfg = new ConfigurationBuilder().AddJsonFile(Path.Combine(apiDir, "appsettings.json"))
            .AddJsonFile(Path.Combine(apiDir, "appsettings.Development.json"), optional: true).AddEnvironmentVariables()
            .AddInMemoryCollection(new Dictionary<string, string?> { ["Gemini:MaxRetries"] = "0", ["Gemini:AttemptTimeoutSeconds"] = "45", ["Gemini:TotalTimeoutSeconds"] = "90" }).Build();
        var gemini = new GeminiService(new HttpClient { Timeout = Timeout.InfiniteTimeSpan }, cfg, new GeminiAvailability(cfg), NullLogger<GeminiService>.Instance, new HttpContextAccessor());
        var ocr = new TutorOcrService(gemini);
        var bytes = await System.IO.File.ReadAllBytesAsync(imagePath);
        var pdf = new PdfDocumentBuilder();
        pdf.AddPage(595, 842).AddPng(bytes, new PdfRectangle(20, 350, 575, 820));
        var samples = new List<(byte[] Data, string Name)> { (bytes, "vietnamese.png"), (pdf.Build(), "scan.pdf") };
        foreach (var ext in new[] { ".jpg", ".webp" }) {
            var path = Path.ChangeExtension(imagePath, ext);
            if (System.IO.File.Exists(path)) samples.Add((await System.IO.File.ReadAllBytesAsync(path), "vietnamese" + ext));
        }
        foreach (var (data, name) in samples)
        {
            var result = await ocr.ReadAsync(new FormFile(new MemoryStream(data), 0, data.Length, "file", name), CancellationToken.None);
            if (result.Method != "ocr" || !result.Text.Contains("Câu 1") || !result.Text.Contains("Câu 2") || !result.Text.Contains("Câu 3") || !result.Text.Contains("11") || !result.Text.Contains("frac") || !result.Text.Contains("sqrt"))
                throw new Exception("FAIL live OCR Vietnamese/multiline/formula " + name);
            Console.WriteLine($"PASS live OCR {name}: Vietnamese, 3 questions, fraction and square root; {result.Warnings.Count} warnings");
        }
    }

    public static async Task Run()
    {
        var count = 0;
        void Check(bool ok, string name) { if (!ok) throw new Exception("FAIL OCR " + name); count++; Console.WriteLine("PASS OCR " + name); }
        static int Status(IActionResult r) => r is ObjectResult o ? o.StatusCode ?? 200 : ((StatusCodeResult)r).StatusCode;
        var cfg = new ConfigurationBuilder().AddInMemoryCollection(new Dictionary<string, string?> {
            ["Gemini:ApiKey"] = "test-only", ["Gemini:Model"] = "test", ["Gemini:MaxRetries"] = "0"
        }).Build();
        var provider = new OcrProvider();
        var httpContext = new HttpContextAccessor { HttpContext = new DefaultHttpContext() };
        var gemini = new GeminiService(new HttpClient(provider), cfg, new GeminiAvailability(cfg), NullLogger<GeminiService>.Instance, httpContext);
        var ocr = new TutorOcrService(gemini);
        await using var connection = new SqliteConnection("Data Source=:memory:");
        await connection.OpenAsync();
        await using var db = new AppDbContext(new DbContextOptionsBuilder<AppDbContext>().UseSqlite(connection).Options);
        await db.Database.EnsureCreatedAsync();
        db.Users.Add(new User { Id = 1, Email = "ocr@example.test", DisplayName = "OCR", PasswordHash = "test" });
        db.Notebooks.Add(new Notebook { Id = 10, UserId = 1, Title = "OCR" });
        await db.SaveChangesAsync();
        var controller = new TutorOcrController(db, ocr) { ControllerContext = new ControllerContext { HttpContext = new DefaultHttpContext {
            User = new ClaimsPrincipal(new ClaimsIdentity([new Claim(ClaimTypes.NameIdentifier, "1")], "test"))
        } } };
        Check(typeof(TutorOcrController).GetCustomAttributes(typeof(AuthorizeAttribute), true).Length == 1, "OCR requires shared authentication");
        static IFormFile File(byte[] bytes, string name) => new FormFile(new MemoryStream(bytes), 0, bytes.Length, "file", name);
        var png = Convert.FromBase64String("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aN5kAAAAASUVORK5CYII=");
        Check(Status(await controller.Read(999, File(png, "a.png"))) == 404 && provider.Calls == 0, "ownership before provider");
        foreach (var file in new[] { File([], "empty.png"), File(png, "a.exe"), File(Encoding.UTF8.GetBytes("fake"), "a.png"), File(new byte[TutorOcrService.MaxFileBytes + 1], "big.png"), File(Encoding.UTF8.GetBytes("%PDF-broken"), "a.pdf") })
            Check(Status(await controller.Read(10, file)) == 400 && provider.Calls == 0, "invalid input rejected locally: " + file.FileName);
        var text = "Câu 1: Giải $2x + 3 = 11$.\nCâu 2: Tính $\\frac{1}{2} + \\sqrt{4}$.";
        provider.Pages = new[] { new { pageNumber = 1, text, readable = true, complete = true, warning = "" } };
        var result = await controller.Read(10, File(png, "de.png"));
        Check(Status(result) == 200 && ((TutorOcrReply)((OkObjectResult)result).Value!).Text == text, "Vietnamese, formula and multiline preserved");
        Check(provider.Mime == "image/png" && provider.Data == Convert.ToBase64String(png), "real multimodal bytes reach shared provider");
        Check(provider.LastBody.Contains("responseSchema") && provider.LastBody.Contains("required"), "OCR requires structured JSON to preserve LaTeX escaping");
        Check(provider.LastBody.Contains("Không giải") && !await db.NotebookSources.AnyAsync() && !await db.NotebookNotes.AnyAsync(), "OCR never solves or stores a source/note");
        provider.Pages = new[] { new { pageNumber = 1, text = "[không rõ] + 2", readable = true, complete = true, warning = "Ảnh mờ, cần sửa ký hiệu." } };
        result = await controller.Read(10, File(png, "blur.png"));
        Check(Status(result) == 200 && ((TutorOcrReply)((OkObjectResult)result).Value!).Warnings.Count > 0, "uncertain formula explicitly warned");
        foreach (var flags in new[] { (false, true), (true, false) }) {
            provider.Pages = new[] { new { pageNumber = 1, text = "partial", readable = flags.Item1, complete = flags.Item2, warning = "Ảnh mờ" } };
            Check(Status(await controller.Read(10, File(png, "blur.png"))) == 422, "unreadable/incomplete result rejected");
        }
        provider.Pages = new[] { new { pageNumber = 1, text = new string('a', 10001), readable = true, complete = true, warning = "" } };
        Check(Status(await controller.Read(10, File(png, "long.png"))) == 422, "no silent clipping over tutor text limit");
        provider.Pages = new[] { new { pageNumber = 1, text = "$\frac{1}{2}$", readable = true, complete = true, warning = "" } };
        Check(Status(await controller.Read(10, File(png, "bad-escape.png"))) == 422, "JSON control characters cannot silently corrupt LaTeX");
        provider.Pages = new[] { new { pageNumber = 1, text = "Câu 1", warning = "" } };
        Check(Status(await controller.Read(10, File(png, "missing-flags.png"))) == 422, "missing readability/completeness verdict rejected");
        var builder = new PdfDocumentBuilder();
        var font = builder.AddStandard14Font(Standard14Font.Helvetica);
        builder.AddPage(595, 842).AddText("Cau 1: 5x + 2 = 17", 12, new PdfPoint(20, 780), font);
        var calls = provider.Calls;
        result = await controller.Read(10, File(builder.Build(), "text.pdf"));
        Check(Status(result) == 200 && provider.Calls == calls && ((TutorOcrReply)((OkObjectResult)result).Value!).Text.Contains("5x + 2 = 17"), "text PDF stays local");
        builder = new PdfDocumentBuilder();
        font = builder.AddStandard14Font(Standard14Font.Helvetica);
        builder.AddPage(595, 842).AddText("Cau 1: 5x + 2 = 17", 12, new PdfPoint(20, 780), font);
        builder.AddPage(595, 842);
        var mixedPdf = builder.Build();
        provider.Pages = new[] { new { pageNumber = 1, text = "Câu 1", readable = true, complete = true, warning = "" }, new { pageNumber = 2, text = "Câu 2: $x^2$", readable = true, complete = true, warning = "" } };
        result = await controller.Read(10, File(mixedPdf, "mixed-scan.pdf"));
        Check(Status(result) == 200 && provider.Calls == calls + 1 && provider.LastBody.Contains("application/pdf") && ((TutorOcrReply)((OkObjectResult)result).Value!).Text.Contains("Câu 2"), "mixed scan PDF includes every page");
        provider.Pages = new[] { new { pageNumber = 1, text = "Câu 1", readable = true, complete = true, warning = "" } };
        Check(Status(await controller.Read(10, File(mixedPdf, "missing-page.pdf"))) == 422, "missing page cannot be accepted");
        builder = new PdfDocumentBuilder();
        for (var i = 0; i <= TutorOcrService.MaxPages; i++) builder.AddPage(595, 842);
        calls = provider.Calls;
        Check(Status(await controller.Read(10, File(builder.Build(), "too-many-pages.pdf"))) == 400 && provider.Calls == calls, "page limit enforced before provider");
        provider.FinishReason = "MAX_TOKENS";
        Check(Status(await controller.Read(10, File(png, "truncated.png"))) == 422, "provider truncation rejected even with valid JSON");
        provider.FinishReason = "STOP"; provider.Status = HttpStatusCode.TooManyRequests;
        Check(Status(await controller.Read(10, File(png, "quota.png"))) == 429, "shared quota status preserved");
        Console.WriteLine($"OCR: {count}/{count} checks passed");
    }

    private sealed class OcrProvider : HttpMessageHandler
    {
        public object Pages { get; set; } = Array.Empty<object>();
        public int Calls { get; private set; }
        public string LastBody { get; private set; } = "";
        public string? Mime { get; private set; }
        public string? Data { get; private set; }
        public string FinishReason { get; set; } = "STOP";
        public HttpStatusCode Status { get; set; } = HttpStatusCode.OK;
        protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken token)
        {
            Calls++; LastBody = await request.Content!.ReadAsStringAsync(token);
            // Decode JSON escapes so prompt assertions also work with Vietnamese strings.
            using var body = JsonDocument.Parse(LastBody);
            var inline = body.RootElement.GetProperty("contents")[0].GetProperty("parts")[1].GetProperty("inlineData");
            Mime = inline.GetProperty("mimeType").GetString(); Data = inline.GetProperty("data").GetString();
            LastBody += body.RootElement.GetProperty("contents")[0].GetProperty("parts")[0].GetProperty("text").GetString();
            return new(Status) { Content = new StringContent(JsonSerializer.Serialize(new { candidates = new[] { new { finishReason = FinishReason, content = new { parts = new[] { new { text = JsonSerializer.Serialize(new { pages = Pages }) } } } } } })) };
        }
    }
}
