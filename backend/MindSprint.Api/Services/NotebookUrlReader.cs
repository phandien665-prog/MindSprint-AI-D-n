using System.Net;
using System.Net.Sockets;

namespace MindSprint.Api.Services;

public sealed class NotebookUrlException(string message, string code, int? upstreamStatus = null)
    : Exception(message)
{
    public string Code { get; } = code;
    public int? UpstreamStatus { get; } = upstreamStatus;
}

public record NotebookUrlContent(Uri Url, string Content, bool IsHtml)
{
    public string? Title { get; init; }
    public string Format { get; init; } = IsHtml ? "html" : "text";
    public Dictionary<string, string> ResponseHeaders { get; init; } = new(StringComparer.OrdinalIgnoreCase);
}

public record NotebookUrlResource(Uri Url, byte[] Bytes, string? MediaType, string? Charset, string? FileName)
{
    public Dictionary<string, string> Headers { get; init; } = new(StringComparer.OrdinalIgnoreCase);
}

/// <summary>Bounded public-web downloads; redirects and actual socket destinations are validated.</summary>
public static class NotebookUrlReader
{
    public const int MaxRedirects = 5;
    public const int MaxBytes = 2_000_000;
    public const int MaxDocumentBytes = 10 * 1024 * 1024;

    public static SocketsHttpHandler CreateHandler() => new()
    {
        AllowAutoRedirect = false,
        AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Deflate | DecompressionMethods.Brotli,
        UseCookies = false,
        UseProxy = false,
        ConnectTimeout = TimeSpan.FromSeconds(10),
        ConnectCallback = async (context, cancellationToken) =>
        {
            // Resolve at connection time and connect to that exact IP, preventing DNS rebinding.
            var addresses = await PublicAddressesAsync(context.DnsEndPoint.Host, cancellationToken);
            foreach (var address in addresses)
            {
                var socket = new Socket(address.AddressFamily, SocketType.Stream, ProtocolType.Tcp);
                try
                {
                    await socket.ConnectAsync(new IPEndPoint(address, context.DnsEndPoint.Port), cancellationToken);
                    return new NetworkStream(socket, ownsSocket: true);
                }
                catch (SocketException) { socket.Dispose(); }
                catch { socket.Dispose(); throw; }
            }
            throw new HttpRequestException("Không thể kết nối đến trang nguồn.");
        }
    };

    public static async Task<NotebookUrlContent> ReadAsync(HttpClient http, string? url, CancellationToken cancellationToken = default)
        => NotebookDocumentExtractor.Extract(await DownloadAsync(http, url, cancellationToken), cancellationToken);

