using System.IO.Compression;
using System.Net;
using System.Text;
using MindSprint.Api.Services;

const string Origin = "https://93.184.216.34/lesson";
const string Lesson = "Nội dung bài học tiếng Việt: ma trận nghịch đảo, phép biến đổi sơ cấp và điều kiện khả nghịch. Đây là tài liệu cần lưu vào sổ tay để ôn tập.";
var passed = 0;
static void Check(bool condition, string message) { if (!condition) throw new Exception(message); }
async Task Case(string name, Func<Task> run) { await run(); passed++; Console.WriteLine("PASS " + name); }
static NotebookUrlResource Resource(byte[] bytes, string? media = null, string path = "lesson", string? charset = null)
    => new(new Uri("https://93.184.216.34/" + path), bytes, media, charset, null);
static NotebookUrlResource TextResource(string text, string? media = "text/plain", string path = "lesson", string? charset = "utf-8")
    => Resource(Encoding.UTF8.GetBytes(text), media, path, charset);
static HttpResponseMessage Reply(int status, string text = Lesson, string? location = null, string media = "text/html")
{
    var response = new HttpResponseMessage((HttpStatusCode)status) { Content = new StringContent(text, Encoding.UTF8, media) };
    if (location is not null) response.Headers.Location = new Uri(location, UriKind.RelativeOrAbsolute);
    return response;
}
static async Task Error(Func<Task> run, string expected)
{
    try { await run(); throw new Exception("Expected " + expected); }
    catch (NotebookUrlException error) { Check(error.Code == expected, "Expected " + expected + ", got " + error.Code); }
}
static byte[] Zip(params (string Name, string Content)[] parts)
{
    using var stream = new MemoryStream();
    using (var archive = new ZipArchive(stream, ZipArchiveMode.Create, true))
        foreach (var part in parts) { using var writer = new StreamWriter(archive.CreateEntry(part.Name).Open(), Encoding.UTF8); writer.Write(part.Content); }
    return stream.ToArray();
}
static byte[] Pdf(bool text)
{
    var content = text ? "BT /F1 12 Tf 50 100 Td (A matrix is invertible when its determinant is not zero. Study elementary row operations.) Tj ET" : "";
    var objects = new[] { "<< /Type /Catalog /Pages 2 0 R >>", "<< /Type /Pages /Kids [3 0 R] /Count 1 >>", "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 400 200] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>", "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>", $"<< /Length {Encoding.ASCII.GetByteCount(content)} >>\nstream\n{content}\nendstream" };
    var pdf = new StringBuilder("%PDF-1.4\n"); var offsets = new List<int>();
    for (var i = 0; i < objects.Length; i++) { offsets.Add(Encoding.ASCII.GetByteCount(pdf.ToString())); pdf.Append($"{i + 1} 0 obj\n{objects[i]}\nendobj\n"); }
    var start = Encoding.ASCII.GetByteCount(pdf.ToString());
    pdf.Append($"xref\n0 {objects.Length + 1}\n0000000000 65535 f \n");
    foreach (var offset in offsets) pdf.Append($"{offset:0000000000} 00000 n \n");
    pdf.Append($"trailer\n<< /Size {objects.Length + 1} /Root 1 0 R >>\nstartxref\n{start}\n%%EOF");
    return Encoding.ASCII.GetBytes(pdf.ToString());
}

