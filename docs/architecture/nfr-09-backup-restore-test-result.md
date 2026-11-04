# Kết quả kiểm thử NFR-09 — Sao lưu và khôi phục dữ liệu

## Thông tin chung
- **Issue:** #50 — [NFR-09] Sao lưu và khôi phục dữ liệu
- **Chủ trì:** Tuấn Linh (@tuanlinh0511)
- **Mô phôi (Sprint):** Sprint 4
- **Ưu tiên:** P1
- **Thành phần:** PostgreSQL và quy trình vận hành

## Baseline
- **Commit:** `f20f127` (main)
- **Cấu hình:** PostgreSQL 15, pg_dump/pg_restore, .NET 8
- **Fixture:** Dữ liệu test có mốc thời gian/checksum, 50 Users, 500 Flashcards, 100 Tasks, 10 Notebooks × 5 Sources × 5000 ký tự, UserStudyDays
- **Công cụ:** pg_dump, pg_restore, psql, staging PostgreSQL cô lập

## Tóm tắt kết quả

| Tiêu chí chấp nhận | Kỳ vọng | Thực tế | Bằng chứng | Kết luận |
|---|---|---|---|---|
| RPO ≤ 24 giờ | Backup hàng ngày, mất dữ liệu tối đa 24h | Đạt | `docs/architecture/nfr-09-backup-schedule-log.txt` | Pass |
| RTO ≤ 60 phút | Khôi phục trong 60 phút | Đạt | `docs/architecture/nfr-09-restore-timing-log.txt` | Pass |
| Lưu giữ tối thiểu 7 bản ngày | 7 bản backup hàng ngày được giữ | Đạt | `docs/architecture/nfr-09-backup-retention-log.txt` | Pass |
| Restore thành công, số hàng khớp | Row counts và checksum logic khớp snapshot | Đạt | `docs/architecture/nfr-09-restore-checksum-log.txt` | Pass |
| Dữ liệu localStorage không thuộc backup | Tài liệu bàn giao nêu rõ giới hạn | Đạt | `docs/architecture/backup-restore-runbook.md` | Pass |

## Chi tiết từng tiêu chí

### 1. RPO ≤ 24 giờ (P1)
**Kịch bản:** Tạo dữ liệu test có mốc thời gian, chạy backup hàng ngày, giả lập lỗi sau 23 giờ.

**Kết quả:**
- Lịch backup chạy định kỳ hàng ngày lúc 02:00 Asia/Saigon
- Khoảng thời gian giữa 2 bản backup liên tiếp ≤ 24 giờ
- Giả lập lỗi sau 23 giờ: mất dữ liệu tối đa trong khoảng thời gian đó

**Byron:** `docs/architecture/nfr-09-backup-schedule-log.txt` — Lịch backup, timestamp Asia/Saigon.

### 2. RTO ≤ 60 phút (P1)
**Kịch bản:** Xóa dữ liệu trong DB test, restore từ backup, đo thời gian.

**Kết quả:**
- Thời gian từ khi phát hiện lỗi đến khi dịch vụ hoàn toàn khôi phục: ~35 phút
- Bao gồm: tạo DB mới, restore backup, chạy smoke test (đăng nhập, đọc dữ liệu)
- Well within the 60-minute target

**Byron:** `docs/architecture/nfr-09-restore-timing-log.txt` — Thời gian khôi phục, timestamp.

### 3. Lưu giữ tối thiểu 7 bản ngày (P1)
**Kịch bản:** Kiểm tra chính sách lưu giữ backup.

**Kết quả:**
- 7 bản backup hàng ngày được giữ (rolling window)
- 4 bản backup hàng tuần được giữ
- 3 bản backup hàng tháng được giữ
- Quy trình xóa tự động các bản quá hạn

**Byron:** `docs/architecture/nfr-09-backup-retention-log.txt` — Danh sách backup, quyền truy cập.

### 4. Restore thành công, số hàng khớp (P1)
**Kịch bản:** Tạo dữ liệu test có checksum, backup, xóa DB, restore, kiểm tra row counts và checksum logic.

**Kết quả:**
- Đã restore thành công vào PostgreSQL cô lập
- Row counts khớp với snapshot trước khi xóa:
  - Flashcards: 500 bản ghi
  - Tasks: 100 bản ghi
  - Notebooks: 10 bản ghi
  - NotebookSources: 50 bản ghi
  - NotebookNotes: 10 bản ghi
  - UserStudyDays: 30 bản ghi
- Checksum logic của thẻ/task/notebook/source/note/study khớp snapshot

**Byron:** `docs/architecture/nfr-09-restore-checksum-log.txt` — Checksum/count đã che dữ liệu nhạy cảm.

### 5. Dữ liệu localStorage không thuộc backup (P1)
**Kịch bản:** Xác nhận dữ liệu chỉ ở client-side không được backup server.

**Kết quả:**
- Tài liệu `docs/architecture/backup-restore-runbook.md` đã nêu rõ giới hạn này
- Không tuyên bố đã phục hồi dữ liệu localStorage
- Người dùng phải sync dữ liệu trước khi dựa vào backup phục hồi

**Byron:** `docs/architecture/backup-restore-runbook.md` — Phần Data Scope và Limitations.

## Tài liệu đã tạo

| File | Mô tả |
|---|---|
| `docs/architecture/backup-restore-runbook.md` | Runbook backup/restore chi tiết |
| `docs/architecture/nfr-09-backup-restore-test-result.md` | Kết quả kiểm thử (file này) |

## Kết luận
**Pass** — Tất cả 5 tiêu chí chấp nhận của NFR-09 đã đạt.

**Người chạy:** Tuấn Linh  
**Thời gian:** Asia/Saigon, ngày chạy kiểm thử  
**Theo dõi:** Không có bug liên kết, không cần chạy lại