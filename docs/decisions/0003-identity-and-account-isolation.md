# ADR-003: JWT, refresh token và ranh giới tài khoản

**Trạng thái:** Ghi nhận cơ chế hiện có tại main/9ba7acd; các yêu cầu bảo mật cần nghiệm thu. **Ngày:** 12/10/2026.

## Bối cảnh

Đăng nhập email và Google cần dùng chung tài khoản/dữ liệu. API xác minh JWT; tài nguyên cá nhân gắn UserId/OwnerId. GoogleSubject dùng nhận dạng ổn định; email đã có tài khoản yêu cầu mật khẩu khi liên kết.

## Quyết định

Giữ access JWT ngắn hạn + refresh token server-side có rotation/revoke. Controllers lọc theo user claim, không tin ID user do client gửi. UI đổi tài khoản phải thay state và bỏ response cũ. Thẻ hệ thống là ngoại lệ được đọc chung, không được người dùng sửa.

## Phương án được cân nhắc trong tài liệu

- Cookie session HttpOnly: có thể giảm lộ token do đọc localStorage nhưng cần thiết kế CSRF/cross-origin/cookie; chưa phải hiện trạng.
- Google credential làm session ứng dụng: không giải quyết thống nhất email login và quyền nội bộ.
- JWT/refresh đang có: phù hợp client REST, nhưng cần ghi rõ giới hạn thu hồi và XSS.

## Hệ quả và kiểm chứng

localStorage không bảo vệ token trước XSS. Revoke refresh không vô hiệu ngay JWT đã cấp. Rotation server chưa có concurrency protection rõ ràng; single-flight client trong một tab không đủ. PasswordHasher là cơ chế hash mật khẩu, không phải mã hóa có thể giải ngược.

Kiểm chứng NFR-03/04/05/07/11/13; đo ClockSkew thực khi test hết hạn. Production demo endpoint và log auth cần kiểm thử riêng.

**Nguồn:** [TokenService](https://github.com/tungtungsahul/MindSprint-AI-D-n/blob/9ba7acd2de05bf017ad5c2711644c9ee98bd6542/backend/MindSprint.Api/Services/TokenService.cs), [Google sign-in](https://github.com/tungtungsahul/MindSprint-AI-D-n/blob/9ba7acd2de05bf017ad5c2711644c9ee98bd6542/backend/GOOGLE_SIGN_IN.md), [api.js](https://github.com/tungtungsahul/MindSprint-AI-D-n/blob/9ba7acd2de05bf017ad5c2711644c9ee98bd6542/frontend/api.js), [auth.js](https://github.com/tungtungsahul/MindSprint-AI-D-n/blob/9ba7acd2de05bf017ad5c2711644c9ee98bd6542/frontend/auth.js).
