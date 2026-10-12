# MindSprintAI

Stack đang dùng: **HTML/CSS/JS (Fetch API)** + **C# ASP.NET Core Web API** + **PostgreSQL (EF Core Code First)** + **JWT** + **Gemini API**.

## Kiến trúc và yêu cầu phi chức năng

[Bộ tài liệu kiến trúc](docs/architecture/README.md) mô tả thành phần, dữ liệu, triển khai,
4 ADR và 14 yêu cầu phi chức năng có tiêu chí đo được. Xem [kế hoạch kiểm thử Sprint 4](docs/architecture/sprint-4-test-plan.md)
để tra cứu issues #42–#55 trong milestone Sprint 4. Các ngưỡng là mục tiêu đề xuất; chưa có kết quả nghiệm thu.

## Cấu trúc
- `frontend/` – giao diện MindSprintAI + `api.js` (client gọi API). Vẫn chạy offline bằng localStorage nếu chưa đăng nhập.
- `backend/MindSprint.Api/` – Web API:
  - `Models/Entities.cs` – User, Flashcard, CardProgress (SRS), KanbanTask
  - `Data/` – `AppDbContext`, `DataSeeder` (bơm 1.814 từ Oxford từ `vocab_seed.json`)
  - `Services/` – `SpacedRepetitionService` (tính NextReviewDate), `GeminiService` (ép JSON), `TokenService` (JWT)
  - `Controllers/` – Auth, Flashcards (CRUD), Review (SRS), Tasks (Kanban CRUD + move), Ai (Gemini)

## Chạy backend
```bash
cd backend/MindSprint.Api
dotnet run          # tự Migrate + Seed, Swagger tại /swagger
```
Sửa cấu hình cục bộ: chuỗi kết nối PostgreSQL, `Jwt:Key` (>= 32 ký tự), `Gemini:ApiKey`, `Cors:Origins`. Giữ khóa API ngoài commit; có thể dùng biến môi trường `Gemini__ApiKey`.
Khi chạy local, `frontend/api.js` tự dùng `http://localhost:5000`; khi triển khai Vercel, biến `API_BASE` được nhúng lúc build. Xem [hướng dẫn triển khai](CI-CD-SETUP.md).

## Chạy frontend
Mở `frontend/` bằng Live Server (cổng 5500) – đã có sẵn trong CORS.

Hoặc chạy từ thư mục gốc:
```powershell
dotnet run --project backend/MindSprint.Api
# Trong terminal thứ hai:
python -m http.server 5500 --bind 127.0.0.1
```
Mở `http://127.0.0.1:5500/frontend/`. Backend C# chạy cổng 5000/5100 và tự áp dụng migration hiện có; không cần tạo migration khi chỉ chạy dự án.

## Đăng nhập Google

Hộp đăng nhập/đăng ký hỗ trợ Google Identity Services, dùng chung JWT và refresh
session với đăng nhập email. Đặt `Google__ClientId` và Authorized JavaScript origins
để bật tính năng; xem [hướng dẫn cấu hình Google](backend/GOOGLE_SIGN_IN.md).
Email đã có tài khoản cần mật khẩu MindSprintAI hiện tại trước khi liên kết để
giữ nguyên dữ liệu học tập. Khi chưa cấu hình Google, email và Demo vẫn dùng được.

## Kanban tích hợp
Tab **Công việc** dùng chung `MindSprintAuth` và `MindSprintApi` với Sổ tay AI, thư viện và lịch học. Có thêm/sửa/xóa, kéo thả hoặc nút chuyển cột, tìm kiếm, lọc ưu tiên và hạn hoàn thành. Công việc được lưu vào PostgreSQL theo tài khoản; khi lỗi kết nối, form giữ nguyên để thử lại.

Thả ở nửa trên/dưới thẻ để chọn vị trí trong cùng cột hoặc giữa các cột; vạch màu đánh dấu vị trí chèn. Các nút **Đưa lên/Đưa xuống** dùng được bằng bàn phím và trên điện thoại. Vị trí được tính theo toàn bộ công việc trong cột, kể cả thẻ đang ẩn bởi bộ lọc; tải lại trang vẫn giữ thứ tự đã lưu. API lỗi thì bảng giữ thứ tự cũ để thử lại.

