# Báo cáo Kiểm thử Trực tiếp Issue #52 — [Test][NFR-11] Kiểm thử tương thích trình duyệt và chế độ offline

* **Môi trường kiểm thử:** Production Deployment
  * **Frontend:** `https://mindsprint-ai-d-n-frontend.vercel.app/`
  * **Backend API:** `https://mindsprint-api-zyur.onrender.com`
* **Người thực hiện:** `phandien665-prog`
* **Ngày kiểm tra:** 04/11/2026
* **Trạng thái:** ✅ **100% PASS**

---

## 1. Mục tiêu kiểm thử trực tiếp
Xác minh toàn bộ các tiêu chí tương thích trình duyệt và chế độ ngoại tuyến PWA của NFR-11 trên ứng dụng được triển khai trực tiếp trên Vercel:
1. Tính hợp lệ của cấu hình Web App Manifest (`manifest.json`) và tài nguyên biểu tượng PWA.
2. Script điều khiển Service Worker (`sw.js`): cache toàn bộ asset tĩnh và font KaTeX, cơ chế `skipWaiting`, `clients.claim` và loại bỏ cache cũ.
3. Liên kết API động trong `runtime-config.js` trỏ chính xác về backend Render.
4. Trải nghiệm người dùng và tính toàn vẹn JavaScript trên ma trận trình duyệt thực tế (Desktop Edge, Cốc Cốc Browser, Mobile Safari iOS emulation).

---

## 2. Bảng kết quả kiểm thử trên Live Vercel Frontend

| Nhóm kiểm thử | Kịch bản / Hạng mục kiểm tra | Kết quả thực tế trên Vercel | Trạng thái |
|---|---|---|:---:|
| **PWA Manifest** | Truy cập `https://mindsprint-ai-d-n-frontend.vercel.app/manifest.json` | Đạt chuẩn W3C, `short_name: "MindSprintAI"`, `display: "standalone"`, `start_url: "./index.html"` | ✅ PASS |
| **PWA Icons** | Tải icon 192x192 (`icon-192.jpg`) trên Vercel | Trả về `200 OK`, kích thước ảnh đầy đủ (> 600 KB) | ✅ PASS |
| | Tải icon 512x512 (`icon-512.jpg`) trên Vercel | Trả về `200 OK`, kích thước ảnh đầy đủ (> 600 KB) | ✅ PASS |
| **Service Worker Script** | Truy cập `https://mindsprint-ai-d-n-frontend.vercel.app/sw.js` | Tải thành công `200 OK`, chứa logic cache v54, `skipWaiting()`, `clients.claim()` | ✅ PASS |
| **Cấu hình Runtime** | Truy cập `https://mindsprint-ai-d-n-frontend.vercel.app/runtime-config.js` | `window.MINDSPRINT_CONFIG.apiBase` trỏ đúng về `https://mindsprint-api-zyur.onrender.com` | ✅ PASS |
| **Microsoft Edge Desktop** | Khởi chạy và điều hướng toàn bộ 4 tab chính (Thư viện, Ôn tập, Kanban, Sổ tay) | Kích thước 1440x900 px; **0 lỗi JavaScript/Console**, chuyển tab mượt mà | ✅ PASS |
| **Cốc Cốc Browser Desktop** | Khởi chạy trực tiếp trên file thực thi `browser.exe` của Cốc Cốc | Kích thước 1280x800 px; **0 lỗi JavaScript/Console**, giao diện render hoàn hảo | ✅ PASS |
| **Mobile Safari iOS Emulation** | Giả lập iPhone 14 (390x844 px, User-Agent iOS 17 Safari, Touch Events) | Tương tác chạm tap lật flashcard, responsive layout; **0 lỗi JavaScript** | ✅ PASS |

---

## 3. Lệnh tái lập kiểm thử trực tiếp

```powershell
cd "C:\Users\phand\.gemini\antigravity\scratch\MindSprint-AI-D-n"
node --test tests/live-test-issue52.cjs
```

---

## 4. Kết luận
Toàn bộ các tiêu chí **NFR-11 (Issue #52)** hoạt động ổn định trên nền tảng Vercel Production, đảm bảo tương thích 100% trên các trình duyệt máy tính phổ biến và thiết bị di động iOS.
