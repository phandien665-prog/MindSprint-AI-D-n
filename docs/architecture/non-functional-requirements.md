# Yêu cầu phi chức năng — MindSprintAI

Ngày lập: **12/10/2026** (Asia/Saigon). Nguồn kiến trúc: nhánh `main`, commit `9ba7acd2de05bf017ad5c2711644c9ee98bd6542`.

## Quy ước và phạm vi

Các mục dưới đây là **mục tiêu nghiệm thu đề xuất cho Sprint 4**, không phải cam kết hệ thống đã đạt. Theo [phân công giữa kỳ được điều chỉnh ngày 14/10/2026](../../tasks/plan.md), toàn bộ nhiệm vụ Test, gồm 14 NFR, ở Sprint 4; các nhiệm vụ tính năng/giao diện/tài liệu ở Sprint 3. Ngưỡng do tài liệu này đề xuất cần được nhóm chốt tại sprint planning và ghi phiên bản trước khi đo; không giảm ngưỡng để hợp thức hóa kết quả thất bại. Các giới hạn ghi “hiện có” được đọc từ mã nguồn, chưa thay cho kiểm thử runtime.

Phạm vi: giao diện chính + ASP.NET Core/PostgreSQL trên `main`; FastAPI/SQLite độc lập không nằm trong kết quả nghiệm thu này. P0 là rủi ro bảo mật/toàn vẹn chặn nghiệm thu; P1 là chất lượng/vận hành cần xác nhận. Mọi yêu cầu đều có một issue kiểm thử riêng ở Sprint 4; người chủ trì nằm trong [kế hoạch kiểm thử Sprint 4](sprint-4-test-plan.md).

Hồ sơ tải chuẩn (NFR-01/02): staging riêng, ghi CPU/RAM, region, phiên bản image/.NET/PostgreSQL và network RTT; 50 tài khoản test, 1.814 thẻ hệ thống theo seed hiện có và mỗi tài khoản 500 thẻ riêng, 100 task, 10 notebook × 5 nguồn × 5.000 ký tự. Dữ liệu này là fixture cần tạo, không phải dữ liệu thực đã thống kê. Mỗi VU giữ tài khoản riêng, think time 1 giây; request mix 35% GET flashcards, 25% GET tasks, 20% GET notebooks, 10% POST task và 10% PATCH move task đã tạo. Tối thiểu 100 mẫu cho mỗi route mỗi lần chạy; báo p95 riêng từng route. Kiểm tra assert body/ownership, không tính response sai nội dung là thành công. Loại AI/upload/Google provider thật khỏi benchmark CRUD và đo riêng. Lỗi ngoài dự kiến gồm timeout, network error, assertion fail và status không thuộc hợp đồng; 429/quota chỉ được loại ở các bài cố ý gây lỗi provider.

Đo warm-up 2 phút rồi steady load 10 phút. Dùng k6/JMeter hoặc công cụ nhóm đã có, không bắt buộc thêm dependency vào ứng dụng. Không chạy tải, fault injection, restore hoặc race test trên dữ liệu người dùng thật.

## Danh mục

