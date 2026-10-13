# Kế hoạch Issue #11 — Validation phía client

Đặc tả đã được Đình Hùng duyệt trong chat ngày 07/10/2026: `SPEC-issue11.md`.
Kế hoạch đã được Đình Hùng duyệt trong chat trước khi triển khai ngày 07/10/2026.
Nền triển khai: main tại `05f3a0b`, working tree sạch trước khi thêm tài liệu này.

## Phạm vi và cách làm

Tạo nhánh local `hung/issue-11-validation`. Hoàn thành validation email, mật khẩu 6–30 ký tự, URL HTTP/HTTPS, upload PDF/TXT/MD/CSV tối đa 10 MiB; cập nhật lỗi theo input/change. Dùng JavaScript thuần, HTML validation, URL parser và các helper thông báo sẵn có, không thêm dependency.

Chuỗi phụ thuộc: kiểm tra nền → auth → notebook → kiểm tra hồi quy/trình duyệt → báo cáo và commit local. Theo dõi tác vụ tại `tasks/todo.md`; chưa tạo issue phụ trên GitHub.

## Các bước triển khai

### 1. Email và mật khẩu trong modal dùng chung

- Bổ sung lỗi gắn với từng ô và trạng thái aria-invalid; không báo lỗi ô chưa tương tác khi mở modal.
- Kiểm tra ngay khi gõ, dán, xóa; sửa hợp lệ thì xóa lỗi. Mật khẩu giữ nguyên nội dung, đếm Unicode code point, 6–30 ký tự; vẫn cho nhập ký tự thứ 31 để báo lỗi.
- Kiểm tra lại trước submit/Enter, không gọi login/register nếu sai; giữ nguyên luồng Google và tên hiển thị hiện có.
- Files: `frontend/auth.js`, `frontend/style.css`, `tests/frontend-validation.test.cjs`.
- Verify: test hành vi nhập và chặn API, các biên 5/6/30/31, Unicode, sửa lỗi, đổi tab login/register.

### 2. URL và file trong Sổ tay AI

- Thay regex URL bằng parser HTTP/HTTPS, phản hồi input bằng khu vực URL hiện có; kiểm tra lại trước request.
- Kiểm tra file ngay khi chọn, tái sử dụng giới hạn 10 MiB và extension hiện có; đưa lỗi vào khu vực upload, không alert; liên kết lỗi với input.
- Giữ file/URL khi sai hoặc request thất bại; chỉ xóa sau thành công; giữ thông báo loading, lỗi server, thành công đang có.
- Files: `frontend/notebook.js`, `frontend/style.css`, `tests/frontend-validation.test.cjs`.
- Verify: URL trống/sai scheme/sai cấu trúc/đúng; file thiếu/sai extension/đuôi viết hoa; kích thước đúng ngưỡng và vượt một byte; invalid không gọi API.

### 3. Kiểm tra và bàn giao

- Chạy test mới và test frontend/session/Google hiện có. Hai harness hiện thiếu window.location: nếu tái hiện lỗi nền, chỉ bổ sung mock location cho đúng môi trường trình duyệt.
- Build frontend; kiểm tra trực tiếp trình duyệt desktop và một viewport hẹp, lỗi inline, bàn phím và việc không gửi request sai. Các request kiểm thử dùng API giả lập, không tạo dữ liệu trên hệ thống nhóm.
- Review diff, cập nhật task trạng thái, viết `ISSUE-11-REPORT.md` với bằng chứng đã chạy và phần chưa kiểm chứng.
- Đồng bộ phiên bản style/auth/notebook trong `frontend/index.html` và `frontend/sw.js` để cache offline nhận bản validation mới; không đổi chiến lược cache.
- Files: test validation, `tests/frontend-session.test.cjs`, `backend/GoogleAuthChecks/frontend-google.test.cjs` nếu cần, báo cáo và task docs.
- Commit local bằng danh tính Git của người dùng; nếu chưa cấu hình danh tính, hỏi người dùng, không dùng tên chung MindSprint User.
- Khi có diff và kết quả cụ thể, chốt việc push nhánh, tạo PR và đăng bình luận Issue #11. Không tự merge hoặc đóng issue.

## Lệnh kiểm tra

Chạy tại thư mục project, dùng Node có sẵn:

```powershell
& 'C:\Users\vudin\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test --test-isolation=none tests/frontend-validation.test.cjs
& 'C:\Users\vudin\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test --test-isolation=none tests/frontend-session.test.cjs tests/frontend-text.test.cjs backend/GoogleAuthChecks/frontend-google.test.cjs
& 'C:\Users\vudin\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' frontend/build.mjs
git diff --check
```

## Rủi ro cần kiểm tra

- Render lại modal/notebook: dùng event delegation hiện có để tránh mất handler; lỗi và trạng thái reset phù hợp khi đổi giao diện.
- Google và đăng nhập: validation client trong modal email không thay đổi API/auth session hay mật khẩu liên kết Google.
- File 10 MiB: frontend kiểm tra đúng ngưỡng; backend có thể chặn tổng multipart request. Ghi rõ nếu chưa kiểm chứng tích hợp, không mở rộng sửa backend trong issue client.
- Phạm vi 30 ký tự phía client đã được duyệt; server hiện chưa thực thi tối đa này. Không tuyên bố đây là giới hạn bảo mật server.
- Main nhóm có thể đổi: kiểm tra lại trước push/PR và kiểm thử trên nền cập nhật nếu cần.

## Cổng kiểm tra

1. Duyệt kế hoạch này trước triển khai.
2. Sau auth và notebook: test validation và hồi quy phải đạt; kiểm tra trình duyệt hoàn tất hoặc ghi rõ blocker.
3. Trước đưa GitHub: diff chỉ gồm Issue #11 và tài liệu/test liên quan, báo cáo phản ánh đúng bằng chứng; người dùng duyệt thao tác bên ngoài.
