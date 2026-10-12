# Kết quả Issue #11 — Validation phía client

Người thực hiện: Đình Hùng; tên tác giả commit: James.
Nhánh: `hung/issue-11-validation`, bắt đầu từ main `05f3a0b`.
Commit code: `cdd6dd4` — `feat(validation): validate auth and notebook inputs as users type`.
Ngày kiểm tra: 07/10/2026.
Issue: https://github.com/tungtungsahul/MindSprint-AI-D-n/issues/11
Pull Request: https://github.com/tungtungsahul/MindSprint-AI-D-n/pull/38
Cập nhật issue: https://github.com/tungtungsahul/MindSprint-AI-D-n/issues/11#issuecomment-6023489491

## Những gì mình đã thực hiện

Mình bổ sung validation phản hồi ngay trong lúc nhập email, mật khẩu và URL; file được kiểm tra ngay khi chọn. Trước khi gửi, các handler kiểm tra lại và dừng request nếu dữ liệu sai. Mình dùng validation HTML, URL parser và helper thông báo hiện có, không thêm thư viện.

| Yêu cầu Issue #11 | Phần đã thực hiện | Kết quả kiểm tra |
|---|---|---|
| Định dạng email | Kiểm tra email bằng input email, thông báo tiếng Việt ngay dưới ô khi nhập | Email sai báo lỗi ngay, sửa đúng xóa lỗi; submit/Enter không gửi dữ liệu sai |
| Độ dài mật khẩu | Từ 6 đến 30 ký tự theo thống nhất với Đình Hùng; tính chữ, số, ký tự đặc biệt, không tự trim hoặc ép yêu cầu độ mạnh mới | Biên 5/6/30/31 và Unicode đạt; ký tự thứ 31 vẫn nhập được và hiện lỗi ngay |
| Định dạng URL | Dùng URL parser, yêu cầu URL tuyệt đối có host và HTTP/HTTPS | URL sai cấu trúc, scheme hoặc port bị chặn; URL hợp lệ gửi qua handler hiện có |
| Định dạng file | Giữ PDF, TXT, MD, CSV; nhận phần mở rộng viết hoa; bổ sung CSV trong nhãn hiển thị | File .exe và .pdf.exe báo lỗi inline ngay khi chọn, không upload |
| Dung lượng tối đa 10 MB | Giữ ngưỡng hiện có 10 × 1024 × 1024 byte | 10.485.760 byte hợp lệ phía client; vượt một byte bị chặn |
| Nhập sai báo lỗi ngay trên giao diện | Theo input/change, lỗi riêng từng ô, aria-invalid/aria-describedby và live status | Lỗi cập nhật trước khi submit; giao diện desktop và viewport 390 × 844 đọc được, không tràn ngang |

Mình cũng đưa lỗi upload từ server vào khu vực file thay cho alert, giữ file khi upload thất bại; không thay đổi các API, schema, luồng phiên đăng nhập hoặc mật khẩu dùng để liên kết Google. Các phiên bản asset/cache được cập nhật đồng bộ để tải code mới.

## Kiểm tra đã chạy

```powershell
& 'C:\Users\vudin\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test --test-isolation=none tests/frontend-validation.test.cjs tests/frontend-session.test.cjs tests/frontend-text.test.cjs backend/GoogleAuthChecks/frontend-google.test.cjs
& 'C:\Users\vudin\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' frontend/build.mjs
git diff --check
```

