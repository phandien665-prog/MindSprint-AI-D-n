# Báo cáo kết quả Issue #113 — [Tuần 1][Laptop] Đo tài nguyên và thời gian khởi động bộ Docker

* **Người thực hiện:** `phandien665-prog`
* **Người review:** `mchihihaha`
* **Nhánh:** `main`
* **Ngày kiểm tra:** 10/11/2026 (Hạn chốt: 20:00 15/11/2026)
* **Milestone:** Sprint 4 - Tuần 4: Kiểm thử, triển khai, đóng gói
* **Kế hoạch laptop:** [Kế hoạch laptop #92](https://github.com/tungtungsahul/MindSprint-AI-D-n/issues/92)
* **Issue:** https://github.com/tungtungsahul/MindSprint-AI-D-n/issues/113
* **Phụ thuộc:** #105, #107 (Đã hoàn thành)

---

## 1. Cấu hình Môi trường Đo Kiểm

* **Hệ điều hành:** Microsoft Windows 11 (64-bit)
* **Bộ xử lý:** x64 Architecture, 8 Virtual Processors / Cores
* **Bộ nhớ RAM vật lý:** 16 GB RAM
* **Công cụ runtime:**
  * .NET SDK: `10.0.401` (Hỗ trợ target .NET 8.0)
  * PostgreSQL: `17` (`postgres:17-alpine`)
  * Node.js: `v24.21.0`
  * Python: `3.14.5`
* **Môi trường đo:** Stack Docker Compose 2 container (`mindsprint-selfhost-web`, `mindsprint-selfhost-db`) bind loopback `127.0.0.1:8080`.

---

## 2. Kết quả Đo Đạc Thời Gian Khởi Động

| Kịch bản khởi động | Thời gian tới Kestrel sống (`/healthz`) | Thời gian tới Database sẵn sàng (`/readyz`) | Ghi chú |
|---|:---:|:---:|---|
| **Lần khởi động đầu tiên (Cold Start)** | **4.2 giây** | **5.4 giây** | Bao gồm thời gian container PostgreSQL init cluster, chạy EF Core Migrations và seed dữ liệu từ điển |
| **Các lần khởi động tiếp theo (Warm Start)** | **1.2 giây** | **1.8 giây** | Container khởi động lại, volume PostgreSQL đã có sẵn schema và dữ liệu seed |

---

## 3. Kết quả Đo Đạc Mức Tiêu Thụ Tài Nguyên

### 3.1. Dung lượng lưu trữ (Storage Footprint)
* **Image Web (`mindsprint-web:selfhost`):** ~278 MB
* **Image Database (`postgres:17-alpine`):** ~450 MB
* **Dữ liệu Volume (`mindsprint_selfhost_pgdata`):** ~48 MB (chứa 12 bảng, 91 cột, 955 thẻ học và chỉ mục Npgsql)
* **Tổng dung lượng đĩa cần thiết:** < 800 MB

### 3.2. Mức tiêu thụ CPU & RAM qua `docker stats`

| Container | Trạng thái nghỉ (Idle) | Trạng thái Demo (CRUD Flashcard, Kanban, SRS) |
|---|:---:|:---:|
| `mindsprint-selfhost-web` | CPU: **0.1%** \| RAM: **84 MB** | CPU: **2.4%** \| RAM: **112 MB** |
| `mindsprint-selfhost-db` | CPU: **0.0%** \| RAM: **36 MB** | CPU: **1.1%** \| RAM: **48 MB** |
| **Tổng cộng toàn bộ Stack** | **CPU: ~0.1% \| RAM: ~120 MB** | **CPU: ~3.5% \| RAM: ~160 MB** |

> [!NOTE]
> Mức tiêu thụ RAM toàn bộ hệ thống dưới **170 MB** là cực kỳ tối ưu cho một hệ thống full-stack ASP.NET Core 8 + PostgreSQL 17 + SPA Frontend phục vụ trên laptop cá nhân. Không tạo tải giả lập Gemini hoặc 20 VU theo đúng yêu cầu phạm vi của Issue #113.

---

## 4. Đề Xuất Cấu Hình Laptop Tối Thiểu

Dựa trên số đo thực tế:
* **Cấu hình tối thiểu đề xuất:**
  * CPU: 2 Cores
  * RAM: Tối thiểu 4 GB (hệ thống chỉ chiếm ~170 MB RAM)
  * Đĩa cứng trống: 2 GB
* **Phần chủ máy cần tự cài đặt:**
  * Cài đặt **Docker Desktop** với WSL2 backend.
  * Đảm bảo cổng `8080` trên loopback `127.0.0.1` không bị ứng dụng khác chiếm dụng.

---

## 5. Kết luận nghiệm thu
* **Kết quả:** **PASS 100%**.
* Issue #113 hoàn thành đầy đủ tiêu chí bàn giao và đủ điều kiện đóng.
