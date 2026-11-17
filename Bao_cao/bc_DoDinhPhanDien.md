# Báo cáo cá nhân môn Lập trình Web

- **Sinh viên** Đỗ Đình Phan Diễn
- **Tài khoản GitHub** [@phandien665-prog](https://github.com/phandien665-prog)
- **Đề tài** Hệ thống hỗ trợ tự học MindSprint AI
- **Ngày đối chiếu** 16/11/2026

Tôi phát triển giao diện Kanban và chức năng tạo thẻ AI trong Thư viện. Tôi cũng viết kịch bản kiểm thử ứng dụng web và kiểm chứng bản đóng gói Docker trên laptop.

## Tính năng đã thực hiện

| Issue | Phần việc thực hiện | Minh chứng |
| --- | --- | --- |
| [#6](https://github.com/tungtungsahul/MindSprint-AI-D-n/issues/6) | Dựng giao diện Kanban ba cột Chưa bắt đầu, Đang làm và Hoàn thành. | [`0ca24f7`](https://github.com/tungtungsahul/MindSprint-AI-D-n/commit/0ca24f7), [ghi nhận tích hợp vào ứng dụng](https://github.com/tungtungsahul/MindSprint-AI-D-n/issues/6#issuecomment-5986342195) |
| [#10](https://github.com/tungtungsahul/MindSprint-AI-D-n/issues/10) | Xây dựng luồng thêm, sửa, xóa công việc và kéo thả giữa các cột. Phần lưu thứ tự kéo thả chi tiết được Bảo Duy tích hợp tiếp trong PR #41. | [`0ca24f7`](https://github.com/tungtungsahul/MindSprint-AI-D-n/commit/0ca24f7), [PR #41](https://github.com/tungtungsahul/MindSprint-AI-D-n/pull/41) |
| [#13](https://github.com/tungtungsahul/MindSprint-AI-D-n/issues/13) | Thêm nút **Tạo thẻ bằng AI** trong Thư viện. Giao diện gọi API tạo thẻ, hiển thị bản xem trước, báo rõ khi số thẻ nhận được ít hơn yêu cầu và lưu các thẻ người dùng chọn. | [`c000d72`](https://github.com/tungtungsahul/MindSprint-AI-D-n/commit/c000d72), [kết quả chạy thử trên Edge](https://github.com/tungtungsahul/MindSprint-AI-D-n/issues/13#issuecomment-6235166644) |

## Kiểm thử và đóng gói

| Issue | Phần việc thực hiện | Minh chứng |
| --- | --- | --- |
| [#42](https://github.com/tungtungsahul/MindSprint-AI-D-n/issues/42) | Bổ sung bộ đo độ trễ API ở tải 20 người dùng ảo và bộ đo chỉ số giao diện. Báo cáo thử tại máy cục bộ ghi p95 của API đọc flashcard là 283 ms trong lượt đo này. | [`e7dc247`](https://github.com/tungtungsahul/MindSprint-AI-D-n/commit/e7dc247), [báo cáo NFR-01](../ISSUE-42-REPORT.md) |
| [#44](https://github.com/tungtungsahul/MindSprint-AI-D-n/issues/44) | Kiểm thử phiên đăng nhập, quyền truy cập dữ liệu theo tài khoản và xung đột khi gia hạn phiên. Báo cáo ghi 118/118 kiểm tra đạt trong các bộ đã chạy, trong đó 40 kiểm tra thuộc AuthIsolationChecks. | [PR #75](https://github.com/tungtungsahul/MindSprint-AI-D-n/pull/75), [`5fa0473`](https://github.com/tungtungsahul/MindSprint-AI-D-n/commit/5fa0473), [báo cáo NFR-03](../ISSUE-44-REPORT.md) |
| [#52](https://github.com/tungtungsahul/MindSprint-AI-D-n/issues/52) | Bổ sung kiểm thử PWA, cache tài nguyên và hành vi khi mất kết nối. Báo cáo ghi 44/44 kiểm tra đạt, có ca trên Chromium/Edge và ca mô phỏng thiết bị di động. | [PR #78](https://github.com/tungtungsahul/MindSprint-AI-D-n/pull/78), [`f7a0a36`](https://github.com/tungtungsahul/MindSprint-AI-D-n/commit/f7a0a36), [báo cáo NFR-11](../ISSUE-52-REPORT.md) |
| [#107](https://github.com/tungtungsahul/MindSprint-AI-D-n/issues/107) | Kiểm chứng build Docker từ mã nguồn sạch trên bản laptop PostgreSQL ban đầu. Lượt xác minh lại sau khi chuyển sang SQL Server nằm trong PR #124 của Bảo Duy. | [`b25eb17`](https://github.com/tungtungsahul/MindSprint-AI-D-n/commit/b25eb17), [báo cáo build ban đầu](https://github.com/tungtungsahul/MindSprint-AI-D-n/issues/107#issuecomment-6774163710), [PR #124](https://github.com/tungtungsahul/MindSprint-AI-D-n/pull/124) |
| [#113](https://github.com/tungtungsahul/MindSprint-AI-D-n/issues/113) | Viết kịch bản đo thời gian khởi động và tài nguyên Docker, cập nhật báo cáo theo SQL Server. Lượt đo trên stack thử nghiệm tách riêng do Bảo Duy tích hợp qua PR #126. Đã hoàn thành nghiệm thu. | [`7f8fd17`](https://github.com/tungtungsahul/MindSprint-AI-D-n/commit/7f8fd17), [`f64ea30`](https://github.com/tungtungsahul/MindSprint-AI-D-n/commit/f64ea30), [PR #126](https://github.com/tungtungsahul/MindSprint-AI-D-n/pull/126), [báo cáo #113](../ISSUE-113-REPORT.md) |
| [#116](https://github.com/tungtungsahul/MindSprint-AI-D-n/issues/116) | Kiểm chứng thứ tự khởi động (DB healthy trước web), cơ chế phân biệt probe sống/sẵn sàng không báo ready giả, chính sách tự phục hồi container (`unless-stopped`) và bảo toàn dữ liệu khi Stop chủ động. | [Báo cáo kỹ thuật #116](../docs/testing/issue-116-container-recovery.md), [báo cáo nghiệm thu](../ISSUE-116-REPORT.md), [bằng chứng thực thi](../docs/testing/evidence/issue-116-container-recovery-2026-11-17.txt) |
| [#117](https://github.com/tungtungsahul/MindSprint-AI-D-n/issues/117) | Kiểm chứng phục hồi sau Sleep/Wake, Reboot và ngắt Internet: nghiệp vụ CRUD cục bộ hoạt động độc lập không cần mạng ngoài, Gemini báo lỗi rõ ràng không crash web/DB/phiên và tự phục hồi khi có mạng, cập nhật runbook vận hành. | [Báo cáo kỹ thuật #117](../docs/testing/issue-117-reboot-sleep-offline.md), [báo cáo nghiệm thu](../ISSUE-117-REPORT.md), [bằng chứng thực thi](../docs/testing/evidence/issue-117-reboot-sleep-offline-2026-11-17.txt), [runbook](../docs/SELF-HOST-DEMO.md) |
