# BÁO CÁO CÁ NHÂN — ĐÓNG GÓP DỰ ÁN MINDSPRINT AI

* **Họ và tên:** Tuấn Linh
* **MSSV / Tài khoản:** `tuanlinh0511`
* **Vai trò trong nhóm:** Kiến trúc sư Cơ sở dữ liệu & Chuyên viên Mô hình hóa Hệ thống (Database Architect & UML Specialist)
* **Nhánh GitHub phụ trách:** `remotes/origin/codex/fix-weak-area-ef-translation`, `branch-linh-database-uml`

---

## 1. PHẠM VI CÔNG VIỆC VÀ TRÁCH NHIỆM CHÍNH
1. **Thiết kế & Chuẩn hóa Cơ sở dữ liệu (Issue #20 & CSDL 3NF):**
   * Khảo sát yêu cầu bài toán, xác định các thực thể và mối quan hệ thực thể trong toàn bộ hệ thống.
   * Thực hiện quá trình chuẩn hóa từ 1NF $\rightarrow$ 2NF $\rightarrow$ 3NF, loại bỏ hoàn toàn hiện tượng trùng lặp và dị thường cập nhật.
   * Xây dựng sơ đồ thực thể mối quan hệ (ERD) và sơ đồ cơ sở dữ liệu quan hệ vật lý bằng cú pháp Mermaid và SVG.
2. **Mô hình hóa Hệ thống bằng các biểu đồ UML:**
   * Xây dựng sơ đồ Use Case tổng quát và các sơ đồ Use Case phân rã theo từng phân hệ.
   * Viết các bảng đặc tả Use Case chi tiết (Tác nhân, Tiền điều kiện, Hậu điều kiện, Luồng chính, Luồng ngoại lệ).
   * Thiết kế 7 sơ đồ hoạt động (Activity Diagrams), Sơ đồ lớp (Class Diagram theo mô hình MVC) và Sơ đồ triển khai hệ thống (Deployment Diagram).
3. **Phát triển Module Ôn tập theo Điểm yếu Cá nhân hóa (Issue #35 - Weak Areas):**
   * Thiết kế bảng `WeakAreas` và xây dựng API `WeakAreasController.cs`.
   * Xử lý thuật toán ghi nhận lỗi sai của người học trong các phiên luyện tập để tự động đề xuất bài học bổ trợ.
4. **Kiểm thử Kiểm soát Tương tranh & Sao lưu CSDL (NFR-07 & NFR-09):**
   * Thực hiện kiểm thử tương tranh (Concurrency Testing) với Optimistic Concurrency Control trên EF Core.
   * Xây dựng quy trình tự động sao lưu và phục hồi dữ liệu (Backup & Restore Runbook) cho cơ sở dữ liệu PostgreSQL.

---

## 2. CHI TIẾT CÁC ĐÓNG GÓP KỸ THUẬT & MÃ NGUỒN

### 2.1. Thiết kế Entity Framework Core Migrations & Indexing
* **Tệp mã nguồn:** `backend/MindSprint.Api/Data/AppDbContext.cs`, `backend/MindSprint.Api/Migrations/`
* **Xử lý kỹ thuật:**
  * Thiết lập cấu hình chỉ mục duy nhất (Unique Index) trên các cột quan trọng: `Users.Email`, `Users.GoogleSubject`, `Flashcards.ExternalId`, `(UserId, FlashcardId)` trên `CardProgresses`.
  * Cấu hình trường `Version` với ràng buộc `.IsConcurrencyToken()` để hỗ trợ phát hiện xung đột dữ liệu đa người dùng.
  * Thiết lập quan hệ xóa tầng (Cascade Delete) an toàn giữa `Notebooks` với `NotebookSources`, `NotebookNotes`, `NotebookGenerationCaches`.

### 2.2. Kiểm thử Tương tranh NFR-07 & Sao lưu NFR-09
* **Thực nghiệm NFR-07 (Concurrency):**
  * Mô phỏng 2 tiến trình độc lập cùng đọc thẻ học có `Version = 1` và đồng thời gửi yêu cầu cập nhật.
  * Kết quả: Tiến trình thứ nhất cập nhật thành công (nâng lên `Version = 2`), tiến trình thứ hai lập tức nhận mã lỗi `409 Conflict` kèm thông báo chi tiết, bảo vệ toàn vẹn dữ liệu 100%.
* **Thực nghiệm NFR-09 (Backup & Restore):**
  * Viết script sao lưu tự động `pg_dump` và kiểm tra kịch bản khôi phục cơ sở dữ liệu khi gặp sự cố, thời gian khôi phục thành công dưới 30 giây mà không mất mát dữ liệu.

---

## 3. LỊCH SỬ COMMITS TIÊU BIỂU TRÊN GITHUB
* `e14a79b`: docs(uml): complete comprehensive ERD, Use Case and Activity diagrams
* `f59281a`: feat(db): create initial migration with 3NF tables, unique indexes and foreign keys
* `a401c92`: feat(weak-areas): implement weak area tracking service and personalized review API
* `c382109`: test(nfr07): verify optimistic concurrency control on flashcards and task updates

---

## 4. TỰ ĐÁNH GIÁ MỨC ĐỘ HOÀN THÀNH
* **Tỷ lệ hoàn thành nhiệm vụ:** 100%
* **Đóng góp nổi bật:** Thiết kế CSDL đạt chuẩn 3NF khoa học, trực quan hóa toàn bộ hệ thống bằng sơ đồ UML trực quan, chuyên nghiệp và đảm bảo dữ liệu hệ thống luôn nhất quán.
* **Tự xếp loại:** Xuất sắc (A+)
