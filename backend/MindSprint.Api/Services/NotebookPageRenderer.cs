using Microsoft.Playwright;

namespace MindSprint.Api.Services;

public interface INotebookPageRenderer
{
    Task<NotebookUrlContent> RenderAsync(HttpClient http, NotebookUrlContent source, CancellationToken token);
}

/// <summary>Runs public-page JavaScript in an isolated context with all HTTP routed through the guarded downloader.</summary>
public sealed class NotebookPageRenderer : INotebookPageRenderer, IDisposable
{
    private readonly SemaphoreSlim slots = new(2, 2);

    public async Task<NotebookUrlContent> RenderAsync(HttpClient http, NotebookUrlContent source, CancellationToken token)
    {
        using var deadline = CancellationTokenSource.CreateLinkedTokenSource(token);
        deadline.CancelAfter(TimeSpan.FromSeconds(25));
        var ct = deadline.Token;
        var entered = false;
        try
        {
            await slots.WaitAsync(ct);
            entered = true;
            using var playwright = await Playwright.CreateAsync().WaitAsync(ct);
            // Use installed Edge on Windows; other platforms use Playwright's Chromium installation.
            var edge = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), "Microsoft", "Edge", "Application", "msedge.exe");
            await using var browser = await playwright.Chromium.LaunchAsync(new()
            {
                Channel = OperatingSystem.IsWindows() && File.Exists(edge) ? "msedge" : null,
                Headless = true,
                ChromiumSandbox = true,
                Timeout = 10_000,
                Args = ["--disable-background-networking", "--disable-extensions", "--disable-sync", "--disable-component-update", "--host-resolver-rules=MAP * ~NOTFOUND", "--force-webrtc-ip-handling-policy=disable_non_proxied_udp"]
            }).WaitAsync(ct);
            await using var context = await browser.NewContextAsync(new()
            {
                ServiceWorkers = ServiceWorkerPolicy.Block,
                AcceptDownloads = false,
                Locale = "vi-VN",
                ViewportSize = new() { Width = 1280, Height = 800 }
            }).WaitAsync(ct);
            // Closing the context interrupts navigation/evaluation as well as blocked fetches on cancellation.
            using var cancellation = ct.Register(() => { _ = context.CloseAsync().ContinueWith(t => _ = t.Exception, TaskContinuationOptions.OnlyOnFaulted); });
            await context.RouteWebSocketAsync("**/*", socket => { _ = socket.CloseAsync().ContinueWith(t => _ = t.Exception, TaskContinuationOptions.OnlyOnFaulted); });
            await context.AddInitScriptAsync("Object.defineProperty(globalThis, 'RTCPeerConnection', {value:undefined, configurable:false}); Object.defineProperty(globalThis, 'webkitRTCPeerConnection', {value:undefined, configurable:false});");
            var page = await context.NewPageAsync().WaitAsync(ct);
            context.Page += (_, popup) => { if (popup != page) _ = popup.CloseAsync().ContinueWith(t => _ = t.Exception, TaskContinuationOptions.OnlyOnFaulted); };
            var count = 0;
            long bytes = 0;
            NotebookUrlException? fatal = null;
            var networkSlots = new SemaphoreSlim(4, 4);
            var seeded = false;
            await context.RouteAsync("**/*", async route =>
            {
                var enteredNetwork = false;
                try
                {
                    var request = route.Request;
                    if (ct.IsCancellationRequested || request.Method != "GET" || request.ResourceType is not ("document" or "script" or "stylesheet" or "fetch" or "xhr") || (request.IsNavigationRequest && request.Frame != page.MainFrame))
                    { await route.AbortAsync(); return; }
                    if (Interlocked.Increment(ref count) > 48)
                        throw new NotebookUrlException("Trang cần quá nhiều yêu cầu để tải. Hãy dán phần nội dung cần học.", "url_render_limit");
                    if (!seeded && request.IsNavigationRequest && request.Url == source.Url.AbsoluteUri)
                    {
                        seeded = true;
                        var initialHeaders = new Dictionary<string, string>(source.ResponseHeaders, StringComparer.OrdinalIgnoreCase) { ["Content-Type"] = "text/html; charset=utf-8" };
                        await route.FulfillAsync(new() { Status = 200, Headers = initialHeaders, Body = source.Content });
                        return;
                    }
                    await networkSlots.WaitAsync(ct);
                    enteredNetwork = true;
                    var resource = await NotebookUrlReader.DownloadAsync(http, request.Url, ct, NotebookUrlReader.MaxBytes);
                    if (Interlocked.Add(ref bytes, resource.Bytes.Length) > 8_000_000)
                        throw new NotebookUrlException("Trang vượt giới hạn tải khi chạy JavaScript. Hãy chọn tài liệu nhỏ hơn.", "url_render_limit");
                    if (resource.Url.AbsoluteUri != request.Url)
                    {
                        // Let the browser retain the final resource URL for relative/module imports.
                        await route.FulfillAsync(new() { Status = 302, Headers = new Dictionary<string, string> { ["Location"] = resource.Url.AbsoluteUri } });
                        return;
                    }
                    var headers = resource.Headers;
                    headers["Content-Type"] = (resource.MediaType ?? "application/octet-stream") + (resource.Charset is { Length: > 0 } charset ? "; charset=" + charset : "");
                    await route.FulfillAsync(new() { Status = 200, BodyBytes = resource.Bytes, Headers = headers });
                }
                catch (NotebookUrlException error)
                {
                    if (error.Code is "url_not_allowed" or "url_render_limit" || route.Request.IsNavigationRequest)
                        Interlocked.CompareExchange(ref fatal, error, null);
                    try { await route.AbortAsync(); } catch (PlaywrightException) { }
                }
                catch (Exception error) when (error is OperationCanceledException or PlaywrightException)
                { try { await route.AbortAsync(); } catch (PlaywrightException) { } }
                finally { if (enteredNetwork) networkSlots.Release(); }
            });
            try
            {
                await page.GotoAsync(source.Url.AbsoluteUri, new() { WaitUntil = WaitUntilState.DOMContentLoaded, Timeout = 18_000 });
                await page.WaitForFunctionAsync("() => { const node=document.querySelector('#mw-content-text, article, main, [role=main], #root, #app, #__next, #__nuxt') || document.body; const text=(node?.innerText || '').trim(); return text.length>=50 && !/^(loading|đang tải|please enable javascript)/i.test(text); }", null, new() { Timeout = 12_000 });
                await Task.Delay(350, ct);
            }
            catch (PlaywrightException) when (fatal is not null) { throw fatal; }
            if (fatal is not null) throw fatal;
            if (!Uri.TryCreate(page.Url, UriKind.Absolute, out var finalUrl) || finalUrl.Scheme is not ("http" or "https"))
                throw new NotebookUrlException("Trang đã chuyển sang địa chỉ không được hỗ trợ.", "url_not_allowed");
            var result = NotebookDocumentExtractor.ExtractHtml(finalUrl, await page.ContentAsync().WaitAsync(ct));
            return result with { Format = "html-js" };
        }
        catch (OperationCanceledException) when (!token.IsCancellationRequested)
        { throw new NotebookUrlException("Trang JavaScript phản hồi quá chậm. Hãy thử lại hoặc dán nội dung/tải file.", "url_render_timeout"); }
        catch (PlaywrightException error) when (!ct.IsCancellationRequested && (error.Message.Contains("Executable doesn't exist", StringComparison.OrdinalIgnoreCase) || error.Message.Contains("executable doesn't exist", StringComparison.OrdinalIgnoreCase)))
        { throw new NotebookUrlException("Máy chủ chưa cài trình duyệt để đọc trang JavaScript. Có thể dùng URL tài liệu, dán văn bản hoặc tải file.", "url_browser_unavailable"); }
        catch (PlaywrightException) when (token.IsCancellationRequested) { throw new OperationCanceledException(token); }
        catch (PlaywrightException) when (ct.IsCancellationRequested)
        { throw new NotebookUrlException("Trang JavaScript phản hồi quá chậm. Hãy thử lại hoặc dán nội dung/tải file.", "url_render_timeout"); }
        catch (PlaywrightException)
        { throw new NotebookUrlException("Không lấy được nội dung sau khi chạy JavaScript. Trang có thể yêu cầu đăng nhập/xác minh; hãy dán văn bản hoặc tải file.", "url_render_failed"); }
        finally { deadline.Cancel(); if (entered) slots.Release(); }
    }

    public void Dispose() => slots.Dispose();
}
