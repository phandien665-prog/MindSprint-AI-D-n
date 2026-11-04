# Bộ test case chức năng — #17

**Phiên bản:** 1.0, ngày 26/10/2026 (Asia/Saigon). **Baseline:** `1a9fecb807e7232a898a27c826615aac657fd798` và test tạo thẻ AI bổ sung trong cùng bộ tài liệu này.
**Phạm vi:** đăng nhập, Kanban, Sổ tay AI và tạo thẻ AI theo #17; bổ sung các ca cần cho ma trận [SRS 0.1](../requirements/software-requirements.md). **46 test case** được định danh ổn định. [Kết quả chạy ban đầu](sprint-3-results.md) tách rõ test tự động, mock, SQLite và phần chưa chạy.

## Thiết lập và cách ghi kết quả

Dùng trình duyệt/profile sạch; tài khoản thử nghiệm A và B có dữ liệu riêng, không dùng dữ liệu cá nhân thật. Cho bản live, tạo dữ liệu trong database QA có thể dọn bỏ; ghi URL, SHA triển khai, browser, giờ chạy, tài khoản giả và mã dữ liệu. Đọc lại dữ liệu sau thao tác ghi. Không chạy ca xóa trên production. Các bộ test browser trong repo tạo server tạm, chặn dịch vụ ngoài, mô phỏng HTTP và đóng browser sau chạy; các checks .NET tạo SQLite in-memory.

Fixture chung: A có sổ tay N1 với nguồn text “Quang hợp dùng ánh sáng để tạo năng lượng hóa học”, N2 khác nội dung; B có sổ tay NB riêng. Kanban: A/B/C ở Todo tại Position 0/1/2, D ở Doing 0; đặt A/C có từ “Visible”, B có từ “Hidden”. Thẻ: câu hỏi/đáp án khác nhau, có cả thẻ hệ thống và thẻ riêng của B. Mỗi ca độc lập phải khôi phục fixture hoặc ghi dữ liệu đầu vào riêng.

P0 chạy trước P1. PASS chỉ áp dụng đúng tầng đã chạy; PARTIAL chưa đáp ứng toàn bộ kết quả mong đợi của ca. CHƯA CHẠY không phải PASS/FAIL; BLOCKED ghi phụ thuộc cụ thể. Khi chạy thủ công, mỗi dòng kết quả ghi ID, input cụ thể, thực tế, trạng thái, ảnh/log và mã lỗi. Không ghi token/khóa thật.

## Tài khoản và phiên

| ID / ưu tiên | Điều kiện / dữ liệu | Bước thực hiện | Kết quả mong đợi |
| --- | --- | --- | --- |
| TC-AUTH-01 / P0 | Form đăng ký; email mới, tên QA, mật khẩu hợp lệ | Nhập → đăng ký → tải lại → đăng xuất → đăng nhập | Phiên đúng user; dữ liệu user còn sau tải lại; server không tạo trùng |
| TC-AUTH-02 / P0 | Form auth; email `broken`, password 5/6/30/31 ký tự và Unicode; email đã tồn tại | Nhập mỗi biên → submit/click/Enter; thử đăng ký email trùng | UI báo inline và chặn dữ liệu lỗi; API từ chối email trùng; không tự tạo phiên sai |
| TC-AUTH-03 / P0 | A có tài khoản | Đăng nhập đúng; mở Kanban/Sổ tay/Thư viện; thử mật khẩu sai | Một phiên dùng chung; sai mật khẩu có lỗi và không ghi đè phiên hợp lệ |
| TC-AUTH-04 / P0 | Access hết hạn, refresh còn hạn | Gửi hai request cùng lúc | Chỉ một refresh; cả hai retry bằng token mới; không request bị treo |
| TC-AUTH-05 / P0 | Refresh hết hạn/bị thu hồi | Gọi API có 401 đồng thời | Tất cả request kết thúc; xóa phiên và mời đăng nhập lại |
| TC-AUTH-06 / P0 | A đang refresh hoặc tải dữ liệu chậm | Đăng xuất A → đăng nhập B → trả phản hồi A trễ | Không đổi token/UI/dữ liệu B thành A; B không thấy dữ liệu cá nhân A |
| TC-AUTH-07 / P0 | A đang đăng nhập; có refresh token | Đăng xuất → kiểm tra UI/storage → dùng refresh cũ trên server QA | Phiên cục bộ xóa; refresh bị revoke; không giả định access token bị vô hiệu ngay |
| TC-AUTH-08 / P1 | Google QA cấu hình; email mới và email trùng | Đăng nhập Google; thử nonce/origin sai; liên kết email cũ bằng mật khẩu | Token/nonce/origin sai bị từ chối; email cũ phải xác minh mật khẩu; chưa cấu hình có thông báo |

