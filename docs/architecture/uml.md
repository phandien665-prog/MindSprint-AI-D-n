# UML và mô hình dữ liệu — baseline 0.1

**Ngày rà:** 26/10/2026. **Mã nguồn:** `1a9fecb807e7232a898a27c826615aac657fd798`. Phục vụ [#20](https://github.com/tungtungsahul/MindSprint-AI-D-n/issues/20), phối hợp #40/#58. Sơ đồ mô tả mã nguồn ASP.NET Core/frontend hiện có; không xác nhận schema production hay chất lượng AI.

## Danh mục sơ đồ

| Loại | Bản xem | Nguồn sửa được | Đối chiếu mã nguồn |
| --- | --- | --- | --- |
| ERD | [SVG](erd.svg), [PNG](erd.png), [chú giải](erd.md) | [erd.mmd](erd.mmd) | Entities, AppDbContext, migrations/model snapshot |
| Use case | [SVG](usecase.svg) | [usecase.mmd](usecase.mmd) | index.html, script.js, notebook.js, kanban.js, api.js |
| Activity Kanban | [SVG](activity-kanban.svg) | [activity-kanban.mmd](activity-kanban.mmd) | kanban.js, TasksController |
| Activity Sổ tay AI | [SVG](activity-notebook.svg) | [activity-notebook.mmd](activity-notebook.mmd) | notebook.js, NotebooksController, TutorController |
| Sequence tài khoản/thẻ | [SVG](sequence-auth-flashcard.svg) | [sequence-auth-flashcard.mmd](sequence-auth-flashcard.mmd) | AuthController, GoogleAuthController, ReviewController, FlashcardsController |
| Sequence Sổ tay AI | [SVG](sequence-notebook.svg) | [sequence-notebook.mmd](sequence-notebook.mmd) | NotebooksController, NotebookAi, TutorService, TutorFileReader |

Use case dùng flowchart với ca sử dụng hình oval và ranh giới hệ thống, vì Mermaid không hỗ trợ cú pháp `useCaseDiagram` của bản cũ. Đường nối biểu diễn tác nhân tham gia, không tự suy ra quan hệ UML include/extend. Activity dùng flowchart với điểm quyết định và nhánh lỗi.

## Danh mục ca sử dụng ổn định

| UC | Mục tiêu | FR liên quan |
| --- | --- | --- |
| UC1 | Ôn flashcard SRS | FR-06 |
| UC2 | Tạo thẻ cá nhân hoặc AI | FR-05, FR-08 |
| UC3 | Xem/lọc/quản lý thư viện | FR-04, FR-05 |
| UC4 | Xem thống kê | FR-19 |
| UC5 | Luyện tập trắc nghiệm | FR-07 |
| UC6 | Quản lý sổ tay | FR-09 |
| UC7 | Quản lý nguồn text/URL/file | FR-10 |
| UC8 | Hỏi đáp theo nguồn/gợi ý | FR-11 |
| UC9 | Studio, ghi chú và lưu thẻ | FR-12, FR-13 |
| UC10 | Gia sư, code và giọng nói | FR-14…16 |
| UC11 | Lịch học định kỳ thủ công | FR-18 |
| UC12 | Kanban | FR-17 |
| UC13 | Chuỗi ngày học | FR-19 |
| UC14 | Tài khoản email và phiên | FR-01, FR-02 |
| UC15 | Google và liên kết tài khoản | FR-03 |
| UC16 | Đồng bộ và xung đột thẻ | FR-22 |
| UC17 | Dữ liệu học cục bộ/offline | FR-21 |
| UC18 | Điểm yếu cá nhân hóa | FR-20 |

UC19 là mục tiêu lập kế hoạch AI (FR-23/#36), chưa tìm thấy trong baseline nên không đưa vào sơ đồ hiện trạng. Xem GAP-01 trong [SRS](../requirements/software-requirements.md).

## Những điểm đã sửa khi đối chiếu mã nguồn

- ERD giữ **12 bảng, 91 cột, 7 FK thực và 5 tham chiếu nghiệp vụ**. Không biến UserId không có FK thành ràng buộc database. PNG/SVG được xuất lại từ cùng `erd.mmd` hiện hành.
- Auth trả `{token, refreshToken, user}`, refresh trả `{token, refreshToken}`. Đăng xuất dùng `POST /api/auth/revoke`, không có `/logout`. Revoke refresh token không tự hủy access token còn hạn; frontend vẫn xóa phiên cục bộ khi revoke lỗi.
- Google gồm config/challenge, kiểm tra nonce/origin/token; email cũ cần xác minh mật khẩu trước liên kết.
- Review dùng ExternalId để tìm thẻ rồi lưu CardProgress theo FlashcardId nội bộ; `due` và `fresh` có endpoint riêng.
- Notebook chat trả HTTP JSON hoàn chỉnh; không SSE. Hội thoại đang hiển thị ở trình duyệt; kết quả AI có thể cache trong NotebookGenerationCaches, không đồng nghĩa tự lưu NotebookNotes.
- File được kiểm tra bởi TutorFileReader; PDF dùng PdfPig, không `pdf-parse`. Ảnh/PDF gốc lưu bytes để dùng chung cho chat/Studio/Gia sư. Upload không tự giải bài.
- Chỉ thao tác lưu ghi chú/thẻ của người dùng mới ghi vào NotebookNotes/Flashcards. Đổi nguồn/sổ tay/tài khoản không nhận phản hồi cũ; giữ nháp khi AI lỗi.
- Kanban gửi mutation lên server rồi tải lại; lỗi move giữ thứ tự hiện tại để thử lại. Không mô tả queue offline hoặc tự đồng bộ nền vì frontend Kanban hiện không triển khai chúng.

## Đối chiếu kiểm thử và giới hạn

[#19](https://github.com/tungtungsahul/MindSprint-AI-D-n/issues/19) đã đóng nhưng body/comments không cung cấp báo cáo kiểm thử để đối chiếu từng luồng. Không lấy trạng thái đóng làm bằng chứng pass. Bộ [test case #17](../testing/sprint-3-test-cases.md) và [kết quả chạy ban đầu](../testing/sprint-3-results.md) cung cấp bằng chứng hiện có theo từng môi trường.

Đã parse/render cả 6 Mermaid bằng **11.4.1**, xem [log](../testing/evidence/sprint-3/diagrams.txt). SVG là bản xuất để đọc, `.mmd` là nguồn chỉnh sửa; khi đổi nguồn phải xuất lại SVG/PNG. Đã kiểm tra trực quan ERD, use case và activity; sequence được render và kiểm tra tương tự. Chưa truy cập schema PostgreSQL đang chạy, Gemini thật hoặc Google thật trong lần rà này.
