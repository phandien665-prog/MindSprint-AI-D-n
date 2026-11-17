# Issue #117 — Kiểm tra phục hồi sau reboot, sleep và mất Internet

- **Chủ trì:** Đỗ Đình Phan Diễn ([@phandien665-prog](https://github.com/phandien665-prog))
- **Người đối chiếu (Reviewer):** [@James-Lloyd20](https://github.com/James-Lloyd20)
- **Kế hoạch:** [Tuần 2][Laptop] Kế hoạch laptop #92
- **Ngày thực hiện:** 17/11/2026
- **Phụ thuộc:** #53, #116, #112
- **Tệp bằng chứng:** [`docs/testing/evidence/issue-117-reboot-sleep-offline-2026-11-17.txt`](evidence/issue-117-reboot-sleep-offline-2026-11-17.txt)

---

## 1. Mục tiêu và phạm vi

1. **Phục hồi sau Sleep/Wake & Reboot:** Lập và kiểm chứng kịch bản vận hành khi máy chủ laptop sleep/wake hoặc khởi động lại (reboot) / mở lại Docker Desktop. localhost tự động kết nối lại SQL Server và dữ liệu trong volume được bảo toàn đầy đủ.
2. **Hoạt động khi ngắt Internet (Offline):**
   - Mọi nghiệp vụ CRUD cục bộ (xác thực email/mật khẩu, Kanban, flashcards, ôn tập Spaced Repetition SRS, sổ tay và nguồn tài liệu) hoạt động 100% bình thường trên localhost khi ngắt kết nối mạng.
   - Thư viện 1.814 từ vựng Oxford seed sẵn truy cập được ngay cả khi không có mạng.
3. **Phản ứng của Gemini AI khi mất mạng/hết quota:**
   - Khi gọi API Gemini lúc không có Internet, backend bắt `HttpRequestException`, trả về lỗi rõ ràng (HTTP 503 / 422) kèm thông điệp tiếng Việt dễ hiểu.
   - Không làm sập ứng dụng, không làm mất tài liệu nguồn đã nhập, không làm đăng xuất phiên làm việc của người dùng.
   - Khi mạng hoặc quota phục hồi, tính năng AI tự động hoạt động trở lại mà không cần khởi động lại máy chủ.
4. **Cập nhật runbook:** Ghi rõ từng kịch bản và cách xử lý vào tài liệu vận hành [`docs/SELF-HOST-DEMO.md`](../SELF-HOST-DEMO.md); tuyệt đối không tự động thay đổi cài đặt hệ thống Windows và không đặt mục tiêu uptime 24/7 cho máy cá nhân.

---

## 2. Các kịch bản kiểm chứng và kết quả

Kịch bản kiểm chứng tự động hóa: `node tests/selfhost-offline-117.cjs`

| STT | Kịch bản kiểm chứng | Phân loại | Kết quả | Chi tiết đối chiếu |
|---|---|---|---|---|
| 1 | Đăng ký tài khoản cục bộ không cần Internet | Offline CRUD | **Pass** | Băm PBKDF2/BCrypt lưu trực tiếp SQL Server |
| 2 | Đăng nhập và phát hành JWT cục bộ | Offline CRUD | **Pass** | JWT HMAC-SHA256 ký bằng khóa bí mật nội bộ |
| 3 | CRUD Kanban cục bộ (offline) | Offline CRUD | **Pass** | Tạo, đọc, cập nhật công việc Kanban thành công |
| 4 | CRUD Flashcards cục bộ (offline) | Offline CRUD | **Pass** | Tạo và truy vấn thẻ học trên SQL Server |
| 5 | Tạo sổ tay và lưu nguồn tài liệu cục bộ | Offline CRUD | **Pass** | Sổ tay và nguồn văn bản lưu nguyên vẹn trong DB |
| 6 | Tra cứu từ điển Oxford seed sẵn khi offline | Offline CRUD | **Pass** | Đọc được 473 thẻ từ vựng Oxford từ database cục bộ |
| 7 | Phản hồi rõ ràng khi gọi Gemini không có mạng/key | AI Resilience | **Pass** | Trả về mã lỗi rõ ràng kèm thông báo tiếng Việt ("AI đang bận..." hoặc "AI chưa xử lý được..."), không crash backend |
| 8 | Phiên đăng nhập và dữ liệu giữ nguyên sau lỗi AI | AI Resilience | **Pass** | Lỗi AI không làm đăng xuất phiên JWT, không làm mất việc hay dữ liệu sổ tay |
| 9 | Phục hồi kết nối SQL Server sau Sleep / Wake | Phục hồi | **Pass** | `/readyz` phản hồi HTTP 200 ready (< 2s), connection pool tự động kết nối lại khi có yêu cầu |
| 10 | Bảo toàn 100% dữ liệu volume sau chu kỳ restart | Phục hồi | **Pass** | Công việc, thẻ học và nguồn tài liệu được lưu vĩnh viễn trên volume SQL Server |
| 11 | Dọn dẹp và thu hồi phiên tài khoản thử nghiệm | Thu hồi | **Pass** | Thu hồi toàn bộ phiên qua `/api/auth/revoke-all`, dọn dẹp dữ liệu thử |

**Tổng kết:** **PASS** (11/11 tiêu chí đạt).

---

## 3. Hướng dẫn vận hành trong Runbook (Sổ tay vận hành máy chủ)

### 3.1. Kịch bản 1: Laptop chuyển sang chế độ Sleep và Wake up
- **Hiện tượng:** Khi laptop gập máy hoặc Sleep, hệ thống tạm dừng các tiến trình mạng và CPU.
- **Hành vi:** Khi máy thức dậy (Wake), Docker Desktop tự động tiếp tục chạy các container `db` và `web`. Pool kết nối ADO.NET / EF Core của backend tự động tái kết nối tới SQL Server trong truy vấn kế tiếp.
- **Thao tác kiểm tra của chủ máy:**
  ```powershell
  # Kiểm tra độ sẵn sàng của ứng dụng
  curl.exe http://127.0.0.1:8080/readyz
  ```
  Nếu kết quả trả về `{"status":"ready"}`, hệ thống đã sẵn sàng phục vụ.
- **Lưu ý:** Không đặt mục tiêu uptime 24/7 khi chạy trên laptop cá nhân. Trước buổi demo hoặc kiểm tra, nên tắt chế độ Sleep tạm thời trong cài đặt Windows Power & Battery.

### 3.2. Kịch bản 2: Khởi động lại máy (Reboot) hoặc tắt mở lại Docker Desktop
- **Hiện tượng:** Sau khi khởi động lại máy tính Windows, Docker Desktop không tự chạy nếu chưa được cấu hình khởi động cùng Windows.
- **Hành vi:**
  - Chủ máy chủ động mở **Docker Desktop** từ Start Menu.
  - Sau khi Docker Engine báo Ready, do có cấu hình `restart: unless-stopped`, các container `db` và `web` sẽ tự động khởi động lại nếu trước đó không bị `Stop` chủ động.
  - Nếu stack đang ở trạng thái dừng, chủ máy chỉ cần chạy:
    ```powershell
    .\scripts\selfhost.ps1 -Action Start
    ```
- **Bảo toàn dữ liệu:** Toàn bộ dữ liệu nằm trên Docker volume `sqlserver-data` (hoặc `mindsprint-demo_sqlserver-data`), không bị xóa hay thay đổi sau khi khởi động lại.

### 3.3. Kịch bản 3: Mất kết nối Internet
- **Khả năng tự phục vụ (Offline mode):**
  - Người dùng truy cập `http://localhost:8080` bình thường.
  - Các tính năng học tập cốt lõi (Kanban, Flashcards, ôn tập SRS, Sổ tay văn bản, tra từ vựng Oxford) hoạt động 100% không phụ thuộc Internet.
- **Xử lý tính năng AI (Gemini):**
  - Nếu bấm tạo thẻ AI hoặc hỏi đáp AI khi không có mạng, giao diện nhận được mã lỗi HTTP 503/422 và hiển thị thông báo thân thiện.
  - Dữ liệu người dùng và phiên đăng nhập được giữ an toàn.
  - Khi máy chủ có mạng trở lại, tính năng AI tự động kết nối và hoạt động bình thường, không cần can thiệp hay khởi động lại dịch vụ.

---

## 4. Hướng dẫn đối chiếu cho Reviewer (@James-Lloyd20)

Reviewer có thể chạy lại bộ kiểm tra bất kỳ lúc nào:

```powershell
# Chạy bộ test kiểm chứng offline, lỗi AI và phục hồi
node tests/selfhost-offline-117.cjs docs/testing/evidence/issue-117-reboot-sleep-offline-2026-11-17.txt

# Kiểm tra file bằng chứng
Get-Content docs/testing/evidence/issue-117-reboot-sleep-offline-2026-11-17.txt
```