await Case("Vietnamese plain text and literal angle brackets", () =>
{
    var source = NotebookDocumentExtractor.Extract(TextResource(Lesson + " x < y & z > 0"));
    Check(source.Content.Contains("tiếng Việt") && source.Content.Contains("x < y"), "Text changed"); return Task.CompletedTask;
});
await Case("Markdown and CSV detected by URL and content type", () =>
{
    Check(NotebookDocumentExtractor.Extract(TextResource("# Bài học\n" + Lesson, "text/markdown", "lesson.md")).Format == "markdown", "Markdown missing");
    Check(NotebookDocumentExtractor.Extract(TextResource("Từ,Nghĩa\nMatrix,Ma trận", "text/csv", "lesson.csv")).Format == "csv", "CSV missing"); return Task.CompletedTask;
});
await Case("structured text keeps code indentation, CSV fields and JSON string spaces", () =>
{
    var markdown = "# Code\n\n```python\nif True:\n    print('x')\n```";
    Check(NotebookDocumentExtractor.Extract(TextResource(markdown, "text/markdown")).Content == markdown, "Code indentation changed");
    Check(NotebookDocumentExtractor.Extract(TextResource("name,value\n\"New  York\",1", "text/csv")).Content.Contains("New  York"), "CSV value changed");
    Check(NotebookDocumentExtractor.Extract(TextResource("{\"name\":\"New  York\"}", "application/json")).Content.Contains("New  York"), "JSON value changed"); return Task.CompletedTask;
});
await Case("UTF-16 BOM and legacy charset", () =>
{
    var utf16 = Encoding.Unicode.GetPreamble().Concat(Encoding.Unicode.GetBytes(Lesson)).ToArray();
    Check(NotebookDocumentExtractor.Extract(Resource(utf16, "text/plain")).Content == Lesson, "BOM failed");
    Check(NotebookDocumentExtractor.Extract(Resource(Encoding.Latin1.GetBytes("café <texte>"), "text/plain", charset: "iso-8859-1")).Content.Contains("café"), "Charset failed"); return Task.CompletedTask;
});
await Case("HTML main content, Vietnamese title and paragraphs retained; menus/scripts removed", () =>
{
    var html = "<html><head><title>Đại số &amp; ma trận</title></head><body><nav>MENU TO REMOVE</nav><main><h1>Ma trận</h1><p>" + Lesson + "</p><p>Đoạn tiếp theo.</p></main><footer>FOOTER TO REMOVE</footer><script>SECRET_SCRIPT</script></body></html>";
    var source = NotebookDocumentExtractor.ExtractHtml(new Uri(Origin), html);
    Check(source.Title == "Đại số & ma trận" && source.Content.Contains("\n"), "HTML metadata/paragraphs missing");
    Check(!source.Content.Contains("TO REMOVE") && !source.Content.Contains("SECRET_SCRIPT"), "HTML noise retained"); return Task.CompletedTask;
});
await Case("MediaWiki content preferred over sidebar", () =>
{
    var source = NotebookDocumentExtractor.ExtractHtml(new Uri(Origin), "<body><div>OTHER SIDEBAR</div><div id='mw-content-text'><p>" + Lesson + "</p></div></body>");
    Check(source.Content == Lesson, "Wrong wiki region"); return Task.CompletedTask;
});
await Case("HTML served at a PDF URL is treated as a share page", () =>
{
    var source = NotebookDocumentExtractor.Extract(TextResource("<html><body><main>" + Lesson + "</main></body></html>", "text/html", "lesson.pdf"));
    Check(source.IsHtml, "HTML was parsed as PDF"); return Task.CompletedTask;
});
await Case("Cloudflare challenge and login pages are not stored as study content", async () =>
{
    await Error(() => { NotebookDocumentExtractor.ExtractHtml(new Uri(Origin), "<html><title>Attention Required! | Cloudflare</title><body>cf-chl challenge-platform</body></html>"); return Task.CompletedTask; }, "url_access_denied");
    await Error(() => { NotebookDocumentExtractor.ExtractHtml(new Uri(Origin), "<body><form><input type='password'></form>Sign in to read</body>"); return Task.CompletedTask; }, "url_login_required");
});
await Case("PDF text layer extracted even with generic MIME", () =>
{
    var source = NotebookDocumentExtractor.Extract(Resource(Pdf(true), "application/octet-stream", "lesson"));
    Check(source.Format == "pdf" && source.Content.Contains("determinant"), "PDF missing"); return Task.CompletedTask;
});
await Case("PDF without text gives clear guidance", async () =>
    await Error(() => { NotebookDocumentExtractor.Extract(Resource(Pdf(false), "application/pdf")); return Task.CompletedTask; }, "url_no_text"));
