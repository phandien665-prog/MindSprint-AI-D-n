using System.Text.RegularExpressions;

namespace MindSprint.Api.Services;

public sealed class NotebookUrlImporter(INotebookPageRenderer renderer)
{
    public async Task<NotebookUrlContent> ImportAsync(HttpClient http, string url, CancellationToken token = default)
    {
        var source = await NotebookUrlReader.ReadAsync(http, url, token);
        if (source.IsHtml)
        {
            var extracted = NotebookDocumentExtractor.ExtractHtml(source.Url, source.Content);
            var scripts = Regex.IsMatch(source.Content, @"<script\b", RegexOptions.IgnoreCase, TimeSpan.FromSeconds(1));
            var appShell = Regex.IsMatch(source.Content, @"id\s*=\s*[""'](?:root|app|__next|__nuxt)[""']", RegexOptions.IgnoreCase, TimeSpan.FromSeconds(1));
            source = scripts && (extracted.Content.Length < 80 || (appShell && extracted.Content.Length < 400))
                ? await renderer.RenderAsync(http, source, token) : extracted;
        }
        var minimumLength = source.Format is "html" or "html-js" ? 50 : 1;
        if (source.Content.Trim().Length < minimumLength)
            throw new NotebookUrlException("Nguồn có quá ít nội dung để học. Hãy dùng trang bài viết/tài liệu đầy đủ hoặc dán văn bản.", "url_empty_content");
        return source;
    }
}
