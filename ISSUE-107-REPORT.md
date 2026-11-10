# Báo cáo kết quả Issue #107 — [Tuần 1][Laptop] Kiểm chứng build Docker từ source sạch

* **Người thực hiện:** `phandien665-prog`
* **Người review:** `minhsonle30122007-png`
* **Nhánh:** `main`
* **Ngày kiểm tra:** 10/11/2026 (Hạn chốt: 20:00 14/11/2026)
* **Milestone:** Sprint 4 - Tuần 4: Kiểm thử, triển khai, đóng gói
* **Kế hoạch laptop:** [Kế hoạch laptop #92](https://github.com/tungtungsahul/MindSprint-AI-D-n/issues/92)
* **Issue:** https://github.com/tungtungsahul/MindSprint-AI-D-n/issues/107
* **Phụ thuộc:** #105 (Đã hoàn thành và merge vào main)

---

## 1. Mục tiêu và Tiêu chí bàn giao

| Tiêu chí | Trạng thái | Chi tiết kiểm chứng |
|---|:---:|---|
| Build image frontend/API từ checkout sạch bằng `Dockerfile.selfhost` | **PASS** | Multi-stage build độc lập trên nền .NET 8 SDK và ASP.NET Core 8 runtime. Toàn bộ source build sạch, không phụ thuộc cache cục bộ. |
| Kiểm tra context build không mang `.env`, secrets, logs, file DB | **PASS** | Kiểm tra qua `.dockerignore` và `.gitignore`. Loại bỏ hoàn toàn `.env*` (trừ `.example`), `*.db`, `*.mdf`, `logs`, `.git`. |
| Chạy smoke image với PostgreSQL test riêng | **PASS** | Kiểm thử qua `scripts/smoke-selfhost.ps1` đạt **7/7 test PASS** trên URL `http://127.0.0.1:8080`. |
| Không mở rộng CI GitHub hay cấu hình deploy cloud | **PASS** | Mọi cấu hình chỉ áp dụng cho Docker Compose localhost/loopback, không chạm tới workflow CI cloud. |

---

## 2. Thông số Kiểm chứng Build Sạch

* **Commit SHA baseline:** `860d868`
* **Dockerfile sử dụng:** `Dockerfile.selfhost`
* **Image mục tiêu:** `mindsprint-web:selfhost`
* **Thời gian build từ clean source:** 42.6 giây (Lần đầu restore NuGet & copy static frontend)
* **Kích thước image cuối:** 278 MB (Tối ưu qua Debian Bookworm Slim, multi-stage bỏ SDK)

### Lệnh tái lập (Reproduction Commands):
```powershell
# 1. Checkout sạch
git checkout main
git pull origin main

# 2. Build image
docker build -t mindsprint-web:selfhost -f Dockerfile.selfhost .

# 3. Khởi động và kiểm thử
powershell -File scripts/selfhost-up.ps1
powershell -File scripts/smoke-selfhost.ps1
```

---

## 3. Kết quả Smoke Test (7/7 PASS)
```text
=== Bat dau Smoke Test tren http://127.0.0.1:8080 ===
  [PASS] Liveness check /healthz tra ve status ok
  [PASS] Readiness check /readyz ket noi database thanh cong
  [PASS] Frontend root (/) tra ve ma 200 va chua MindSprint
  [PASS] Asset /api.js tra ve ma 200 dung noi dung
  [PASS] Asset /style.css tra ve ma 200
  [PASS] API route khong ton tai tra ve ma 404 (khong tra ve HTML)
  [PASS] API /api/flashcards bao ve dung chuan Auth (ma 401)
-------------------------------------------
Ket qua: 7 pass, 0 fail
```

---

## 4. Kết luận nghiệm thu
* **Kết quả:** **PASS 100%**.
* Issue #107 đủ điều kiện đóng hoàn tất.
