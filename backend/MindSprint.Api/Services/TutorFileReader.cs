using System.Text;
using UglyToad.PdfPig;

namespace MindSprint.Api.Services;

public record TutorFile(byte[] Bytes, string MimeType, int PageCount);

public static class TutorFileReader
{
    public const int MaxFileBytes = 10 * 1024 * 1024;
    public const int MaxPages = 20;

    public static async Task<TutorFile> ReadAsync(IFormFile? file, CancellationToken token, bool allowText = false)
    {
        if (file is null || file.Length == 0) throw new ArgumentException("Tệp trống. Hãy chọn ảnh hoặc tài liệu.");
        if (file.Length > MaxFileBytes) throw new ArgumentException("Tệp tối đa 10 MB.");
        var mime = Path.GetExtension(file.FileName).ToLowerInvariant() switch {
            ".jpg" or ".jpeg" => "image/jpeg", ".png" => "image/png", ".webp" => "image/webp", ".pdf" => "application/pdf",
            ".txt" or ".md" or ".csv" when allowText => "text/plain",
            _ => throw new ArgumentException("Chỉ hỗ trợ JPG, PNG, WebP, PDF" + (allowText ? ", TXT, MD hoặc CSV." : "."))
        };
        using var stream = new MemoryStream();
        await using (var input = file.OpenReadStream())
        {
            var buffer = new byte[81920];
            int read;
            while ((read = await input.ReadAsync(buffer, token)) > 0)
            {
                if (stream.Length + read > MaxFileBytes) throw new ArgumentException("Tệp tối đa 10 MB.");
                await stream.WriteAsync(buffer.AsMemory(0, read), token);
            }
        }
        var bytes = stream.ToArray();
        if (mime == "text/plain")
        {
            string text;
            try { text = new UTF8Encoding(false, true).GetString(bytes).Trim('\uFEFF'); }
            catch (DecoderFallbackException) { throw new ArgumentException("Tài liệu chữ cần dùng UTF-8. Hãy chuyển sang PDF hoặc lưu tệp bằng UTF-8."); }
            if (string.IsNullOrWhiteSpace(text) || text.Any(c => char.IsControl(c) && c is not ('\n' or '\r' or '\t')))
                throw new ArgumentException("Không đọc được tệp văn bản này. Hãy chọn tài liệu hợp lệ.");
            if (text.Length > NotebookDocumentExtractor.MaxTextChars) throw new ArgumentException("Tài liệu vượt 200.000 ký tự. Hãy chọn phần cần hỏi; nội dung chưa bị cắt ngắn.");
            return new(bytes, mime, 1);
        }
        if (!Matches(bytes, mime)) throw new ArgumentException("Nội dung tệp không đúng định dạng. Hãy chọn ảnh/PDF hợp lệ.");
        var pages = 1;
        if (mime == "application/pdf")
        {
            try { using var pdf = PdfDocument.Open(bytes); pages = pdf.NumberOfPages; }
            catch (Exception) { throw new ArgumentException("Không đọc được PDF. Tệp có thể hỏng hoặc được mã hóa; hãy thay tệp khác."); }
            if (pages is < 1 or > MaxPages) throw new ArgumentException("PDF tối đa 20 trang. Hãy chọn phần đề cần học.");
        }
        return new(bytes, mime, pages);
    }

    private static bool Matches(byte[] bytes, string mime) => mime switch {
        "application/pdf" => bytes.AsSpan().StartsWith("%PDF-"u8),
        "image/png" => bytes.AsSpan().StartsWith(new byte[] {137, 80, 78, 71, 13, 10, 26, 10}),
        "image/jpeg" => bytes.AsSpan().StartsWith(new byte[] {255, 216, 255}),
        "image/webp" => bytes.Length >= 12 && bytes.AsSpan(0, 4).SequenceEqual("RIFF"u8) && bytes.AsSpan(8, 4).SequenceEqual("WEBP"u8),
        _ => false
    };
}
