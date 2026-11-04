# 🚀 MindSprintAI — Ghi chú phát hành phiên bản 0.2 (Release Notes v0.2.0)

**Phiên bản:** `v0.2.0` (Bản phát hành chính thức Sprint 4)  
**Ngày phát hành:** 04/11/2026 (Asia/Saigon)  
**Kho mã nguồn:** [tungtungsahul/MindSprint-AI-D-n](https://github.com/tungtungsahul/MindSprint-AI-D-n)  
**Nhóm tác giả (Nhóm 5 - Công nghệ Phần mềm):**
- Bảo Duy (@tungtungsahul) — Project Lead, AI Integration & Backend
- Phan Diễn (@phandien665-prog) — Security Hardening, PWA Offline, Testing & Packaging Lead
- Minh Sơn (@minhsonle30122007-png) — System Architecture & Requirements
- Tuấn Linh (@tuanlinh0511) — Database & Data Engineering
- Đình Hùng — Frontend UI/UX & Client Validation
- Minh Chiến — Cloud Deployment & Synchronization

---

## 📌 Tóm tắt tổng quan bản phát hành 0.2

Phiên bản **MindSprintAI 0.2** đánh dấu cột mốc hoàn thành trọn vẹn **Sprint 4 ("Kiểm thử, triển khai, đóng gói")**, chuyển đổi nền tảng từ giai đoạn MVP thử nghiệm sang một hệ thống phần mềm học tập thông minh ổn định, an toàn và sẵn sàng triển khai thực tế. 

Điểm nổi bật nhất của phiên bản 0.2 là việc **nghiệm thu đạt 100% các yêu cầu phi chức năng khắt khe (14 NFRs)** với hệ thống **230 bài kiểm thử tự động**, giải quyết triệt để các rủi ro bảo mật tài khoản (IDOR, Token Rotation Race Condition), mang lại trải nghiệm học tập ngoại tuyến (PWA Offline First) với bộ từ điển Oxford 1.814 từ vựng và mở rộng các tính năng AI gia sư tiên tiến.

---

## ✨ Các tính năng mới & Cải tiến nổi bật (What's New)

### 1. Trải nghiệm Ngoại tuyến PWA & Tương thích đa trình duyệt (NFR-11 / FR-21)
- **Kiến trúc PWA Offline First:** Tích hợp Service Worker chuyên dụng với chiến lược cache thông minh (Cache First cho asset tĩnh, Network First có fallback cho dữ liệu động).
- **Trọn bộ tài sản ngoại tuyến:** Cache sẵn 23 tệp cốt lõi của ứng dụng cùng 20 font KaTeX toán học, bảo đảm ứng dụng mở ngay tức thì kể cả khi ngắt kết nối mạng hoàn toàn.
- **Từ điển Oxford 1.814 từ vựng Offline:** Cho phép học sinh tra cứu, ôn tập từ vựng mọi lúc mọi nơi mà không phụ thuộc vào internet.
- **Hàng đợi đồng bộ an toàn (Offline Queue Replay):** Tự động lưu các thao tác khi mất mạng và phát lại tuần tự khi kết nối mạng trở lại. Hệ thống tự động hủy hàng đợi nếu người dùng chuyển đổi tài khoản, bảo vệ tính riêng tư tuyệt đối.
- **Tương thích toàn diện:** Kiểm thử và vận hành mượt mà trên **Microsoft Edge (156.x)**, **Mobile Safari iOS 17**, **Google Chrome** và trình duyệt nội địa **Cốc Cốc (154.x)**.

### 2. Tăng cường Bảo mật, Phân quyền & Cô lập tài khoản (NFR-03 / FR-01, FR-02, FR-03)
- **Vá triệt để Race Condition trong Refresh Token Rotation:** Cập nhật dịch vụ `TokenService` sử dụng lệnh nguyên tử `ExecuteUpdateAsync` của EF Core 8. Kiểm chứng thực tế với 10 luồng song song trên PostgreSQL 17 chỉ duy nhất 1 luồng được cấp token mới, 9 luồng còn lại bị từ chối chính xác.
- **Ma trận bảo vệ Anti-IDOR 100%:** Ngăn chặn tuyệt đối việc người dùng truy cập trái phép dữ liệu của tài khoản khác. Bất kỳ yêu cầu đọc, cập nhật hoặc xóa Task, Flashcard, Notebook, Note, StudyDay hoặc Streak không thuộc quyền sở hữu đều bị server chặn với mã lỗi `404 Not Found`.
- **Bảo mật Google OAuth 2.0:** Tích hợp xác thực Nonce ngẫu nhiên dùng một lần (single-use), whitelist domain CORS và bảo vệ liên kết tài khoản không gây trùng lặp.

### 3. Trợ giảng Lập trình thông minh (Programming Tutor - FR-24 / #34, #66)
- Bổ sung chế độ gia sư chuyên biệt cho ngôn ngữ **Python** và **JavaScript**.
- Khả năng đọc mã nguồn, phân tích cú pháp, giải thích nguyên nhân lỗi runtime và đưa ra hướng dẫn khắc phục từng bước có gợi mở tư duy, không đưa sẵn đáp án khi người học chưa tự suy nghĩ.

### 4. Lập kế hoạch học tập cá nhân hóa bằng AI (AI Study Plan - FR-23 / #36, #71)
- Giải quyết dứt điểm điểm tồn đọng **GAP-01** từ bản 0.1.
- AI phân tích mục tiêu của người học, thời hạn kỳ thi và các chủ đề yếu (Weak Areas) để sinh lịch trình phân bổ thời gian học tập khoa học.
- Hỗ trợ màn hình xem trước (preview) và cho phép người học lựa chọn thêm từng mục công việc vào bảng Kanban hoặc Lịch học.

### 5. Giao tiếp giọng nói tiếng Việt & Hỗ trợ Mobile cảm ứng (FR-25 / #37, #70)
- Tích hợp Web Speech API cho phép người học đặt câu hỏi bằng giọng nói tiếng Việt trong Sổ tay AI.
- Tối ưu hóa toàn bộ bảng điều khiển Kanban và thẻ học cho thao tác chạm vuốt (touch gestures) trên màn hình điện thoại thông minh và máy tính bảng.

### 6. Độ tin cậy AI & Dự phòng ngoại tuyến (NFR-06, NFR-14 / FR-08)
- Cơ chế quản lý lỗi Gemini API thông minh: Tự động phát hiện lỗi giới hạn hạn mức (429 Quota Exceeded) hoặc sự cố nhà cung cấp (503 Service Unavailable), thực hiện exponential backoff và chuyển tiếp mượt mà.
- **Bộ trích xuất thẻ dự phòng (Heuristic Fallback Card Generator):** Khi không có kết nối mạng hoặc AI tạm thời gián đoạn, thuật toán heuristic cục bộ sẽ tự động bóc tách các cặp câu hỏi/đáp án từ văn bản để người dùng tiếp tục việc học mà không bị gián đoạn.

### 7. Hiện đại hóa Giao diện (Study Cockpit UI)
- Thiết kế lại bảng điều khiển trung tâm theo phong cách Study Cockpit hiện đại với bảng màu Pastel dịu mắt, giảm mỏi mắt khi học tập thời gian dài.
- Hỗ trợ chuyển đổi giao diện Sáng / Tối (Light Mode / Dark Mode) linh hoạt.
- Cải thiện trình render công thức Toán học KaTeX và khối code có highlight cú pháp.

---

## 📊 Bảng tổng kết kết quả kiểm thử (QA Verification Scoreboard)

Toàn bộ **230 bài kiểm thử tự động** trên các tầng kiểm thử đều đạt kết quả tuyệt đối **100% PASS**:

| Tên bộ kiểm thử | Công nghệ / Môi trường | Số test cases | Kết quả | Trọng tâm kiểm thử |
| :--- | :--- | :--- | :--- | :--- |
| **AuthIsolationChecks** | C# / .NET 8 / PostgreSQL 17 | 40 | **40 / 40 PASS** | Chữ ký JWT, Anti-IDOR Matrix, Race Condition Concurrency (1 win, 9 reject), Live DB cleanup |
| **GoogleAuthChecks** | C# / .NET 8 / SQLite InMemory | 33 | **33 / 33 PASS** | Nonce lifecycle, Origin whitelist, Google Token Validation, Account Linking |
| **TutorChecks** | C# / .NET 8 / Mock AI | 59 | **59 / 59 PASS** | Gia sư giải từng bước, Gợi ý 3 cấp độ, Programming Tutor (Python/JS), OCR PDF context |
| **UrlImportChecks** | C# / .NET 8 / Test HTTP Host | 31 | **31 / 31 PASS** | Chống SSRF, chặn IP nội bộ, bóc tách HTML/PDF/DOCX/Markdown, Content-Length boundaries |
| **KanbanChecks** | C# / .NET 8 / InMemory DB | 19 | **19 / 19 PASS** | Transaction locking, quyền sở hữu thẻ, duy trì toàn vẹn thứ tự kéo thả các cột |
| **GeminiReliability** | C# / .NET 8 / WireMock | 12 | **12 / 12 PASS** | Chịu lỗi 429/503, cooldown token, fallback model, cancellation token |
| **nfr11-browser-offline** | Node.js / Playwright / Web API | 10 | **10 / 10 PASS** | PWA manifest, SW Cache 23 files, Oxford 1.814 từ vựng offline, Edge, Safari iOS 17, Cốc Cốc |
| **Frontend Unit Suites** | Node.js / JSDOM | 26 | **26 / 26 PASS** | Session lifecycle (11), Math KaTeX render (5), Client validation (4), AI Flashcards (6) |
| **TỔNG CỘNG** | **Toàn hệ thống** | **230** | **230 / 230 PASS (100%)** | **Sẵn sàng phát hành (Production-Ready)** |

---

## 🛠 Hướng dẫn cài đặt & Khởi chạy phiên bản 0.2

### Yêu cầu môi trường
- **.NET SDK:** Phiên bản 8.0 trở lên (hỗ trợ .NET 8 / .NET 9 / .NET 10)
- **Node.js:** Phiên bản 18.x trở lên
- **Cơ sở dữ liệu:** PostgreSQL 15+ (Khuyến nghị PostgreSQL 17) hoặc SQLite (cho chế độ thử nghiệm)

### 1. Khởi chạy Backend (.NET 8 Web API)
```powershell
cd backend/MindSprint.Api
# Cập nhật ConnectionString trong appsettings.json nếu dùng PostgreSQL
dotnet run
# API sẽ lắng nghe tại: http://localhost:5000 hoặc https://localhost:5001
```

### 2. Khởi chạy Frontend (PWA Client)
```powershell
cd frontend
# Chạy một web server tĩnh bất kỳ (ví dụ qua Node.js hoặc Python)
npx serve . -l 3000
# Mở trình duyệt và truy cập: http://localhost:3000
```

### 3. Kiểm tra chế độ Offline
1. Mở trình duyệt truy cập ứng dụng lần đầu để Service Worker hoàn tất cài đặt và nạp cache.
2. Mở DevTools (F12) -> Thẻ **Network** -> Chọn trạng thái **Offline**.
3. Tải lại trang (F5): Ứng dụng vẫn hiển thị đầy đủ giao diện và cho phép truy cập mục Thư viện để tra cứu, học 1.814 từ vựng Oxford bình thường.

---

## 📦 Danh mục tệp phát hành (Release Artifacts)

- **Mã nguồn:** Source code (`.zip` và `.tar.gz`)
- **Tài liệu đặc tả yêu cầu 0.2:** `docs/requirements/software-requirements-0.2.md`
- **Gói phân phối dựng sẵn (Pre-built Bundle):** [`release/mindsprint-ai-v0.2.0.zip`](release/mindsprint-ai-v0.2.0.zip)
  * **SHA-256 Checksum:** `B404C92B19963A00AABBF3F04C24760C97D69B092DBAB2463D5F9D13ED205CDC`
  * `backend/`: Đã được build sẵn qua `dotnet publish` (.NET 8 binary)
  * `frontend/`: Toàn bộ mã nguồn tĩnh PWA sẵn sàng host trên Vercel, Netlify hoặc Nginx.

---

*MindSprintAI — Tối ưu hóa hành trình tri thức với trí tuệ nhân tạo và kỹ thuật ghi nhớ ngắt quãng.*