## Thẻ và ôn tập

| ID / ưu tiên | Điều kiện / dữ liệu | Bước thực hiện | Kết quả mong đợi |
| --- | --- | --- | --- |
| TC-CARD-01 / P0 | Thẻ hệ thống, A và B khác nhau | Đăng nhập A → tìm/lọc danh mục/chủ đề → lọc không kết quả | Chỉ thẻ được phép; bộ lọc đúng; rỗng có thông báo |
| TC-CARD-02 / P0 | A có mạng; câu hỏi/đáp án không trống | Tạo → sửa → tải lại → xóa; thử sửa ID của B | Đọc lại đúng dữ liệu; xóa đúng thẻ; ID B bị từ chối |
| TC-CARD-03 / P0 | Một thẻ của A ở hai tab, cùng version | Tab 1 sửa → tab 2 gửi bản cũ → chọn giải quyết xung đột; thử mất mạng | 409 không báo thành công; giữ dữ liệu để giải quyết; queue giữ thao tác chưa gửi |
| TC-CARD-04 / P0 | Thẻ mới/due của A và progress riêng B | Ôn Nhớ 2 lần → Chưa nhớ → đọc lại progress; thử lỗi lưu | Khoảng 1 rồi 3 ngày; Chưa nhớ repetition=0, due ngay; B không đổi; lỗi lưu không báo đồng bộ |
| TC-CARD-05 / P1 | Một bộ thẻ có đáp án biết trước | Mở quiz → trả lời đúng/sai → xem giải thích/điểm; thử không đủ dữ liệu | Kết quả đúng bộ câu hỏi; không mở bài rỗng; lỗi có thông báo |

## Tạo thẻ AI

| ID / ưu tiên | Điều kiện / dữ liệu | Bước thực hiện | Kết quả mong đợi |
| --- | --- | --- | --- |
| TC-AI-01 / P0 | A đăng nhập; tài liệu 3 câu; count=3; HTTP giả lập trả 3 thẻ hợp lệ và 1 thẻ rỗng | Mở nút Tạo thẻ AI → nhập → tạo | 3 preview hợp lệ; có cảnh báo thẻ bị bỏ; chưa gọi lưu thẻ |
| TC-AI-02 / P0 | Preview Alpha/Beta/Gamma | Bỏ chọn Gamma → lưu; lần lưu thứ 2 trả 503 | Chỉ Alpha đã lưu; Beta còn chưa lưu; Gamma không gửi; thông báo lưu từng phần |
| TC-AI-03 / P0 | Sau TC-AI-02; bỏ lỗi HTTP | Thử lưu lại | Chỉ gửi Beta; Alpha không lưu trùng; tổng 2 thẻ, Gamma vẫn không lưu |
| TC-AI-04 / P0 | Sau khi lưu thành công; chủ đề `Sprint 3 QA` | Tải lại → mở thư viện | Bộ thẻ đã lưu được tải từ HTTP fixture; có đúng 2 thẻ |
| TC-AI-05 / P0 | A đăng nhập, tài liệu có nội dung; provider trả 429 | Tạo thẻ → đọc trạng thái/preview | Giữ phiên A; ghi rõ dự phòng nếu trích xuất được; không tự lưu thẻ dự phòng |
| TC-AI-06 / P0 | Chưa đăng nhập; text trống hoặc count 0/101; file sai/oversize | Mở tạo thẻ → thử từng input → submit | Chặn thao tác/hiển thị lỗi; không gửi request không hợp lệ; không sinh thẻ rỗng |
| TC-AI-07 / P1 | API QA/PostgreSQL và Gemini thật; không dùng mock | Tạo từ text và tệp hỗ trợ → chọn/lưu → đăng nhập lại → học thẻ | Nội dung đối chiếu được tài liệu; dữ liệu lưu server bền vững đúng tài khoản; ghi chi phí/lỗi và bằng chứng |

