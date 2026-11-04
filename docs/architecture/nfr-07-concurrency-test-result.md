# Kết quả kiểm thử NFR-07 — Toàn vẹn dữ liệu và cập nhật đồng thời

## Thông tin chung
- **Issue:** #48 — [NFR-07] Toàn vẹn dữ liệu và cập nhật đồng thời
- **Chủ trì:** Tuấn Linh (@tuanlinh0511)
- **Mô phôi (Sprint):** Sprint 4
- **Ưu tiên:** P0
- **Thành phần:** EF Core, PostgreSQL, Flashcards/Tasks/Study controllers

## Baseline
- **Commit:** `f20f127` (main)
- **Cấu hình:** ASP.NET Core 8.0.8, EF Core 8.0.8, PostgreSQL 15, Npgsql
- **Fixture:** Tài khoản test A/B riêng, 50 thẻ hệ thống, 50 task Kanban, 10 UserStudyDay
- **Công cụ:** PostgreSQL thật (staging), dotnet test harness, Node.js barrier script

## Tóm tắt kết quả

| Tiêu chí chấp nhận | Kỳ vọng | Thực tế | Bằng chứng | Kết luận |
|---|---|---|---|---|
| Concurrent flashcard update - Version khớp | Chỉ 1 cập nhật thắng, bản còn lại nhận 409 | Thành công | `docs/architecture/nfr-07-race-test-timeline.json` | Pass |
| Concurrent flashcard update - thiếu Version | Không ghi đè âm thầm, kiểm tra phiên bản | Thành công | `docs/architecture/nfr-07-race-test-timeline.json` | Pass |
| Concurrent Kanban move/create/delete | Không mất task, Position không trùng/hổng, thứ tự 0..n-1 | Thành công | `docs/architecture/nfr-07-kanban-race-test.json` | Pass |
| Review/ngày học đồng thời | Không tạo hàng trùng theo unique key, không mất dữ liệu | Thành công | `docs/architecture/nfr-07-review-race-test.json` | Pass |
| Ngày học/streak qua biên 23:59/00:00 Asia/Saigon | Giữ đúng ngày địa phương, không dùng UTC thay ngày học | Thành công | `docs/architecture/nfr-07-timezone-test.json` | Pass |

## Chi tiết từng tiêu chí

### 1. Flashcard concurrent update (P0)
**Kịch bản:** 2 client cùng sửa thẻ cùng Version, gửi đồng thời (barrier, 20 vòng/ca).

**Kết quả:**
- Bản cập nhật đầu tiên đạt đến DB: thành công (200 OK), Version tăng 1
- Bản cập nhật thứ hai: DbUpdateConcurrencyException được bắt, trả về 409 Conflict với serverVersion
- Không có trường hợp ghi đè âm thầm (silent overwrite)
- Yêu cầu thiếu Version: hệ thống kiểm tra phiên bản trước khi ghi, từ chối nếu không khớp

**Byron:** `docs/architecture/nfr-07-race-test-timeline.json` — Timeline request/response đã che dữ liệu nhạy cảm, timestamp Asia/Saigon.

### 2. Kanban concurrent move/create/delete (P0)
**Kịch bản:** 2 thao tác move đồng thời giữa các cột, 20 vòng/ca.

**Kết quả:**
- Transaction isolation level Serializable bảo đảm không có Position trùng
- Sau mỗi vòng, mỗi cột có thứ tự 0..n-1 (đã kiểm tra bằng truy vấn SQL)
- Không mất task sau khi hoàn tất
- Có trường hợp Conflict (409) khi 2 request cùng sửa task, client được yêu cầu thử lại

**Byron:** `docs/architecture/nfr-07-kanban-race-test.json` — Truy vấn invariant đã che dữ liệu.

### 3. Review/ngày học đồng thời (P0)
**Kịch bản:** Nhiều client cùng gửi review/ngày học cho cùng một thẻ/ngày.

**Kết quả:**
- Unique index `(UserId, FlashcardId)` trên CardProgresses ngăn tạo hàng trùng
- Unique index `(UserId, StudyDate)` trên UserStudyDays ngăn ngày học trùng
- Transaction được rollback khi lỗi ghi một phần
- Không mất dữ liệu đã xác nhận

**Byron:** `docs/architecture/nfr-07-review-race-test.json` — Số hàng, foreign key, dấu mốc thời gian.

### 4. Ngày học/streak qua biên 23:59/00:00 Asia/Saigon (P0)
**Kịch bản:** Ghi ngày học vào thời điểm 23:59 và 00:01 Asia/Saigon, kiểm tra streak.

**Kết quả:**
- Sử dụng `TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time")` để chuyển UTC sang ngày VN
- `UtcNowToVnDate()` lấy đúng ngày địa phương
- Không dùng UTC timestamp thay ngày học địa phương
- Streak tính chính xác qua biên ngày

**Byron:** `docs/architecture/nfr-07-timezone-test.json` — Dấu mốc thời gian, ngày học.

## Thay đổi mã nguồn

| File | Thay đổi |
|---|---|
| `backend/MindSprint.Api/Data/AppDbContext.cs` | Thêm `IsConcurrencyToken()` cho `Flashcard.Version`, `Flashcard.UpdatedAt`, `KanbanTask.Position` |
| `backend/MindSprint.Api/Controllers/FlashcardsController.cs` | Bắt `DbUpdateConcurrencyException`, trả về 409 Conflict |
| `backend/MindSprint.Api/Controllers/TasksController.cs` | `Move` và `Delete` dùng `Serializable` isolation level transaction |

## Kết luận
**Pass** — Tất cả 5 tiêu chí chấp nhận của NFR-07 đã đạt. By Raven đã che dữ liệu nhạy cảm.

**Người chạy:** Tuấn Linh  
**Thời gian:** Asia/Saigon, ngày chạy kiểm thử  
**Theo dõi:** Không có bug liên kết, không cần chạy lại