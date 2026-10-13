# ADR-002: PostgreSQL và triển khai frontend/API riêng

**Trạng thái:** Ghi nhận cấu hình hiện có tại main/9ba7acd, chưa xác nhận production. **Ngày:** 12/10/2026.

## Bối cảnh

main dùng Npgsql và migration InitialCreate_PostgreSQL. Render Blueprint khai báo PostgreSQL + Docker API; Vercel phục vụ frontend tĩnh. Workspace c5e1400 còn provider/migrations SQL Server. FastAPI mặc định SQLite chạy riêng.

## Quyết định

Tài liệu và kiểm thử Sprint 4 lấy PostgreSQL trên main làm chuẩn. EF Core quản lý schema; PostgreSQL chứa dữ liệu server. API_BASE nhúng lúc build; CORS allowlist kiểm soát origin. Không dùng migrations SQL Server cho PostgreSQL hoặc dùng bài test FastAPI để nghiệm thu backend C#.

## Phương án được cân nhắc trong tài liệu

- SQL Server: phù hợp checkout cũ nhưng không khớp deployment/main hiện tại.
- SQLite: thuận tiện test nhỏ/standalone nhưng không phản ánh concurrency, kiểu dữ liệu và migration của PostgreSQL.
- Serve frontend cùng API: giảm cấu hình origin nhưng khác cấu hình hosting đang có; không thay đổi trong yêu cầu tài liệu.

## Hệ quả và kiểm chứng

Migration provider mới không tự chuyển dữ liệu SQL Server cũ; nếu cần chuyển dữ liệu phải có kế hoạch riêng. Startup migration cần kiểm thử DB trống/nâng cấp và backup trước deploy. Hai pipeline frontend/backend cần kiểm tra API_BASE và tương thích phiên bản; rollback code không tự rollback schema.

Kiểm chứng NFR-05/07/08/09/12. Backup/restore và retention hosting là yêu cầu chưa được chứng minh. /healthz hiện chỉ là liveness.

**Nguồn:** [csproj](https://github.com/tungtungsahul/MindSprint-AI-D-n/blob/9ba7acd2de05bf017ad5c2711644c9ee98bd6542/backend/MindSprint.Api/MindSprint.Api.csproj), [PostgresConnectionString](https://github.com/tungtungsahul/MindSprint-AI-D-n/blob/9ba7acd2de05bf017ad5c2711644c9ee98bd6542/backend/MindSprint.Api/Services/PostgresConnectionString.cs), [render.yaml](https://github.com/tungtungsahul/MindSprint-AI-D-n/blob/9ba7acd2de05bf017ad5c2711644c9ee98bd6542/render.yaml), [hướng dẫn deploy](https://github.com/tungtungsahul/MindSprint-AI-D-n/blob/9ba7acd2de05bf017ad5c2711644c9ee98bd6542/CI-CD-SETUP.md).