TC-AI-01…05 chạy tuần tự trong `tests/ai-cards-browser.test.cjs` với fixture riêng; dùng `node --test --test-reporter=tap tests/ai-cards-browser.test.cjs`. Ca 07 cần cấu hình QA được cấp và không được báo PASS bằng HTTP giả lập.

## Sổ tay AI

| ID / ưu tiên | Điều kiện / dữ liệu | Bước thực hiện | Kết quả mong đợi |
| --- | --- | --- | --- |
| TC-NB-01 / P0 | A và B có sổ tay riêng | Tạo N1 → tải lại → mở → xóa; A truy cập ID của B | Lưu đúng A; không đọc/xóa sổ tay B; xóa cascade dữ liệu con |
| TC-NB-02 / P0 | N1/N2; response N2 bị trì hoãn hoặc 503 | Chuyển sổ tay/tài khoản trong lúc tải; trả response cũ | Không đưa nguồn/ghi chú/đáp án cũ vào ngữ cảnh mới; tải lỗi báo rõ |
| TC-NB-03 / P0 | N1, nguồn text hợp lệ; text trắng/>200.000 ký tự | Thêm text → đọc lại; thử text sai; thêm nguồn thứ 21 | Chỉ nguồn hợp lệ được lưu; giới hạn có lỗi; đúng NotebookId |
| TC-NB-04 / P0 | URL công khai QA; URL malformed, loopback/private/redirect tới private | Thêm từng URL | URL hợp lệ được nhập; URL không hợp lệ/bị chặn báo lỗi; không truy cập mạng nội bộ |
| TC-NB-05 / P0 | PDF fixture có `5x + 2 = 17`; JPG/PNG/WebP/TXT/MD/CSV, tệp lỗi | Upload → xem nguồn → hỏi tham chiếu; thử >10 MiB/>20 trang/tổng bytes vượt | Trích xuất/giữ file đúng; không tự giải khi upload; từ chối vượt giới hạn và giữ đầu vào thử lại |
| TC-NB-06 / P0 | N1 có nguồn được dùng trong chat và ghi chú đã lưu | Xóa nguồn → hỏi/gợi ý tiếp → đọc ghi chú | Không gửi nguồn đã xóa; bỏ ngữ cảnh/gợi ý cũ; ghi chú vẫn còn |
| TC-NB-07 / P0 | N1 có nguồn; sổ tay rỗng; câu hỏi trắng | Hỏi theo nguồn; lặp câu hỏi giống nhau; thử sổ tay rỗng/blank | HTTP JSON trả lời/trích dẫn; cache không lẫn sổ tay; rỗng bị từ chối |
| TC-NB-08 / P0 | N1 đang hỏi; giả lập 429/502 hoặc mạng lỗi | Gửi → nhận lỗi → đổi sổ tay trước phản hồi → thử lại | Giữ nháp; không mất phiên do quota; không nhận câu trả lời sai ngữ cảnh |
| TC-NB-09 / P1 | N1 có nguồn; các loại Studio | Tạo summary/guide/FAQ/timeline/mindmap/cards/quiz/audio; thử lỗi định dạng | Hiển thị đúng loại; không báo thành công khi AI lỗi; đọc tiếng có dừng |
| TC-NB-10 / P0 | Studio hoặc trả lời Gia sư có code | Lưu ghi chú/thẻ → tải lại → mở → xóa ghi chú | Nội dung đúng và giữ code/thụt dòng; thẻ vào đúng tài khoản; xóa không tác động nguồn/ghi chú khác |

## Kanban

