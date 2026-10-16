using System.IO.Compression;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Xml;
using System.Xml.Linq;
using HtmlAgilityPack;
using UglyToad.PdfPig;
using UglyToad.PdfPig.DocumentLayoutAnalysis.TextExtractor;

namespace MindSprint.Api.Services;

public static class NotebookDocumentExtractor
{
    public const int MaxTextChars = 200_000;
    private static readonly TimeSpan RegexTimeout = TimeSpan.FromSeconds(1);
    private static readonly HashSet<string> Blocks = ["p", "div", "section", "article", "main", "li", "tr", "h1", "h2", "h3", "h4", "h5", "h6", "pre", "blockquote"];

    public static NotebookUrlContent Extract(NotebookUrlResource resource, CancellationToken token = default)
    {
        token.ThrowIfCancellationRequested();
        var ext = Path.GetExtension(resource.FileName ?? resource.Url.AbsolutePath).ToLowerInvariant();
        var title = Path.GetFileNameWithoutExtension(resource.FileName ?? Uri.UnescapeDataString(resource.Url.AbsolutePath.TrimEnd('/')));
        if (string.IsNullOrWhiteSpace(title)) title = resource.Url.Host;
        var bytes = resource.Bytes;
        var media = resource.MediaType;
        try
        {
            // HTML error/share pages must be interpreted as HTML even when the URL ends in .pdf/.docx.
            if (media is "text/html" or "application/xhtml+xml")
                return new(resource.Url, Decode(resource), true) { Format = "html", ResponseHeaders = resource.Headers };
            if (bytes.AsSpan().StartsWith("%PDF-"u8) || media == "application/pdf")
            {
                using var pdf = PdfDocument.Open(bytes);
                if (pdf.NumberOfPages > 500) throw new NotebookUrlException("PDF có quá nhiều trang (tối đa 500). Hãy chọn phần tài liệu cần học.", "url_document_too_large");
                var text = new StringBuilder();
                foreach (var page in pdf.GetPages())
                {
                    token.ThrowIfCancellationRequested();
                    Append(text, ContentOrderTextExtractor.GetText(page) + "\n\n");
                }
                if (string.IsNullOrWhiteSpace(text.ToString()))
                    throw new NotebookUrlException("PDF này không có lớp chữ, có thể là bản scan. Hãy dùng bản PDF có chữ hoặc dán văn bản đã nhận dạng.", "url_no_text");
                return Source(resource.Url, text.ToString(), "pdf", string.IsNullOrWhiteSpace(pdf.Information.Title) ? title : pdf.Information.Title);
            }
            if (bytes.AsSpan().StartsWith("PK\x03\x04"u8) || media?.Contains("officedocument", StringComparison.OrdinalIgnoreCase) == true)
                return Office(resource.Url, bytes, title, token);
            if (ext is ".doc" or ".xls" or ".ppt" || media is "application/msword" or "application/vnd.ms-excel" or "application/vnd.ms-powerpoint")
                throw new NotebookUrlException("Định dạng Office cũ chưa được hỗ trợ. Hãy chuyển sang DOCX, XLSX, PPTX hoặc PDF có chữ.", "url_unsupported_content");
            if (media?.StartsWith("image/") == true || media?.StartsWith("audio/") == true || media?.StartsWith("video/") == true || bytes.Any(b => b == 0) && resource.Charset is null && !bytes.AsSpan().StartsWith(new byte[] { 0xFF, 0xFE }) && !bytes.AsSpan().StartsWith(new byte[] { 0xFE, 0xFF }))
                throw Unsupported();

            var content = Decode(resource);
            // Detect HTML from bytes for servers that omit/mislabel Content-Type.
            if (Regex.IsMatch(content, @"^\s*(?:<!doctype\s+html|<html\b)", RegexOptions.IgnoreCase, RegexTimeout))
                return new(resource.Url, content, true) { Format = "html", ResponseHeaders = resource.Headers };
            if (media is "application/json" || media?.EndsWith("+json") == true || ext == ".json")
            {
                using var json = JsonDocument.Parse(content, new() { MaxDepth = 64 });
                return Source(resource.Url, JsonSerializer.Serialize(json.RootElement, new JsonSerializerOptions { WriteIndented = true, Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping }), "json", title);
            }
            if (media is "application/xml" or "text/xml" or "application/rss+xml" or "application/atom+xml" || media?.EndsWith("+xml") == true || ext is ".xml" or ".rss" or ".atom")
            {
                var document = SafeXml(new StringReader(content));
                var text = new StringBuilder();
                foreach (var leaf in document.Descendants().Where(e => !e.HasElements))
                {
                    token.ThrowIfCancellationRequested();
                    var value = leaf.Value;
                    if (value.Contains('<')) value = ExtractHtml(resource.Url, value).Content;
                    if (!string.IsNullOrWhiteSpace(value)) Append(text, leaf.Name.LocalName + ": " + value + "\n");
                }
                return Source(resource.Url, text.ToString(), document.Root?.Name.LocalName is "rss" or "feed" ? "feed" : "xml", title);
            }
            if (media is not null && !media.StartsWith("text/") && media is not ("application/octet-stream" or "application/csv")) throw Unsupported();
            var format = ext switch { ".md" or ".markdown" => "markdown", ".csv" => "csv", _ => media == "text/markdown" ? "markdown" : media == "text/csv" ? "csv" : "text" };
            return Source(resource.Url, content, format, title);
        }
        catch (NotebookUrlException) { throw; }
        catch (OperationCanceledException) { throw; }
        catch (Exception error) when (error is InvalidDataException or XmlException or JsonException or ArgumentException or InvalidOperationException or IOException)
        {
            throw new NotebookUrlException("Không đọc được cấu trúc tài liệu từ URL. File có thể hỏng hoặc được mã hóa; hãy thử bản khác.", "url_invalid_document");
        }
    }