`frontend/kanban.js` ghép logic bảng mới từ `frontend/js/kanban.js` vào giao diện chính. Trạng thái Todo/InProgress/Completed được ánh xạ sang Todo/Doing/Done (0/1/2) của API C#. Migration `AddTaskPriority` bổ sung mức ưu tiên cho công việc cũ với giá trị mặc định Medium.

Bản FastAPI mới kéo về được giữ ở `backend/app`, giao diện ở `frontend/standalone.html` và `frontend/js`. `python run_server.py` mở bản này ở cổng 8000 với dữ liệu/phiên riêng; web chính sử dụng backend C# ở trên.

## Endpoint chính
| Method | URL | Mô tả |
|---|---|---|
| POST | /api/auth/register, /api/auth/login | Trả JWT |
| GET/POST/PUT/DELETE | /api/flashcards | CRUD thẻ (kèm trạng thái SRS) |
| POST | /api/review | `{cardId, remembered}` → tính NextReviewDate |
| GET | /api/review/due | Thẻ đến hạn + thẻ mới |
| GET/POST/PUT/PATCH/DELETE | /api/tasks | Kanban; `PATCH /{id}/move` khi kéo thả |
| POST | /api/ai/flashcards, /api/ai/quiz | Gemini sinh thẻ/trắc nghiệm từ văn bản |

## Sổ tay AI (kiểu NotebookLM)
Tab **Sổ tay AI** trong frontend (`notebook.js`) + `NotebooksController`/`NotebookAi` ở backend:
| Tính năng NotebookLM | Trong dự án |
|---|---|
| Nguồn tài liệu | Dán văn bản, PDF/TXT/MD/CSV (tối đa 10MB), URL (có chống SSRF); tối đa 20 nguồn/sổ tay |
| Hỏi đáp có trích dẫn | `POST /api/notebooks/{id}/chat` – chỉ trả lời từ nguồn, kèm số [n] và đoạn trích |
| Câu hỏi gợi ý | `GET /api/notebooks/{id}/suggestions` |
| Tóm tắt, Study guide, FAQ | `POST /api/notebooks/{id}/generate` với `type` = summary / studyguide / faq |
| Timeline, Mind map | `type` = timeline / mindmap |
| Flashcard, Trắc nghiệm | `type` = flashcards / quiz; flashcard lưu vào thư viện thẻ + SRS qua `/save-cards` |
| Audio overview | `type` = audio (kịch bản 2 người dẫn), phát bằng giọng đọc của trình duyệt |
| Ghi chú | `/api/notebooks/{id}/notes` – lưu câu trả lời hoặc tài liệu đã tạo |

Sau khi thêm entity mới, tạo migration mới: `dotnet ef migrations add AddNotebooks`.
Chưa có: PDF dạng ảnh scan (cần OCR), audio bằng giọng AI thật, trả lời dạng streaming, tìm kiếm theo vector (hiện gửi toàn bộ nguồn, tối đa ~300k ký tự, cho Gemini).

## Kiểm tra
```powershell
node --test tests/frontend-session.test.cjs tests/frontend-text.test.cjs
dotnet run --project backend/KanbanChecks/KanbanChecks.csproj -c Release
# Kiểm tra trình duyệt với Edge/Playwright và API mô phỏng, không chạm DB thật:
node --test tests/kanban-browser.test.cjs
dotnet run --project tests/GeminiReliability/GeminiReliability.csproj
# Kiểm tra Kanban với backend đang chạy (tạo tài khoản kiểm thử riêng):
$env:MINDSPRINT_TEST_API = 'http://localhost:5000'
node --test tests/kanban-integration.test.cjs
```
Các bài kiểm thử Python trong `tests/test_tier*.py` dành cho bản FastAPI riêng.