| ID / ưu tiên | Điều kiện / dữ liệu | Bước thực hiện | Kết quả mong đợi |
| --- | --- | --- | --- |
| TC-KB-01 / P0 | A đăng nhập | Tạo task đủ thuộc tính → sửa tiêu đề/mô tả/ưu tiên/hạn → đọc lại | Dữ liệu đúng, thuộc A; sửa còn sau mở DbContext/tải lại |
| TC-KB-02 / P0 | Fixture A/B/C/D | Kéo C lên đầu/cuối Todo, chuyển A sang Doing/Done; tải lại | PATCH đúng status/position; thứ tự liên tục và bền vững |
| TC-KB-03 / P0 | A/C Visible, B Hidden | Lọc Visible → kéo A trước C → bỏ lọc | B không bị mất; thứ tự toàn cột đúng vị trí thực |
| TC-KB-04 / P0 | Fixture có 3 task; PATCH trả 503 | Thử move → quan sát → bỏ lỗi → thử lại | Lỗi giữ thứ tự; không báo thành công; retry cập nhật đúng |
| TC-KB-05 / P0 | Task của A, đăng nhập B | List, sửa, move, xóa ID A bằng B | List B không có A; mutation 404; task A còn nguyên |
| TC-KB-06 / P0 | Task hiện có | Mở xóa → hủy → mở xóa → xác nhận → đọc lại | Hủy giữ nguyên; xác nhận xóa đúng task và sắp lại Position |
| TC-KB-07 / P1 | Màn hình 320/360/375/390/768/1440; bàn phím | Mở form; dùng nút lên/xuống, Enter, kéo vào vị trí cũ | Không tràn ngang; focus hợp lý; no-op không gửi mutation |
| TC-KB-08 / P0 | Tiêu đề trắng/>200, mô tả >5.000, priority/status sai, Position âm | Gửi từng input trực tiếp và qua UI | Từ chối dữ liệu sai, giữ dữ liệu cũ; không task rỗng |

## Ca mở rộng để truy vết SRS

| ID / ưu tiên | Điều kiện / dữ liệu | Bước thực hiện | Kết quả mong đợi |
| --- | --- | --- | --- |
| TC-EXT-01 / P1 | N1 sở hữu A; đề `2x+3=11`, bài làm; hint 1…3 | Giải/kiểm tra/hint/solution; thử thiếu bài và sai mức | Phản hồi đúng chế độ; thiếu dữ kiện được hỏi thêm; hint không công bố lời giải sớm; ownership trước AI |
| TC-EXT-02 / P1 | Python/JS có lỗi biết trước | Phân tích → đổi code/ngôn ngữ → hỏi tiếp → lưu ghi chú | Hiển thị “Chưa chạy code”; không chạy code; ngữ cảnh cũ bỏ khi đổi input |
| TC-EXT-03 / P1 | Speech adapter giả lập, sau đó thiết bị QA thật | Bật mic → sửa transcript → gửi; từ chối quyền; rời trang; đọc/dừng đáp án | Không tự gửi; giữ bàn phím; hủy speech khi đổi ngữ cảnh; tách kết quả thật/giả lập |
| TC-EXT-04 / P1 | A có lịch thứ Hai 08:00, 30 phút | Tạo/sửa/tắt/bật/xóa → tải lại; thử chọn lại lịch tắt trên UI | Lưu đúng A, giờ/thời lượng; không mất khả năng bật lại; lỗi được ghi nếu UI không hỗ trợ |
| TC-EXT-05 / P1 | Ngày học hôm qua/hôm nay theo UTC+7, ngày ngắt | Ghi ngày học → query khoảng → xem streak | Đúng số thẻ/phút; >0 thẻ tạo ngày học; hôm nay chưa học currentStreak=0 theo API |
| TC-EXT-06 / P1 | Nhóm >=3 progress với known/review, nhóm ít dữ liệu; A/B | Analyze → xem lý do/chỉ số → luyện tập | Ngưỡng theo WeakAreaService; không dùng dữ liệu B; thiếu dữ liệu có hướng dẫn |
| TC-EXT-07 / P1 | Đã cache và có queue thẻ đúng A | Ngắt mạng → học/sửa → tải lại → có mạng → đổi B trong lúc sync | Giữ dữ liệu/queue hợp lệ; không gửi queue A vào B; AI offline báo không khả dụng |
| TC-EXT-08 / P1 | Cần triển khai luồng kế hoạch AI #36 | Sinh kế hoạch → chọn/chỉnh → lưu lịch/task, thử trùng và lỗi từng phần | Preview trước lưu; tránh trùng; báo chính xác mục thành công, retry phần còn lại; hiện BLOCKED GAP-01 |

Ca hiện có là cơ sở kiểm thử chức năng, không thay chiến dịch tải, bảo mật, backup, tương thích đầy đủ và đánh giá AI trong [Sprint 4](../architecture/sprint-4-test-plan.md). Giữ nguyên ngưỡng NFR đã quy định.
