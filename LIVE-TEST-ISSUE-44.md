# Báo cáo Kiểm thử Trực tiếp Issue #44 — [Test][NFR-03] Xác thực, phân quyền và cô lập tài khoản

* **Môi trường kiểm thử:** Production Deployment
  * **Frontend:** `https://mindsprint-ai-d-n-frontend.vercel.app/`
  * **Backend API:** `https://mindsprint-api-zyur.onrender.com`
  * **Cơ sở dữ liệu:** PostgreSQL 17 (Render Managed Database)
* **Người thực hiện:** `phandien665-prog`
* **Ngày kiểm tra:** 04/11/2026
* **Trạng thái:** ✅ **100% PASS**

---

## 1. Mục tiêu kiểm thử trực tiếp
Xác minh toàn bộ các tiêu chí an toàn, bảo mật và cô lập tài khoản NFR-03 trên hệ thống đang chạy trực tiếp trên Internet:
1. Đăng ký tài khoản, đăng nhập email/mật khẩu, từ chối email trùng và mật khẩu sai.
2. Kiểm tra tính toàn vẹn của JWT token: từ chối truy cập không token và token bị can thiệp/giả mạo chữ ký.
3. Ma trận Anti-IDOR: Người dùng B (User B) dùng token của mình tấn công vào tài nguyên của Người dùng A (User A) trên toàn bộ các endpoint (Kanban Tasks, Flashcards cá nhân, Sổ tay AI, Thống kê học tập SRS).
4. Cơ chế xoay vòng Refresh Token (Token Rotation) và phòng chống Race Condition khi có 10 request gửi đồng thời cùng 1 refresh token trên PostgreSQL thật.
5. Cấu hình xác thực Google Sign-In công khai không để lộ mã bí mật client secret.

---

## 2. Bảng kết quả kiểm thử trên Live Render API

| Nhóm kiểm thử | Kịch bản / Endpoint kiểm tra | Kết quả thực tế | Trạng thái |
|---|---|---|:---:|
| **Xác thực người dùng** | Đăng ký tài khoản User A & User B | Trả về `200 OK` kèm cặp JWT Access Token và Refresh Token | ✅ PASS |
| | Đăng ký lại với email User A đã tồn tại | Trả về `409 Conflict` (từ chối tạo trùng) | ✅ PASS |
| | Đăng nhập với mật khẩu không đúng | Trả về `401 Unauthorized` | ✅ PASS |
| **Bảo mật JWT** | Truy cập endpoint bảo vệ không có header Authorization | Trả về `401 Unauthorized` | ✅ PASS |
| | Truy cập với token bị sửa đổi chữ ký (tampered token) | Trả về `401 Unauthorized` | ✅ PASS |
| **Anti-IDOR: Kanban Tasks** | User B lấy danh sách `GET /api/tasks` | Không xuất hiện bất kỳ task nào của User A | ✅ PASS |
| | User B cập nhật `PUT /api/tasks/{taskA.Id}` | Trả về `404 Not Found`, dữ liệu A nguyên vẹn | ✅ PASS |
| | User B kéo thả `PATCH /api/tasks/{taskA.Id}/move` | Trả về `404 Not Found` | ✅ PASS |
| | User B xóa `DELETE /api/tasks/{taskA.Id}` | Trả về `404 Not Found` | ✅ PASS |
| **Anti-IDOR: Flashcards** | User B lấy danh sách `GET /api/flashcards` | Chỉ thấy thẻ hệ thống Oxford, không thấy thẻ riêng của A | ✅ PASS |
| | User B chỉnh sửa thẻ riêng của A `PUT /api/flashcards/{cardA.Id}` | Trả về `404 Not Found` | ✅ PASS |
| | User B xóa thẻ riêng của A `DELETE /api/flashcards/{cardA.Id}` | Trả về `404 Not Found` | ✅ PASS |
| **Anti-IDOR: Sổ tay AI** | User B lấy danh mục sổ tay `GET /api/notebooks` | Không xuất hiện sổ tay của User A | ✅ PASS |
| | User B xem nguồn `GET /api/notebooks/{nbA.Id}/sources` | Trả về `404 Not Found` | ✅ PASS |
| | User B xóa sổ tay `DELETE /api/notebooks/{nbA.Id}` | Trả về `404 Not Found` | ✅ PASS |
| **Anti-IDOR: Study Stats** | User B truy vấn chuỗi học tập `GET /api/study/streak` | Trả về streak = 0, cô lập hoàn toàn với User A | ✅ PASS |
| **Refresh Concurrency** | Xoay vòng Refresh Token hợp lệ | Cấp access token mới và refresh token mới | ✅ PASS |
| | Tấn công Replay: sử dụng lại refresh token cũ đã xoay vòng | Trả về `401 Unauthorized` | ✅ PASS |
| | **Chống Race Condition: 10 request gửi đồng thời cùng 1 refresh token** | **Chính xác 1 request thành công (200), 9 request bị từ chối (401)** | ✅ PASS |
| **Google Auth Config** | Truy vấn `GET /api/auth/google/config` | Trả về trạng thái `enabled: true`, không lộ secret | ✅ PASS |

---

## 3. Lệnh tái lập kiểm thử trực tiếp

```powershell
cd "C:\Users\phand\.gemini\antigravity\scratch\MindSprint-AI-D-n"
node --test tests/live-test-issue44.cjs
```

---

## 4. Kết luận
Toàn bộ các tiêu chí bảo mật **NFR-03 (Issue #44)** hoạt động chính xác và an toàn tuyệt đối trên môi trường Live Production Render API + PostgreSQL.