| ID | Thuộc tính | Ưu tiên | Thành phần |
| --- | --- | --- | --- |
| [NFR-01](#nfr-01) | Hiệu năng phản hồi | P1 | API CRUD, frontend, EF Core |
| [NFR-02](#nfr-02) | Khả năng chịu tải và giới hạn tài nguyên | P1 | Kestrel, PostgreSQL, GeminiAvailability, URL renderer |
| [NFR-03](#nfr-03) | Xác thực, phân quyền và cô lập tài khoản | P0 | JWT, TokenService, GoogleSignInService, controllers, phiên frontend |
| [NFR-04](#nfr-04) | An toàn dữ liệu đầu vào và nguồn ngoài | P0 | NotebookUrlReader/Importer/Renderer, upload, text-renderer, validation API |
| [NFR-05](#nfr-05) | Bảo mật cấu hình, truyền tải và quyền riêng tư | P0 | Vercel, Render, Program.cs, cấu hình và log |
| [NFR-06](#nfr-06) | Khả năng phục hồi khi AI và mạng lỗi | P1 | GeminiService, GeminiAvailability, API client, UI |
| [NFR-07](#nfr-07) | Toàn vẹn dữ liệu và cập nhật đồng thời | P0 | EF Core, PostgreSQL, Flashcards/Tasks/Study controllers |
| [NFR-08](#nfr-08) | Tính sẵn sàng và phát hiện trạng thái dịch vụ | P1 | API health, PostgreSQL, monitor staging |
| [NFR-09](#nfr-09) | Sao lưu và khôi phục dữ liệu | P1 | PostgreSQL và quy trình vận hành |
| [NFR-10](#nfr-10) | Khả dụng và tiếp cận giao diện | P1 | Giao diện đăng nhập, thư viện, Kanban, notebook, dialogs |
| [NFR-11](#nfr-11) | Tương thích trình duyệt và chế độ offline | P1 | Service worker, localStorage, account-scoped state |
| [NFR-12](#nfr-12) | Khả năng bảo trì và triển khai tái lập | P1 | GitHub Actions, .NET build, frontend build, Docker, EF migrations |
| [NFR-13](#nfr-13) | Khả năng quan sát và chẩn đoán lỗi | P1 | API logging, correlation, đo lỗi/thời gian/provider |
| [NFR-14](#nfr-14) | Chất lượng và an toàn đầu ra AI | P1 | NotebookAi, TutorService, JSON validation, UI render |

<a id="nfr-01"></a>

## NFR-01: Hiệu năng phản hồi

**Ưu tiên:** P1. **Trạng thái:** Đề xuất / chưa nghiệm thu. **Thành phần:** API CRUD, frontend, EF Core.

**Hiện trạng:** API đọc toàn bộ danh sách thẻ/công việc; chưa có báo cáo tải hoặc phân trang.

**Tiêu chí đạt:**

- Ở hồ sơ tải chuẩn 20 VU: p95 GET ≤ 500 ms, p95 thao tác ghi ≤ 800 ms, tỷ lệ lỗi ngoài dự kiến ≤ 1%.
- Trang chủ đã đăng nhập: LCP ≤ 2,5 s, CLS ≤ 0,1; p75 INP ≤ 200 ms trên tối thiểu 30 tương tác cho mỗi cấu hình kiểm thử (đo lab, chưa phải số liệu người dùng thực).

**Cách kiểm thử:**

1. Chạy tải chuẩn 10 phút sau warm-up 2 phút; báo cáo riêng theo endpoint và đọc/ghi.
2. Đo 5 lần tải trang trên desktop và mobile, ghi cấu hình mạng/CPU; đánh giá p75 LCP/CLS và tương tác INP bằng công cụ đo phù hợp.

**Bằng chứng:** Báo cáo tải JSON/HTML, trace trình duyệt, p50/p95/p99, số request và tỷ lệ lỗi.

**Nguồn mã:** [frontend/api.js](https://github.com/tungtungsahul/MindSprint-AI-D-n/blob/9ba7acd2de05bf017ad5c2711644c9ee98bd6542/frontend/api.js), [backend/MindSprint.Api/Controllers/FlashcardsController.cs](https://github.com/tungtungsahul/MindSprint-AI-D-n/blob/9ba7acd2de05bf017ad5c2711644c9ee98bd6542/backend/MindSprint.Api/Controllers/FlashcardsController.cs), [backend/MindSprint.Api/Controllers/TasksController.cs](https://github.com/tungtungsahul/MindSprint-AI-D-n/blob/9ba7acd2de05bf017ad5c2711644c9ee98bd6542/backend/MindSprint.Api/Controllers/TasksController.cs).

**Phụ thuộc kiểm thử:** Không có.

<a id="nfr-02"></a>

## NFR-02: Khả năng chịu tải và giới hạn tài nguyên

**Ưu tiên:** P1. **Trạng thái:** Đề xuất / chưa nghiệm thu. **Thành phần:** Kestrel, PostgreSQL, GeminiAvailability, URL renderer.

**Hiện trạng:** Gemini giới hạn đồng thời mặc định 2 mỗi tiến trình; renderer 2 phiên. Chưa có giới hạn phân tán hoặc kết quả kiểm thử dung lượng.

**Tiêu chí đạt:**

- Tăng tải từ 20 lên 50 VU trong 2 phút, giữ 50 VU 10 phút: p95 GET ≤ 1 s, p95 ghi ≤ 1,5 s; lỗi ngoài dự kiến ≤ 1%; tiến trình không crash/OOM.
- Với cấu hình MaxConcurrentRequests=2, số HTTP Gemini đang chạy ≤ 2; renderer ≤ 2 phiên; hủy request giải phóng slot.
- Sau tải và idle 5 phút, bộ nhớ tiến trình không vượt 120% baseline sau warm-up, không tăng liên tục qua 3 chu kỳ tải; ghi rõ RAM/CPU máy.

**Cách kiểm thử:**

1. Dùng cùng dữ liệu và hỗn hợp request như NFR-01; đo CPU/RAM/connection pool.
2. Dùng provider và trang nguồn giả lập có bộ đếm concurrency; gửi 10 request, hủy một phần rồi kiểm tra request mới chạy được.

**Bằng chứng:** Biểu đồ tài nguyên, bộ đếm concurrency, lỗi/timeout, cấu hình test.

**Nguồn mã:** [backend/MindSprint.Api/Services/GeminiAvailability.cs](https://github.com/tungtungsahul/MindSprint-AI-D-n/blob/9ba7acd2de05bf017ad5c2711644c9ee98bd6542/backend/MindSprint.Api/Services/GeminiAvailability.cs), [backend/MindSprint.Api/Services/NotebookPageRenderer.cs](https://github.com/tungtungsahul/MindSprint-AI-D-n/blob/9ba7acd2de05bf017ad5c2711644c9ee98bd6542/backend/MindSprint.Api/Services/NotebookPageRenderer.cs).

**Phụ thuộc kiểm thử:** NFR-01.

<a id="nfr-03"></a>

## NFR-03: Xác thực, phân quyền và cô lập tài khoản

**Ưu tiên:** P0. **Trạng thái:** Đề xuất / chưa nghiệm thu. **Thành phần:** JWT, TokenService, GoogleSignInService, controllers, phiên frontend.

**Hiện trạng:** JWT kiểm tra issuer/audience/signature/lifetime; refresh rotation/revoke; lọc UserId/OwnerId. Token đang lưu localStorage.

**Tiêu chí đạt:**

- Mọi API dữ liệu cá nhân từ chối JWT thiếu/sai chữ ký/sai issuer/sai audience/hết hạn (401); token hết hạn được test ngoài khoảng ClockSkew đã cấu hình.
- Tài khoản B không đọc/sửa/xóa tài nguyên A kể cả đổi ID/nested source/note ID; dữ liệu thẻ hệ thống chỉ được đọc theo thiết kế.
- Refresh token cũ sau rotation, hết hạn hoặc bị revoke không cấp phiên mới; Google nonce giả/hết hạn và liên kết thiếu mật khẩu bị từ chối.
- Đổi tài khoản/đăng xuất xóa trạng thái hiển thị của phiên cũ và bỏ kết quả đến trễ; đăng xuất chỉ thu hồi refresh token, JWT đã cấp có thể còn hợp lệ đến hết hạn cộng ClockSkew.

**Cách kiểm thử:**

1. Tạo A/B riêng; chạy ma trận endpoint CRUD, review, study, notebook, tutor và nested resources.
2. Kiểm tra rotation/revoke tuần tự và 2 request refresh đồng thời; nếu cùng token cấp hai phiên mới thì ghi lỗi, không coi single-flight trong một tab là bảo đảm server.
3. Chạy các ca Google giả lập và chuyển tài khoản khi API đang chờ.

**Bằng chứng:** Ma trận endpoint/status, response đã che token, test session và ảnh chuyển tài khoản.

**Nguồn mã:** [backend/MindSprint.Api/Services/TokenService.cs](https://github.com/tungtungsahul/MindSprint-AI-D-n/blob/9ba7acd2de05bf017ad5c2711644c9ee98bd6542/backend/MindSprint.Api/Services/TokenService.cs), [backend/MindSprint.Api/Services/GoogleSignInService.cs](https://github.com/tungtungsahul/MindSprint-AI-D-n/blob/9ba7acd2de05bf017ad5c2711644c9ee98bd6542/backend/MindSprint.Api/Services/GoogleSignInService.cs), [frontend/auth.js](https://github.com/tungtungsahul/MindSprint-AI-D-n/blob/9ba7acd2de05bf017ad5c2711644c9ee98bd6542/frontend/auth.js), [frontend/api.js](https://github.com/tungtungsahul/MindSprint-AI-D-n/blob/9ba7acd2de05bf017ad5c2711644c9ee98bd6542/frontend/api.js).

**Phụ thuộc kiểm thử:** Không có.

<a id="nfr-04"></a>

## NFR-04: An toàn dữ liệu đầu vào và nguồn ngoài

**Ưu tiên:** P0. **Trạng thái:** Đề xuất / chưa nghiệm thu. **Thành phần:** NotebookUrlReader/Importer/Renderer, upload, text-renderer, validation API.

**Hiện trạng:** URL có kiểm tra DNS/socket/redirect và giới hạn tải; upload hỗ trợ PDF/TXT/MD/CSV. Giới hạn của URL importer khác upload trực tiếp.

**Tiêu chí đạt:**

- Chặn SSRF tới loopback/private/link-local/metadata, IPv4/IPv6, redirect sang mạng riêng và DNS rebinding; không truyền token/cookie tới nguồn.
- Payload XSS từ tiêu đề, task, thẻ, Markdown/LaTeX và nội dung AI không chạy script hoặc event handler; URL javascript: bị chặn khi render link.
- File rỗng/sai loại/vượt 10 MiB, URL quá giới hạn và dữ liệu task sai trả 4xx có thông báo; không ghi nguồn/task không hợp lệ và không crash.
- Kiểm tra 19/20/21 nguồn, 200.000/200.001 ký tự và biên multipart; việc cắt văn bản phải được hiển thị rõ cho người dùng. Hiện Store cắt 200.001 ký tự âm thầm nên cần ghi failure nếu chưa sửa.

**Cách kiểm thử:**

1. Dùng máy chủ nguồn kiểm thử do nhóm kiểm soát; kiểm tra từng redirect và đích kết nối.
2. Chạy bộ payload XSS/URL/file/ZIP/XML lỗi và các biên kích thước; đối chiếu trạng thái DB trước/sau.

**Bằng chứng:** Danh sách payload đã che dữ liệu nhạy cảm, log kết nối đích, ảnh UI và kết quả DB.

**Nguồn mã:** [backend/URL_IMPORT.md](https://github.com/tungtungsahul/MindSprint-AI-D-n/blob/9ba7acd2de05bf017ad5c2711644c9ee98bd6542/backend/URL_IMPORT.md), [backend/MindSprint.Api/Services/NotebookUrlReader.cs](https://github.com/tungtungsahul/MindSprint-AI-D-n/blob/9ba7acd2de05bf017ad5c2711644c9ee98bd6542/backend/MindSprint.Api/Services/NotebookUrlReader.cs), [backend/MindSprint.Api/Controllers/NotebooksController.cs](https://github.com/tungtungsahul/MindSprint-AI-D-n/blob/9ba7acd2de05bf017ad5c2711644c9ee98bd6542/backend/MindSprint.Api/Controllers/NotebooksController.cs), [frontend/text-renderer.js](https://github.com/tungtungsahul/MindSprint-AI-D-n/blob/9ba7acd2de05bf017ad5c2711644c9ee98bd6542/frontend/text-renderer.js).

**Phụ thuộc kiểm thử:** Không có.

<a id="nfr-05"></a>

## NFR-05: Bảo mật cấu hình, truyền tải và quyền riêng tư

**Ưu tiên:** P0. **Trạng thái:** Đề xuất / chưa nghiệm thu. **Thành phần:** Vercel, Render, Program.cs, cấu hình và log.

**Hiện trạng:** main có CORS allowlist, kiểm tra JWT key, Swagger chỉ Development. Seed demo tắt Production nhưng endpoint /api/auth/demo vẫn có thể tạo tài khoản.

**Tiêu chí đạt:**

- Bản staging/production dùng HTTPS frontend/API, không mixed content; origin hợp lệ có CORS header, origin lạ không có Access-Control-Allow-Origin (không yêu cầu CORS tự trả 403).
- Không có API key, JWT key, password hoặc chuỗi kết nối chứa mật khẩu trong frontend/dist, commit mới, response hay log; phát hiện secret lịch sử phải ghi remediation riêng.
- Production không mở Swagger và không cấp tài khoản demo có mật khẩu cố định qua endpoint; cấu hình JWT key hoặc allowlist thiếu phải fail startup rõ ràng.
- Mô tả cho người dùng nội dung tài liệu/câu hỏi gửi sang Gemini; không đưa JWT, refresh token hoặc dữ liệu của tài khoản khác vào prompt.

**Cách kiểm thử:**

1. Build với cấu hình giả lập và kiểm tra artifact; kiểm tra HTTPS/CORS ở public staging với origin đúng/sai.
2. Gọi /api/auth/demo trong môi trường Production riêng; kiểm tra log và body gửi provider giả lập.
3. Kiểm tra giao diện mô tả luồng dữ liệu AI; không dùng tài liệu cá nhân thật cho bài test.

**Bằng chứng:** Network HAR đã che bí mật, kiểm tra artifact/log, cấu hình đã ẩn giá trị, ảnh thông báo AI.

**Nguồn mã:** [backend/MindSprint.Api/Program.cs](https://github.com/tungtungsahul/MindSprint-AI-D-n/blob/9ba7acd2de05bf017ad5c2711644c9ee98bd6542/backend/MindSprint.Api/Program.cs), [backend/MindSprint.Api/Controllers/AuthController.cs](https://github.com/tungtungsahul/MindSprint-AI-D-n/blob/9ba7acd2de05bf017ad5c2711644c9ee98bd6542/backend/MindSprint.Api/Controllers/AuthController.cs), [frontend/build.mjs](https://github.com/tungtungsahul/MindSprint-AI-D-n/blob/9ba7acd2de05bf017ad5c2711644c9ee98bd6542/frontend/build.mjs), [CI-CD-SETUP.md](https://github.com/tungtungsahul/MindSprint-AI-D-n/blob/9ba7acd2de05bf017ad5c2711644c9ee98bd6542/CI-CD-SETUP.md).

**Phụ thuộc kiểm thử:** Không có.

<a id="nfr-06"></a>

## NFR-06: Khả năng phục hồi khi AI và mạng lỗi

**Ưu tiên:** P1. **Trạng thái:** Đề xuất / chưa nghiệm thu. **Thành phần:** GeminiService, GeminiAvailability, API client, UI.

**Hiện trạng:** Gemini retry/fallback/cooldown, ngân sách timeout/hủy request; lỗi có code. Chưa xác nhận mọi luồng UI khi mất mạng.

**Tiêu chí đạt:**

- Provider giả lập 429/500/503/404/401/timeout/JSON lỗi tạo lỗi API có kiểm soát; 429 giữ phiên và cung cấp thời gian thử lại; fallback chỉ theo cấu hình.
- Mỗi lần gọi GeminiService bị giới hạn bởi TotalTimeoutSeconds (mặc định 150 s, test cho phép sai số 5 s) gồm chờ slot/retry; hủy client ngừng công việc và giải phóng slot.
- API CRUD vẫn dùng được khi Gemini lỗi; form/nội dung đã nhập được giữ để thử lại; không báo lưu thành công khi ghi DB thất bại.
- Ca mất response sau khi server đã ghi phải được phát hiện: retry không được âm thầm tạo bản ghi trùng. Chưa có idempotency contract chung nên đây là ca cần kiểm chứng.

**Cách kiểm thử:**

1. Chạy harness provider giả lập; ghi số lần gọi, model, Retry-After và thời gian.
2. Giả lập offline, mất kết nối và 429 trong trình duyệt; kiểm tra giữ form, session và dữ liệu sau reconnect.
3. Với tutor nhiều lượt provider, đo từng CallAsync và tổng endpoint riêng; không suy diễn 150 s là deadline chung của cả endpoint.

**Bằng chứng:** Timeline request, số retry/fallback, test UI và đối chiếu dữ liệu sau lỗi.

**Nguồn mã:** [backend/MindSprint.Api/Services/GeminiService.cs](https://github.com/tungtungsahul/MindSprint-AI-D-n/blob/9ba7acd2de05bf017ad5c2711644c9ee98bd6542/backend/MindSprint.Api/Services/GeminiService.cs), [tests/GeminiReliability/Program.cs](https://github.com/tungtungsahul/MindSprint-AI-D-n/blob/9ba7acd2de05bf017ad5c2711644c9ee98bd6542/tests/GeminiReliability/Program.cs), [frontend/api.js](https://github.com/tungtungsahul/MindSprint-AI-D-n/blob/9ba7acd2de05bf017ad5c2711644c9ee98bd6542/frontend/api.js), [frontend/js/kanban.js](https://github.com/tungtungsahul/MindSprint-AI-D-n/blob/9ba7acd2de05bf017ad5c2711644c9ee98bd6542/frontend/js/kanban.js).

**Phụ thuộc kiểm thử:** Không có.

<a id="nfr-07"></a>

## NFR-07: Toàn vẹn dữ liệu và cập nhật đồng thời

**Ưu tiên:** P0. **Trạng thái:** Đề xuất / chưa nghiệm thu. **Thành phần:** EF Core, PostgreSQL, Flashcards/Tasks/Study controllers.

**Hiện trạng:** Có unique indexes và Version của thẻ; kiểm tra Version là optional, chưa cấu hình EF concurrency token. Kanban sắp vị trí trong SaveChanges nhưng chưa bảo đảm giữa request đồng thời.

**Tiêu chí đạt:**

- Hai client sửa thẻ cùng Version: chỉ một cập nhật thắng; bản còn lại nhận 409 và không ghi đè âm thầm. Test cả request cùng thời điểm và request thiếu Version.
- Hai thao tác move/create/delete Kanban đồng thời không mất task hoặc để Position trùng/hổng sau khi hoàn tất; mỗi cột có thứ tự 0..n-1.
- Review/ngày học lặp hoặc đồng thời không tạo hàng trùng theo unique key, không mất dữ liệu đã xác nhận; lỗi ghi một phần được rollback.
- Ngày học/streak giữ đúng ngày Asia/Saigon qua biên 23:59/00:00 và restart; UTC timestamp không được dùng thay ngày học địa phương.

**Cách kiểm thử:**

1. Dùng barrier gửi request đồng thời tới PostgreSQL thật, tối thiểu 20 vòng mỗi ca; không thay bằng SQLite/in-memory.
2. Đọc DB/GET sau mỗi vòng, kiểm tra version/count/order/foreign key và dấu mốc thời gian.

**Bằng chứng:** Timeline request/response, truy vấn invariants đã che dữ liệu, kết quả race test.

**Nguồn mã:** [backend/MindSprint.Api/Controllers/FlashcardsController.cs](https://github.com/tungtungsahul/MindSprint-AI-D-n/blob/9ba7acd2de05bf017ad5c2711644c9ee98bd6542/backend/MindSprint.Api/Controllers/FlashcardsController.cs), [backend/MindSprint.Api/Controllers/TasksController.cs](https://github.com/tungtungsahul/MindSprint-AI-D-n/blob/9ba7acd2de05bf017ad5c2711644c9ee98bd6542/backend/MindSprint.Api/Controllers/TasksController.cs), [backend/MindSprint.Api/Controllers/StudyStatsController.cs](https://github.com/tungtungsahul/MindSprint-AI-D-n/blob/9ba7acd2de05bf017ad5c2711644c9ee98bd6542/backend/MindSprint.Api/Controllers/StudyStatsController.cs), [backend/MindSprint.Api/Data/AppDbContext.cs](https://github.com/tungtungsahul/MindSprint-AI-D-n/blob/9ba7acd2de05bf017ad5c2711644c9ee98bd6542/backend/MindSprint.Api/Data/AppDbContext.cs).

**Phụ thuộc kiểm thử:** NFR-03.

<a id="nfr-08"></a>

## NFR-08: Tính sẵn sàng và phát hiện trạng thái dịch vụ

**Ưu tiên:** P1. **Trạng thái:** Đề xuất / chưa nghiệm thu. **Thành phần:** API health, PostgreSQL, monitor staging.

**Hiện trạng:** /healthz chỉ trả status=ok; chưa kiểm tra DB, chưa có readiness và SLO monitor được kiểm chứng.

**Tiêu chí đạt:**

- Trong cửa sổ quan sát staging 24 giờ, probe mỗi phút: tỷ lệ request CRUD hợp lệ thành công ≥ 99%; timeout mỗi probe 5 s, tính cả cold start/maintenance trong mẫu.
- Liveness còn thành công khi tiến trình sống; readiness thất bại (503) khi DB không truy cập được; /healthz hiện tại chỉ là liveness, cần ghi failure nếu chưa có readiness.
- Monitor phát hiện API không khả dụng sau tối đa 5 phút và có sự kiện/cảnh báo kiểm thử; không tiết lộ cấu hình qua health response.

**Cách kiểm thử:**

1. Chạy monitor có authentication cho CRUD bằng tài khoản test; lưu mẫu lỗi/thành công và khoảng thời gian.
2. Tắt DB hoặc chặn kết nối trong staging, sau đó khôi phục; đo readiness, liveness và thời gian phát hiện.

**Bằng chứng:** CSV probe, tỷ lệ thành công, sự kiện cảnh báo và lịch fault injection.

**Nguồn mã:** [backend/MindSprint.Api/Program.cs](https://github.com/tungtungsahul/MindSprint-AI-D-n/blob/9ba7acd2de05bf017ad5c2711644c9ee98bd6542/backend/MindSprint.Api/Program.cs), [render.yaml](https://github.com/tungtungsahul/MindSprint-AI-D-n/blob/9ba7acd2de05bf017ad5c2711644c9ee98bd6542/render.yaml).

**Phụ thuộc kiểm thử:** NFR-12.

<a id="nfr-09"></a>

## NFR-09: Sao lưu và khôi phục dữ liệu

**Ưu tiên:** P1. **Trạng thái:** Đề xuất / chưa nghiệm thu. **Thành phần:** PostgreSQL và quy trình vận hành.

**Hiện trạng:** Chưa có runbook backup/restore hoặc bằng chứng khôi phục. Bản cloud demo không mặc nhiên đáp ứng mục tiêu lưu trữ lâu dài.

**Tiêu chí đạt:**

- Mục tiêu RPO ≤ 24 giờ và RTO ≤ 60 phút cho dữ liệu server; xác nhận lịch backup, quyền truy cập và lưu giữ tối thiểu 7 bản ngày.
- Restore bản backup vào PostgreSQL cô lập thành công; số hàng và checksum logic của thẻ/task/notebook/source/note/study khớp snapshot.
- Dữ liệu chỉ ở localStorage chưa sync không thuộc backup server; tài liệu bàn giao nêu rõ giới hạn này, không tuyên bố đã phục hồi dữ liệu đó.

**Cách kiểm thử:**

1. Tạo dữ liệu test có mốc thời gian/checksum; tạo backup và kiểm tra vị trí, quyền, chu kỳ lưu.
2. Xóa dữ liệu chỉ trong DB test hoặc dùng DB mới, restore, chạy smoke test đăng nhập/đọc dữ liệu và đo RPO/RTO.

**Bằng chứng:** Runbook, lịch backup, log restore đã ẩn bí mật, checksum/count và thời gian khôi phục.

**Nguồn mã:** [CI-CD-SETUP.md](https://github.com/tungtungsahul/MindSprint-AI-D-n/blob/9ba7acd2de05bf017ad5c2711644c9ee98bd6542/CI-CD-SETUP.md), [backend/MindSprint.Api/Data/AppDbContext.cs](https://github.com/tungtungsahul/MindSprint-AI-D-n/blob/9ba7acd2de05bf017ad5c2711644c9ee98bd6542/backend/MindSprint.Api/Data/AppDbContext.cs).

**Phụ thuộc kiểm thử:** NFR-12.

<a id="nfr-10"></a>

## NFR-10: Khả dụng và tiếp cận giao diện

**Ưu tiên:** P1. **Trạng thái:** Đề xuất / chưa nghiệm thu. **Thành phần:** Giao diện đăng nhập, thư viện, Kanban, notebook, dialogs.

**Hiện trạng:** Có điều khiển Kanban bằng bàn phím, trạng thái aria-live và validation inline; chưa có đánh giá toàn bộ các luồng.

**Tiêu chí đạt:**

- Ở 360/390/768/1440 px, đăng nhập, tạo thẻ/task/nguồn và chat không bị che thao tác; bảng rộng có vùng cuộn riêng, trang không tràn ngang ngoài chủ đích.
- Các luồng chính hoàn thành bằng bàn phím: focus nhìn thấy, dialog không kẹt focus, Escape/đóng hợp lý; lỗi liên kết đúng input và loading/error được thông báo.
- Theo các tiêu chí WCAG 2.2 AA áp dụng cho luồng kiểm thử: tương phản chữ thường ≥ 4,5:1, chữ lớn ≥ 3:1, dùng được khi zoom 200%; kiểm thử tự động không còn lỗi serious/critical và có kiểm tra thủ công.

**Cách kiểm thử:**

1. Chạy luồng bằng Tab/Shift+Tab/Enter/Space, kiểm tra dialog và reorder Kanban không dùng chuột.
2. Kiểm tra responsive/zoom/contrast bằng công cụ browser và NVDA hoặc VoiceOver trên tối thiểu một cấu hình.

**Bằng chứng:** Ảnh viewport/zoom, báo cáo accessibility, checklist bàn phím và screen reader.

**Nguồn mã:** [frontend/index.html](https://github.com/tungtungsahul/MindSprint-AI-D-n/blob/9ba7acd2de05bf017ad5c2711644c9ee98bd6542/frontend/index.html), [frontend/dialogs.js](https://github.com/tungtungsahul/MindSprint-AI-D-n/blob/9ba7acd2de05bf017ad5c2711644c9ee98bd6542/frontend/dialogs.js), [frontend/js/kanban.js](https://github.com/tungtungsahul/MindSprint-AI-D-n/blob/9ba7acd2de05bf017ad5c2711644c9ee98bd6542/frontend/js/kanban.js), [frontend/style.css](https://github.com/tungtungsahul/MindSprint-AI-D-n/blob/9ba7acd2de05bf017ad5c2711644c9ee98bd6542/frontend/style.css).

**Phụ thuộc kiểm thử:** Không có.

<a id="nfr-11"></a>

## NFR-11: Tương thích trình duyệt và chế độ offline

**Ưu tiên:** P1. **Trạng thái:** Đề xuất / chưa nghiệm thu. **Thành phần:** Service worker, localStorage, account-scoped state.

**Hiện trạng:** PWA cache app, API luôn gọi mạng; thư viện/lịch có lưu cục bộ và queue, Kanban/notebook online. Asset CDN ảnh hưởng lần cài cache đầu.

**Tiêu chí đạt:**

- Đăng nhập/thẻ/Kanban/notebook chạy trên Chrome, Edge, Firefox desktop và Safari iOS; ghi phiên bản cụ thể tại thời điểm kiểm thử, không có exception JavaScript chưa xử lý.
- Sau một lần tải online và cài service worker thành công, app shell và các chức năng học cục bộ đã cache mở offline; notebook/AI/ghi Kanban báo cần mạng rõ ràng.
- Queue hỗ trợ offline replay đúng tài khoản khi nối mạng; đổi A→B không hiển thị/replay dữ liệu A; update service worker không để trộn asset làm hỏng trang.
- Lần mở đầu offline hoặc CDN cài cache thất bại có thông báo/giới hạn được ghi rõ; không hứa mọi tính năng dùng offline.

**Cách kiểm thử:**

1. Chạy cùng smoke flow trên các trình duyệt trong ma trận; Safari thực hoặc thiết bị cloud phù hợp, không dùng Chromium giả lập thay Safari.
2. Kiểm tra offline sau cache, mạng chập chờn, reload, đổi tài khoản và update cache từ phiên bản cũ.

**Bằng chứng:** Ma trận browser/version/device, ảnh offline, trạng thái cache/queue và số request replay.

**Nguồn mã:** [frontend/sw.js](https://github.com/tungtungsahul/MindSprint-AI-D-n/blob/9ba7acd2de05bf017ad5c2711644c9ee98bd6542/frontend/sw.js), [frontend/script.js](https://github.com/tungtungsahul/MindSprint-AI-D-n/blob/9ba7acd2de05bf017ad5c2711644c9ee98bd6542/frontend/script.js), [frontend/manifest.json](https://github.com/tungtungsahul/MindSprint-AI-D-n/blob/9ba7acd2de05bf017ad5c2711644c9ee98bd6542/frontend/manifest.json), [frontend/api.js](https://github.com/tungtungsahul/MindSprint-AI-D-n/blob/9ba7acd2de05bf017ad5c2711644c9ee98bd6542/frontend/api.js).

**Phụ thuộc kiểm thử:** NFR-03.

<a id="nfr-12"></a>

## NFR-12: Khả năng bảo trì và triển khai tái lập

**Ưu tiên:** P1. **Trạng thái:** Đề xuất / chưa nghiệm thu. **Thành phần:** GitHub Actions, .NET build, frontend build, Docker, EF migrations.

**Hiện trạng:** CI build backend/frontend, backend deploy Render khi main có secrets; Vercel riêng. Chưa có job chạy các harness trong CI; Docker chưa cài Chromium cho URL JS fallback.

**Tiêu chí đạt:**

- Từ checkout sạch trên CI/Linux: dotnet build Release và npm run build thành công; cấu hình API_BASE được nhúng đúng, không chứa secret.
- Migration PostgreSQL chạy được trên DB rỗng và nâng cấp DB baseline; restart không seed trùng; image startup bind PORT và /healthz trả 200.
- Bộ hồi quy bắt buộc của API/session/Kanban/URL/tutor chạy pass và được ghi lại, gồm test với PostgreSQL cho ngữ nghĩa provider.
- Quy trình deploy/rollback chỉ rõ phiên bản và backup trước migration; rollback code không giả định schema được tự hạ cấp. URL JS fallback được kiểm tra trong image nếu được công bố là hỗ trợ.

**Cách kiểm thử:**

1. Chạy build/harness từ checkout sạch; build image và khởi động với PostgreSQL test.
2. Deploy staging, smoke test, restart và quay về image trước bằng quy trình có kiểm tra tương thích schema.

**Bằng chứng:** Link CI, build logs, image/commit ID, migration/smoke/rollback report.

**Nguồn mã:** [.github/workflows/ci-cd.yml](https://github.com/tungtungsahul/MindSprint-AI-D-n/blob/9ba7acd2de05bf017ad5c2711644c9ee98bd6542/.github/workflows/ci-cd.yml), [frontend/build.mjs](https://github.com/tungtungsahul/MindSprint-AI-D-n/blob/9ba7acd2de05bf017ad5c2711644c9ee98bd6542/frontend/build.mjs), [backend/MindSprint.Api/Dockerfile](https://github.com/tungtungsahul/MindSprint-AI-D-n/blob/9ba7acd2de05bf017ad5c2711644c9ee98bd6542/backend/MindSprint.Api/Dockerfile), [backend/MindSprint.Api/Migrations/20261006104859_InitialCreate_PostgreSQL.cs](https://github.com/tungtungsahul/MindSprint-AI-D-n/blob/9ba7acd2de05bf017ad5c2711644c9ee98bd6542/backend/MindSprint.Api/Migrations/20261006104859_InitialCreate_PostgreSQL.cs).

**Phụ thuộc kiểm thử:** Không có.

<a id="nfr-13"></a>

## NFR-13: Khả năng quan sát và chẩn đoán lỗi

**Ưu tiên:** P1. **Trạng thái:** Đề xuất / chưa nghiệm thu. **Thành phần:** API logging, correlation, đo lỗi/thời gian/provider.

**Hiện trạng:** Có Console auth logging và warning Gemini; chưa thấy correlation xuyên suốt/metrics endpoint và dashboard.

**Tiêu chí đạt:**

- Mỗi request có request/correlation ID, method/route, status, duration; ID phản hồi cho phép đối chiếu log của cùng request và lỗi dependency.
- Log lỗi đủ xác định endpoint, loại lỗi và dependency nhưng không chứa password/JWT/key/nội dung tài liệu hoặc dữ liệu cá nhân trực tiếp.
- Đo được request rate, error rate và latency theo route, cùng Gemini retry/quota/timeout; khi gây 5xx có thể xác định request và nguyên nhân trong 10 phút từ artifact.

**Cách kiểm thử:**

1. Tạo ba request success/validation error/provider failure, đối chiếu ID giữa response và log.
2. Kiểm tra redaction bằng giá trị bí mật giả làm canary; đối chiếu số request và retry thực tế với metrics/report.

**Bằng chứng:** Log mẫu đã che dữ liệu, biểu đồ hoặc báo cáo metrics, thời gian truy vết lỗi.

**Nguồn mã:** [backend/MindSprint.Api/Program.cs](https://github.com/tungtungsahul/MindSprint-AI-D-n/blob/9ba7acd2de05bf017ad5c2711644c9ee98bd6542/backend/MindSprint.Api/Program.cs), [backend/MindSprint.Api/Services/GeminiService.cs](https://github.com/tungtungsahul/MindSprint-AI-D-n/blob/9ba7acd2de05bf017ad5c2711644c9ee98bd6542/backend/MindSprint.Api/Services/GeminiService.cs).

**Phụ thuộc kiểm thử:** NFR-05.

<a id="nfr-14"></a>

## NFR-14: Chất lượng và an toàn đầu ra AI

**Ưu tiên:** P1. **Trạng thái:** Đề xuất / chưa nghiệm thu. **Thành phần:** NotebookAi, TutorService, JSON validation, UI render.

**Hiện trạng:** Prompt yêu cầu theo nguồn và bỏ chỉ thị trong tài liệu; tutor có kiểm định gợi ý. Chưa có báo cáo chất lượng end-to-end toàn bộ tác vụ.

**Tiêu chí đạt:**

- Bộ 30 câu hỏi có đáp án chuẩn (10 theo nguồn, 10 tutor/check, 10 hints; gồm thiếu dữ kiện và chỉ thị độc hại) chạy 3 lần với model/config ghi rõ: ≥ 90% đầu ra đúng theo rubric ở từng nhóm; có người chấm đối chiếu.
- Với hỏi theo nguồn, mọi trích dẫn nguồn phải thuộc notebook được phép và đoạn trích tồn tại trong nguồn; không đủ dữ kiện phải nói thiếu thay vì bịa.
- Tất cả response JSON dùng cho flashcard/quiz/mindmap đáp ứng schema/giới hạn; phản hồi sai cấu trúc bị từ chối bằng lỗi có kiểm soát.
- Nội dung prompt injection không đổi vai trò/đọc dữ liệu tài khoản khác, gợi ý không tiết lộ lời giải đầy đủ sớm; lỗi kiểm định không được trình bày như kết quả đúng.

**Cách kiểm thử:**

1. Chốt fixture/rubric trước khi chạy; dùng tài liệu test công khai/tự tạo và tài khoản riêng, ghi model, prompt revision, lượt chạy, thời gian và số lần gọi.
2. Thử 10 output JSON sai và ca trích dẫn bịa qua provider giả lập; kiểm tra UI xử lý lỗi.
3. Báo cáo điểm từng nhóm và biến động qua 3 lần; kiểm thử mock chỉ xác nhận hợp đồng, không chứng minh chất lượng model thật.

**Bằng chứng:** Fixture/đáp án/rubric, bảng chấm 90 output, kết quả schema/citation/injection đã che dữ liệu.

**Nguồn mã:** [backend/MindSprint.Api/Services/NotebookAi.cs](https://github.com/tungtungsahul/MindSprint-AI-D-n/blob/9ba7acd2de05bf017ad5c2711644c9ee98bd6542/backend/MindSprint.Api/Services/NotebookAi.cs), [backend/MindSprint.Api/Services/TutorService.cs](https://github.com/tungtungsahul/MindSprint-AI-D-n/blob/9ba7acd2de05bf017ad5c2711644c9ee98bd6542/backend/MindSprint.Api/Services/TutorService.cs), [backend/TutorChecks/SPRINT2.md](https://github.com/tungtungsahul/MindSprint-AI-D-n/blob/9ba7acd2de05bf017ad5c2711644c9ee98bd6542/backend/TutorChecks/SPRINT2.md).

**Phụ thuộc kiểm thử:** NFR-04, NFR-06.

## Tài liệu chuẩn tham chiếu

- [WCAG 2.2 — W3C](https://www.w3.org/TR/WCAG22/): tiêu chí bàn phím, tương phản, phóng to và phản hồi nhập liệu của NFR-10. Các kiểm tra nêu trên chưa đủ để tuyên bố toàn bộ sản phẩm đạt WCAG.
- [Web Vitals — web.dev](https://web.dev/articles/vitals): LCP/INP/CLS của NFR-01. Số đo Sprint 4 là số đo lab; đánh giá trải nghiệm thực cần dữ liệu người dùng thực.
- [EF Core concurrency — Microsoft](https://learn.microsoft.com/en-us/ef/core/saving/concurrency): concurrency token giúp kiểm tra phiên bản trong lệnh ghi DB; chỉ so sánh phiên bản trước SaveChanges chưa bảo đảm chống race.
- [ASP.NET Core health checks — Microsoft](https://learn.microsoft.com/en-us/aspnet/core/host-and-deploy/health-checks?view=aspnetcore-8.0): phân biệt kiểm tra tiến trình và kiểm tra phụ thuộc.
