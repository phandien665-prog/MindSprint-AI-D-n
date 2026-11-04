# Kết quả kiểm thử Issue #20 — ERD, Use Case, Activity/Sequence Diagram

## Thông tin chung
- **Issue:** #20 — [Tuấn Linh] [Docs] ERD, Use Case, Activity/Sequence Diagram
- **Chủ trì:** tuanlinh0511
- **Mô phôi (Sprint):** Sprint 3
- **Ưu tiên:** P1 (docs)

## Baseline
- **Commit:** `267072d` (main)
- **Thư mục:** `docs/architecture/`
- **Công cụ:** Mermaid

## Tóm tắt kết quả

| Sơ đồ | File | Nội dung | Kết luận |
|-------|------|----------|----------|
| Use Case | `usecase.mmd` | 6 gói, 18 use cases (bao gồm UC18 phân tích điểm yếu) | Pass |
| Activity Notebook | `activity-notebook.mmd` | Add Source → Chat Q&A flow | Pass |
| Activity Kanban | `activity-kanban.mmd` | CRUD Task + Drag&Drop + Offline Sync | Pass |
| Sequence Notebook | `sequence-notebook.mmd` | Auth → Notebook → Sources → Chat/Studio/Tutor | Pass |
| Sequence Auth & Flashcard | `sequence-auth-flashcard.mmd` | Login/Google/Refresh/Logout + Flashcard SRS/Optimistic Locking | Pass |

## Chi tiết từng sơ đồ

### 1. Use Case Diagram (usecase.mmd)
**Nội dung:**
- 4 actor: Người học, Hệ thống AI, Google Identity, Nguồn URL công khai
- 6 gói: Học tập & Flashcard, Sổ tay AI, Lịch học & Kanban, Tài khoản & Đồng bộ
- 18 use cases (UC1-UC17 + UC18 Phân tích điểm yếu cá nhân hóa)
- Quan hệ include/extend giữa các use case

**Kết quả:** Đầy đủ, khớp với hệ thống đã code (bao gồm tính năng Weak Areas từ Issue #35).

**Byron:** `docs/architecture/usecase.mmd`

### 2. Activity Diagram - Notebook AI (activity-notebook.mmd)
**Nội dung:**
- Luồng: Đăng nhập → Chọn sổ tay → Thêm nguồn (văn bản/URL/file) → Nhập câu hỏi → Gọi Gemini API → Hiển thị câu trả lời → Lưu lịch sử
- Xác thực, quản lý nguồn, hỏi đáp AI được phân thành các subgraph

**Kết quả:** Khớp với luồng thực tế trong NotebooksController và NotebookAi service.

**Byron:** `docs/architecture/activity-notebook.mmd`

### 3. Activity Diagram - Kanban (activity-kanban.mmd)
**Nội dung:**
- Luồng: Đăng nhập → Tải bảng → Xem 3 cột (Todo/Doing/Done) → Tạo/Sửa/Xóa task → Kéo thả → Đồng bộ offline
- Bao gồm xử lý xung đột khi đồng bộ server

**Kết quả:** Khớp với TasksController (Create, Update, Move, Delete) và logic Arrange.

**Byron:** `docs/architecture/activity-kanban.mmd`

### 4. Sequence Diagram - Notebook AI (sequence-notebook.mmd)
**Nội dung:**
- Người học ↔ UI ↔ NotebooksController ↔ PostgreSQL ↔ Gemini API
- Luồng: Lấy danh sách sổ tay → Tạo/Chọn sổ tay → Thêm nguồn (Text/URL/File) → Chat/Q&A → Studio Generation → Tutor Flow

**Kết quả:** Đầy đủ, bao gồm authentication, add source (3 loại), chat, studio, tutor.

**Byron:** `docs/architecture/sequence-notebook.mmd`

### 5. Sequence Diagram - Auth & Flashcard (sequence-auth-flashcard.mmd)
**Nội dung:**
- Phần Auth: Đăng nhập email/password, Đăng nhập Google, Refresh token, Đăng xuất
- Phần Flashcard: Học thẻ (SRS), Tạo thẻ cá nhân (optimistic locking), Xóa thẻ

**Kết quả:** Khớp với AuthController, FlashcardsController, ReviewController. Bao gồm xử lý version conflict (409).

**Byron:** `docs/architecture/sequence-auth-flashcard.mmd`

## Kết quả nghiệm thu giữa kỳ
- Tất cả 5 sơ đồ UML đã được tạo và commit
- Các sơ đồ khớp với mã nguồn đã triển khai (khớp với các controller, service đã có)
- Có tích hợp tính năng Weak Areas (Issue #35) vào Use Case diagram (UC18)

## Kết luận
**Pass** — Tất cả 5 sơ đồ UML yêu cầu trong Issue #20 đã hoàn thành.

**Người chạy:** tuanlinh0511  
**Thời gian:** Asia/Saigon  
**Theo dõi:** Không có bug liên kết