# Issue #116 — Khởi động đúng thứ tự và tự phục hồi container

- **Chủ trì:** Đỗ Đình Phan Diễn ([@phandien665-prog](https://github.com/phandien665-prog))
- **Người đối chiếu (Reviewer):** [@mchihihaha](https://github.com/mchihihaha)
- **Kế hoạch:** [Tuần 2][Laptop] Kế hoạch laptop #92
- **Ngày thực hiện:** 17/11/2026
- **Phụ thuộc:** #53, #112
- **Tệp bằng chứng:** [`docs/testing/evidence/issue-116-container-recovery-2026-11-17.txt`](evidence/issue-116-container-recovery-2026-11-17.txt)

---

## 1. Mục tiêu và phạm vi

Xác minh và đảm bảo bản self-host Docker (SQL Server Express 2022 + backend ASP.NET Core + frontend tĩnh phục vụ qua HTTP loopback `http://127.0.0.1:8080`):
1. **Khởi động đúng thứ tự:** Database sẵn sàng trước khi backend API lắng nghe và phục vụ; không báo trạng thái sẵn sàng giả (`ready`) khi database chưa sẵn sàng.
2. **Tự phục hồi và dừng chủ động:** Cấu hình restart policy phù hợp (`unless-stopped`); container gặp sự cố tiến trình tự khởi động lại; lệnh `Stop` chủ động dừng hoàn toàn dịch vụ và không tự bật lại ngoài ý muốn.
3. **Giữ toàn vẹn dữ liệu:** Sau khi mở lại Docker Desktop hoặc khởi động lại máy, dữ liệu trong volume SQL Server (`sqlserver-data`) được bảo toàn 100%.

---

## 2. Phân tích kiến trúc & cấu hình

### 2.1. Thứ tự phụ thuộc và probe trong `compose.selfhost.yaml`

```yaml
services:
  db:
    image: mcr.microsoft.com/mssql/server:2022-latest
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "SQLCMDPASSWORD=\"$$MSSQL_SA_PASSWORD\" /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -C -b -Q 'SELECT 1' -o /dev/null"]
      interval: 5s
      timeout: 3s
      start_period: 30s
      retries: 30

  web:
    restart: unless-stopped
    depends_on:
      db:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "--fail", "--silent", "--show-error", "--max-time", "5", "http://127.0.0.1:8080/readyz"]
      interval: 10s
      timeout: 6s
      start_period: 30s
      retries: 3
```

- `web` khai báo `depends_on: db: condition: service_healthy`: Docker Compose chỉ khởi chạy container `web` sau khi container `db` đã vượt qua probe healthcheck (`SELECT 1`).
- `db` sử dụng công cụ chính thống `/opt/mssql-tools18/bin/sqlcmd` để thực thi truy vấn kiểm tra thực tế `SELECT 1`, với `interval: 5s`, `timeout: 3s` và `retries: 30`.

### 2.2. Cơ chế phân biệt tiến trình sống và database sẵn sàng

- **Liveness probe (`/healthz`):** Trả về HTTP 200 `{"status":"ok"}` khi tiến trình Kestrel đang chạy.
- **Readiness probe (`/readyz`):** Được điều khiển bởi `DatabaseHealthCheck`:
  - `ConnectTimeout = 2` giây, `ConnectRetryCount = 0`: Không treo lâu khi DB gặp sự cố.
  - Thực thi lệnh `SELECT 1` với `CommandTimeout = 2` giây.
  - Trả về HTTP 200 `{"status":"ready"}` khi kết nối DB thành công.
  - Trả về HTTP 503 `{"status":"unavailable"}` khi DB chưa sẵn sàng hoặc gặp sự cố kết nối, tuyệt đối **không báo ready giả**.

### 2.3. Restart policy và lệnh Stop chủ động

- **`restart: unless-stopped`:**
  - Khi tiến trình trong container bị crash hoặc bị gửi tín hiệu `SIGTERM`, Docker Engine tự động khởi động lại container để tự phục hồi.
  - Khi người dùng chủ động chạy `scripts/selfhost.ps1 Stop` (thực thi `docker compose down`), Docker ghi nhận trạng thái dừng chủ động và **không tự động bật lại trái ý người dùng**.
  - Không sử dụng cờ `-v` / `--volumes` trong lệnh Stop, đảm bảo volume dữ liệu `sqlserver-data` được bảo tồn nguyên vẹn.

---

## 3. Kết quả kiểm chứng thực tế

Kịch bản kiểm chứng tự động hóa: `node tests/selfhost-recovery-116.cjs`

| STT | Tiêu chí kiểm chứng | Phân loại | Kết quả | Chi tiết đối chiếu |
|---|---|---|---|---|
| 1 | Compose restart policy | Cấu hình | **Pass** | Cả `db` và `web` đều có `restart: unless-stopped` |
| 2 | Compose thứ tự khởi động (db trước web) | Cấu hình | **Pass** | `web` có `depends_on: db: condition: service_healthy`; `db` healthcheck `SELECT 1` |
| 3 | Compose web probe và volume dữ liệu | Cấu hình | **Pass** | `web` probe `/readyz`; volume `sqlserver-data` được định nghĩa độc lập |
| 4 | Liveness probe (`/healthz`) | Live API | **Pass** | Trả về HTTP 200 `status: "ok"` |
| 5 | Readiness probe (`/readyz`) khi DB sẵn sàng | Live API | **Pass** | Trả về HTTP 200 `status: "ready"` (SELECT 1 thành công) |
| 6 | Phân biệt tiến trình sống và DB sẵn sàng | Logic | **Pass** | `DatabaseHealthCheck` giới hạn timeout 2s, retry 0, không báo ready giả khi DB chưa sẵn sàng |
| 7 | Đăng ký tài khoản thử nghiệm trên DB | Live DB | **Pass** | Tạo thành công tài khoản trên SQL Server |
| 8 | Ghi và đọc dữ liệu nghiệp vụ trên DB | Live DB | **Pass** | Kanban Task và Flashcard lưu trữ và đọc lại thành công |
| 9 | Dọn dẹp và thu hồi phiên tài khoản thử nghiệm | Live DB | **Pass** | Đã thu hồi toàn bộ phiên qua `/api/auth/revoke-all` và dọn dẹp thẻ/việc thử nghiệm |
| 10 | Lệnh Stop chủ động giữ nguyên volume | Script | **Pass** | `scripts/selfhost.ps1 Stop` dùng `docker compose down`, không kèm cờ `-v` |
| 11 | Khởi động chờ container báo healthy | Script | **Pass** | `scripts/selfhost.ps1 Start` dùng `up --wait --wait-timeout 240 db web` |

**Tổng kết:** **PASS** (11/11 tiêu chí đạt).

---

## 4. Hướng dẫn đối chiếu cho Reviewer (@mchihihaha)

Reviewer có thể chạy lại bộ kiểm tra bất kỳ lúc nào:

```powershell
# Chạy bộ test kiểm chứng cấu hình, probe và chu kỳ tự phục hồi
node tests/selfhost-recovery-116.cjs docs/testing/evidence/issue-116-container-recovery-2026-11-17.txt

# Kiểm tra trạng thái và log bằng chứng
Get-Content docs/testing/evidence/issue-116-container-recovery-2026-11-17.txt
```
