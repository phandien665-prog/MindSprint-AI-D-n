# HỒ SƠ NỘP BÁO CÁO VÀ ĐỒ ÁN MÃ NGUỒN — DỰ ÁN MINDSPRINT AI

* **Kho lưu trữ GitHub:** [https://github.com/tungtungsahul/MindSprint-AI-D-n](https://github.com/tungtungsahul/MindSprint-AI-D-n)
* **Bản chạy trực tiếp (Live Production):**
  * Frontend: [https://mindsprint-ai-d-n-frontend.vercel.app/](https://mindsprint-ai-d-n-frontend.vercel.app/)
  * Backend API: [https://mindsprint-api-zyur.onrender.com](https://mindsprint-api-zyur.onrender.com)

---

## 📁 CẤU TRÚC HỒ SƠ DỰ ÁN

```
MindSprint-AI-D-n/
├── Bao_cao/                               # Thư mục Báo cáo theo yêu cầu
│   ├── Bao_cao_Tong_hop.md                # Báo cáo tổng hợp toàn diện (Mục 1, 2, 3, 4 + TLTK)
│   ├── bc_NguyenTranBaoDuy.md             # Báo cáo cá nhân: Nguyễn Trần Bảo Duy (Backend Lead)
│   ├── bc_DoDinhPhanDien.md               # Báo cáo cá nhân: Đỗ Đình Phan Diễn (Frontend & Auth)
│   ├── bc_VuDinhHung.md                   # Báo cáo cá nhân: Vũ Đình Hùng (Responsive & Speech AI)
│   ├── bc_MinhChien.md                    # Báo cáo cá nhân: Minh Chiến (Notebook AI & Load Test)
│   └── bc_TuanLinh.md                     # Báo cáo cá nhân: Tuấn Linh (CSDL 3NF & UML)
│
├── Code_Docs/                             # Tài liệu kỹ thuật mã nguồn & GitHub
│   └── HUONG_DAN_CODE_VA_GITHUB.md        # Chi tiết Connect DB, CRUD Sản phẩm & 5 nhánh Git
│
├── backend/                               # Thư mục mã nguồn Backend (ASP.NET Core 8 Web API)
│   └── MindSprint.Api/                    # Controllers, Models, Data (EF Core 8), Services
│
├── frontend/                              # Thư mục mã nguồn Frontend (HTML5, Modern CSS, JS)
└── tests/                                 # Kịch bản kiểm thử (NFRs, Unit Test, Playwright, k6)
```

---

## 📌 TÓM TẮT NỘI DUNG CHÍNH

### 1. Báo cáo tổng hợp (`Bao_cao/Bao_cao_Tong_hop.md`)
1. **Phát biểu bài toán:** Lý do chọn đề tài, đối tượng, phạm vi nghiên cứu, giải quyết đường cong quên lãng Ebbinghaus.
2. **Phân tích & thiết kế:**
   * **2.1 Thiết kế CSDL:** Xác định 12 thực thể $\rightarrow$ Xác định mối quan hệ $\rightarrow$ Quá trình chuẩn hóa chi tiết 1NF $\rightarrow$ 2NF $\rightarrow$ 3NF $\rightarrow$ Sơ đồ ERD (Mermaid) $\rightarrow$ Database Diagram $\rightarrow$ Data Dictionary chi tiết từng bảng.
   * **2.2 Thiết kế hệ thống:** Sơ đồ Use Case tổng quát và phân rã, Bảng đặc tả Use Case, 7 sơ đồ Activity Diagrams (Mermaid + mô tả chi tiết), Sơ đồ lớp Class Diagram theo mô hình MVC, Sơ đồ triển khai Deployment Diagram.
3. **Triển khai:** Frontend (PWA, Web Speech API, Cockpit UI), Backend (ASP.NET Core 8, EF Core 8, PostgreSQL, JWT Token Rotation), Kiểm thử (Unit Test, Integration Test, NFR-01, NFR-02, NFR-03, NFR-07, NFR-11).
4. **Kết quả & Hướng phát triển:** Demo kết quả, kết luận, kế hoạch phát triển tương lai và danh mục tài liệu tham khảo chuẩn học thuật.

### 2. Code & GitHub (`Code_Docs/HUONG_DAN_CODE_VA_GITHUB.md`)
1. **Connect DB:** Chi tiết kết nối PostgreSQL với `Npgsql`, chuỗi kết nối, `AppDbContext` và tự động migration.
2. **CRUD Quản lý sản phẩm (SP):** Triển khai đầy đủ Create, Read, Update, Delete trong `FlashcardsController.cs` kèm Optimistic Concurrency Control (`Version`).
3. **GitHub 5 nhánh (5 Branches):** Đã phân nhánh và liên kết commit tương ứng với 5 thành viên:
   * `branch-1-duy-backend-srs` (Nguyễn Trần Bảo Duy)
   * `branch-2-dien-frontend-auth` (Đỗ Đình Phan Diễn)
   * `branch-3-hung-ui-speech` (Vũ Đình Hùng)
   * `branch-4-chien-notebook-plan` (Minh Chiến)
   * `branch-5-linh-database-uml` (Tuấn Linh)