await Case("DOCX paragraphs and tables read without executing external relationships", () =>
{
    var bytes = Zip(("word/document.xml", "<w:document xmlns:w='urn:word'><w:body><w:p><w:r><w:t>" + Lesson + "</w:t></w:r></w:p><w:tbl><w:tr><w:tc><w:p><w:r><w:t>Ô trong bảng</w:t></w:r></w:p></w:tc></w:tr></w:tbl></w:body></w:document>"));
    var source = NotebookDocumentExtractor.Extract(Resource(bytes, "application/octet-stream", "lesson.docx"));
    Check(source.Format == "docx" && source.Content.Contains("Ô trong bảng"), "DOCX missing"); return Task.CompletedTask;
});
await Case("PPTX slides use numeric order", () =>
{
    var bytes = Zip(("ppt/presentation.xml", "<presentation/>"), ("ppt/slides/slide10.xml", "<slide><p><t>SLIDE TEN</t></p></slide>"), ("ppt/slides/slide2.xml", "<slide><p><t>SLIDE TWO " + Lesson + "</t></p></slide>"));
    var source = NotebookDocumentExtractor.Extract(Resource(bytes, null, "lesson.pptx"));
    Check(source.Format == "pptx" && source.Content.IndexOf("SLIDE TWO") < source.Content.IndexOf("SLIDE TEN"), "Slide order wrong"); return Task.CompletedTask;
});
await Case("XLSX shared strings, inline strings and cached numeric values", () =>
{
    var bytes = Zip(("xl/workbook.xml", "<workbook/>"), ("xl/sharedStrings.xml", "<sst><si><t>Ma trận</t></si></sst>"), ("xl/worksheets/sheet1.xml", "<worksheet><sheetData><row><c r='A1' t='s'><v>0</v></c><c r='B1' t='inlineStr'><is><t>Bài tập</t></is></c><c r='C1'><f>1+1</f><v>2</v></c></row></sheetData></worksheet>"));
    var source = NotebookDocumentExtractor.Extract(Resource(bytes, null, "lesson.xlsx"));
    Check(source.Format == "xlsx" && source.Content.Contains("Ma trận") && source.Content.Contains("Bài tập") && source.Content.Contains("C1: 2"), "Spreadsheet values missing"); return Task.CompletedTask;
});
await Case("JSON remains structured and Vietnamese readable", () =>
{
    var source = NotebookDocumentExtractor.Extract(TextResource("{\"bài học\":\"Ma trận\",\"items\":[1,2]}", "application/json", "lesson.json"));
    Check(source.Format == "json" && source.Content.Contains("bài học") && source.Content.Contains("\n"), "JSON missing"); return Task.CompletedTask;
});
await Case("RSS/Atom descriptions strip markup and XML labels are retained", () =>
{
    var rss = NotebookDocumentExtractor.Extract(TextResource("<rss><channel><title>Bài học</title><item><description><![CDATA[<p>" + Lesson + "</p>]]></description></item></channel></rss>", "application/rss+xml"));
    Check(rss.Format == "feed" && rss.Content.Contains(Lesson) && !rss.Content.Contains("<p>"), "RSS missing");
    Check(NotebookDocumentExtractor.Extract(TextResource("<lesson><title>Ma trận</title></lesson>", "application/xml")).Content.Contains("title: Ma trận"), "XML missing"); return Task.CompletedTask;
});
await Case("XML external entities and corrupt JSON are rejected", async () =>
{
    await Error(() => { NotebookDocumentExtractor.Extract(TextResource("<!DOCTYPE x [<!ENTITY leak SYSTEM 'file:///C:/secret'>]><x>&leak;</x>", "application/xml")); return Task.CompletedTask; }, "url_invalid_document");
    await Error(() => { NotebookDocumentExtractor.Extract(TextResource("{bad json", "application/json")); return Task.CompletedTask; }, "url_invalid_document");
});
await Case("office XML entities, corrupt archives and unsupported media are rejected", async () =>
{
    await Error(() => { NotebookDocumentExtractor.Extract(Resource(Zip(("word/document.xml", "<!DOCTYPE x [<!ENTITY leak SYSTEM 'http://127.0.0.1/'>]><x>&leak;</x>")), null)); return Task.CompletedTask; }, "url_invalid_document");
    await Error(() => { NotebookDocumentExtractor.Extract(Resource("PK\u0003\u0004bad zip"u8.ToArray(), null)); return Task.CompletedTask; }, "url_invalid_document");
    await Error(() => { NotebookDocumentExtractor.Extract(Resource([1, 2, 3], "image/png")); return Task.CompletedTask; }, "url_unsupported_content");
});
await Case("zip expansion and extracted-text limits prevent silent truncation", async () =>
{
    await Error(() => { NotebookDocumentExtractor.Extract(Resource(Zip(("word/document.xml", new string('x', 21 * 1024 * 1024))), null)); return Task.CompletedTask; }, "url_document_too_large");
    await Error(() => { NotebookDocumentExtractor.Extract(TextResource(new string('a', 200_001))); return Task.CompletedTask; }, "url_text_too_large");
});
await Case("redirect statuses, relative URLs and final origin", async () =>
{
    foreach (var status in new[] { 301, 302, 303, 307, 308 })
    {
        var calls = 0;
        using var http = new HttpClient(new StubHandler((r, ct) => Task.FromResult(++calls == 1 ? Reply(status, location: "/final#part") : Reply(200, media: "text/plain"))));
        var source = await NotebookUrlReader.ReadAsync(http, Origin); Check(calls == 2 && source.Url.AbsolutePath == "/final" && source.Url.Fragment == "", "Redirect not followed");
    }
});
await Case("redirect loops, missing Location and maximum hops", async () =>
{
    using var loop = new HttpClient(new StubHandler((r, ct) => Task.FromResult(Reply(302, location: "/lesson"))));
    await Error(async () => { await NotebookUrlReader.ReadAsync(loop, Origin); }, "url_redirect_loop");
    using var missing = new HttpClient(new StubHandler((r, ct) => Task.FromResult(Reply(302))));
    await Error(async () => { await NotebookUrlReader.ReadAsync(missing, Origin); }, "url_invalid_redirect");
    var hops = 0; using var many = new HttpClient(new StubHandler((r, ct) => Task.FromResult(Reply(302, location: "/hop" + ++hops))));
    await Error(async () => { await NotebookUrlReader.ReadAsync(many, Origin); }, "url_redirect_limit"); Check(hops == 6, "Hop count wrong");
});
await Case("private initial URL and redirect are rejected before HTTP reaches target", async () =>
{
    foreach (var target in new[] { "http://127.0.0.1/x", "http://2130706433/x", "http://0x7f000001/x", "http://10.0.0.1/x", "http://169.254.169.254/x", "http://[::1]/x", "http://[::ffff:192.168.1.1]/x", "ftp://8.8.8.8/x", "https://user:secret@8.8.8.8/x" })
    {
        var calls = 0; using var http = new HttpClient(new StubHandler((r, ct) => { calls++; return Task.FromResult(Reply(302, location: target)); }));
        await Error(async () => { await NotebookUrlReader.ReadAsync(http, target); }, "url_not_allowed"); Check(calls == 0, "Unsafe initial URL fetched");
        await Error(async () => { await NotebookUrlReader.ReadAsync(http, Origin); }, "url_not_allowed"); Check(calls == 1, "Unsafe redirect fetched");
    }
});
await Case("address policy blocks internal/reserved IPv4 and IPv6", () =>
{
    foreach (var ip in new[] { "0.0.0.0", "127.0.0.1", "10.1.1.1", "100.64.0.1", "169.254.169.254", "172.16.0.1", "192.168.1.1", "192.0.2.1", "198.18.0.1", "198.51.100.1", "203.0.113.1", "224.0.0.1", "::1", "fc00::1", "fe80::1", "ff02::1", "::ffff:127.0.0.1", "2001:db8::1", "2002:a00:1::1" }) Check(!NotebookUrlReader.IsPublicAddress(IPAddress.Parse(ip)), "Allowed " + ip);
    Check(NotebookUrlReader.IsPublicAddress(IPAddress.Parse("8.8.8.8")) && NotebookUrlReader.IsPublicAddress(IPAddress.Parse("2606:4700:4700::1111")), "Public IP rejected"); return Task.CompletedTask;
});
await Case("upstream failures keep session-independent error codes", async () =>
{
    foreach (var pair in new[] { (401, "url_access_denied"), (403, "url_access_denied"), (404, "url_not_found"), (429, "url_rate_limited"), (500, "url_http_error") })
    {
        var calls = 0; using var http = new HttpClient(new StubHandler((r, ct) => { calls++; return Task.FromResult(Reply(pair.Item1)); }));
        await Error(async () => { await NotebookUrlReader.ReadAsync(http, Origin); }, pair.Item2); Check(calls == 1, "Denied request retried");
    }
});
await Case("headers contain app identity and no user credentials", async () =>
{
    using var http = new HttpClient(new StubHandler((r, ct) =>
    {
        Check(r.Headers.UserAgent.ToString().Contains("MindSprintAI") && r.Headers.Accept.Any(h => h.MediaType == "application/pdf"), "Headers missing");
        Check(r.Headers.Authorization is null && !r.Headers.Contains("Cookie"), "Credentials leaked"); return Task.FromResult(Reply(200, media: "text/plain"));
    })); await NotebookUrlReader.ReadAsync(http, Origin);
});
await Case("network, timeout and caller cancellation remain distinct", async () =>
{
    using var network = new HttpClient(new StubHandler((r, ct) => throw new HttpRequestException("offline")));
    await Error(async () => { await NotebookUrlReader.ReadAsync(network, Origin); }, "url_network_error");
    using var timeout = new HttpClient(new StubHandler((r, ct) => throw new TaskCanceledException()));
    await Error(async () => { await NotebookUrlReader.ReadAsync(timeout, Origin); }, "url_timeout");
    using var cancellation = new CancellationTokenSource(); cancellation.Cancel();
    try { await NotebookUrlReader.ReadAsync(timeout, Origin, cancellation.Token); throw new Exception("Cancellation lost"); } catch (OperationCanceledException) { }
});
await Case("document and HTML download limits work for known and streaming lengths", async () =>
{
    foreach (var media in new[] { "text/html", "application/pdf" })
    foreach (var streaming in new[] { false, true })
    {
        var limit = media == "text/html" ? NotebookUrlReader.MaxBytes : NotebookUrlReader.MaxDocumentBytes;
        using var http = new HttpClient(new StubHandler((r, ct) =>
        {
            var response = Reply(200); response.Content = streaming ? new StreamContentUnknownLength(new byte[limit + 1]) : new ByteArrayContent(new byte[limit + 1]); response.Content.Headers.ContentType = new(media); return Task.FromResult(response);
        })); await Error(async () => { await NotebookUrlReader.DownloadAsync(http, Origin); }, "url_too_large");
    }
});
await Case("static HTML uses extraction without launching a browser", async () =>
{
    var renderer = new StubRenderer(); var importer = new NotebookUrlImporter(renderer);
    using var http = new HttpClient(new StubHandler((r, ct) => Task.FromResult(Reply(200, "<html><title>Bài học</title><main><p>" + Lesson + "</p></main></html>"))));
    var source = await importer.ImportAsync(http, Origin); Check(renderer.Calls == 0 && source.Title == "Bài học" && source.Content == Lesson, "Static importer failed");
});
await Case("JavaScript app shell selects renderer and returns rendered text", async () =>
{
    var renderer = new StubRenderer(); var importer = new NotebookUrlImporter(renderer);
    using var http = new HttpClient(new StubHandler((r, ct) => Task.FromResult(Reply(200, "<html><div id='root'>Loading...</div><script src='/app.js'></script></html>"))));
    var source = await importer.ImportAsync(http, Origin); Check(renderer.Calls == 1 && source.Content.Contains(Lesson), "JS fallback not used");
});
await Case("403 does not trigger browser bypass and empty pages fail", async () =>
{
    var renderer = new StubRenderer(); var importer = new NotebookUrlImporter(renderer);
    using var denied = new HttpClient(new StubHandler((r, ct) => Task.FromResult(Reply(403))));
    await Error(async () => { await importer.ImportAsync(denied, Origin); }, "url_access_denied"); Check(renderer.Calls == 0, "403 launched browser");
    using var empty = new HttpClient(new StubHandler((r, ct) => Task.FromResult(Reply(200, "<html><main>empty</main></html>"))));
    await Error(async () => { await importer.ImportAsync(empty, Origin); }, "url_empty_content");
});
await Case("PDF, Office and JSON flow through the same importer", async () =>
{
    foreach (var item in new[] { (Pdf(true), "application/pdf", "pdf"), (Zip(("word/document.xml", "<document><p><t>" + Lesson + "</t></p></document>")), "application/octet-stream", "docx"), (Encoding.UTF8.GetBytes("{\"lesson\":\"" + Lesson + "\"}"), "application/json", "json") })
    {
        using var http = new HttpClient(new StubHandler((r, ct) => { var response = Reply(200); response.Content = new ByteArrayContent(item.Item1); response.Content.Headers.ContentType = new(item.Item2); return Task.FromResult(response); }));
        var source = await new NotebookUrlImporter(new StubRenderer()).ImportAsync(http, Origin); Check(source.Format == item.Item3, "Wrong importer format");
    }
});
await Case("short valid document content can be imported; empty text cannot", async () =>
{
    var importer = new NotebookUrlImporter(new StubRenderer());
    using var shortText = new HttpClient(new StubHandler((r, ct) => Task.FromResult(Reply(200, "word,meaning\nMatrix,Ma trận", media: "text/csv"))));
    Check((await importer.ImportAsync(shortText, Origin)).Content.Contains("Ma trận"), "Short CSV rejected");
    using var emptyText = new HttpClient(new StubHandler((r, ct) => Task.FromResult(Reply(200, "  ", media: "text/plain"))));
    await Error(async () => { await importer.ImportAsync(emptyText, Origin); }, "url_empty_content");
});

