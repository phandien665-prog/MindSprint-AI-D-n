# Đặc tả yêu cầu phần mềm — MindSprintAI 0.1

**Phiên bản sản phẩm/baseline:** 0.1. **Phiên bản tài liệu:** 1.0, ngày 26/10/2026 (Asia/Saigon).
**Mã nguồn đối chiếu:** [`1a9fecb807e7232a898a27c826615aac657fd798`](https://github.com/tungtungsahul/MindSprint-AI-D-n/tree/1a9fecb807e7232a898a27c826615aac657fd798), main tại thời điểm rà soát. Thay đổi của bộ tài liệu này không thay đổi hành vi ứng dụng.
**Issue:** [#58](https://github.com/tungtungsahul/MindSprint-AI-D-n/issues/58). SRS ở đây là đặc tả yêu cầu; thuật toán SRS trong ứng dụng là ôn tập ngắt quãng.

## 1. Mục tiêu, người dùng và ranh giới

MindSprintAI giúp học sinh, sinh viên và người tự học tổ chức kiến thức, ôn thẻ, hỏi đáp theo tài liệu và quản lý thời gian học. Mục tiêu MVP là hoàn thành một chu trình: tài khoản → tạo/nhập nội dung → học/ôn/luyện tập → lưu tiến độ → tổ chức công việc và lịch học. Đối chiếu [báo cáo MVP #21](../report/BAO_CAO_MINDSPRINT.md), [kiến trúc #40](../architecture/software-architecture.md) và [UML #20](../architecture/uml.md).

| Tác nhân | Quyền và trách nhiệm |
| --- | --- |
| Khách/người học cục bộ | Xem/học dữ liệu trên thiết bị; đăng ký hoặc đăng nhập để dùng server |
| Người học đã đăng nhập | Quản lý dữ liệu của mình; không xem/sửa tài nguyên riêng của tài khoản khác |
| Google Identity | Cấp ID token cho đăng nhập/liên kết tài khoản, khi đã cấu hình |
| Gemini | Sinh nội dung học và trả lời; kết quả phải được người học đối chiếu |
| Nguồn URL công khai | Cung cấp nội dung nhập vào sổ tay, chịu kiểm tra URL/DNS và giới hạn tải |

Phạm vi triển khai là `frontend/index.html` và API ASP.NET Core 8/EF Core/PostgreSQL. FastAPI/SQLite trong `backend/app` là ứng dụng độc lập, ngoài baseline này. SQLite trong các bộ checks chỉ là môi trường kiểm tra cô lập.

**Trong phạm vi 0.1:** tài khoản email/Google; thư viện thẻ, ôn/luyện tập và tạo thẻ AI; Sổ tay/Studio/Gia sư; lập trình và giọng nói tùy trình duyệt; Kanban; lịch học thủ công; thống kê/điểm yếu; dữ liệu cục bộ và đồng bộ thẻ trong phạm vi hỗ trợ. Kế hoạch học do AI từ #36 vẫn là yêu cầu mục tiêu 0.1, nhưng chưa tìm thấy triển khai tại baseline: ghi riêng FR-23 và GAP-01, không coi lịch thủ công là đã thay thế tính năng đó.

**Ngoài phạm vi 0.1:** thanh toán, lớp học/giáo viên/quản trị, chia sẻ hoặc cộng tác sổ tay, thực thi code người học, AI offline, bảo đảm đồng bộ offline cho mọi tính năng, thông báo email/push theo lịch, ứng dụng native. Không suy diễn các chức năng này từ tầm nhìn sản phẩm.

## 2. Quy ước nghiệm thu và ràng buộc

- P0: chu trình học/lưu dữ liệu và an toàn tài khoản; P1: chức năng mở rộng trong phạm vi. Mỗi FR dưới đây có luồng chính, ngoại lệ và kết quả có thể kiểm chứng.
- Trước thao tác cá nhân cần tài khoản hợp lệ; server kiểm tra UserId/ownership. Với thao tác ghi, kiểm tra cả phản hồi và dữ liệu đọc lại sau tải trang bằng đúng tài khoản.
- Mất mạng không được báo đã đồng bộ server. Hết phiên: thử làm mới nếu hợp lệ, sau đó yêu cầu đăng nhập lại. Phản hồi đến trễ của tài khoản/sổ tay cũ phải bị bỏ.
- Dịch vụ AI cần mạng và cấu hình hợp lệ; 429/lỗi nhà cung cấp phải phân biệt với hết phiên. Giữ nội dung nhập để sửa/thử lại. Kết quả fallback tạo thẻ phải ghi rõ là dự phòng, không gán thành kết quả Gemini.
- Nguồn sổ tay: tối đa 20 nguồn, 200.000 ký tự/nguồn; tệp tối đa 10 MiB, PDF tối đa 20 trang, tổng bytes ảnh/PDF trong sổ tay tối đa 10 MiB. Định dạng và ngoại lệ theo [OCR.md](../../backend/TutorChecks/OCR.md). Bộ nhập tệp tạo thẻ độc lập có hợp đồng riêng trong `AiController`, không mặc định giống nguồn sổ tay.
- PostgreSQL, cấu hình JWT/CORS và AI là điều kiện môi trường; không đưa khóa thật vào tài liệu/test. Google cần client ID, origin và challenge hợp lệ; micro cần quyền và trình duyệt hỗ trợ. Giọng nói phải có bàn phím thay thế.
- “Có trong mã nguồn”, “issue đã đóng”, “đạt kiểm tra giả lập” và “đã nghiệm thu live” là các trạng thái khác nhau. Hoàn thành #58 là hoàn thành tài liệu; không tự xác nhận toàn bộ FR/NFR đạt.

## 3. Yêu cầu chức năng và ma trận truy vết

FR-01…FR-23 là định danh ổn định để liên kết yêu cầu và bằng chứng. Mỗi dòng sau là một đặc tả tối thiểu: thực hiện luồng chính với điều kiện ở mục 2, gây ngoại lệ đã nêu, rồi so kết quả với cột tiêu chí. Mã UC tra trong [danh mục UML](../architecture/uml.md); mã TC tra [bộ test case](../testing/sprint-3-test-cases.md). `CHƯA CHẠY` là kịch bản đã đặc tả nhưng chưa có kết quả lần này. `PARTIAL` chỉ có bằng chứng ở một tầng, phải đọc giới hạn trong báo cáo kết quả.

| ID / ưu tiên | Luồng chính | Ngoại lệ bắt buộc | Tiêu chí kiểm chứng | UC / issue triển khai | Test / trạng thái tại baseline |
| --- | --- | --- | --- | --- | --- |
| FR-01 / P0 | Đăng ký email, tên, mật khẩu; nhận phiên | Email sai/trùng, thiếu trường, mật khẩu không hợp lệ | Không tạo tài khoản lỗi; email trùng bị từ chối; tài khoản hợp lệ đăng nhập được | UC14 / #7, #11 | TC-AUTH-01/02; PARTIAL validation, chưa thử đăng ký live |
| FR-02 / P0 | Đăng nhập → làm mới phiên → đăng xuất | Sai mật khẩu, refresh hết hạn, request đồng thời, chuyển tài khoản | Một phiên dùng chung các tính năng; refresh không treo; tài khoản cũ không ghi đè tài khoản mới; revoke đúng phiên | UC14 / #5, #7 | TC-AUTH-03…07; PASS ở JS/browser giả lập, revoke server chưa nghiệm thu |
| FR-03 / P1 | Google challenge → ID token → tạo/liên kết tài khoản | Origin/nonce/token sai, email đã có, tính năng chưa cấu hình | Chỉ liên kết khi xác minh danh tính và mật khẩu hiện có; chưa bật có thông báo | UC15 / #28 | TC-AUTH-08; CHƯA CHẠY Google thật |
| FR-04 / P0 | Mở thư viện → tìm/lọc danh mục/chủ đề | Không có thẻ, chuyển tài khoản | Chỉ hiển thị thẻ hệ thống/của mình; có trạng thái rỗng; không rò thẻ tài khoản cũ | UC3 / #9, #15 | TC-CARD-01; CHƯA CHẠY đầy đủ |
| FR-05 / P0 | Tạo → sửa → xóa thẻ cá nhân | Trống câu hỏi/đáp án, không sở hữu, phiên bản cũ | Đọc lại đúng dữ liệu; không sửa/xóa thẻ của người khác; 409 không bị báo thành công | UC2, UC3 / #9 | TC-CARD-02/03; CHƯA CHẠY đầy đủ |
| FR-06 / P0 | Lấy due/fresh → mở đáp án → Nhớ/Chưa nhớ | Hết thẻ, lỗi lưu, thẻ không được truy cập | Tiến độ đúng người/thẻ; Nhớ lần 1/2 có khoảng 1/3 ngày; Chưa nhớ reset repetition và đến hạn ngay | UC1 / #3, #14 | TC-CARD-04; CHƯA CHẠY SRS runtime lần này |
| FR-07 / P1 | Chọn bài trắc nghiệm/nhập đáp án → trả lời → xem kết quả | Không đủ thẻ, bỏ trống | Chấm và giải thích theo đáp án của bài; giữ đúng tập câu hỏi | UC5 / #23 | TC-CARD-05; CHƯA CHẠY |
| FR-08 / P0 | Nhập tài liệu → tạo AI → xem/chọn → lưu thẻ | Dữ liệu trả sai, quota, lỗi lưu một phần | Không tự lưu; bỏ thẻ rỗng; giữ thẻ chưa lưu; retry không lưu lại thẻ đã thành công; đọc lại trong thư viện | UC2 / #12, #13 | TC-AI-01…07; PASS 01…05 trong browser giả lập, 06…07 chưa chạy |
| FR-09 / P0 | Tạo, mở, liệt kê và xóa sổ tay | Không sở hữu, tải lỗi, phản hồi trễ | Nguồn/ghi chú đúng sổ tay; xóa notebook cascade dữ liệu con; đổi ngữ cảnh không nhận dữ liệu cũ | UC6 / #24, #30 | TC-NB-01/02; PARTIAL browser chuyển ngữ cảnh |
| FR-10 / P0 | Thêm/xóa nguồn text, URL, ảnh/PDF/tệp văn bản | URL nội bộ/hỏng, định dạng/số lượng/dung lượng sai | Chỉ lưu nguồn hợp lệ; upload không tự giải; xóa nguồn bỏ ngữ cảnh cũ, giữ ghi chú | UC7 / #11, #25, #27, #33 | TC-NB-03…06; PARTIAL validation, chưa thử PostgreSQL/URL thật |
| FR-11 / P0 | Hỏi theo nguồn và chọn gợi ý | Không có nguồn/câu hỏi trống, quota/AI lỗi | Trả lời JSON và trích dẫn; lỗi giữ nháp; không nhận phản hồi sổ tay cũ | UC8 / #12, #30 | TC-NB-07/08; PARTIAL browser, chất lượng Gemini chưa nghiệm thu |
| FR-12 / P1 | Chọn loại Studio → tạo → xem/lưu | Không có nguồn, AI/định dạng lỗi | Hiển thị đúng loại; flashcard/quiz có câu hỏi/đáp án; văn bản lưu ghi chú; audio có dừng | UC9 / #12, #30 | TC-NB-09/10; CHƯA CHẠY toàn luồng |
| FR-13 / P0 | Lưu, mở lại, xóa ghi chú | Lưu lỗi, không sở hữu | Dữ liệu còn sau tải lại; xóa đúng ghi chú; code giữ dòng/thụt dòng | UC9 / #30, #34 | TC-NB-10; CHƯA CHẠY toàn luồng |
| FR-14 / P1 | Gia sư giải, kiểm tra bài làm, gợi ý mức 1–3 | Thiếu đề/bài làm, hint sai mức, lộ lời giải | Yêu cầu bổ sung khi thiếu; hint không công bố đáp án trước hành động xem lời giải; ownership trước gọi AI | UC10 / #30, #31, #32, #33 | TC-EXT-01; PASS controller/SQLite, AI giả lập |
| FR-15 / P1 | Gia sư lập trình Python/JavaScript → hỏi tiếp → lưu | Thiếu code, thay đầu vào, provider lỗi | Phân tích và ca kiểm thử dự kiến; luôn “Chưa chạy code”; không thực thi code | UC10 / #34 | TC-EXT-02; CHƯA CHẠY lần này |
| FR-16 / P1 | Bật micro → sửa chữ → gửi; chủ động đọc/dừng trả lời | Không hỗ trợ/quyền bị từ chối, rời ngữ cảnh | Không tự gửi; vẫn nhập chữ được; đổi tài khoản/sổ tay dừng nhận diện và đọc | UC10 / #37 | TC-EXT-03; PASS adapter giả lập, micro/loa thật chưa chạy |
| FR-17 / P0 | Tạo/sửa/xóa, lọc và chuyển/sắp xếp Kanban | Tiêu đề trống/>200, mô tả >5.000, move lỗi, không sở hữu | Thứ tự lưu/đọc lại đúng; task ẩn vẫn giữ thứ tự; thất bại không thay bằng thành công; thao tác bàn phím/mobile dùng được | UC12 / #10, #16 | TC-KB-01…08; PASS browser giả lập và controller/SQLite |
| FR-18 / P1 | CRUD lịch định kỳ theo ngày, giờ, thời lượng, nhãn; bật/tắt | Giờ sai, không sở hữu, lỗi lưu | Thay đổi đúng tài khoản, còn sau tải lại; API list chỉ trả lịch hoạt động; kiểm tra riêng UI bật lại lịch tắt | UC11 / #14 | TC-EXT-04; CHƯA CHẠY |
| FR-19 / P1 | Ghi ngày học → xem số thẻ/phút và streak | Không có dữ liệu, khoảng ngày không hợp lệ | Ngày theo UTC+7; ngày >0 thẻ được tính; hôm nay chưa học thì currentStreak=0 theo API hiện có | UC4, UC13 / #14 | TC-EXT-05; CHƯA CHẠY |
| FR-20 / P1 | Phân tích điểm yếu → chuyển sang luyện tập | Chưa có tiến độ/thiếu dữ liệu | Nhóm >=3 tiến độ và tỷ lệ theo quy tắc hiện có <70% được nhận diện; chỉ dữ liệu tài khoản hiện tại | UC18 / #35 | TC-EXT-06; CHƯA CHẠY; chỉ số suy từ progress, không phải lịch sử mọi lần trả lời |
| FR-21 / P1 | Tải/cache ứng dụng và dữ liệu → học khi mất mạng | Chưa cache, chức năng cần server/AI | Dữ liệu học cục bộ còn sau tải lại; không hứa AI/offline toàn ứng dụng; không lộ dữ liệu tài khoản trước | UC17 / #9 | TC-EXT-07; CHƯA CHẠY ma trận offline |
| FR-22 / P0 | Gửi hàng đợi thẻ/ngày học → xử lý xung đột | Mất mạng, 409, đổi tài khoản giữa request | Chỉ bỏ thao tác đã gửi thành công; giữ queue chưa gửi; không gửi dữ liệu user cũ sang user mới | UC16 / #9, #14 | TC-CARD-03, TC-EXT-07; CHƯA CHẠY toàn luồng |
| FR-23 / P1 | AI đề xuất kế hoạch → chọn/chỉnh → lưu Lịch/Công việc | Trùng lịch, lưu từng phần lỗi | Preview trước lưu; tránh trùng; chỉ báo từng mục đã lưu thực tế, cho retry phần còn lại | UC19 (mục tiêu, chưa có trong sơ đồ hiện trạng) / #36 | TC-EXT-08; BLOCKED GAP-01, chưa tìm thấy triển khai tại baseline |

## 4. Yêu cầu phi chức năng và nghiệm thu

Giữ nguyên ID, ngưỡng và phương pháp của [14 NFR](../architecture/non-functional-requirements.md) từ #40. Các ngưỡng đó là mục tiêu đề xuất cần chốt trước đo, không phải kết quả đã đạt. [Kế hoạch Sprint 4](../architecture/sprint-4-test-plan.md) quản lý chiến dịch riêng.

| NFR | Nội dung | Issue | FR liên quan |
| --- | --- | --- | --- |
| NFR-01 | Hiệu năng phản hồi | #42 | FR-04…08, FR-17…20 |
| NFR-02 | Tải và tài nguyên | #43 | Các FR gọi server |
| NFR-03 | Xác thực, phân quyền, cô lập | #44 | FR-01…23 có dữ liệu cá nhân |
| NFR-04 | Kiểm tra dữ liệu/nguồn không tin cậy | #45 | FR-01, FR-05, FR-08…17 |
| NFR-05 | Cấu hình, truyền tải, riêng tư | #46 | FR-01…03, các FR gọi server/AI |
| NFR-06 | Phục hồi khi AI/mạng lỗi | #47 | FR-08…16, FR-21…23 |
| NFR-07 | Toàn vẹn và đồng thời | #48 | FR-05, FR-06, FR-17…23 |
| NFR-08 | Sẵn sàng/phát hiện dịch vụ | #49 | Các FR gọi server |
| NFR-09 | Backup/restore | #50 | Dữ liệu tài khoản và học tập |
| NFR-10 | Khả dụng và tiếp cận | #51 | Toàn bộ UI, đặc biệt FR-16/17 |
| NFR-11 | Trình duyệt và offline | #52 | FR-16, FR-21/22 |
| NFR-12 | Bảo trì và triển khai tái lập | #53 | Toàn baseline |
| NFR-13 | Quan sát/chẩn đoán lỗi | #54 | Các FR gọi server/AI |
| NFR-14 | Chất lượng/an toàn AI | #55 | FR-08, FR-11/12, FR-14/15, FR-23 |

## 5. Các điểm chưa nghiệm thu và đối chiếu chéo

| ID | Phát hiện / quyết định ghi nhận | Hướng xác minh tiếp |
| --- | --- | --- |
| GAP-01 | #36 đã đóng trên GitHub, nhưng tìm trong controllers, api.js, script.js và notebook.js tại baseline chưa thấy luồng AI lập kế hoạch có preview/lưu từng phần. FR-23 vẫn là mục tiêu 0.1 chưa nghiệm thu; không biến thành “đã làm” vì trạng thái issue. | Kiểm tra commit/nhánh triển khai #36, tích hợp và chạy TC-EXT-08; không thuộc phần bổ sung tài liệu này. |
| GAP-02 | #19 đã đóng; nội dung issue không đính kèm báo cáo kết quả/comment. Video và ảnh trong repo chỉ là bằng chứng demo, không thay bộ test có kết quả. | Báo cáo lần chạy này chỉ dùng log tự tạo; không suy ra production pass từ #19. |
| GAP-03 | Validation đăng ký phía UI và API có giới hạn khác nhau; API yêu cầu password tối thiểu 6 ký tự. | Đối chiếu SPEC-issue11 và TC-AUTH-01/02; chưa xác nhận chính sách mật khẩu thống nhất. |
| GAP-04 | Lịch tắt không nằm trong API danh sách; việc người dùng tìm và bật lại lịch trên UI chưa được chứng minh. | Chạy TC-EXT-04, ghi lỗi nếu không thể chọn lại. |
| GAP-05 | Bộ test #17 chỉ yêu cầu kết quả chạy ban đầu. Cloud, PostgreSQL thật, chất lượng AI, Google, micro/loa và NFR không được nghiệm thu bởi mock. | Theo dõi trạng thái từng TC trong báo cáo và các issue NFR Sprint 4. |

Các hiệu chỉnh hiện trạng (12 bảng/91 cột, 18 UC, JSON thay SSE, revoke thay logout, không có queue Kanban) được cập nhật trong UML và báo cáo MVP cùng thay đổi này. [Báo cáo kiểm tra](../testing/sprint-3-results.md) cho biết môi trường, lệnh chạy, số đạt, phần chưa chạy và bằng chứng.

## 6. Quản lý thay đổi

Giữ nguyên FR/UC/TC đã cấp, thêm ID tiếp theo khi mở rộng. Khi đổi hành vi, cập nhật tiêu chí, UML, ma trận và test cùng một thay đổi có review; ghi SHA mới. Mỗi kết luận nghiệm thu phải kèm môi trường, dữ liệu trước/sau, kết quả thực tế và bằng chứng. Không giảm ngưỡng NFR hoặc đổi “chưa chạy” thành “đạt” để đóng issue tài liệu.
