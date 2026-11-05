# BÁO CÁO CÁ NHÂN — ĐÓNG GÓP DỰ ÁN MINDSPRINT AI

* **Họ và tên:** Nguyễn Trần Bảo Duy
* **MSSV / Tài khoản:** `tungtungsahul` / `baoduy4bbt360`
* **Vai trò trong nhóm:** Nhóm trưởng (Team Lead) & Lập trình viên Backend chính (Backend Lead)
* **Nhánh GitHub phụ trách:** `branch-duy-backend-srs` (hoặc `codex/duy-sprint-2`, `codex/issue-34-programming-tutor`)

---

## 1. PHẠM VI CÔNG VIỆC VÀ TRÁCH NHIỆM CHÍNH
1. **Quản lý dự án & Điều phối nhóm:**
   * Thiết lập cấu trúc kho chứa GitHub, phân chia nhánh (Git Branching Strategy) theo mô hình GitFlow.
   * Lập kế hoạch Sprint (Sprint 1 đến Sprint 4), phân chia Issue và theo dõi tiến độ công việc của 5 thành viên.
   * Cấu hình CI/CD Pipeline với GitHub Actions (`.github/workflows/ci-cd.yml`) để tự động hóa build, test và deploy lên Render.
2. **Thiết kế & Xây dựng Kiến trúc Backend:**
   * Khởi tạo dự án ASP.NET Core 8 Web API (`MindSprint.Api`), cấu hình Dependency Injection, Middleware, CORS và Swagger UI.
   * Thiết kế và triển khai thuật toán Spaced Repetition (SRS) SuperMemo SM-2 trong `SrsService.cs`.
   * Xây dựng toàn bộ hệ thống API Quản lý Thẻ học Flashcard (`FlashcardsController.cs`) hỗ trợ CRUD đầy đủ và Optimistic Concurrency Control.
3. **Phát triển Module Gia sư Lập trình AI (Issue #34):**
   * Tích hợp Gemini AI API để hỗ trợ sinh viên phân tích và sửa lỗi code (Python, JavaScript).
   * Triển khai chế độ gợi ý Socratic Method để người học tự tư duy khắc phục lỗi thay vì chỉ copy đáp án.

---

## 2. CHI TIẾT CÁC ĐÓNG GÓP KỸ THUẬT & MÃ NGUỒN

### 2.1. Triển khai thuật toán Spaced Repetition (SM-2)
* **Tệp mã nguồn:** `backend/MindSprint.Api/Services/SrsService.cs`
* **Nghiệp vụ thực hiện:**
  * Tiếp nhận đánh giá độ nhớ $q \in [1, 5]$ từ người học.
  * Cập nhật hệ số độ dễ $EF$ đảm bảo không nhỏ hơn ngưỡng tối thiểu 1.3:
    $$EF' = \max\left(1.3, \; EF + (0.1 - (5 - q) \times (0.08 + (5 - q) \times 0.02))\right)$$
  * Tính toán khoảng cách ngày ôn tiếp theo $I(n)$:
    * Nếu $q < 3$: Reset $n = 0, I = 1$ (học lại từ đầu).
    * Nếu $n = 1: I_1 = 1$ ngày.
    * Nếu $n = 2: I_2 = 6$ ngày.
    * Nếu $n > 2: I_n = \text{round}(I_{n-1} \times EF')$.

### 2.2. Triển khai CRUD Quản lý Thẻ học (Sản phẩm)
* **Tệp mã nguồn:** `backend/MindSprint.Api/Controllers/FlashcardsController.cs`
* **Các endpoints xây dựng:**
  * `GET /api/flashcards`: Đọc danh sách thẻ (hỗ trợ lọc theo `category`, `subCategory`, phân trang và tải kèm trạng thái SRS).
  * `POST /api/flashcards`: Thêm mới sản phẩm thẻ học cá nhân với `OwnerId = currentUserId`.
  * `PUT /api/flashcards/{externalId}`: Chỉnh sửa thông tin thẻ có kiểm tra token tương tranh `Version`.
  * `DELETE /api/flashcards/{externalId}`: Xóa thẻ khỏi cơ sở dữ liệu.

---

## 3. LỊCH SỬ COMMITS TIÊU BIỂU TRÊN GITHUB
* `71aab4d`: Merge pull request #79 from tungtungsahul/codex/issue-43-nfr02
* `cc81fc7`: Merge branch 'dien/issue-52-nfr11-browser-offline' into main
* `6f4be74`: docs(issue-44): update verification report with 20/20 ConcurrencyChecks PASS
* `e2497f3`: fix(auth): align TokenService rotation with EF Core optimistic concurrency tokens
* `f43701b`: feat(srs): implement SuperMemo SM-2 calculation engine and tests

---

## 4. TỰ ĐÁNH GIÁ MỨC ĐỘ HOÀN THÀNH
* **Tỷ lệ hoàn thành nhiệm vụ:** 100%
* **Đóng góp nổi bật:** Dẫn dắt kiến trúc backend chuẩn chỉ, xử lý triệt để bài toán tương tranh (OCC) và triển khai thành công live server trên Render.
* **Tự xếp loại:** Xuất sắc (A+)
