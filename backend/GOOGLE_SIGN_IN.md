# Đăng nhập Google cho MindSprintAI

Đã thêm Google Identity Services vào hộp đăng nhập/đăng ký. Google cấp ID token;
backend xác minh token rồi cấp JWT và refresh token của MindSprintAI. Người dùng
Google dùng chung quyền truy cập Sổ tay AI, flashcard, SRS, lịch học, thống kê và
Kanban như tài khoản email. Quyền dùng AI vẫn phụ thuộc cấu hình/quota AI của server.

## Bật tính năng

Trên máy hiện tại, Client ID đã được lưu vào
`backend/MindSprint.Api/appsettings.Development.json` (file cấu hình local được
Git bỏ qua). `dotnet run` theo profile Development sẽ tự đọc cấu hình này;
không cần đặt biến môi trường lại mỗi lần chạy. Cấu hình production vẫn dùng
biến môi trường như bước 6 bên dưới.

Kiểm tra ngày 2026-10-06: backend đã bật, nút Google và cửa sổ đăng nhập thật
hiện được. Google SDK báo `The given origin is not allowed for the given client ID.`
cho trang local. Trong Google Cloud, mở đúng Web Client đã cung cấp và thêm hai
Authorized JavaScript origins ở bước 4; sau đó lưu và tải lại trang. Client ID trong
code không tự cập nhật danh sách origin trên Google Cloud.

1. Mở [Google Cloud Console](https://console.cloud.google.com/), chọn/tạo project.
2. Trong **Google Auth Platform**, cấu hình Branding (tên ứng dụng, email hỗ trợ),
   Audience và Data Access. Đăng nhập chỉ cần thông tin cơ bản `openid`, `email`,
   `profile`; không xin quyền Gmail/Drive. Nếu ứng dụng ở chế độ Testing, thêm tài
   khoản được phép thử vào Test users theo cấu hình Audience của project.
3. Trong **Clients**, tạo OAuth client loại **Web application**.
4. Thêm **Authorized JavaScript origins** chính xác:
   - `http://localhost:5500`
   - `http://127.0.0.1:5500`
   - Khi triển khai: origin HTTPS thực tế của frontend, không thêm đường dẫn `/frontend/`.
5. Sao chép **Client ID** dạng `...apps.googleusercontent.com`.
   Luồng popup/JavaScript callback này không cần Client Secret hay redirect URI.
6. Cấu hình backend bằng biến môi trường PowerShell, rồi khởi động lại backend:

   ```powershell
   $env:Google__ClientId = '731168499491-73c4013mfesra4n8debc8imccnabcfum.apps.googleusercontent.com'
   dotnet run --project backend/MindSprint.Api/MindSprint.Api.csproj
   ```

   Cho môi trường thật, đặt các biến này trong cấu hình hosting; giữ Client ID
   khớp project đã tạo. Không cần sửa `appsettings.json` chứa cấu hình riêng.

7. Nếu frontend chạy ở origin khác hai địa chỉ local trên, cấu hình thêm allowlist
   backend (danh sách này **thay thế** hai origin mặc định):

   ```powershell
   $env:Google__AllowedOrigins__0 = 'https://ten-mien-cua-ban.example'
   # Thêm __1, __2 ... nếu có nhiều origin được phép.
   ```

8. Mở lại web, vào **Đăng nhập** hoặc **Đăng ký**. Nút Google chính thức xuất hiện
   khi Client ID đã được cấu hình. Chọn tài khoản và xác nhận trên cửa sổ Google.
   Không cần nhập mật khẩu Google vào MindSprintAI.

Kiểm tra cấu hình: `GET http://localhost:5000/api/auth/google/config` trả
`enabled: true` khi Client ID được đặt. `enabled: false` nghĩa là chưa bật;
đăng nhập email/Demo vẫn hoạt động. `enabled: true` không tự chứng minh Client ID
hay Authorized origins hợp lệ — cần thử đăng nhập thật để xác nhận.

## Tài khoản đã tồn tại

- Email mới: tự tạo tài khoản khi ID token Google hợp lệ và email đã được xác minh.
- Email đã có tài khoản MindSprintAI: hộp thoại yêu cầu mật khẩu **MindSprintAI
  hiện tại** để liên kết, giữ nguyên User ID, sổ tay và dữ liệu học tập.
- Sau khi liên kết, đăng nhập Google dùng `sub` ổn định, không dựa riêng vào email.
- Email đã liên kết Google khác: không tự chuyển liên kết hoặc gộp dữ liệu.
- Tài khoản tạo bằng Google không có mật khẩu dùng chung hay mật khẩu mặc định.
  Nếu chưa có chức năng đặt mật khẩu, tiếp tục dùng Google để đăng nhập tài khoản đó.

## API và bảo vệ phiên

- `GET /api/auth/google/config`: Client ID công khai, không chứa secret.
- `GET /api/auth/google/challenge`: nonce ngẫu nhiên, hết hạn sau 5 phút.
- `POST /api/auth/google`: JSON `{ credential, nonce, existingPassword? }`.
- Trả session `{ token, refreshToken, user: { id, email, displayName } }` giống
  đăng nhập email; Google credential không được lưu vào localStorage/DB/log.
- Xác minh chữ ký, issuer, audience, hạn token bằng thư viện Google.Apis.Auth;
  kiểm tra email verified và nonce trùng với lượt đăng nhập do backend cấp.
- Nonce chỉ dùng một lần sau khi đăng nhập thành công; vẫn dùng được cho bước
  chứng minh mật khẩu khi liên kết. Nonce được giữ trong RAM có giới hạn dung lượng.
- Challenge/login kiểm tra Origin chính xác và giới hạn chung 20 yêu cầu/phút/IP.
  JSON gọi thủ công cũng cần header `Origin` thuộc allowlist.
- Migration `20261006000000_AddGoogleSignIn` chỉ thêm cột nullable GoogleSubject và
  unique filtered index; không thay dữ liệu/mật khẩu hiện có. Startup áp dụng migration.
- Khi dùng nhiều instance backend, cần chuyển nonce sang kho dùng chung với thao
  tác consume nguyên tử (ví dụ Redis) và giới hạn tốc độ dùng chung. RAM hiện tại
  phù hợp triển khai một instance; khởi động lại làm các lượt đang chờ hết hiệu lực.

## Kiểm thử

```powershell
node --test tests/frontend-session.test.cjs tests/frontend-text.test.cjs
node --test backend/GoogleAuthChecks/frontend-google.test.cjs
dotnet run --project backend/GoogleAuthChecks/GoogleAuthChecks.csproj --artifacts-path "$env:TEMP/mindsprint-google-check-artifacts"
```

Thêm `-- --live-keys` vào lệnh dotnet để kiểm tra chữ ký giả qua khóa công khai
Google (cần mạng, không cần Client ID thật hoặc tài khoản Google).

Backend checks dùng SQLite trong bộ nhớ và validator giả cho các tình huống
tài khoản; có kiểm tra token sai định dạng, sai audience/issuer và hết hạn qua validator Google thật. Không thay
người dùng thật. Kiểm tra trình duyệt dùng SDK/API giả cho các luồng UI; không
thay thế kiểm tra đăng nhập Google thật sau khi có Client ID.

Tài liệu chính thức:
[Tạo Client ID](https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid),
[Nút Google](https://developers.google.com/identity/gsi/web/guides/display-button),
[Xác minh ID token](https://developers.google.com/identity/gsi/web/guides/verify-google-id-token).
