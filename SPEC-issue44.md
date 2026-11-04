# Đặc tả Issue #44 — [Test][NFR-03] Kiểm thử xác thực, phân quyền và cô lập tài khoản

Trạng thái: Đã hoàn thành triển khai test suite và xác minh trên backend chính ASP.NET Core 8 + PostgreSQL 17.
Người thực hiện: `phandien665-prog`
Milestone: Sprint 4 - Tuần 4: Kiểm thử, triển khai, đóng gói (P0)
Nguồn: https://github.com/tungtungsahul/MindSprint-AI-D-n/issues/44
Tài liệu liên quan: [docs/architecture/non-functional-requirements.md](docs/architecture/non-functional-requirements.md#nfr-03), [docs/architecture/sprint-4-test-plan.md](docs/architecture/sprint-4-test-plan.md), [docs/decisions/0003-identity-and-account-isolation.md](docs/decisions/0003-identity-and-account-isolation.md).

---

## 1. Mục tiêu

Kiểm chứng toàn diện các cam kết phi chức năng **NFR-03** đối với hệ thống xác thực JWT, cơ chế xoay vòng Refresh Token (Token Rotation), bảo mật Google Sign-In và tính cô lập dữ liệu cá nhân giữa các người dùng (Anti-IDOR) trên backend chính **ASP.NET Core 8 + PostgreSQL**, không dùng kết quả FastAPI/SQLite thay thế.

---

## 2. Tiêu chí nghiệm thu (Acceptance Criteria)

| Thành phần | Quy tắc kiểm thử | Kết quả mong đợi |
|---|---|---|
| **JWT Security** | Kiểm tra chữ ký bí mật, tính toàn vẹn, Issuer, Audience và hạn dùng | • Token hợp lệ xác minh đúng `NameIdentifier` (UserId).<br>• Token giả mạo chữ ký (attacker HMAC key) bị từ chối (401).<br>• Token sai Issuer hoặc sai Audience bị từ chối (401).<br>• Token quá hạn (ngoài ClockSkew) bị từ chối (401). |
| **Cô lập dữ liệu Tasks (Kanban)** | User B thao tác trên task của User A | • `GET /api/tasks`: User B chỉ thấy task của B, danh sách rỗng đối với task A.<br>• `PUT /api/tasks/{taskA.Id}`: trả về 404.<br>• `PATCH /api/tasks/{taskA.Id}/move`: trả về 404.<br>• `DELETE /api/tasks/{taskA.Id}`: trả về 404; dữ liệu User A nguyên vẹn. |
| **Cô lập dữ liệu Flashcards** | User B thao tác trên thẻ học của User A & thẻ hệ thống | • `GET /api/flashcards`: User B không thấy thẻ riêng của A; thấy thẻ hệ thống Oxford (`OwnerId == null`).<br>• `PUT /api/flashcards/{cardA.ExternalId}`: trả về 404.<br>• `DELETE /api/flashcards/{cardA.ExternalId}`: trả về 404.<br>• Thẻ hệ thống không cho phép sửa/xóa bởi người dùng thông thường (trả về 404). |
| **Cô lập dữ liệu Review (SRS)** | User B ghi nhận tiến độ thẻ của User A | • `POST /api/review`: gửi `cardId` của User A trả về 404 Not Found. |
| **Cô lập Sổ tay (Notebooks)** | User B truy cập sổ tay, nguồn và ghi chú của User A | • `GET /api/notebooks`: User B không thấy sổ tay của A.<br>• `GET /api/notebooks/{id}/sources`: trả về 404.<br>• `GET /api/notebooks/{id}/notes`: trả về 404.<br>• `DELETE /api/notebooks/{id}`: trả về 404. |
| **Cô lập Thống kê học tập (Study)** | User B xem dữ liệu streak và ngày học của User A | • `GET /api/study/days`: chỉ trả về ngày học của B.<br>• `GET /api/study/streak`: streak của B là 0, không kế thừa dữ liệu của A. |
| **Refresh Token Lifecycle & Concurrency** | Tạo, xác thực, xoay vòng, thu hồi và chống Race Condition | • `CreateRefreshTokenAsync`: sinh token mật mã ngẫu nhiên 64 ký tự.<br>• `RotateAsync`: cấp token mới, đánh dấu thu hồi token cũ (`IsRevoked = true`).<br>• Dùng lại token cũ (Replay Attack): bị từ chối (null/401).<br>• Token hết hạn hoặc token đã bị thu hồi: từ chối.<br>• **Bảo vệ Concurrency (Race Condition):** 10 request song song gọi `RotateAsync` với cùng 1 refresh token: **duy nhất 1 request thành công**, 9 request bị từ chối. |
| **Google Sign-In Flow** | Nonce, Origin và liên kết tài khoản | • Nonce giả, nonce hết hạn (> 5 phút), replay nonce bị từ chối.<br>• Origin không nằm trong cấu hình whitelist bị chặn 403.<br>• Email đã tồn tại yêu cầu xác minh mật khẩu trước khi liên kết. |
| **Live Database Engine** | Kiểm thử trực tiếp trên PostgreSQL | Toàn bộ các kiểm tra ACID, ràng buộc khóa ngoại, Index Unique và cô lập IDOR thực thi chuẩn xác trên PostgreSQL 17 thật của staging/production. |
