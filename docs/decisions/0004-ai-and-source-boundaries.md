# ADR-004: Cô lập Gemini và nguồn tài liệu ngoài

**Trạng thái:** Ghi nhận hiện trạng tại main/9ba7acd; mục tiêu chất lượng được đề xuất. **Ngày:** 12/10/2026.

## Bối cảnh

Gemini có thể lỗi/quota/JSON sai và nội dung nguồn có thể chứa chỉ thị độc hại. Nguồn URL có rủi ro SSRF, tải lớn và JS dùng nhiều tài nguyên. Không thể dùng prompt để bảo đảm tuyệt đối đúng hoặc an toàn.

## Quyết định

Gọi Gemini từ backend qua GeminiService dùng chung retry/fallback/cooldown/deadline và semaphore. Load tài liệu sau kiểm tra quyền notebook. URL đi qua downloader bảo vệ DNS/socket/redirect và renderer hạn chế tài nguyên. Kết quả AI chỉ lưu bền qua thao tác ghi rõ ràng; text phải render an toàn.

## Phương án được cân nhắc trong tài liệu

- Gọi Gemini trực tiếp từ frontend: làm lộ API key và phân tán kiểm soát tài nguyên.
- RAG/vector DB hoặc queue nền: có thể phù hợp nguồn rất lớn/tác vụ dài, nhưng hiện chưa có nhu cầu đo được; context đang chia/cắt theo ký tự.
- Prompt + gateway service hiện tại: đơn giản cho MVP, cần schema/citation/rubric và fault tests.

## Hệ quả và kiểm chứng

Semaphore/cooldown chỉ dùng trong một tiến trình, không phải hạn mức toàn hệ thống khi scale nhiều replica. Deadline 150 s là mặc định của một CallAsync, không phải tổng tutor có nhiều lượt. Prompt theo nguồn và kiểm định tutor không thay kiểm thử chất lượng; parse JSON không bảo đảm schema.

Cần thông báo luồng dữ liệu sang Gemini, fixture chấm điểm và giới hạn chi phí bằng số lần gọi/giới hạn tài nguyên. Chưa đề xuất mức chi phí tiền vì không có ngân sách của nhóm. Docker chưa cài browser runtime để bảo đảm URL JS fallback.

Kiểm chứng NFR-02/04/05/06/12/14.

**Nguồn:** [GeminiService](https://github.com/tungtungsahul/MindSprint-AI-D-n/blob/9ba7acd2de05bf017ad5c2711644c9ee98bd6542/backend/MindSprint.Api/Services/GeminiService.cs), [NotebookAi](https://github.com/tungtungsahul/MindSprint-AI-D-n/blob/9ba7acd2de05bf017ad5c2711644c9ee98bd6542/backend/MindSprint.Api/Services/NotebookAi.cs), [URL_IMPORT](https://github.com/tungtungsahul/MindSprint-AI-D-n/blob/9ba7acd2de05bf017ad5c2711644c9ee98bd6542/backend/URL_IMPORT.md), [Tutor](https://github.com/tungtungsahul/MindSprint-AI-D-n/blob/9ba7acd2de05bf017ad5c2711644c9ee98bd6542/backend/TutorChecks/SPRINT2.md).
