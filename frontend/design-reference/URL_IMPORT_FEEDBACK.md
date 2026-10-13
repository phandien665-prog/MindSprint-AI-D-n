# Phản hồi lỗi thêm URL — v40

Lỗi “Trang trả về lỗi 403 (không theo redirect)” xuất phát từ `NotebooksController.AddUrl`: backend nhận HTTP 403 từ trang nguồn và trả lỗi 400 về frontend. Cụm “không theo redirect” được gắn vào tất cả HTTP lỗi; bản thân 403 không phải chuyển hướng.

Trong phạm vi frontend đã cho phép:

- Hiển thị trạng thái đang tải, lỗi và thành công ngay dưới ô URL; giữ URL khi tải thất bại.
- Giải thích riêng lỗi 403 từ trang nguồn; chỉ hướng dẫn dùng URL cuối cùng khi backend báo mã chuyển hướng 301, 302, 303, 307 hoặc 308.
- Nút “Dán văn bản”/“Tải file” mở và focus các biểu mẫu hiện có. Không tự tải lại, tạo nguồn giả hoặc đổi dữ liệu/API.
- Escape nội dung lỗi, hỗ trợ thông báo cho trình đọc màn hình; không mở hộp alert cho lỗi URL.
- Cache ứng dụng nâng lên v40 cho các tài nguyên đã sửa.

File triển khai: `notebook.js`, `ui.js`, `style.css`, `index.html`, `sw.js`. Kết quả kiểm tra lưu trong `VALIDATION_RESULTS.json` mục `urlFeedbackV40`.

Kiểm thử trước/sau: `node --test tests/frontend-session.test.cjs tests/frontend-text.test.cjs` đều pass 16/16. Edge headless với API mô phỏng xác minh lỗi 403, mã chuyển hướng, giữ URL/phiên đăng nhập, nút nhập thay thế, loading/thành công, escape lỗi và mobile sáng/tối không tràn ngang. Backend và các file bị giới hạn được kiểm tra hash, giữ nguyên.

**Giới hạn của bản frontend:** tại thời điểm triển khai v40 chưa có URL thực tế để tái hiện. Bản frontend cải thiện cách hiển thị, không khiến trang nguồn ngừng từ chối tải.

## Sửa backend theo phê duyệt tiếp theo — 2026-10-06

Người dùng đã cho phép sửa backend cho việc thêm URL. Thay đổi giới hạn ở `Services/NotebookUrlReader.cs` (mới), `Controllers/NotebooksController.cs` và cấu hình HTTP client `web` trong `Program.cs`; không sửa `appsettings.json`, endpoint, payload yêu cầu hoặc cơ chế đăng nhập.

- Gửi User-Agent có tên MindSprintAI, Accept và Accept-Language; hỗ trợ giải nén gzip/deflate/Brotli.
- Theo tối đa 5 chuyển hướng (301/302/303/307/308), gồm đường dẫn tương đối và đổi tên miền; lưu URL cuối cùng làm nguồn. Chặn vòng lặp, Location thiếu và chuyển hướng quá giới hạn.
- Kiểm tra mọi URL/IP; chỉ HTTP/HTTPS công khai, không thông tin đăng nhập trong URL. Xác minh DNS tại lúc kết nối và kết nối thẳng IP đã kiểm tra để tránh đổi kết quả DNS giữa kiểm tra và tải. Không chuyển cookie/token đăng nhập của người dùng sang nguồn.
- Phân biệt 401/403 từ nguồn, 404, 429, lỗi mạng, timeout, nội dung quá lớn và định dạng không hỗ trợ; không nhầm 403 với redirect. Lỗi nguồn vẫn trả HTTP 400 về API ứng dụng, kèm `code` và `upstreamStatus`, không làm hết phiên đăng nhập.
- Giới hạn 15 giây cho chuỗi tải + đọc nội dung, 2 MB sau giải nén; không cắt nội dung quá lớn rồi lưu như thể đầy đủ. Đọc charset/BOM khi hỗ trợ; giữ văn bản thuần, trích nội dung HTML với regex có timeout.

Xác minh: build backend 0 lỗi/cảnh báo; 19 nhóm kiểm thử C# qua harness riêng trong thư mục tạm (không thay đổi `tests/`). Kiểm tra trực tiếp bằng HTTP handler production: example.com, httpbin chuyển hướng tương đối đến HTML, chuyển hướng sang example.com và giải nén gzip đều thành công. Hai bộ kiểm thử frontend trước/sau vẫn pass 16/16. Hash cấu hình riêng và các file test giữ nguyên.

**Giới hạn tại thời điểm sửa backend lần đầu:** chưa xác minh end-to-end lưu nguồn trên tài khoản/DB của người dùng. URL Wikioasis được cung cấp sau đó đã được kiểm tra: HTTP 403, server Cloudflare, trang “Attention Required! | Cloudflare”. Đây là từ chối của trang nguồn.

## Mở rộng loại URL — v41

Theo yêu cầu tiếp theo, thêm bộ đọc PDF có chữ, DOCX/PPTX/XLSX, TXT/Markdown/CSV, JSON/XML/RSS/Atom và renderer cho trang JavaScript có tài nguyên GET công khai. Cập nhật mô tả trong phần Thêm từ URL; endpoint/payload frontend giữ nguyên. Giới hạn tài liệu/renderer và hướng dẫn cài trình duyệt được mô tả tại [backend/URL_IMPORT.md](../../backend/URL_IMPORT.md).

Build pass; 37 kiểm tra URL, gồm Edge thực và 4 nguồn mạng công khai, đều pass. Hai bộ frontend vẫn pass 16/16. Backend đã được khởi động lại, Swagger tại cổng 5000/5100 trả 200. Chưa nhập nguồn thử vào DB/tài khoản của người dùng. Trang yêu cầu đăng nhập/CAPTCHA hoặc vẫn bị Cloudflare chặn không được bảo đảm đọc tự động.
