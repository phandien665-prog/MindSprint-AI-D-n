# Đặc tả yêu cầu phần mềm — MindSprintAI 0.2

**Phiên bản sản phẩm/baseline:** 0.2 (Sprint 4: Kiểm thử chuyên sâu, Tối ưu hóa UI & Chế độ Offline PWA).  
**Phiên bản tài liệu:** 2.0, ngày 04/11/2026 (Asia/Saigon).  
**Mã nguồn đối chiếu:** Nhánh Sprint 4 / Release `v0.2.0`, đối chiếu từ mốc baseline 0.1 (`1a9fecb`).  
**Milestone:** [Sprint 4 - Tuần 4: Kiểm thử, triển khai, đóng gói](https://github.com/tungtungsahul/MindSprint-AI-D-n/milestone/4).

---

## 1. Mục tiêu, người dùng và ranh giới phiên bản 0.2

MindSprintAI là nền tảng học tập thông minh giúp học sinh, sinh viên và người tự học tổ chức kiến thức, ghi nhớ qua thẻ lặp lại ngắt quãng (Spaced Repetition), hỏi đáp tài liệu đa phương thức bằng AI và quản lý tiến độ học tập có cấu trúc.

Sau khi hoàn thành chu trình MVP cơ bản tại bản 0.1, **phiên bản 0.2** tập trung vào:
1. **Kiểm thử phi chức năng chuyên sâu (Hardening & Quality Assurance):** Nghiệm thu đạt 100% các tiêu chí bảo mật, phân quyền tài khoản (NFR-03: Anti-IDOR, Token Rotation Race Condition Fix), tính toàn vẹn đồng thời (NFR-07: Concurrency Tokens), độ ổn định AI (NFR-06/14) và khả năng sao lưu phục hồi (NFR-09).
2. **Khả năng hoạt động Offline & Đa nền tảng (NFR-11):** Nâng cấp kiến trúc Progressive Web App (PWA) với Service Worker cache 23 tệp cốt lõi và 20 font KaTeX; tích hợp trọn vẹn bộ từ điển Oxford 1.814 từ vựng dùng offline; hàng đợi đồng bộ ngoại tuyến (Offline Queue Replay) an toàn theo phiên người dùng; hỗ trợ tối ưu trên Microsoft Edge, Mobile Safari iOS 17 và trình duyệt Cốc Cốc.
3. **Mở rộng năng lực AI & Trợ giảng:** Hoàn thiện AI lập kế hoạch cá nhân hóa (FR-23 / #36), Trợ giảng lập trình Python/JavaScript (FR-24 / #34), và Tương tác giọng nói tiếng Việt đa điểm chạm (FR-25 / #37).
4. **Hiện đại hóa giao diện & Triển khai tự động:** Nâng cấp bảng điều khiển Study Cockpit, chế độ sáng/tối linh hoạt, giao diện màu pastel dịu mắt và pipeline CI/CD tự động lên Render (.NET 8 API / PostgreSQL) & Vercel (Frontend PWA).

### Phân định phạm vi 0.2

| Thành phần | Trong phạm vi 0.2 | Ngoài phạm vi 0.2 |
| --- | --- | --- |
| **Xác thực & Tài khoản** | Đăng ký, đăng nhập JWT, Google OAuth 2.0, Refresh Token Rotation nguyên tử, phân tách dữ liệu đa tài khoản (Anti-IDOR) | Single Sign-On doanh nghiệp (SAML/LDAP), xác thực sinh trắc học phần cứng |
| **Học tập & Flashcards** | Thuật toán SRS lặp lại ngắt quãng, tạo thẻ AI tự động, trích xuất dự phòng heuristic offline, tra cứu 1.814 từ vựng Oxford offline | Đồng bộ thẻ ngang hàng P2P giữa các máy không qua server |
| **Sổ tay AI & Gia sư** | Chat tài liệu (PDF, Ảnh scan OCR, DOCX, TXT, URL), gợi ý giải bài 3 cấp độ, Trợ giảng code Python/JS, Giọng nói tiếng Việt | Tự động chạy mã nguồn người học (code execution sandbox) |
| **Lập kế hoạch & Quản lý** | Bảng Kanban kéo thả có khóa giao dịch, Lịch học thông minh, Lập kế hoạch ôn thi tự động bằng AI | Tích hợp Google Calendar / Apple Reminders hai chiều |
| **Môi trường & Triển khai** | ASP.NET Core 8, EF Core 8, PostgreSQL 17, Service Worker PWA, CI/CD Render + Vercel | Triển khai Kubernetes đa cụm phân tán (multi-region cluster) |

---

## 2. Quy ước nghiệm thu và ràng buộc chất lượng

- **Ưu tiên P0:** Các chức năng cốt lõi ảnh hưởng trực tiếp đến an toàn dữ liệu, tính đúng đắn của chu trình học, phân quyền tài khoản và đồng bộ. Bắt buộc 100% test case kiểm thử tự động phải vượt qua.
- **Ưu tiên P1:** Các chức năng trợ giúp nâng cao, giao diện và mở rộng định dạng tài liệu.
- **Ràng buộc an toàn tài khoản:** Tuyệt đối không cho phép IDOR; User B không thể đọc, sửa, xóa bất kỳ dữ liệu nào của User A (Task, Card, Notebook, Note, Source, StudyDay, Streak). Mọi vi phạm trả về `404 Not Found`.
- **Ràng buộc đồng thời:** Khi nhiều yêu cầu xoay vòng Refresh Token (Token Rotation) gửi cùng lúc, cơ chế nguyên tử `ExecuteUpdateAsync` bảo đảm duy nhất 1 luồng thành công, 9 luồng còn lại bị từ chối; ngăn chặn tuyệt đối tình trạng nhân bản session hoặc chiếm quyền.
- **Ràng buộc ngoại tuyến:** Ứng dụng phải duy trì giao diện và cho phép ôn luyện bộ từ vựng offline ngay cả khi ngắt kết nối mạng hoàn toàn. Khi mạng khôi phục, hàng đợi thao tác phải được đẩy lên server theo đúng thứ tự mà không làm trộn lẫn dữ liệu giữa các phiên tài khoản.

---

## 3. Ma trận yêu cầu chức năng (FR-01 đến FR-25)

| Mã FR / Mức | Tên yêu cầu | Mô tả luồng xử lý & Tiêu chí nghiệm thu | Use Case / Issue | Trạng thái nghiệm thu bản 0.2 |
| :--- | :--- | :--- | :--- | :--- |
| **FR-01** / P0 | Đăng ký & Đăng nhập bằng Email/Password | Kiểm tra định dạng email, độ dài mật khẩu >= 6 ký tự cả client và server; cấp phát Access Token và Refresh Token hợp lệ. | UC01, UC02 / #7, #11 | **PASS** (11/11 tests session, 4/4 tests validation) |
| **FR-02** / P0 | Đăng nhập Google & Liên kết tài khoản | Xác thực Google ID Token với Nonce một lần, whitelist origin; liên kết tài khoản email hiện hữu không gây trùng lặp. | UC03 / #28 | **PASS** (33/33 tests GoogleAuthChecks) |
| **FR-03** / P0 | Làm mới phiên & Thu hồi Token | Refresh Token Rotation nguyên tử; thu hồi token cũ ngay khi cấp token mới; từ chối token giả mạo, hết hạn hoặc replay. | UC04 / #5 | **PASS** (40/40 tests AuthIsolationChecks) |
| **FR-04** / P0 | Quản lý Thư viện Flashcards | Tạo thẻ thủ công, xem danh sách, cập nhật, xóa thẻ cá nhân; bảo vệ thẻ hệ thống không bị ghi đè. | UC05 / #3, #9 | **PASS** (Anti-IDOR verified trên PostgreSQL 17) |
| **FR-05** / P0 | Ôn tập ngắt quãng (SRS Review) | Đánh giá độ khó thẻ (Again, Hard, Good, Easy); tính toán khoảng thời gian lặp lại và cập nhật streak học tập. | UC06 / #14 | **PASS** (Tích hợp live PostgreSQL & Local Storage) |
| **FR-06** / P1 | Ôn tập theo điểm yếu cá nhân hóa | Hệ thống phát hiện các thẻ có tỷ lệ trả lời sai cao, nhóm theo chủ đề và đưa vào danh sách ưu tiên ôn tập. | UC07 / #35, #64 | **PASS** (EF Core DTO translation verified) |
| **FR-07** / P1 | Tạo Flashcard tự động bằng AI | Người học nhập đoạn văn hoặc tài liệu; AI phân tích và tự động sinh danh sách câu hỏi - câu trả lời tương ứng. | UC08 / #13 | **PASS** (3/3 frontend-ai-flashcards tests pass) |
| **FR-08** / P1 | Trích xuất thẻ dự phòng khi Offline/Lỗi AI | Khi mất mạng hoặc API Gemini trả lỗi 429/503, tự động kích hoạt bộ trích xuất heuristic tạo thẻ tại chỗ. | UC08 / #47 | **PASS** (3/3 fallback-cards tests, NFR-11.6 pass) |
| **FR-09** / P0 | Quản lý Sổ tay học tập (Notebooks) | Tạo sổ tay mới, xem danh mục, chỉnh sửa tên và xóa sổ tay thuộc sở hữu cá nhân. | UC09 / #3, #24 | **PASS** (Anti-IDOR verified trên Notebook endpoints) |
| **FR-10** / P1 | Nhập nguồn tài liệu văn bản & tệp | Tải lên PDF, DOCX, TXT, ảnh chụp đề bài; hệ thống tự động bóc tách nội dung văn bản và lưu vào sổ tay. | UC10 / #33, #63 | **PASS** (OCR & Document parser verified) |
| **FR-11** / P1 | Nhập nguồn từ liên kết web (URL Import) | Nhập URL bài viết; hệ thống lọc nội dung chính, chặn tấn công SSRF, giới hạn kích thước và chuyển hướng an toàn. | UC10 / #25, #27 | **PASS** (31/31 UrlImportChecks pass) |
| **FR-12** / P0 | Hỏi đáp tài liệu với AI (Notebook Chat) | Trò chuyện theo ngữ cảnh tài liệu đã tải vào sổ tay; hỗ trợ render công thức Toán học LaTeX và Markdown. | UC11 / #12, #57 | **PASS** (Cache AI context verified, 5/5 math tests pass) |
| **FR-13** / P1 | Gia sư AI giải bài tập từng bước | Phân tích bài toán, hướng dẫn từng bước tư duy thay vì đưa ngay đáp án; yêu cầu làm rõ khi đề bài thiếu dữ kiện. | UC12 / #30 | **PASS** (TutorChecks pass) |
| **FR-14** / P1 | Gợi ý giải bài 3 cấp độ (Hint System) | Cung cấp gợi ý cấp 1 (định hướng chung), cấp 2 (công thức/phương pháp), cấp 3 (bước giải chi tiết). | UC13 / #32 | **PASS** (15 hint checks pass trong TutorChecks) |
| **FR-15** / P1 | Chấm và phân tích bài làm của học sinh | So sánh bài làm người học với lời giải mẫu, chỉ ra vị trí sai sót và giải thích nguyên nhân. | UC14 / #31 | **PASS** (Feedback classification verified) |
| **FR-16** / P0 | Quản lý công việc Kanban | Bảng Kanban 3 cột (Todo, In Progress, Done); hỗ trợ kéo thả thẻ công việc, lưu vị trí và toàn vẹn dữ liệu. | UC15 / #6, #10 | **PASS** (19/19 KanbanChecks pass) |
| **FR-17** / P1 | Lịch học tập & Thống kê chuỗi ngày học | Ghi nhận các ngày hoàn thành mục tiêu học tập, hiển thị lịch và đếm chuỗi ngày liên tiếp (streak). | UC17 / #14 | **PASS** (StudyStats verified trên PostgreSQL) |
| **FR-18** / P1 | Quản lý lịch học thủ công | Cho phép người dùng tạo, kích hoạt hoặc tạm dừng các phiên học định kỳ theo tuần. | UC17 / #9 | **PASS** (UI controls & database mapping verified) |
| **FR-19** / P0 | Đồng bộ hàng đợi cục bộ (Sync Queue) | Các thao tác thực hiện khi mất mạng được lưu vào hàng đợi; tự động phát lại (replay) tuần tự khi có mạng. | UC16 / #9, #14 | **PASS** (NFR-11.5 sequential replay pass) |
| **FR-20** / P0 | Cô lập lưu trữ cục bộ theo tài khoản | Tách biệt vùng nhớ `personalStorage` giữa khách vãng lai và các tài khoản khác nhau; không lộ dữ liệu cũ. | UC18 / #44 | **PASS** (NFR-11.4 storage isolation pass) |
| **FR-21** / P1 | Hoạt động Offline hoàn chỉnh (PWA) | Toàn bộ giao diện chính và bộ 1.814 từ vựng Oxford tải được ngay cả khi ngắt toàn bộ kết nối mạng. | UC16 / #52 | **PASS** (10/10 nfr11-browser-offline tests pass) |
| **FR-22** / P1 | Hiển thị công thức Toán học KaTeX | Render chuẩn xác công thức toán inline `$..$` và block `$$..$$`, ma trận và ký hiệu đặc biệt không lỗi script. | UC11 / #11 | **PASS** (5/5 frontend-text tests pass) |
| **FR-23** / P1 | **AI Lập kế hoạch học tập cá nhân hóa** | AI phân tích mục tiêu, thời hạn ôn thi và điểm yếu để sinh lịch trình phân bổ thời gian hợp lý; có xem trước. | UC19 / #36, #71 | **PASS** (Đã đóng GAP-01; thuật toán phân bổ verified) |
| **FR-24** / P1 | **Trợ giảng lập trình (Programming Tutor)** | Hỗ trợ phân tích mã nguồn Python và JavaScript, phát hiện lỗi cú pháp, giải thích lỗi runtime và hướng dẫn sửa. | UC20 / #34, #66 | **PASS** (59/59 checks trong TutorChecks bao gồm code tutor) |
| **FR-25** / P1 | **Hỏi đáp giọng nói tiếng Việt & Hỗ trợ Mobile** | Thu âm câu hỏi tiếng Việt bằng Web Speech API; hỗ trợ thao tác chạm vuốt tối ưu cho màn hình cảm ứng di động. | UC21 / #37, #70 | **PASS** (Mobile touch gestures & voice input verified) |

---

## 4. Báo cáo nghiệm thu Yêu cầu Phi chức năng (NFR-01 đến NFR-14)

| Mã NFR | Nội dung kiểm thử | Phương pháp & Môi trường | Kết quả nghiệm thu thực tế | Trạng thái |
| :--- | :--- | :--- | :--- | :--- |
| **NFR-01** | Hiệu năng phản hồi API | Đo thời gian phản hồi các endpoint CRUD và đồng bộ dưới tải tiêu chuẩn | Thời gian xử lý trung bình < 120ms trên PostgreSQL 17 | **PASS** |
| **NFR-02** | Khả năng chịu tải & giới hạn tài nguyên | Giới hạn 20 nguồn/sổ tay, 200.000 ký tự/nguồn, tệp tải lên tối đa 10 MiB | Bộ lọc chặn triệt để dữ liệu vượt ngưỡng trước khi xử lý | **PASS** |
| **NFR-03** | Xác thực, phân quyền & cô lập tài khoản | Kiểm thử chữ ký JWT, Anti-IDOR matrix, xoay vòng Refresh Token đồng thời | **118/118 tests đạt 100%** (40 C# Auth, 33 Google, 19 Kanban, 26 Node) | **PASS** |
| **NFR-04** | An toàn dữ liệu đầu vào & chống XSS | Kiểm tra sanitization trên input HTML, URL javascript:, công thức LaTeX | Không cho phép thực thi script ngoài ý muốn; mã độc bị mã hóa an toàn | **PASS** |
| **NFR-05** | Bảo mật cấu hình & quyền riêng tư | Khóa API Gemini, JWT Secret lưu trong biến môi trường; CORS whitelist | Header bảo mật HSTS, Strict-Origin, không rò rỉ thông tin server | **PASS** |
| **NFR-06** | Phục hồi khi AI hoặc mạng lỗi | Mô phỏng lỗi Gemini 429 (rate limit), 503 (quá tải), ngắt kết nối mạng | Tự động retry với exponential backoff và chuyển fallback mượt mà | **PASS** (12/12 GeminiReliability) |
| **NFR-07** | Toàn vẹn dữ liệu & cập nhật đồng thời | Sử dụng PostgreSQL Concurrency Tokens (`xmin`), transaction locking | Không xuất hiện race condition khi cập nhật thứ tự thẻ Kanban | **PASS** |
| **NFR-08** | Tính sẵn sàng & phát hiện trạng thái | Kiểm tra endpoint `/health`, báo hiệu trạng thái kết nối mạng trên UI | Chỉ báo rõ ràng trạng thái Online/Offline cho người dùng | **PASS** |
| **NFR-09** | Sao lưu & khôi phục dữ liệu | Quy trình backup tự động PostgreSQL và kịch bản phục hồi thảm họa | Đã thiết lập runbook khôi phục dữ liệu chi tiết | **PASS** |
| **NFR-10** | Khả năng tiếp cận & thân thiện UI | Độ tương phản màu sắc đạt chuẩn WCAG 2.1 AA, hỗ trợ phím tắt và nhãn | Màu pastel dịu mắt, hỗ trợ đầy đủ chế độ Light/Dark | **PASS** |
| **NFR-11** | Tương thích trình duyệt & chế độ Offline | Kiểm thử Service Worker cache, PWA manifest trên Edge, Safari, Cốc Cốc | **10/10 tests đạt 100%**; 1.814 từ Oxford mở trơn tru offline | **PASS** |
| **NFR-12** | Triển khai tái lập & CI/CD | Dockerfile chuẩn, pipeline GitHub Actions build & test tự động | Build thành công 100% trên Render (.NET) & Vercel (Frontend) | **PASS** |
| **NFR-13** | Khả năng quan sát & chẩn đoán lỗi | Ghi log có cấu trúc (structured logging), không in lộ bí mật người dùng | Mã lỗi chuẩn RESTful (400, 401, 403, 404, 409, 500) | **PASS** |
| **NFR-14** | Chất lượng & an toàn nội dung AI | Kiểm duyệt prompt injection, định dạng JSON cấu trúc từ LLM | 100% phản hồi được parse an toàn, không gây crash ứng dụng | **PASS** |

---

## 5. Tổng kết giải quyết các điểm tồn đọng (Gaps Resolved from v0.1)

| Mã GAP | Vấn đề tồn đọng tại bản 0.1 | Giải pháp & Kết quả nghiệm thu tại bản 0.2 |
| :--- | :--- | :--- |
| **GAP-01** | Chưa tìm thấy mã nguồn triển khai AI lập kế hoạch (#36) trong baseline 0.1 | **ĐÃ GIẢI QUYẾT:** Tích hợp thành công chức năng AI Study Plan (#71), cho phép người học xem trước (preview) lịch trình và thêm từng phần vào Lịch học/Công việc. |
| **GAP-02** | Thiếu báo cáo kiểm thử chi tiết và tự động hóa cho các NFR cốt lõi | **ĐÃ GIẢI QUYẾT:** Xây dựng hệ thống 230 bài test tự động bao quát 100% các tiêu chí bảo mật, concurrency, PWA, AI reliability và browser compatibility. |
| **GAP-03** | Khác biệt về validation mật khẩu giữa client-side và API | **ĐÃ GIẢI QUYẾT:** Đồng bộ quy tắc kiểm tra: độ dài tối thiểu 6 ký tự, báo lỗi ngay khi nhập liệu và chặn submit nếu không hợp lệ cả ở frontend và backend. |
| **GAP-04** | Trạng thái kích hoạt lịch học chưa rõ ràng trên giao diện | **ĐÃ GIẢI QUYẾT:** Bổ sung switch bật/tắt trực quan trên giao diện Lịch học, hỗ trợ lọc và đồng bộ trạng thái lưu trữ xuống database. |
| **GAP-05** | Chưa kiểm chứng trên cơ sở dữ liệu PostgreSQL 17 thật | **ĐÃ GIẢI QUYẾT:** Xác thực thành công toàn bộ migration, quan hệ bảng và Anti-IDOR trên cơ sở dữ liệu PostgreSQL 17 thực tế. |

---

## 6. Tổng kết độ tin cậy phần mềm (Software Quality Scoreboard)

- **Tổng số ca kiểm thử tự động:** **230 / 230 Tests Passed (100% Pass Rate)**
  * `AuthIsolationChecks` (JWT, IDOR, PostgreSQL 17, Token Rotation Concurrency): **40 / 40 PASS**
  * `GoogleAuthChecks` (Nonce, Origin Whitelist, Account Linking): **33 / 33 PASS**
  * `TutorChecks` (Gia sư, Hints, Code Tutor, PDF Context): **59 / 59 PASS**
  * `UrlImportChecks` (SSRF Defense, Parsing, Format Handlers): **31 / 31 PASS**
  * `KanbanChecks` (Transaction Locking, Ownership, Ordering): **19 / 19 PASS**
  * `GeminiReliability` (Fault Tolerance, Cooldown, Retries): **12 / 12 PASS**
  * `nfr11-browser-offline` (PWA, Service Worker, Oxford Offline, Cross-Browser): **10 / 10 PASS**
  * `Frontend Node Test Suites` (Session, Math KaTeX, Form Validation, AI Cards): **26 / 26 PASS**
- **Kết luận:** Phiên bản MindSprintAI 0.2 đạt đầy đủ tất cả các tiêu chí nghiệm thu của Sprint 4, sẵn sàng cho việc đóng gói phát hành và triển khai thực tế.
