# Kết quả chạy ban đầu — Sprint 3 / #17

**Ngày:** 26/10/2026 (Asia/Saigon). **Baseline ứng dụng:** `1a9fecb807e7232a898a27c826615aac657fd798`. Bộ tài liệu/test mới được quản lý trong nhánh `codex/complete-sprint-3`; commit/PR hoàn thiện là bằng chứng bàn giao. Không sửa hành vi ứng dụng trong lần này.

## Môi trường và cách tái hiện

Windows, Node **24.20.0**, .NET SDK **10.0.401** chạy dự án net8.0, Edge **156.0.4314.42**, Playwright đã có trong output build API. Browser chạy headless với profile sạch và HTTP fixture, service worker bị chặn; không dùng session cá nhân, cloud hay key AI thật. Checks backend gọi controller/service thật trên SQLite in-memory, không phải PostgreSQL. Đã dùng PdfPig thật để tạo/đọc PDF trong TutorChecks; phản hồi Gemini vẫn giả lập.

Từ gốc repo, chạy các lệnh dưới đây. Nếu chưa có Playwright runtime, build API theo README hoặc cung cấp Playwright cục bộ; có thể đặt `TUTOR_BROWSER` theo đường dẫn Chromium/Edge. Các file log đính kèm ghi kết quả thực tế của lần chạy này.

| Lệnh | Kết quả | Bằng chứng |
| --- | --- | --- |
| `node --test tests/frontend-session.test.cjs tests/frontend-validation.test.cjs tests/frontend-text.test.cjs tests/frontend-voice.test.cjs tests/fallback-cards.test.cjs` | **29/29 PASS**, 0 skip | [node-unit.txt](evidence/sprint-3/node-unit.txt) |
| `node --test --test-reporter=tap tests/kanban-browser.test.cjs tests/notebook-mobile-voice.test.cjs tests/cockpit-browser.test.cjs` | **3/3 PASS**, 0 skip | [browser.tap](evidence/sprint-3/browser.tap) |
| `node --test --test-reporter=tap tests/ai-cards-browser.test.cjs` | **1/1 PASS**, 0 skip; gồm TC-AI-01…05 | [ai-cards-browser.tap](evidence/sprint-3/ai-cards-browser.tap) |
| `dotnet run --project backend/KanbanChecks --no-restore` | **19 checks PASS** | [kanban-checks.txt](evidence/sprint-3/kanban-checks.txt) |
| `dotnet run --project backend/TutorChecks --no-restore` | **59 checks PASS** | [tutor-checks.txt](evidence/sprint-3/tutor-checks.txt) |

Tổng: **33 test Node/browser và 78 checks backend đạt**, không phải 111 test case nghiệp vụ độc lập. Các case nghiệp vụ ghép nhiều assertion và có ca chỉ chạy được một phần. Không cộng mock và live để suy ra độ phủ hoặc chất lượng production.

## Trạng thái từng nhóm test case

Đối chiếu [46 case có đầu vào/bước/mong đợi](sprint-3-test-cases.md). Một case PARTIAL vẫn cần hoàn thành các bước còn thiếu trước nghiệm thu FR.

