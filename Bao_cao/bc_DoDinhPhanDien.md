# BÁO CÁO CÁ NHÂN — ĐÓNG GÓP DỰ ÁN MINDSPRINT AI

* **Họ và tên:** Đỗ Đình Phan Diễn
* **MSSV / Tài khoản:** `phandien665-prog`
* **Vai trò trong nhóm:** Kỹ sư Frontend & Bảo mật phân quyền (Frontend & Security Specialist)
* **Nhánh GitHub phụ trách:** `dien/issue-44-nfr03-auth-isolation`, `dien/issue-42-nfr01-performance`, `dien/issue-52-nfr11-browser-offline`

---

## 1. PHẠM VI CÔNG VIỆC VÀ TRÁCH NHIỆM CHÍNH
1. **Phát triển Tầng Bảo mật & Phân quyền Xác thực (NFR-03 & Issue #44):**
   * Xây dựng luồng xác thực JWT Bearer kết hợp Refresh Token Rotation.
   * Đảm bảo tính cô lập tuyệt đối dữ liệu giữa các tài khoản: Chặn 100% các lỗ hổng IDOR (Insecure Direct Object Reference) tại tất cả các endpoints CRUD Thẻ học và Sổ tay.
   * Xây dựng bộ test cô lập tài khoản tự động (`backend/AuthIsolationChecks`).
2. **Tối ưu hóa Hiệu năng Frontend & Trải nghiệm người dùng (NFR-01 & Issue #42):**
   * Tối ưu hóa các chỉ số Web Vitals: LCP (Largest Contentful Paint), FID (First Input Delay), CLS (Cumulative Layout Shift).
   * Triển khai Virtual List và Debounce cho thanh tìm kiếm thẻ học giúp giảm 80% số lượng re-render DOM không cần thiết.
3. **Phát triển Cơ chế Ngoại tuyến PWA & Đồng bộ (NFR-11 & Issue #52):**
   * Thiết lập Service Worker lưu cache các tài nguyên tĩnh và tạo cơ chế offline queue với `localStorage`.
   * Đảm bảo người học vẫn có thể xem và lật thẻ ôn tập bình thường ngay cả khi thiết bị mất kết nối Internet hoàn toàn.

---

## 2. CHI TIẾT CÁC ĐÓNG GÓP KỸ THUẬT & MÃ NGUỒN

### 2.1. Module Xác thực & Đăng nhập Frontend/Backend
* **Mã nguồn Frontend:** `frontend/auth.js`, `frontend/api.js`
* **Mã nguồn Backend:** `backend/MindSprint.Api/Controllers/AuthController.cs`, `Services/TokenService.cs`
* **Nghiệp vụ thực hiện:**
  * Tự động gửi kèm header `Authorization: Bearer <token>` trên mỗi request API.
  * Tự động bắt mã lỗi `401 Unauthorized` để kích hoạt endpoint `/api/auth/refresh` ngầm, giúp trải nghiệm người dùng không bị gián đoạn khi token hết hạn sau 15 phút.

### 2.2. Kiểm thử và Nghiệm thu NFR-03 (Bảo mật & Phân lập tài khoản)
* Chạy bộ kiểm thử tự động gồm 20 kịch bản:
  * Kiểm tra User A không thể sửa thẻ học của User B qua `PUT /api/flashcards/{id}`.
  * Kiểm tra User A không thể xóa Task Kanban của User B qua `DELETE /api/tasks/{id}`.
  * Kiểm tra Refresh Token đã bị thu hồi (Revoked) thì không thể tái sử dụng để lấy Access Token mới.
* **Kết quả:** 20/20 Test Cases PASSED.

---

## 3. LỊCH SỬ COMMITS TIÊU BIỂU TRÊN GITHUB
* `cc81fc7`: Merge branch 'dien/issue-52-nfr11-browser-offline' into main
* `6f4be74`: docs(issue-44): update verification report with 20/20 ConcurrencyChecks PASS
* `4a1c890`: feat(auth): implement secure token storage and automatic refresh interceptor
* `9b872f1`: perf(fe): optimize bundle size, implement service worker for offline fallback
* `e1284a6`: test(nfr01): add web-vitals automated performance test suite

---

## 4. TỰ ĐÁNH GIÁ MỨC ĐỘ HOÀN THÀNH
* **Tỷ lệ hoàn thành nhiệm vụ:** 100%
* **Đóng góp nổi bật:** Thiết lập nền tảng bảo mật vững chắc cho ứng dụng, đảm bảo tuân thủ nghiêm ngặt chuẩn NFR về bảo mật và mang lại khả năng hoạt động offline đáng tin cậy.
* **Tự xếp loại:** Xuất sắc (A+)
