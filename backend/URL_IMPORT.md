# Nhập nhiều loại URL vào Sổ tay AI

Luồng `/api/notebooks/{id}/sources/url` vẫn nhận `{ "url": "https://..." }`, kiểm tra chủ sở hữu sổ tay và lưu nguồn như trước. Frontend/API client không đổi endpoint hay payload. `NotebookUrlImporter` chọn bộ đọc, trích nội dung rồi chuyển văn bản cho hệ thống AI hiện có.

| Nguồn | Nội dung nhập được |
|---|---|
| HTML/XHTML | Tiêu đề, nội dung chính, đoạn văn; ưu tiên `main`, `article`, vùng nội dung MediaWiki; bỏ menu/script/style. |
| Trang JavaScript | Khi HTML ban đầu quá ít nội dung, chạy Edge/Chromium headless rồi trích DOM. Hỗ trợ tải script và dữ liệu qua GET. |
| PDF | Lớp chữ; nhận dạng cả khi URL không có đuôi PDF hoặc MIME chung. |
| DOCX | Văn bản và bảng trong phần nội dung tài liệu. |
| PPTX | Văn bản slide, theo thứ tự số slide. |
| XLSX | Ô chữ, shared/inline strings và giá trị số/cached formula; giữ vị trí ô. Không tính lại công thức hay dựng biểu đồ. |
| TXT, Markdown, CSV | Văn bản, xuống dòng; giữ thụt lề mã và khoảng trắng trong dữ liệu. |
| JSON | Cấu trúc JSON dễ đọc, giữ giá trị chuỗi và tiếng Việt. |
| XML, RSS, Atom | Tên trường và nội dung; làm sạch HTML trong mô tả feed. Không đọc external entity. |

Đây là đọc **URL trỏ trực tiếp tới nội dung công khai**. Link chia sẻ chỉ hiển thị đăng nhập không được coi là nội dung tài liệu. PDF scan/ảnh cần OCR chưa hỗ trợ. Video/audio, file Office cũ `.doc/.xls/.ppt`, tài liệu mã hóa và ứng dụng cần POST/WebSocket/đăng nhập chưa có bộ đọc riêng. Không vượt CAPTCHA hoặc khẳng định đọc được trang chặn Cloudflare.

## Giới hạn và cách tải

- Tối đa 5 chuyển hướng HTTP; lưu URL cuối cùng. Chặn vòng lặp, URL có userinfo và địa chỉ không công khai.
- Kiểm tra DNS ở mỗi đích và tại lúc mở socket; kết nối đúng IP đã kiểm tra. Không dùng proxy/cookie dùng chung, không gửi token của người dùng tới trang nguồn.
- Web/text/JSON/XML tối đa 2.000.000 byte; tài liệu binary tối đa 10 MiB, tính sau giải nén HTTP. Giới hạn đọc HTTP 15 giây.
- Văn bản trích tối đa 200.000 ký tự; vượt giới hạn sẽ báo lỗi để tránh lưu bản bị cắt mà không biết. HTML cần ít nhất 50 ký tự; tài liệu cần có nội dung không trống.
- PDF tối đa 500 trang. Office ZIP tối đa 3.000 entry và 20 MiB tổng dữ liệu giải nén; XML cấm DTD/entity ngoài.
- Renderer: tối đa 2 phiên đồng thời, 25 giây/phiên, 48 yêu cầu và 8 MB tài nguyên. Tất cả HTTP đi qua bộ tải kiểm tra IP, tối đa 4 tải song song; chặn iframe navigation, POST, tải file, service worker, WebSocket và WebRTC. Giữ CSP/CORS của nguồn; không chuyển cookie/token tới nguồn.
- Lỗi trang nguồn trả về lỗi API 400 kèm `message`, `code`, `upstreamStatus` khi có. 401/403 **từ trang nguồn** không làm hết phiên đăng nhập vào MindSprint.

## Cài và chạy

```powershell
dotnet restore backend/MindSprint.Api/MindSprint.Api.csproj
dotnet build backend/MindSprint.Api/MindSprint.Api.csproj
```

Windows dùng Edge cài tại vị trí chuẩn nếu có. Nếu dùng máy không có Edge hoặc triển khai Linux, cài Chromium của Playwright sau khi build:

```powershell
pwsh backend/MindSprint.Api/bin/Debug/net8.0/playwright.ps1 install chromium
# Linux: cài thêm thư viện hệ thống theo hướng dẫn Playwright (install --with-deps chromium).
```

Chạy backend bằng quy trình hiện có. Không sửa `appsettings.json`; khóa AI, JWT và cấu hình DB giữ nguyên. Nếu máy chủ không có trình duyệt, nguồn web tĩnh/tài liệu vẫn đọc được; trang cần JavaScript báo `url_browser_unavailable`.

Thư viện thêm: [HtmlAgilityPack](https://www.nuget.org/packages/HtmlAgilityPack/1.13.0) 1.13.0 và [Microsoft.Playwright](https://www.nuget.org/packages/Microsoft.Playwright/1.63.0) 1.63.0. PDF dùng PdfPig hiện có. DOCX/PPTX/XLSX dùng ZIP/XML của .NET, không cần Microsoft Office.

## Xác minh

Bộ kiểm tra riêng nằm ở `backend/UrlImportChecks/`; không sửa thư mục `tests/`. Dùng thư mục artifacts riêng khi dev server đang chạy để tránh file thực thi bị khóa:

```powershell
dotnet run --project backend/UrlImportChecks/UrlImportChecks.csproj --artifacts-path "$env:TEMP/mindsprint-url-check-artifacts" -- --browser --live
node --test tests/frontend-session.test.cjs tests/frontend-text.test.cjs
```

`--browser` thêm hai kiểm tra Edge/Chromium thực với HTTP mô phỏng: đọc script + JSON và chặn truy cập nội bộ. `--live` thêm nguồn công khai HTML, chuyển hướng, PDF mẫu Mozilla, JSON; website bên ngoài có thể thay đổi hoặc từ chối truy cập.

Đã xác minh ngày 2026-10-06: build 0 lỗi/cảnh báo; **37 kiểm tra URL pass**, gồm 4 kiểm tra mạng thực; **16/16 kiểm tra frontend trước/sau pass**. Giao diện cũng được kiểm tra lỗi/loading/thành công, giữ URL/phiên, nút dán/tải file và mobile sáng/tối. Backend đã được khởi động lại, Swagger tại cổng 5000/5100 trả HTTP 200. Chưa thực hiện nhập nguồn vào tài khoản/DB của người dùng; kiểm tra importer và renderer chạy độc lập với DB.

Frontend cache v41 cập nhật phần mô tả loại URL và trạng thái đang đọc nguồn. Xem kết quả chi tiết tại `frontend/design-reference/VALIDATION_RESULTS.json`, mục `multiUrlV41`.
