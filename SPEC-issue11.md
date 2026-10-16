# Đặc tả Issue #11 — Validation phía client

Trạng thái: Đình Hùng đã duyệt đặc tả và kế hoạch trong chat; triển khai theo tasks/plan.md.

Nguồn: https://github.com/tungtungsahul/MindSprint-AI-D-n/issues/11

## Mục tiêu

Hoàn thành phần Sprint 2 của Đình Hùng: kiểm tra email, độ dài mật khẩu, URL, định dạng và dung lượng file trước khi gửi server. Người dùng thấy lỗi ngay trong lúc nhập hoặc chọn file, sửa đúng thì lỗi được cập nhật/xóa ngay.

## Yêu cầu đã xác nhận

- Làm trên máy local; chuẩn bị mô tả kết quả để đăng GitHub sau khi kiểm tra.
- Mật khẩu từ 6 đến 30 ký tự, gồm chữ, số, ký tự đặc biệt. Không tự thêm yêu cầu bắt buộc có từng loại ký tự.
- Validation phản hồi theo sự kiện input; file theo sự kiện change. Không chặn việc gõ ký tự thứ 31: cho phép nhập và hiện lỗi.

## Tiêu chí nghiệm thu

| Đầu vào | Quy tắc | Kết quả cần kiểm tra |
|---|---|---|
| Email | Bắt buộc, kiểm tra định dạng email bằng khả năng có sẵn của trình duyệt | Sai hiện lỗi ngay khi nhập; đúng xóa lỗi |
| Mật khẩu | 6–30 ký tự, giữ nguyên khoảng trắng, không tự trim | 5 và 31 ký tự báo lỗi; 6 và 30 ký tự hợp lệ; nhập và dán đều được kiểm tra |
| URL nguồn notebook | URL tuyệt đối có host, giao thức HTTP hoặc HTTPS; dùng URL parser có sẵn | Sai hiện lỗi khi nhập; không gửi request khi sai |
| File notebook | Giữ các loại upload hiện có: PDF, TXT, MD, CSV; phần mở rộng không phân biệt hoa thường; tối đa 10 × 1024 × 1024 byte | Kiểm tra ngay khi chọn; sai định dạng hoặc quá giới hạn hiện lỗi tại khu vực upload |

- Bấm gửi vẫn kiểm tra lại, không gọi API với đầu vào không hợp lệ; giữ dữ liệu để người dùng sửa.
- Lỗi tiếng Việt hiển thị trong giao diện, liên kết với ô nhập bằng thuộc tính accessibility phù hợp; không dùng alert cho lỗi validation file.
- Không hiện lỗi trên những ô chưa được tương tác khi vừa mở giao diện. Sau khi bắt đầu nhập, kiểm tra ngay cả khi giá trị chưa hoàn chỉnh; khi gửi kiểm tra cả ô còn trống.
- Giữ hoạt động đăng nhập, đăng ký, Google và notebook hiện có. Giới hạn 30 áp dụng ô mật khẩu email; mật khẩu liên kết tài khoản Google cần xác nhận riêng nếu muốn đổi.
- Đếm độ dài theo ký tự Unicode (code point); chữ có dấu dựng sẵn, số và ký tự đặc biệt thông thường đều được tính. Các chuỗi emoji ghép có thể gồm nhiều code point.

## Cách làm và cấu trúc

Người dùng đã clone lại vào `C:\Data\IT_Code\Web_code\LapTrinhWeb\DangTrienKhai\MindSprint-AI-D-n`. Kiểm tra ngày 07/10/2026: working tree sạch, nhánh main tại commit `05f3a0b`, không còn merge dang dở. Triển khai tại bản local này trên nhánh `hung/issue-11-validation`.

- `frontend/auth.js`: validation email và mật khẩu trong modal dùng chung.
- `frontend/notebook.js`: validation URL/file và phản hồi lỗi hiện có.
- CSS hiện có: chỉ bổ sung nếu cần để hiển thị lỗi rõ ràng.
- `tests/frontend-validation.test.cjs`: kiểm tra các biên và việc chặn API khi dữ liệu sai, dùng Node test runner hiện có.
- `ISSUE-11-REPORT.md`: mô tả thay đổi, kết quả kiểm tra, mức đáp ứng và giới hạn thực tế để đăng GitHub.

Tận dụng HTML constraint validation, URL parser và helper phản hồi lỗi đã có; không thêm thư viện hay framework validation.

## Quy ước code

Giữ JavaScript thuần, IIFE, cách đặt tên và indentation hiện có; lỗi dùng textContent hoặc helper escape hiện có. Ví dụ phong cách:

```js
function passwordError(value) {
    const length = Array.from(value).length;
    return length < 6 || length > 30
        ? 'Mật khẩu phải có từ 6 đến 30 ký tự.'
        : '';
}
```

## Lệnh và kiểm tra

Các lệnh dưới chạy từ thư mục project local nêu trên; đường dẫn Node đã có trên máy:

```powershell
& 'C:\Users\vudin\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test --test-isolation=none tests/frontend-validation.test.cjs
& 'C:\Users\vudin\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test --test-isolation=none tests/frontend-session.test.cjs tests/frontend-text.test.cjs backend/GoogleAuthChecks/frontend-google.test.cjs
& 'C:\Users\vudin\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' frontend/build.mjs
git diff --check
```

Kiểm tra trình duyệt thật: gõ/dán email và mật khẩu, sửa lỗi, đổi chế độ login/register, nhập URL, chọn file hợp lệ/sai định dạng/quá giới hạn; kiểm tra bàn phím và lỗi liên kết đúng ô. Chỉ báo những kiểm tra thực sự đã chạy. Nếu kiểm tra tích hợp cần tài khoản hoặc môi trường chưa có, ghi rõ phần chưa kiểm chứng.

## Ranh giới

- Luôn: giữ thay đổi trong phạm vi Issue #11; kiểm tra dữ liệu trước request; giữ validation server; review diff và kiểm tra trước khi giao.
- Hỏi trước: thay đổi quy tắc nghiệp vụ chưa xác nhận, đổi schema, thêm dependency, thay đổi flow Google, xử lý thay đổi chưa publish của bản local cũ.
- Không thực hiện: force push, push trực tiếp main, tự merge Pull Request, xóa bản local cũ, đăng bí mật hoặc tuyên bố issue hoàn tất khi chưa đủ bằng chứng.

Việc push nhánh, tạo Pull Request và đăng bình luận GitHub cần được chốt sau khi có diff và báo cáo kiểm tra cụ thể. Nội dung báo cáo sẽ phân biệt yêu cầu đã đáp ứng và điều còn thiếu; không tự đóng issue.

## Điểm cần duyệt

1. Dùng bản clone local đã được người dùng tạo lại trong thư mục cũ và nhánh riêng cho Issue #11.
2. Quy tắc và tiêu chí nghiệm thu trong bản này, bao gồm phạm vi mật khẩu email 6–30 ký tự.

Backend đang chỉ có giới hạn mật khẩu tối thiểu 6 ký tự. Giới hạn tối đa 30 trong đặc tả này là yêu cầu validation phía client; chưa coi đó là giới hạn được server thực thi. File đúng ngưỡng 10 MiB có thể còn vướng giới hạn tổng request multipart của backend; phải ghi nhận riêng nếu tái hiện được.
