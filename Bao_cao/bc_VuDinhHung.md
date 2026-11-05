# BÁO CÁO CÁ NHÂN — ĐÓNG GÓP DỰ ÁN MINDSPRINT AI

* **Họ và tên:** Vũ Đình Hùng
* **MSSV / Tài khoản:** `James-Lloyd20` / `vudinhhung2906`
* **Vai trò trong nhóm:** Kỹ sư Giao diện người dùng & Đa phương tiện AI (UI/UX & Voice AI Specialist)
* **Nhánh GitHub phụ trách:** `hung/issue-11-validation`, `hung/issues-16-37`

---

## 1. PHẠM VI CÔNG VIỆC VÀ TRÁCH NHIỆM CHÍNH
1. **Thiết kế Giao diện Responsive Mobile-First (Issue #16):**
   * Tối ưu hóa toàn bộ giao diện của phân hệ Sổ tay AI (AI Notebook) và Bảng công việc Kanban tương thích hoàn hảo trên các kích thước màn hình: Mobile (dưới 480px), Tablet (768px) và Desktop (1200px+).
   * Xử lý thanh cuộn mượt mà (smooth scrolling), ẩn hiện Sidebar thông minh trên điện thoại và điều chỉnh kích thước nút bấm thân thiện với cảm ứng ngón tay (Touch-friendly UI).
2. **Tích hợp Nhập liệu bằng Giọng nói tiếng Việt (Issue #37 & Voice STT/TTS):**
   * Sử dụng Web Speech Recognition API để người học có thể đọc câu hỏi bằng tiếng Việt trực tiếp vào Sổ tay AI.
   * Xây dựng tính năng cho phép xem lại và chỉnh sửa văn bản đã nhận diện trước khi gửi đi.
   * Tích hợp tính năng Text-to-Speech (TTS) để máy có thể đọc to câu trả lời hoặc phát âm từ vựng tiếng Anh chuẩn xác.
3. **Validation Dữ liệu Client & Server (Issue #11 & NFR-04):**
   * Xây dựng cơ chế kiểm tra tính hợp lệ của dữ liệu đầu vào ngay tại phía Client (độ dài câu hỏi, định dạng tệp tải lên, cấu trúc URL) nhằm giảm tải các request lỗi gửi lên máy chủ.
   * Chống các cuộc tấn công Cross-Site Scripting (XSS) bằng cách làm sạch mã HTML hiển thị (HTML Sanitization).

---

## 2. CHI TIẾT CÁC ĐÓNG GÓP KỸ THUẬT & MÃ NGUỒN

### 2.1. Module Nhận diện giọng nói tiếng Việt
* **Tệp mã nguồn:** `frontend/notebook.js`, `frontend/script.js`
* **Công nghệ:** Web Speech API (`webkitSpeechRecognition` / `SpeechRecognition`)
* **Xử lý kỹ thuật:**
  * Cấu hình ngôn ngữ `recognition.lang = 'vi-VN'`.
  * Hỗ trợ chế độ nghe liên tục (`continuous = false` và `interimResults = true`) để hiển thị chữ đang nói theo thời gian thực.
  * Tự động xử lý lỗi khi microphone không được cấp quyền hoặc trình duyệt không hỗ trợ Web Speech (fallback về ô gõ phím thông thường).

### 2.2. Tối ưu hóa giao diện Responsive Mobile cho Kanban
* **Tệp mã nguồn:** `frontend/style.css`, `frontend/index.html`
* **Xử lý kỹ thuật:**
  * Trên màn hình di động, bảng Kanban tự động chuyển đổi từ hiển thị 3 cột song song sang chế độ chuyển Tab (`To Do` | `In Progress` | `Done`) để tránh tình trạng vỡ khung hình.
  * Hỗ trợ thao tác kéo chạm cảm ứng (Touch Drag & Drop) mượt mà không bị giật lag.

---

## 3. LỊCH SỬ COMMITS TIÊU BIỂU TRÊN GITHUB
* `a839f21`: feat(voice): add Vietnamese speech-to-text recognition with live transcription preview
* `b28491c`: fix(responsive): optimize notebook and kanban layout for mobile devices
* `c914e20`: feat(validation): implement client-side form validation and sanitize inputs against XSS
* `d401a75`: style: refine Study Cockpit theme colors and touch-friendly controls

---

## 4. TỰ ĐÁNH GIÁ MỨC ĐỘ HOÀN THÀNH
* **Tỷ lệ hoàn thành nhiệm vụ:** 100%
* **Đóng góp nổi bật:** Mang đến trải nghiệm giao diện người dùng mượt mà, tiện ích giọng nói tiếng Việt độc đáo giúp việc tương tác với AI trở nên tự nhiên và dễ dàng.
* **Tự xếp loại:** Giỏi (A)