if (args.Contains("--browser"))
{
    await Case("real browser runs external script and GET JSON via guarded transport", async () =>
    {
        var requests = new List<string>();
        using var http = new HttpClient(new StubHandler((r, ct) =>
        {
            lock (requests) requests.Add(r.RequestUri!.AbsolutePath);
            var body = r.RequestUri!.AbsolutePath switch { "/lesson" => "<html><head><title>Rendered lesson</title></head><body><main id='root'>Loading...</main><script src='/app.js'></script></body></html>", "/app.js" => "fetch('/lesson.json').then(r=>r.json()).then(r=>document.querySelector('main').textContent=r.text)", _ => "{\"text\":\"" + Lesson + "\"}" };
            return Task.FromResult(Reply(200, body, media: r.RequestUri.AbsolutePath.EndsWith(".js") ? "text/javascript" : r.RequestUri.AbsolutePath.EndsWith(".json") ? "application/json" : "text/html"));
        }));
        using var renderer = new NotebookPageRenderer(); var source = await new NotebookUrlImporter(renderer).ImportAsync(http, Origin);
        Check(source.Content == Lesson && source.Format == "html-js" && requests.Contains("/app.js") && requests.Contains("/lesson.json"), "Rendered content missing");
    });
    await Case("real browser cannot fetch private resources", async () =>
    {
        using var http = new HttpClient(new StubHandler((r, ct) => Task.FromResult(Reply(200, "<html><main id='root'>Loading...</main><script>fetch('http://127.0.0.1/private').catch(()=>document.querySelector('main').textContent='" + Lesson + "')</script></html>"))));
        using var renderer = new NotebookPageRenderer();
        await Error(async () => { await new NotebookUrlImporter(renderer).ImportAsync(http, Origin); }, "url_not_allowed");
    });
}
if (args.Contains("--live"))
{
    using var handler = NotebookUrlReader.CreateHandler(); using var http = new HttpClient(handler);
    using var renderer = new NotebookPageRenderer(); var importer = new NotebookUrlImporter(renderer);
    foreach (var url in new[] { "https://example.com/", "https://httpbin.org/redirect-to?url=%2Fhtml", "https://raw.githubusercontent.com/mozilla/pdf.js/master/test/pdfs/tracemonkey.pdf", "https://httpbin.org/json" })
        await Case("live " + url, async () =>
        {
            var source = url.EndsWith(".pdf") ? await NotebookUrlReader.ReadAsync(http, url) : await importer.ImportAsync(http, url);
            Check(source.Content.Length > 0 && (!url.EndsWith(".pdf") || source.Format == "pdf"), "Live extraction missing"); Console.WriteLine("  format=" + source.Format + " chars=" + source.Content.Length);
        });
}
Console.WriteLine($"{passed} URL import checks passed.");

sealed class StubHandler(Func<HttpRequestMessage, CancellationToken, Task<HttpResponseMessage>> send) : HttpMessageHandler
{ protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken token) => send(request, token); }
sealed class StubRenderer : INotebookPageRenderer
{
    public int Calls { get; private set; }
    public Task<NotebookUrlContent> RenderAsync(HttpClient http, NotebookUrlContent source, CancellationToken token)
    { Calls++; return Task.FromResult(new NotebookUrlContent(source.Url, "Nội dung bài học tiếng Việt: ma trận nghịch đảo, phép biến đổi sơ cấp và điều kiện khả nghịch. Đây là tài liệu cần lưu vào sổ tay để ôn tập.", false) { Title = "Rendered", Format = "html-js" }); }
}
sealed class StreamContentUnknownLength(byte[] data) : HttpContent
{
    protected override bool TryComputeLength(out long length) { length = 0; return false; }
    protected override Task SerializeToStreamAsync(Stream stream, TransportContext? context) => stream.WriteAsync(data).AsTask();
    protected override Task<Stream> CreateContentReadStreamAsync() => Task.FromResult<Stream>(new MemoryStream(data));
}