- 26/26 kiểm tra đạt: 4 kiểm tra hành vi validation mới và 22 kiểm tra session, Google, hiển thị nội dung hiện có.
- Trước khi sửa, kiểm tra validation mới thất bại vì chưa có lỗi theo input/change. Hai harness session/Google cũ cũng thiếu window.location; mình chỉ bổ sung mock hostname localhost, giữ nguyên các assertions.
- Dùng test-isolation=none vì sandbox trên máy chặn việc Node spawn test process; không bỏ hoặc skip test.
- Build frontend và kiểm tra diff đạt.
- Trình duyệt thật chạy frontend dự án với API giả lập local, không tạo tài khoản/dữ liệu trên backend của nhóm: đã thử email sai, mật khẩu thứ 31, sửa đúng, đổi tab login/register, Enter đăng nhập, URL sai/đúng, file sai loại/quá giới hạn/đúng ngưỡng và lỗi server.
- Nhật ký API giả lập trong lượt kiểm tra nguồn chỉ có một request login hợp lệ, một request URL hợp lệ và một request file đúng ngưỡng; các trường hợp sai đã bấm gửi không tạo request. File đúng ngưỡng vẫn được chọn và URL vẫn còn sau lỗi server giả lập.
- Không ghi nhận lỗi console trong lượt kiểm tra UI; kiểm tra viewport hẹp cho modal auth và khu vực nguồn notebook đều không tràn ngang.

## Mức đáp ứng và giới hạn

Phần validation phía client của Issue #11 đã đáp ứng các tiêu chí được duyệt và các kiểm tra nêu trên. Mình đề nghị nhóm review code và nghiệm thu; báo cáo này không tự đóng issue hoặc khẳng định triển khai production hoàn tất.

- Chưa kiểm tra lưu file/đọc URL/đăng nhập trên backend PostgreSQL thật hoặc đăng nhập Google thật. API giả lập chỉ xác nhận hành vi client và xử lý lỗi.
- Server hiện chưa áp dụng giới hạn mật khẩu tối đa 30; đây là giới hạn phía client trong phạm vi issue đã duyệt. Ô mật khẩu email đăng nhập cũng kiểm tra 6–30 như đặc tả, nên tài khoản cũ có mật khẩu dài hơn 30 cần nhóm quyết định cách xử lý nếu tồn tại.
- Backend có RequestSizeLimit bằng đúng 10 MiB cho tổng request; multipart có overhead. Vì vậy client cho phép file đúng 10 MiB không chứng minh server sẽ nhận file đó. Cần xử lý giới hạn request backend ở phần việc riêng nếu nhóm muốn bảo đảm upload sát ngưỡng.
- Định dạng file phía client dựa vào phần mở rộng, không chứng minh nội dung file an toàn hoặc đọc được; backend vẫn kiểm tra/xử lý nội dung. Độ dài Unicode tính theo code point, emoji ghép có thể gồm nhiều ký tự theo cách đếm này.
- Người dùng đã xác nhận gửi GitHub sau khi xem kết quả. Code đã được push lên nhánh hung/issue-11-validation, PR #38 và báo cáo trên issue được tạo dưới tài khoản James-Lloyd20. PR chưa merge vào main. Issue #11 đã được người dùng đóng sau khi gửi báo cáo.

## Cập nhật xử lý xung đột PR #38 — 07/10/2026

- Đồng bộ `origin/main` tại `3b11c2e` bằng merge vào nhánh `hung/issue-11-validation`; xử lý xung đột tại `frontend/index.html`, `frontend/notebook.js`, `frontend/sw.js`.
- Giữ hộp thoại thêm nguồn, Gia sư AI, điều hướng và hộp thoại thông báo mới của nhóm. Chuyển validation URL/file vào hộp thoại mới; không giữ biểu mẫu cũ trùng ID.
- Kéo thả tệp phát sự kiện `change` để dùng cùng luồng validation với chọn tệp. Khi submit thiếu/sai tệp, focus nút Chọn tệp vì input file mới được ẩn.
- Đồng bộ phiên bản tài nguyên và service worker lên cache v52; giữ phiên bản auth có validation.
- 31 kiểm tra logic/session/Google/hiển thị/tutor đạt; 1 bài kiểm tra tích hợp Edge đạt với API giả lập. Bài Edge bổ sung kiểm tra chọn tệp, kéo thả quá 10 MiB, đúng ngưỡng, URL sai/đúng, chặn request sai và giữ dữ liệu khi server trả lỗi; các assertions Gia sư AI hiện có được giữ nguyên.
- Frontend build và kiểm tra diff đạt. Các giới hạn backend/Google thật đã nêu ở trên vẫn áp dụng. PR tiếp tục chờ nhóm review, chưa merge vào main.