    public static async Task<NotebookUrlResource> DownloadAsync(HttpClient http, string? url, CancellationToken cancellationToken = default, int maximumBytes = MaxDocumentBytes)
    {
        if (url is null || url.Length > 4096 || !Uri.TryCreate(url.Trim(), UriKind.Absolute, out var uri))
            throw InvalidUrl();
        using var deadline = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
        deadline.CancelAfter(TimeSpan.FromSeconds(15));
        var token = deadline.Token;
        var visited = new HashSet<string>(StringComparer.Ordinal);
        try
        {
            for (var redirects = 0; ; redirects++)
            {
                if (uri.Scheme is not ("http" or "https") || !string.IsNullOrEmpty(uri.UserInfo)) throw InvalidUrl();
                uri = new UriBuilder(uri) { Fragment = "" }.Uri;
                await PublicAddressesAsync(uri.DnsSafeHost, token);
                if (!visited.Add(uri.AbsoluteUri))
                    throw new NotebookUrlException("Trang nguồn chuyển hướng lặp. Hãy thử đường dẫn trực tiếp đến tài liệu.", "url_redirect_loop");

                using var request = new HttpRequestMessage(HttpMethod.Get, uri);
                request.Headers.UserAgent.ParseAdd("Mozilla/5.0 (compatible; MindSprintAI/1.0; +https://github.com/tungtungsahul/MindSprint-AI-D-n)");
                request.Headers.Accept.ParseAdd("text/html,application/xhtml+xml,application/pdf,text/plain,application/json,application/xml;q=0.9,*/*;q=0.5");
                request.Headers.AcceptLanguage.ParseAdd("vi-VN,vi;q=0.9,en;q=0.8");
                using var response = await http.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, token);
                var status = (int)response.StatusCode;
                if (status is 301 or 302 or 303 or 307 or 308)
                {
                    if (redirects >= MaxRedirects)
                        throw new NotebookUrlException("Trang nguồn chuyển hướng quá nhiều lần. Hãy thử URL cuối cùng trong trình duyệt.", "url_redirect_limit");
                    var location = response.Headers.Location;
                    if (location is null || !Uri.TryCreate(uri, location, out var destination))
                        throw new NotebookUrlException("Trang nguồn trả về chuyển hướng không hợp lệ.", "url_invalid_redirect");
                    uri = destination;
                    continue;
                }
                if (!response.IsSuccessStatusCode)
                    throw status switch
                    {
                        401 or 403 => new NotebookUrlException($"Trang nguồn từ chối tải nội dung ({status}). Trang có thể yêu cầu đăng nhập hoặc chặn truy cập tự động. Hãy dán văn bản hoặc tải file tài liệu.", "url_access_denied", status),
                        404 => new NotebookUrlException("Không tìm thấy trang nguồn (404). Kiểm tra lại đường dẫn.", "url_not_found", status),
                        429 => new NotebookUrlException("Trang nguồn giới hạn lượt tải (429). Vui lòng thử lại sau hoặc dán văn bản/tải file.", "url_rate_limited", status),
                        _ => new NotebookUrlException($"Trang nguồn trả về lỗi {status}. Vui lòng thử lại sau hoặc thêm tài liệu bằng văn bản/file.", "url_http_error", status)
                    };

                var mediaType = response.Content.Headers.ContentType?.MediaType?.ToLowerInvariant();
                var byteLimit = mediaType?.StartsWith("text/") == true || mediaType is "application/xhtml+xml" or "application/json" or "application/xml" or "application/rss+xml" or "application/atom+xml"
                    ? Math.Min(MaxBytes, maximumBytes) : maximumBytes;
                if (response.Content.Headers.ContentLength > byteLimit) throw TooLarge(byteLimit);
                using var stream = await response.Content.ReadAsStreamAsync(token);
                using var buffer = new MemoryStream();
                var chunk = new byte[8192];
                int read;
                while ((read = await stream.ReadAsync(chunk, token)) > 0)
                {
                    if (buffer.Length + read > byteLimit) throw TooLarge(byteLimit);
                    buffer.Write(chunk, 0, read);
                }
                var charset = response.Content.Headers.ContentType?.CharSet?.Trim('"', '\'');
                var disposition = response.Content.Headers.ContentDisposition;
                return new NotebookUrlResource(uri, buffer.ToArray(), mediaType, charset, (disposition?.FileNameStar ?? disposition?.FileName)?.Trim('"'))
                {
                    Headers = response.Headers.Where(h => h.Key.StartsWith("Access-Control-", StringComparison.OrdinalIgnoreCase) || h.Key.Equals("Content-Security-Policy", StringComparison.OrdinalIgnoreCase))
                        .ToDictionary(h => h.Key, h => string.Join(",", h.Value), StringComparer.OrdinalIgnoreCase)
                };
            }
        }
        catch (OperationCanceledException) when (!cancellationToken.IsCancellationRequested)
        {
            throw new NotebookUrlException("Trang nguồn phản hồi quá chậm. Hãy thử lại hoặc thêm tài liệu bằng văn bản/file.", "url_timeout");
        }
        catch (HttpRequestException error)
        {
            if (error.GetBaseException() is NotebookUrlException blocked) throw blocked;
            throw new NotebookUrlException("Không kết nối được đến trang nguồn. Kiểm tra đường dẫn hoặc thêm tài liệu bằng văn bản/file.", "url_network_error");
        }
    }

    private static NotebookUrlException InvalidUrl() => new("URL không hợp lệ hoặc không được phép. Chỉ hỗ trợ http/https tới trang công khai.", "url_not_allowed");
    private static NotebookUrlException TooLarge(int limit) => new($"Nguồn vượt giới hạn tải ({(limit == MaxBytes ? "2" : "10")} MB). Hãy chọn tài liệu nhỏ hơn hoặc dán phần nội dung cần học.", "url_too_large");

    private static async Task<IPAddress[]> PublicAddressesAsync(string host, CancellationToken cancellationToken)
    {
        IPAddress[] addresses;
        try
        {
            addresses = IPAddress.TryParse(host.Trim('[', ']'), out var address)
                ? [address] : await Dns.GetHostAddressesAsync(host, cancellationToken);
        }
        catch (SocketException) { throw new NotebookUrlException("Không tìm thấy địa chỉ trang nguồn. Kiểm tra lại URL.", "url_dns_error"); }
        if (addresses.Length == 0 || addresses.Any(ip => !IsPublicAddress(ip))) throw InvalidUrl();
        return addresses;
    }

    public static bool IsPublicAddress(IPAddress ip)
    {
        if (ip.IsIPv4MappedToIPv6) ip = ip.MapToIPv4();
        if (IPAddress.IsLoopback(ip)) return false;
        var b = ip.GetAddressBytes();
        if (ip.AddressFamily == AddressFamily.InterNetworkV6)
        {
            // Only global unicast, excluding protocol, documentation and 6to4 ranges.
            return (b[0] & 0xE0) == 0x20
                && !(b[0] == 0x20 && b[1] == 0x01 && b[2] <= 1)
                && !(b[0] == 0x20 && b[1] == 0x01 && b[2] == 0x0D && b[3] == 0xB8)
                && !(b[0] == 0x20 && b[1] == 0x02)
                && !(b[0] == 0x3F && (b[1] & 0xF0) == 0xF0);
        }
        return ip.AddressFamily == AddressFamily.InterNetwork
            && b[0] is not (0 or 10 or 127) && b[0] < 224
            && !(b[0] == 100 && b[1] is >= 64 and <= 127)
            && !(b[0] == 169 && b[1] == 254)
            && !(b[0] == 172 && b[1] is >= 16 and <= 31)
            && !(b[0] == 192 && (b[1] == 168 || (b[1] == 0 && b[2] is 0 or 2)))
            && !(b[0] == 198 && (b[1] is 18 or 19 || (b[1] == 51 && b[2] == 100)))
            && !(b[0] == 203 && b[1] == 0 && b[2] == 113);
    }
}
