# Đặc tả Issue #52 — [Test][NFR-11] Kiểm thử tương thích trình duyệt và chế độ offline

* **Trạng thái:** Đã hoàn thành triển khai test suite và xác minh trên môi trường trình duyệt thực tế & headless Playwright.
* **Người thực hiện:** `phandien665-prog`
* **Nhánh:** `dien/issue-52-nfr11-browser-offline`
* **Milestone:** Sprint 4 - Tuần 4: Kiểm thử, triển khai, đóng gói (P1)
* **Nguồn:** https://github.com/tungtungsahul/MindSprint-AI-D-n/issues/52
* **Tài liệu liên quan:** [docs/architecture/non-functional-requirements.md](docs/architecture/non-functional-requirements.md#nfr-11), [docs/architecture/sprint-4-test-plan.md](docs/architecture/sprint-4-test-plan.md).

---

## 1. Mục tiêu

Kiểm chứng toàn diện các cam kết phi chức năng **NFR-11** đối với hệ thống MindSprint AI:
1. **Tương thích trình duyệt (Cross-browser compatibility):** Ứng dụng chạy mượt mà, kết xuất đúng bố cục giao diện, không phát sinh ngoại lệ JavaScript chưa bắt (uncaught exceptions) trên Microsoft Edge (Chromium 156.x), Cốc Cốc (Chromium 154.x), và Mobile Safari iOS (viewport 390x844, touch events).
2. **Chế độ ngoại tuyến (Offline Mode & Service Worker):** Cài đặt và kích hoạt Service Worker đúng quy chuẩn PWA (`manifest.json`), bộ nhớ đệm CacheStorage lưu trữ đầy đủ 100% tài nguyên tĩnh (HTML/CSS/JS/KaTeX fonts/Icons), tự động hồi phục về `index.html` khi mất kết nối.
3. **Chức năng học tập ngoại tuyến:** Toàn bộ 1.814 từ vựng Oxford hạt nhân, bộ thẻ cá nhân lưu trong `localStorage`, lịch học và thuật toán Spaced Repetition (SRS) hoạt động bình thường khi không có kết nối Internet. Có tính năng trích xuất thẻ học heuristic dự phòng khi AI không khả dụng ngoại tuyến.
4. **Hàng đợi ngoại tuyến & Cô lập tài khoản (Offline Queue & Account Isolation):** Các thao tác tạo/sửa/xóa thẻ và cập nhật ngày học khi offline được đưa vào hàng đợi `ms-offline-queue`. Khi có mạng trở lại, hệ thống tự động đồng bộ (replay) tuần tự lên backend. Chuyển đổi tài khoản (User A -> User B) đảm bảo không rò rỉ dữ liệu, hủy ngay tác vụ đồng bộ dở dang của tài khoản cũ.
5. **Ranh giới tính năng phụ thuộc mạng:** Các module cần server và AI (Sổ tay AI, Tải URL, Kanban) hiển thị thông báo lỗi mạng rõ ràng, không làm mất dữ liệu người dùng đang nhập dở.

---

## 2. Tiêu chí nghiệm thu (Acceptance Criteria)

| Thành phần | Quy tắc kiểm thử | Kết quả mong đợi |
|---|---|---|
| **Web App Manifest (PWA)** | Kiểm tra cấu trúc `manifest.json`, icon và cấu hình hiển thị | • Manifest hợp lệ theo chuẩn W3C Web App Manifest.<br>• Khai báo đúng `display: standalone`, `start_url: ./index.html`.<br>• Cung cấp đủ icon kích thước 192x192 và 512x512 tồn tại thực tế trên đĩa (> 1 KB). |
| **Service Worker Asset Manifest** | Kiểm tra danh mục tài nguyên tĩnh trong `sw.js` | • Toàn bộ 23 asset tĩnh (HTML, CSS, JS, KaTeX CSS/JS) tồn tại nguyên vẹn trên đĩa.<br>• Toàn bộ 20 font KaTeX WOFF2 trong `MATH_FONTS` có mặt đầy đủ.<br>• Tên cache có tiền tố phiên bản (`mindsprintai-cache-v*`). |
| **Service Worker Lifecycle & Routing** | Kiểm tra cơ chế cài đặt, kích hoạt, dọn dẹp cache và điều hướng mạng | • Gọi `self.skipWaiting()` khi cài đặt và `self.clients.claim()` khi kích hoạt.<br>• Tự động quét và dọn sạch các cache phiên bản cũ (`mindsprint-cache-*`, `mindsprintai-cache-*`).<br>• Yêu cầu API (`/api/`) và Google OAuth luôn gửi trực tiếp qua mạng, không bị cache.<br>• Khi mất mạng điều hướng (navigate), fallback trả về `./index.html` đã cache. |
| **Phân vùng bộ nhớ theo tài khoản** | Kiểm tra `personalStorage` phân tách không gian khóa `localStorage` | • Khách (Guest): sử dụng khóa trực tiếp (vd: `timetable-slots`).<br>• Người dùng A: khóa có định dạng tiền tố `ms-account:{userId}:*`.<br>• Người dùng B: khóa độc lập hoàn toàn, không đọc hoặc ghi đè dữ liệu của A. |
| **Hàng đợi ngoại tuyến (Offline Queue Replay)** | Thao tác ghi nhận khi offline và cơ chế đồng bộ tuần tự khi có mạng | • Thao tác tạo/sửa/xóa thẻ và ngày học được lưu vào `ms-offline-queue` của đúng tài khoản.<br>• Khi có mạng (`window.online`), hệ thống duyệt tuần tự và xóa khỏi queue khi thành công.<br>• Khi đổi tài khoản giữa chừng: vòng lặp kiểm tra `accountVersion` và dừng ngay lập tức, không replay dữ liệu tài khoản cũ vào tài khoản mới. |
| **Trích xuất thẻ dự phòng (Offline Heuristic AI)** | Tạo thẻ học từ văn bản khi ngoại tuyến hoặc mất kết nối AI API | • Phân tích cú pháp dạng cặp thuật ngữ - định nghĩa (dấu `:`, `-`, `–`, `—`).<br>• Tự động lọc bỏ các dòng rác, mục lục, bài tập thừa.<br>• Sinh ra các thẻ học hợp lệ có câu hỏi/câu trả lời nguyên tử. |
| **Kho từ vựng ngoại tuyến (Oxford Vocabulary)** | Kiểm tra bộ dữ liệu từ vựng tích hợp sẵn trong client | • Chứa đúng 1.814 từ vựng tiếng Anh Oxford được phân chia theo hơn 10 chủ đề chi tiết.<br>• Tra cứu, lọc, học SRS hoàn toàn không cần gọi mạng. |
| **Thông báo lỗi mạng rõ ràng (Network Boundaries)** | Thao tác trên Kanban và Sổ tay AI khi mất kết nối mạng | • Kanban: hiển thị toast lỗi rõ ràng, giữ nguyên form nhập công việc và bật nút tải lại.<br>• Sổ tay AI: báo lỗi kết nối rõ ràng và cung cấp giải pháp dự phòng (dán văn bản, tải file thủ công). |
| **Tương thích trình duyệt Edge Desktop** | Khởi chạy và điều hướng toàn bộ ứng dụng trên Microsoft Edge | • Không có bất kỳ ngoại lệ JavaScript chưa bắt (uncaught errors) nào trong Console.<br>• Điều hướng qua lại giữa 4 tab (Thẻ học, Ôn tập, Kanban, Sổ tay) mượt mà. |
| **Tương thích trình duyệt Cốc Cốc Desktop** | Khởi chạy và kết xuất trên Cốc Cốc Browser | • Khởi chạy thành công trên executable Cốc Cốc thực tế.<br>• Kết xuất đầy đủ thanh điều hướng, logo và nội dung không lỗi console. |
| **Tương thích Mobile Safari iOS** | Giả lập iPhone 14 (390x844, Safari User-Agent, Touch Events) | • Giao diện đáp ứng (responsive), thanh điều hướng và thẻ học tương tác tốt với sự kiện chạm (tap/touch).<br>• Không có ngoại lệ JavaScript trên môi trường WebKit/Safari mobile. |
