# Kiến trúc và yêu cầu phi chức năng MindSprintAI

Bộ tài liệu phục vụ yêu cầu kiến trúc [#40](https://github.com/tungtungsahul/MindSprint-AI-D-n/issues/40) và kiểm thử Sprint 4, lập ngày **12/10/2026**.

| Tài liệu | Nội dung |
| --- | --- |
| [ERD](erd.md) | 10 bảng, 69 cột; khóa ngoại, quan hệ nghiệp vụ, ảnh PNG/SVG và Mermaid |
| [Kiến trúc phần mềm](software-architecture.md) | Bối cảnh, thành phần, dữ liệu, luồng xử lý, triển khai và rủi ro |
| [Yêu cầu phi chức năng](non-functional-requirements.md) | 14 yêu cầu NFR-01…NFR-14, ngưỡng và cách đo |
| [Kế hoạch kiểm thử Sprint 4](sprint-4-test-plan.md) | Issue tương ứng, thứ tự thực hiện và điều kiện nghiệm thu |
| [ADR-001](../decisions/0001-layered-monolith.md) | Backend theo tầng trong một ứng dụng |
| [ADR-002](../decisions/0002-postgresql-and-deployment.md) | PostgreSQL và triển khai frontend/API riêng |
| [ADR-003](../decisions/0003-identity-and-account-isolation.md) | JWT, refresh token và ranh giới tài khoản |
| [ADR-004](../decisions/0004-ai-and-source-boundaries.md) | Cô lập Gemini và nguồn tài liệu ngoài |

## Mốc kiến trúc và trạng thái

Nguồn chuẩn của tài liệu là [main tại commit 9ba7acd](https://github.com/tungtungsahul/MindSprint-AI-D-n/tree/9ba7acd2de05bf017ad5c2711644c9ee98bd6542): **HTML/CSS/JS + ASP.NET Core 8 + PostgreSQL + EF Core + JWT + Gemini**. Checkout cục bộ `codex/duy-sprint-2` ở `c5e1400` còn dùng SQL Server và có cấu hình vận hành cũ. Không trộn migrations/provider giữa hai mốc.

“Hiện có” nghĩa là đã quan sát trong mã/cấu hình; không có nghĩa đã xác minh môi trường production. “Đề xuất” là mục tiêu chất lượng cần chốt tại sprint planning. Các ADR ghi nhận kiến trúc hiện tại và phân tích trade-off của tài liệu này; không giả định lịch sử phê duyệt của nhóm.

Chưa thực thi các bài tải, bảo mật, khôi phục hay chấm chất lượng AI của Sprint 4. Các issues được mở để thực hiện các bài đó. Cấu hình cloud chưa được xác minh đang chạy thực tế.

## Cập nhật

Khi thay đổi provider, hợp đồng API, phiên đăng nhập, giới hạn AI hoặc triển khai: cập nhật tài liệu này, ADR liên quan và issue kiểm thử có ID NFR; ghi lại commit và bằng chứng. Quyết định thay thế tạo ADR mới liên kết ADR cũ. Bản docs này là nơi tra cứu chính, có thể liên kết từ wiki khi wiki được khởi tạo.
