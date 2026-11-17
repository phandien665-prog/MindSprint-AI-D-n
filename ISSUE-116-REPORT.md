# Báo cáo nghiệm thu Issue #116

- **Người phụ trách:** Đỗ Đình Phan Diễn ([@phandien665-prog](https://github.com/phandien665-prog))
- **Người đối chiếu theo issue:** [@mchihihaha](https://github.com/mchihihaha)
- **Kế hoạch:** [Tuần 2][Laptop] Kế hoạch laptop #92
- **Issue:** [#116](https://github.com/tungtungsahul/MindSprint-AI-D-n/issues/116)
- **Thời điểm nghiệm thu:** 17/11/2026

Lượt kiểm chứng ngày **17/11/2026** đạt **Pass (11/11 tiêu chí)** trên bản self-host Docker / SQL Server Express 2022.

| Nhóm tiêu chí | Nội dung kiểm chứng | Kết quả |
|---|---|:---:|
| **Thứ tự khởi động** | `web` chỉ khởi động sau khi `db` báo `service_healthy`. Cấu hình healthcheck `SELECT 1` bằng `sqlcmd` trên SQL Server. | **Pass** |
| **Độ tin cậy của probe** | Phân biệt rõ tiến trình sống (`/healthz` 200) và database sẵn sàng (`/readyz` 200). Không bao giờ báo `ready` giả khi database chưa sẵn sàng. | **Pass** |
| **Tự phục hồi vs Dừng chủ động** | `restart: unless-stopped` tự khởi động lại khi container bị lỗi/crash. Lệnh `scripts/selfhost.ps1 Stop` dừng dứt điểm, không tự động bật lại trái ý. | **Pass** |
| **Bảo toàn dữ liệu** | Khi mở lại Docker Desktop hoặc khởi động lại máy, dữ liệu trong volume `sqlserver-data` được bảo toàn 100%. | **Pass** |

- [Báo cáo kỹ thuật chi tiết](docs/testing/issue-116-container-recovery.md)
- [Bằng chứng thực thi](docs/testing/evidence/issue-116-container-recovery-2026-11-17.txt)
