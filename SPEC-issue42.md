# Đặc tả Issue #42 — [Test][NFR-01] Kiểm thử hiệu năng phản hồi

* **Trạng thái:** Đã hoàn thành triển khai bài đo tải và xác minh đạt 100% tiêu chí nghiệm thu trên backend ASP.NET Core 8 + PostgreSQL 17 và frontend client.
* **Người thực hiện:** `phandien665-prog`
* **Nhánh:** `dien/issue-42-nfr01-performance`
* **Milestone:** Sprint 4 - Tuần 4: Kiểm thử, triển khai, đóng gói (P1)
* **Nguồn:** https://github.com/tungtungsahul/MindSprint-AI-D-n/issues/42
* **Tài liệu liên quan:** [docs/architecture/non-functional-requirements.md](docs/architecture/non-functional-requirements.md#nfr-01), [docs/architecture/sprint-4-test-plan.md](docs/architecture/sprint-4-test-plan.md).

---

## 1. Mục tiêu

Kiểm chứng các chỉ số hiệu năng phi chức năng **NFR-01** của hệ thống MindSprint AI trong môi trường tải chuẩn:
1. **Hiệu năng API backend dưới tải 20 VU:**
   - 20 Virtual Users (VU) hoạt động đồng thời, mỗi VU sở hữu tài khoản riêng biệt và token JWT độc lập.
   - Hỗn hợp request (Request Mix) phản ánh lưu lượng thực tế của ứng dụng:
     - 35% `GET /api/flashcards` (truy vấn danh sách thẻ học)
     - 25% `GET /api/tasks` (truy vấn danh sách công việc Kanban)
     - 20% `GET /api/notebooks` (truy vấn danh mục sổ tay AI)
     - 10% `POST /api/tasks` (thao tác ghi: thêm mới công việc)
     - 10% `PATCH /api/tasks/{id}/move` (thao tác ghi: đổi vị trí / cột kéo thả)
   - Tối thiểu 100 mẫu đo cho từng route riêng biệt.
   - Đảm bảo tính toàn vẹn dữ liệu và quyền sở hữu (ownership assertion).
2. **Chỉ số Web Vitals của Frontend (Lab Measurement):**
   - Đo lường chỉ số Core Web Vitals trên trang chủ đã đăng nhập của người dùng qua trình duyệt tự động (Playwright PerformanceObserver).
   - Đánh giá trên cả hai cấu hình: Màn hình máy tính (Desktop 1440x900) và Thiết bị di động (Mobile Safari iOS 390x844).
   - Đo đạc tối thiểu 30 tương tác người dùng liên tiếp để ghi nhận độ trễ phản hồi tương tác (Interaction to Next Paint - INP).

---

## 2. Tiêu chí nghiệm thu (Acceptance Criteria)

| Thành phần | Tiêu chí kỹ thuật | Ngưỡng cam kết (Target Threshold) | Kết quả kỳ vọng |
|---|---|:---:|---|
| **API GET Requests** | Phân vị 95 (p95) độ trễ phản hồi cho toàn bộ các route đọc dữ liệu | **p95 ≤ 500 ms** | API trả về dữ liệu nhanh chóng, không gây nghẽn I/O khi có 20 người dùng truy vấn đồng thời. |
| **API Write Requests** | Phân vị 95 (p95) độ trễ phản hồi cho các thao tác ghi (POST/PATCH) | **p95 ≤ 800 ms** | Thao tác ghi dữ liệu, sắp xếp thẻ công việc lưu vào PostgreSQL hoàn thành dưới 800ms. |
| **Tỷ lệ lỗi ngoài dự kiến** | Tỷ lệ request gặp lỗi (HTTP status không hợp đồng, timeout, network error) | **Error Rate ≤ 1.0%** | Hệ thống chạy ổn định 100%, không phát sinh lỗi 500, lỗi crash hay timeout dưới tải. |
| **Kích thước mẫu kiểm thử** | Số lượng request thực thi cho mỗi route | **≥ 100 mẫu / route** | Đảm bảo tính hội tụ thống kê của phân vị p95/p99. |
| **Tính toàn vẹn & Phân quyền** | Xác minh nội dung phản hồi và quyền sở hữu dữ liệu trong bài tải | **100% Valid Ownership** | Dữ liệu trả về đúng định dạng, User chỉ nhận dữ liệu thuộc sở hữu của mình. |
| **Largest Contentful Paint (LCP)** | Thời gian render phần tử nội dung lớn nhất trên trang chủ đã đăng nhập | **LCP ≤ 2.5 s** | Trang tải nội dung chính dưới 2.5 giây. |
| **Cumulative Layout Shift (CLS)** | Độ dịch chuyển bố cục tích lũy trong quá trình tải và render trang | **CLS ≤ 0.10** | Giao diện ổn định, không giật cục nhảy layout khi nạp font hoặc icon. |
| **Interaction to Next Paint (INP)** | Phân vị 75 (p75) độ trễ khung hình tiếp theo trên ít nhất 30 tương tác | **p75 INP ≤ 200 ms** | Thao tác click tab, lật flashcard, mở modal mượt mà, phản hồi tức thì. |
