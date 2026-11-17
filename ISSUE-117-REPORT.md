# Báo cáo nghiệm thu Issue #117

- **Người phụ trách:** Đỗ Đình Phan Diễn ([@phandien665-prog](https://github.com/phandien665-prog))
- **Người đối chiếu theo issue:** [@James-Lloyd20](https://github.com/James-Lloyd20)
- **Kế hoạch:** [Tuần 2][Laptop] Kế hoạch laptop #92
- **Issue:** [#117](https://github.com/tungtungsahul/MindSprint-AI-D-n/issues/117)
- **Thời điểm nghiệm thu:** 17/11/2026

Lượt kiểm chứng ngày **17/11/2026** đạt **Pass (11/11 tiêu chí)** trên bản self-host Docker / SQL Server Express 2022.

| Nhóm tiêu chí | Nội dung kiểm chứng | Kết quả |
|---|---|:---:|
| **Phục hồi Sleep / Wake** | Sau khi máy sleep rồi wake, Docker giữ nguyên mạng và container. Probe `/readyz` trả HTTP 200 ready (< 2s), connection pool tự tái kết nối. | **Pass** |
| **Phục hồi Reboot / Docker reload** | Sau khi chủ máy mở lại Docker Desktop, stack tự động chạy hoặc khởi động lại bằng `scripts/selfhost.ps1 Start`, bảo toàn 100% dữ liệu volume. | **Pass** |
| **CRUD Offline khi mất Internet** | Đăng ký, đăng nhập, thẻ flashcards, ôn tập SRS, Kanban, sổ tay và 1.814 từ vựng Oxford hoạt động bình thường mà không cần mạng ngoài. | **Pass** |
| **Khả năng phục hồi AI khi mất mạng** | Gọi Gemini lúc không có mạng trả mã lỗi rõ ràng (`ai_busy` / `503` / `422`), không sập backend, không mất tài liệu, không đăng xuất phiên. Tự động phục hồi khi có mạng. | **Pass** |
| **Cập nhật Runbook vận hành** | Đã ghi đầy đủ hướng dẫn xử lý từng kịch bản vào `docs/SELF-HOST-DEMO.md`, nêu rõ không đặt mục tiêu uptime 24/7 trên laptop. | **Pass** |

- [Báo cáo kỹ thuật chi tiết](docs/testing/issue-117-reboot-sleep-offline.md)
- [Bằng chứng thực thi](docs/testing/evidence/issue-117-reboot-sleep-offline-2026-11-17.txt)