    public static string Decode(NotebookUrlResource resource)
    {
        Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);
        var encoding = Encoding.UTF8;
        var charset = resource.Charset;
        if (string.IsNullOrWhiteSpace(charset) && resource.MediaType is "text/html" or "application/xhtml+xml")
            charset = Regex.Match(Encoding.ASCII.GetString(resource.Bytes.AsSpan(0, Math.Min(resource.Bytes.Length, 4096))), "charset\\s*=\\s*[\"']?([\\w-]+)", RegexOptions.IgnoreCase, RegexTimeout).Groups[1].Value;
        if (!string.IsNullOrWhiteSpace(charset))
        {
            try { encoding = Encoding.GetEncoding(charset); }
            catch (ArgumentException) { }
            catch (NotSupportedException) { }
        }
        using var stream = new MemoryStream(resource.Bytes);
        using var reader = new StreamReader(stream, encoding, detectEncodingFromByteOrderMarks: true);
        return reader.ReadToEnd();
    }

    public static NotebookUrlContent ExtractHtml(Uri url, string html)
    {
        if (html.Length > NotebookUrlReader.MaxBytes) throw new NotebookUrlException("Nội dung trang quá lớn. Hãy chọn phần cần học.", "url_too_large");
        var document = new HtmlDocument { OptionMaxNestedChildNodes = 128 };
        document.LoadHtml(html);
        var title = HtmlEntity.DeEntitize(document.DocumentNode.SelectSingleNode("//title")?.InnerText ?? "").Trim();
        if ((title.Contains("Just a moment", StringComparison.OrdinalIgnoreCase) || title.Contains("Attention Required", StringComparison.OrdinalIgnoreCase)) && (html.Contains("cloudflare", StringComparison.OrdinalIgnoreCase) || html.Contains("cf-chl", StringComparison.OrdinalIgnoreCase)))
            throw new NotebookUrlException("Trang đang yêu cầu xác minh Cloudflare. Hãy mở trang trong trình duyệt và thêm nội dung bằng văn bản/file.", "url_access_denied");
        var hasPassword = document.DocumentNode.SelectSingleNode("//input[translate(@type,'PASSWORD','password')='password']") is not null;
        foreach (var node in document.DocumentNode.SelectNodes("//script|//style|//noscript|//nav|//header|//footer|//aside|//svg|//canvas|//form|//button|//iframe|//*[@hidden]|//*[@aria-hidden='true']")?.ToArray() ?? []) node.Remove();
        var main = document.DocumentNode.SelectSingleNode("//*[@id='mw-content-text']")
            ?? document.DocumentNode.SelectSingleNode("//main|//article|//*[@role='main']")
            ?? document.DocumentNode.SelectSingleNode("//body") ?? document.DocumentNode;
        var text = new StringBuilder();
        WriteNode(main, text, 0);
        if (hasPassword && text.Length < 500)
            throw new NotebookUrlException("Trang này yêu cầu đăng nhập. Hãy mở tài liệu bằng tài khoản của bạn rồi dán nội dung hoặc tải file.", "url_login_required");
        return Source(url, text.ToString(), "html", string.IsNullOrWhiteSpace(title) ? url.Host : title);
    }

    private static void WriteNode(HtmlNode node, StringBuilder output, int depth)
    {
        if (depth > 128) throw new NotebookUrlException("Trang có cấu trúc quá phức tạp. Hãy dán phần nội dung cần học.", "url_invalid_document");
        if (node.NodeType == HtmlNodeType.Text) { Append(output, HtmlEntity.DeEntitize(node.InnerText)); return; }
        if (node.Name == "br") Append(output, "\n");
        var block = Blocks.Contains(node.Name);
        if (block) Append(output, "\n");
        foreach (var child in node.ChildNodes) WriteNode(child, output, depth + 1);
        if (block) Append(output, "\n");
        if (node.Name is "td" or "th") Append(output, "\t");
    }

    private static NotebookUrlContent Office(Uri url, byte[] bytes, string title, CancellationToken token)
    {
        using var archive = new ZipArchive(new MemoryStream(bytes), ZipArchiveMode.Read);
        if (archive.Entries.Count > 3000 || archive.Entries.Sum(e => e.Length) > 20 * 1024 * 1024)
            throw new NotebookUrlException("Tài liệu Office quá lớn sau giải nén. Hãy chọn tài liệu nhỏ hơn.", "url_document_too_large");
        XDocument Part(ZipArchiveEntry entry)
        {
            token.ThrowIfCancellationRequested();
            using var stream = entry.Open();
            using var reader = XmlReader.Create(stream, XmlSettings());
            return XDocument.Load(reader);
        }
        static string Text(XElement element) => string.Concat(element.Descendants().Where(e => e.Name.LocalName == "t").Select(e => e.Value));
        var text = new StringBuilder();
        string format;
        if (archive.GetEntry("word/document.xml") is { } word)
        {
            format = "docx";
            foreach (var paragraph in Part(word).Descendants().Where(e => e.Name.LocalName == "p")) Append(text, Text(paragraph) + "\n");
        }
        else if (archive.GetEntry("ppt/presentation.xml") is not null)
        {
            format = "pptx";
            foreach (var slide in archive.Entries.Where(e => Regex.IsMatch(e.FullName, @"^ppt/slides/slide\d+\.xml$", RegexOptions.None, RegexTimeout)).OrderBy(e => int.Parse(Regex.Match(e.Name, @"\d+").Value)))
            {
                Append(text, slide.Name + "\n");
                foreach (var paragraph in Part(slide).Descendants().Where(e => e.Name.LocalName == "p")) Append(text, Text(paragraph) + "\n");
            }
        }
        else if (archive.GetEntry("xl/workbook.xml") is not null)
        {
            format = "xlsx";
            var shared = archive.GetEntry("xl/sharedStrings.xml") is { } sharedPart ? Part(sharedPart).Descendants().Where(e => e.Name.LocalName == "si").Select(Text).ToArray() : [];
            foreach (var sheet in archive.Entries.Where(e => Regex.IsMatch(e.FullName, @"^xl/worksheets/sheet\d+\.xml$", RegexOptions.None, RegexTimeout)).OrderBy(e => int.Parse(Regex.Match(e.Name, @"\d+").Value)))
            {
                Append(text, sheet.Name + "\n");
                foreach (var row in Part(sheet).Descendants().Where(e => e.Name.LocalName == "row"))
                {
                    foreach (var cell in row.Elements().Where(e => e.Name.LocalName == "c"))
                    {
                        var value = cell.Elements().FirstOrDefault(e => e.Name.LocalName == "v")?.Value ?? Text(cell);
                        if (cell.Attribute("t")?.Value == "s" && int.TryParse(value, out var index) && index >= 0 && index < shared.Length) value = shared[index];
                        Append(text, (cell.Attribute("r")?.Value ?? "") + ": " + value + "\t");
                    }
                    Append(text, "\n");
                }
            }
        }
        else throw Unsupported();
        return Source(url, text.ToString(), format, title);
    }

    private static XmlReaderSettings XmlSettings() => new() { DtdProcessing = DtdProcessing.Prohibit, XmlResolver = null, MaxCharactersInDocument = 10 * 1024 * 1024 };
    private static XDocument SafeXml(TextReader input) { using var reader = XmlReader.Create(input, XmlSettings()); return XDocument.Load(reader); }
    private static void Append(StringBuilder output, string text)
    {
        if (output.Length + text.Length > MaxTextChars) throw TextTooLarge();
        output.Append(text);
    }
    private static NotebookUrlException TextTooLarge() => new("Nội dung vượt 200.000 ký tự. Hãy chọn phần tài liệu cần học để tránh mất nội dung khi lưu.", "url_text_too_large");
    private static NotebookUrlException Unsupported() => new("Loại nguồn này chưa được hỗ trợ. Có thể nhập URL web, PDF có chữ, DOCX/PPTX/XLSX, TXT/MD/CSV hoặc JSON/XML/RSS.", "url_unsupported_content");
    private static NotebookUrlContent Source(Uri url, string text, string format, string? title)
    {
        if (text.Length > MaxTextChars) throw TextTooLarge();
        text = text.Replace("\r\n", "\n");
        if (format is "html" or "pdf" or "docx" or "pptx")
        {
            text = Regex.Replace(text, @"[ \t]+", " ", RegexOptions.None, RegexTimeout);
            text = Regex.Replace(text, @"\n[ \t]*\n(?:[ \t]*\n)+", "\n\n", RegexOptions.None, RegexTimeout);
        }
        text = text.Trim();
        return new(url, text, false) { Title = title, Format = format };
    }
}