| Case | Trạng thái | Kết quả thực tế và giới hạn |
| --- | --- | --- |
| TC-AUTH-01/02 | PARTIAL | Validation UI và dispatch login/register đúng được kiểm tra bằng JS harness; chưa tạo tài khoản live hay thử email trùng trên DB. |
| TC-AUTH-03 | PASS (JS/HTTP giả lập) | Phiên dùng chung các tính năng; browser hiển thị đúng tài khoản; sai thông tin không ghi đè phiên hiện tại. |
| TC-AUTH-04/05/06 | PASS (JS/HTTP giả lập) | Single-flight refresh, refresh lỗi kết thúc tất cả request, phản hồi cũ không ghi đè account mới. Browser cũng kiểm tra checklist riêng từng account. |
| TC-AUTH-07 | PARTIAL | Logout xóa user/UI và chuyển ngữ cảnh trong browser; chưa xác minh revoke token trên server thật. |
| TC-AUTH-08 | CHƯA CHẠY | Chỉ thử UI khi Google chưa bật; chưa thử ID token/nonce/origin/link thật trong lần này. |
| TC-CARD-01…05 | CHƯA CHẠY đầy đủ | Browser tải lại bộ thẻ AI đã lưu không đủ chứng minh CRUD/concurrency/SRS/quiz toàn bộ. |
| TC-AI-01 | PASS (HTTP giả lập) | Trả 3 thẻ hợp lệ + 1 rỗng, UI có đúng 3 preview và chưa gửi lưu. |
| TC-AI-02/03 | PASS (HTTP giả lập) | Bỏ chọn Gamma; Alpha lưu được, Beta lỗi 503; retry chỉ lưu Beta, không trùng Alpha. |
| TC-AI-04 | PASS (HTTP giả lập) | Tải lại trang lấy dữ liệu fixture đã lưu; thư viện có bộ `Sprint 3 QA` với 2 thẻ. Không chứng minh độ bền PostgreSQL. |
| TC-AI-05 | PASS (HTTP giả lập) | 429 giữ phiên QA, sinh preview dự phòng có nhãn; không tự lưu fallback. |
| TC-AI-06/07 | CHƯA CHẠY | Chưa chạy toàn ma trận input của form AI hoặc Gemini/PostgreSQL thật. |
| TC-NB-01 | PARTIAL | Ownership Gia sư/controller được kiểm tra; chưa chạy CRUD/cascade sổ tay toàn luồng. |
| TC-NB-02 | PARTIAL | Browser kiểm tra lỗi tải/chuyển sổ tay, bỏ ngữ cảnh cũ; chưa toàn bộ ghi chú/chuyển account ở backend. |
| TC-NB-03/04 | PARTIAL | Validation URL và file phía UI đạt; chưa chạy hết giới hạn Store, SSRF/redirect và URL công khai thật. |
| TC-NB-05 | PARTIAL | Controller thật nhập PDF chứa đề, trích xuất được text, gọi Gia sư đúng nguồn; kiểm tra giới hạn file UI. Chưa đủ định dạng/giới hạn nguồn backend trong ca này. |
| TC-NB-06 | CHƯA CHẠY | Chưa kiểm tra xóa nguồn và giữ ghi chú toàn luồng. |
| TC-NB-07 | PARTIAL | Controller thật từ chối sổ tay không nguồn; dùng đúng nguồn và tái dùng cache chat; browser gửi đúng route. Chưa xác minh chất lượng trích dẫn Gemini thật. |
| TC-NB-08 | PARTIAL | JS quota giữ phiên; browser AI 503 giữ draft và bàn phím; chưa toàn bộ lỗi mạng/cloud của chat. |
| TC-NB-09/10 | CHƯA CHẠY | Không khẳng định Studio và lưu ghi chú/thẻ đã đạt từ test Gia sư. |
| TC-KB-01/02 | PASS (browser giả lập + controller/SQLite) | CRUD UI, thứ tự kéo thả và vị trí request đúng; sửa/move còn sau DbContext mới. |
| TC-KB-03/04 | PASS (browser giả lập) | Bộ lọc giữ task ẩn; move lỗi không đổi thứ tự; retry thành công. |
| TC-KB-05 | PASS (controller/SQLite) | User khác list rỗng, update/move/delete 404; kiểm tra không qua HTTP middleware. |
| TC-KB-06 | PARTIAL | Browser xác nhận xóa và controller đọc lại đã xóa; chưa assertion riêng nhánh hủy xóa. |
| TC-KB-07 | PASS (browser giả lập) | Viewport nhỏ không tràn; thao tác lên/xuống/Enter giữ focus; no-op không mutation. |
| TC-KB-08 | PARTIAL | Controller từ chối tiêu đề trắng, Position âm và status sai; chưa kiểm tra hết biên độ dài và priority trong lần này. |
| TC-EXT-01 | PASS (controller/SQLite, AI giả lập) | 59 checks gồm ownership, chế độ giải/check/hint, thiếu đầu vào và chặn hint lộ lời giải. Không chấm chất lượng Gemini thật. |
| TC-EXT-02 | CHƯA CHẠY | Không dùng 59 TutorChecks thường để xác nhận bộ programming riêng. |
| TC-EXT-03 | PARTIAL | Adapter speech giả lập đạt opt-in, sửa transcript, không tự gửi, lỗi và hủy/dừng khi đổi ngữ cảnh; chưa thử micro/loa thật. |
| TC-EXT-04…07 | CHƯA CHẠY | Lịch học/streak/điểm yếu/offline đầy đủ không thuộc lần chạy ban đầu này. |
| TC-EXT-08 | BLOCKED | GAP-01: chưa tìm thấy triển khai kế hoạch AI #36 trong baseline, dù issue đã đóng. |

## Bằng chứng UML và rà soát tài liệu

Đã parse/render **6/6 sơ đồ Mermaid 11.4.1**, xuất SVG và cập nhật PNG ERD: [log](evidence/sprint-3/diagrams.txt), [danh mục UML](../architecture/uml.md). ERD nguồn và model snapshot được đối chiếu số bảng/cột, tên cột, FK và unique index. Kiểm tra liên kết/ID của SRS, UML và test case trước bàn giao.

Chạy `python tests/check-sprint3-docs.py` để đối chiếu tên 91 cột/12 bảng với EF snapshot, 23 FR có truy vết, 18 UC hiện trạng, 46 case không trùng, liên kết nội bộ và verdict của các log. Kiểm tra này dùng thư viện chuẩn, không cần thêm dependency. Render dùng Mermaid 11.4.1; nguồn `.mmd` và SVG hiện hành đều được bàn giao.

Đã thử bỏ tạm điều kiện bỏ qua thẻ đã lưu trong vòng retry: test browser mới thất bại đúng assertion chống lưu trùng. Mã ứng dụng được khôi phục nguyên byte sau kiểm tra, không có diff: [bằng chứng mutation](evidence/sprint-3/mutation-check.txt). Khi có bản nháp khác trong workspace, dùng `python tests/check-sprint3-docs.py --index` để kiểm tra đúng nội dung đã stage và chỉ chấp nhận liên kết tới file được quản lý phiên bản.

## Kết luận cho phạm vi issue

#17 yêu cầu bộ test case và **kết quả chạy ban đầu**: đã có 46 case và kết quả thực tế ở bốn nhóm chức năng, kèm ca chưa chạy/blocked. Hoàn thành issue này không có nghĩa mọi case đều PASS hoặc mọi FR đã nghiệm thu. #20/#58 bàn giao sơ đồ và đặc tả hiện trạng, ghi rõ các điểm chưa nghiệm thu.

Đối chiếu #19: GitHub ghi CLOSED nhưng body/comments không đính kèm báo cáo chi tiết; không tái sử dụng trạng thái đó làm kết quả live. Các NFR #42…#55 và kiểm thử Google, micro, PostgreSQL/cloud, chất lượng AI vẫn theo [kế hoạch Sprint 4](../architecture/sprint-4-test-plan.md). Không giảm ngưỡng hoặc đóng các issue đó trong lần này.
