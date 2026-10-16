# ADR-001: Backend theo tầng trong một ứng dụng

**Trạng thái:** Ghi nhận hiện trạng tại main/9ba7acd; đề xuất duy trì trong Sprint 4. **Ngày:** 12/10/2026.

## Bối cảnh

MindSprint có flashcard/SRS, Kanban, study và notebook/tutor; các module dùng chung phiên người dùng và AppDbContext. Không có bằng chứng cần triển khai độc lập từng module.

## Quyết định

Mô tả và giữ một ASP.NET Core API với controllers, services và EF Core. Controllers có thể truy cập DbContext trực tiếp; không mô tả hệ thống là Clean Architecture hoặc microservices. Frontend tĩnh gọi REST qua MindSprintApi.

## Phương án được cân nhắc trong tài liệu

- Microservices: cho phép scale độc lập nhưng thêm networking, distributed auth/transaction và vận hành; chưa có benchmark để biện minh.
- Domain/application/infrastructure tách project: hợp lý khi domain phức tạp; chưa cần tái cấu trúc cho công việc tài liệu/Sprint 4.
- Giữ mô hình đang có: ít thay đổi, dễ lần theo luồng và tận dụng các harness hiện tại.

Đây là phân tích trade-off khi lập tài liệu, không khẳng định nhóm đã từng đánh giá các phương án trên.

## Hệ quả và kiểm chứng

Dễ build/deploy một artifact nhưng deploy và giới hạn slot gắn theo tiến trình. Không thêm broker/cache chỉ để đạt hình thức kiến trúc. Đo NFR-01/02/12/13; thay đổi cấu trúc chỉ sau khi có bottleneck hoặc nhu cầu module rõ ràng.

**Nguồn:** [Program](https://github.com/tungtungsahul/MindSprint-AI-D-n/blob/9ba7acd2de05bf017ad5c2711644c9ee98bd6542/backend/MindSprint.Api/Program.cs), [Controllers](https://github.com/tungtungsahul/MindSprint-AI-D-n/tree/9ba7acd2de05bf017ad5c2711644c9ee98bd6542/backend/MindSprint.Api/Controllers), [Services](https://github.com/tungtungsahul/MindSprint-AI-D-n/tree/9ba7acd2de05bf017ad5c2711644c9ee98bd6542/backend/MindSprint.Api/Services).
