# Kế hoạch redesign MindSprintAI — đổi hướng lần 2

Ngày 2026-10-06, người dùng yêu cầu và cho phép triển khai hướng **cam/gradient pastel theo ảnh Minded** tại `dribbble-minded.png`. Kế hoạch này **thay thế hoàn toàn hướng “giấy mực” và “cam phẳng”** trước đó, bao gồm palette, font và quy định cấm gradient/bóng/hover. Giữ nội dung và chức năng tiếng Việt, triển khai trên nhánh `frontend-redesign`.

## Bảng màu hiện hành

| Thành phần | Mã / cách dùng |
|---|---|
| Nền trang | `#F7F5FA`: trắng xám nhẹ ánh tím, không dùng ngà/be |
| Sidebar, panel sáng | `#FFFFFF`, viền mảnh `#E5E0ED` |
| Nút chính, nhấn | `#FF7A45`, hover `#E8622E` |
| Chữ chính | `#1A1A2E`, dùng cả trên nút cam để đạt tương phản |
| Chữ phụ | `#625C70` |
| Chữ/icon cam trên nền sáng | `#B23E13`, active nền `#FFF0E8` |
| Quả cầu | `linear-gradient(135deg, #A78BFA, #F472B6, #60A5FA)`; **chỉ một quả cầu lớn trong Sổ tay AI**, có lớp sáng nhẹ trên bề mặt |
| Card luân phiên A | `#FFF0E8 → #FCE4EC` |
| Card luân phiên B | `#FCE4EC → #F3E5F5` |
| Card luân phiên C | `#F3E5F5 → #E8F0FE` |
| Focus input | Cam + `0 0 0 4px rgba(255,122,69,.12)`; outline bàn phím xuất hiện ngay |
| Shadow hover card | `0 8px 24px rgba(255,122,69,.15)` |
| Đúng/hoàn thành, lỗi | Xanh `#26704B`, đỏ hồng `#BF354A`; không đổi ý nghĩa phản hồi |

Chế độ tối vẫn sử dụng được: nền tím xám `#191721`, panel `#25212F`, chữ sáng `#F5F1F9`, card gradient giảm sáng tương ứng. Nút chính vẫn cam. Không dùng lại bộ màu giấy mực. Các giá trị màu/gradient/shadow tập trung ở `tokens.css`.

## Font

Dùng **Inter 400–800** cho toàn giao diện, gồm tiêu đề, nhãn, nội dung và nút. Bỏ Lora/serif. Giữ KaTeX cho công thức và monospace cho đoạn mã; không sửa vendor.

## Header và sidebar

Header dùng chung tất cả tab: thanh tìm kiếm pill lớn phía trái; mail, chuông và avatar chữ cái + tên/email thật từ `MindSprintAuth` phía phải. Avatar header dùng nền cam nhẹ, không lặp quả cầu gradient. Cập nhật theo yêu cầu tiếp theo: quả cầu duy nhất chuyển từ Trang chủ sang Sổ tay AI. Không dùng tên, ảnh hoặc số thông báo mẫu.

Tìm kiếm chỉ hỗ trợ điều hướng các tab và bộ thẻ đang được render, không thêm endpoint. Mail mở ghi chú/tài liệu trong Sổ tay AI; chuông mở lịch học và nhắc nhở đang có. Avatar mở đăng nhập khi chưa có phiên, hoặc menu **Đổi ảnh đại diện / Dùng ảnh mặc định / Đăng xuất** khi đã đăng nhập. Đăng xuất dùng luồng thu hồi phiên hiện có. Tên/email người dùng chỉ nằm ở header góc phải, bỏ cả hai vị trí tên và nút đăng xuất cũ trong sidebar.

Ảnh đại diện JPG/PNG/WebP tối đa 5 MB được cắt vuông, thu nhỏ thành JPEG 256×256 và lưu trong localStorage theo ID tài khoản. Không đồng bộ ảnh lên máy chủ; đổi tài khoản không dùng chung ảnh. Có phản hồi lỗi định dạng/dung lượng/lưu trữ và hỗ trợ bàn phím (Tab/Escape), đóng menu khi nhấn ra ngoài. Bỏ dòng hướng dẫn “Thêm nguồn ở bên trái…” khỏi vùng chat Sổ tay AI, giữ trích dẫn trong câu trả lời thật.

Sidebar giữ nhóm **Học tập / Tổ chức / Ứng dụng**, đủ tám tab, icon Font Awesome rõ ràng. Active nền cam nhạt bo góc; chữ/icon cam đậm. **Danh mục chỉ hiển thị trong Thư viện**, giữ thay đổi đã được yêu cầu ở lượt trước. Mobile xếp lại header và sidebar, không tràn ngang.

## Bố cục các tab

| Tab | Hướng triển khai |
|---|---|
| Trang chủ | Bỏ quả cầu; lời chào và hành động học căn trái, chip hành động pill cam; thống kê thực; bộ thẻ gợi ý và bốn card chức năng gradient pastel luân phiên. Không thêm ô hỏi giả khi trang chưa có chức năng này. |
| Thư viện | Giữ lọc/tìm chủ đề/SRS; bộ thẻ gradient pastel, icon tròn nhỏ trước tiêu đề, nút pill cam. |
| Luyện tập | Giữ chọn trắc nghiệm/tự luận/ghép thẻ; panel trắng bo góc, tiến độ cam; đáp án dài xuống dòng đầy đủ, giữ phản hồi đúng/sai. |
| Lịch học | Lưới và widget nền trắng bo góc, tiêu đề ngày cam nhẹ; giữ lịch và nhắc nhở. |
| Công việc | Ba cột Kanban rõ ràng, task gradient pastel luân phiên; giữ kéo thả và nút chuyển cột. |
| Tổng quan | Card số liệu gradient nhẹ, chữ tối và nhấn cam; giữ biểu đồ/dữ liệu thực. |
| Sổ tay AI | Bám ảnh gốc: nguồn ở cạnh trái; quả cầu và lời chào giữa vùng hỏi đáp; chip trên composer lớn bo tròn; tám card Studio pastel ở phía dưới; kết quả/ghi chú giữ riêng. Tablet/mobile thu gọn nguồn và reflow. |
| Cài đặt | Nhóm thiết lập nền trắng bo góc; controls pill, checkbox/switch bật màu cam; giữ đổi theme. |

## Hiệu ứng tương tác — thay thế bản trước

Các phản hồi thao tác 120–200ms, easing tự nhiên `cubic-bezier(.4,0,.2,1)`; loading là trạng thái đang xử lý, không phải trang trí tự chạy. Không ripple. Không đổi cơ chế lật, chọn đáp án, kéo thả hoặc xử lý dữ liệu. Có hỗ trợ `prefers-reduced-motion`.

1. **Card chức năng/bộ thẻ/task:** hover `translateY(-4px)`, shadow cam `0 8px 24px rgba(255,122,69,.15)`, viền cam nhạt; active `translateY(-1px)`, bóng thu nhỏ. Transition 180ms; thiết bị không có hover không nâng thẻ khi chạm.
2. **Nút pill chính:** nền cam, hover cam đậm + bóng tăng; active `scale(.97)` + bóng thu nhỏ, 150ms. Disabled không transform/shadow.
3. **Input:** focus viền cam + shadow `0 0 0 4px rgba(255,122,69,.12)`, 150ms; outline focus bàn phím tức thì. Áp dụng tìm kiếm, ô hỏi AI và biểu mẫu.
4. **Avatar:** hover `scale(1.05)` 150–180ms; avatar header nền cam nhẹ và quả cầu Sổ tay AI dùng gradient. Không xoay liên tục.
5. **Chip nhanh/gợi ý:** hover `scale(1.03)` + viền cam đậm, active `scale(.96)`, 150ms.
6. **Sidebar:** hover nền cam rất nhạt, active cam nhạt + chữ/icon cam đậm; transition màu 150ms, active click nhẹ.
7. **Flashcard 3D:** giữ rotateY/cơ chế lật, easing `cubic-bezier(.4,0,.2,1)`, 200ms; shadow cam tăng khi flipped, không đổi state học.
8. **Đã thuộc/Chưa thuộc:** mỗi click nảy `1 → 1.05 → 1` trong 150ms bằng Web Animations API thuần hiển thị, bỏ motion nếu người dùng chọn reduced-motion.
9. **Toggle/switch:** núm translate và nền chuyển mượt 150ms; trạng thái bật cam. Checkbox/radio/range cũng dùng accent cam.
10. **Loading AI:** ba chấm cam đổi opacity mờ–rõ theo nhịp lệch, chỉ hiện khi chat/Studio đang xử lý; thay spinner trong các thông báo loading. Reduced-motion dùng chấm tĩnh.
11. **Liên kết chữ:** đường gạch chân cam 1px từ trái sang phải khi hover, 150ms; không gradient tô chữ.

## Phạm vi và xác minh

Không sửa backend, tests, các file chạy/cấu hình test, `standalone.html`, `frontend/js/`, `vocab_data.js`, `vendor/katex/`, API client hoặc bộ render công thức. Các hàm, exports, endpoint/payload và xử lý dữ liệu giữ nguyên. JS được sửa/thêm chỉ phục vụ DOM/render/hiệu ứng.

Các file triển khai: `tokens.css`, `style.css`, `kanban.css`, `index.html`, template icon trong `script.js`, template loading trong `notebook.js`, **thêm `ui.js`** cho header và phản hồi click; `sw.js`, `manifest.json` để cập nhật tài nguyên/PWA. Cập nhật tài liệu kế hoạch và audit/kết quả trong `design-reference/`.

Chạy `node --test tests/frontend-session.test.cjs tests/frontend-text.test.cjs` trước và sau; kiểm tra trình duyệt trên tám tab ở 320, 375, 414, 768px và desktop, sáng/tối, focus/hover/click/loading. Chụp preview từng tab. Hallmark audit theo yêu cầu, ghi rõ ngoại lệ người dùng đã chỉ định cho gradient/pill/glow/hover, vẫn kiểm tra an toàn layout, tương phản, trạng thái và tính nhất quán.

## Điều chỉnh theo phản hồi mới nhất

Người dùng yêu cầu Sổ tay AI bám ảnh Minded gốc sát hơn và chuyển quả cầu từ Trang chủ sang Sổ tay AI. Chỉ một `.welcome-orb` nằm trong template Sổ tay AI. Khi đã có hội thoại, lời chào/quả cầu được thu gọn để dành chỗ đọc câu trả lời. Ô hỏi giữ `#nb-q`, nút gửi giữ `data-act="send"`; tất cả `data-gen` và hành động tài liệu/ghi chú giữ nguyên. Nút cộng ở composer mở phần tải file hiện có, nút nguồn trên tablet/mobile chỉ đóng/mở vùng hiển thị, không gọi API.

### Khung Sổ tay & Nguồn — theo ảnh Notebook do người dùng gửi

Hallmark áp dụng ở phạm vi component, giữ palette/font hiện tại. Ảnh tham khảo có khung nguồn cao ở trái, một nút “Thêm nguồn”, trạng thái trống ở giữa khung và hộp thêm tài liệu tập trung. Chuyển bố cục này sang nền sáng/cam hiện có; dark mode vẫn dùng token của ứng dụng. Không sao chép các lựa chọn chưa có chức năng như tìm web, Drive hoặc Sách.

Khung nguồn rộng 280px, chọn sổ tay ở trên, nút thêm nguồn pill, danh sách và số lượng tài liệu thật bên dưới. Nút thu gọn biến khung thành thanh 56px có nút mở lại/thêm nguồn và số lượng; vùng hỏi đáp cùng Studio mở rộng. Trên tablet/mobile, thanh nguồn nằm ngang và mặc định thu gọn. Trạng thái đóng/mở giữ khi chuyển sổ tay trong phiên hiện tại.

Hộp thêm nguồn dùng native `dialog` với ba tab **Tải tệp lên / Trang web / Dán văn bản**, giữ tất cả ID và `data-act` nhập tài liệu cũ. Tải file nhận PDF/TXT/MD/CSV tối đa 10 MB, chọn hoặc kéo thả một tệp rồi bấm Tải lên. Có nhãn trường, phản hồi chọn tệp/lỗi/thành công; Tab/Escape và phím mũi tên trong tablist hoạt động. Đóng hộp trả focus về nút mở; composer và lựa chọn thay thế khi URL lỗi mở đúng tab. Không đổi endpoint, payload, hàm dữ liệu hay backend.

Tự đánh giá Hallmark: Philosophy 5, Hierarchy 5, Execution 4, Specificity 5, Restraint 5, Variety 4. Gradient/pill/cam là yêu cầu chủ đích đã duyệt. Bản xem thử tám trạng thái tại `notebook-sources.preview.html`.

Đã xác minh: 16/16 test frontend bắt buộc và 6/6 test phiên Google pass; trình duyệt kiểm tra thu gọn/mở, tải tệp multipart, kéo thả, nhập URL/văn bản, lỗi 403 và phương án thay thế, trích dẫn, phím Tab/mũi tên/Escape, giữ trạng thái khi chuyển sổ tay. Hộp thêm nguồn/bản xem thử không tràn ngang ở 320/375/414/768px. Các cặp chữ/nền chính của component ở cả sáng/tối đạt tỷ lệ tương phản từ 5.26:1 (kiểm tra trạng thái màu sau transition).

### Hộp thoại trong web — thay hộp đen của trình duyệt

Theo yêu cầu mới, thay các lệnh `alert`, `confirm`, `prompt` mặc định trong ứng dụng chính bằng component dùng native HTML `dialog`, được CSS hóa theo palette cam/pastel và font Inter hiện tại. Không ghi đè các hàm mặc định của `window`; các nơi xác nhận chuyển sang chờ kết quả bất đồng bộ. Giữ API, payload và tên hàm dữ liệu hiện có. Quyền thông báo, trình chọn tệp và lời mời cài PWA vẫn do trình duyệt quản lý.

Hộp tạo sổ tay có nhãn **Tên sổ tay**, nút **Hủy / Tạo sổ tay**, báo lỗi tên trống tại chỗ. Trong lúc gửi yêu cầu, nút đổi thành **Đang tạo…**, chặn gửi lặp; nếu API lỗi thì giữ tên đã nhập và cho thử lại ngay trong hộp. Các thao tác xóa sổ tay, thẻ, công việc, lịch học, dừng luyện tập và thoát game dùng hộp xác nhận trong web. Xung đột sửa thẻ có hai lựa chọn rõ **Giữ bản server / Ghi đè bản cục bộ**; đóng bằng Escape/nút đóng không tự ghi đè. Thông báo thiếu nguồn, dữ liệu không hợp lệ, đồng bộ lỗi và lưu thẻ thành công cũng hiển thị trong web.

Component có hàng đợi để nhiều thông báo không chồng lên nhau, dùng `textContent` cho dữ liệu người dùng, Tab/Shift+Tab giữ focus trong hộp, Escape/backdrop/nút đóng hủy thao tác và trả focus về nút mở. Hủy các hộp đang chờ khi tài khoản đổi; các thao tác xác nhận kiểm tra lại phiên trước khi gọi API. Có trạng thái mặc định, hover, focus, active, disabled, loading, error, success; responsive 320/375/414/768px, light/dark, reduced-motion. Không sửa backend hoặc tests. Tài nguyên/cache tăng lên v45.

File của thay đổi này: `dialogs.js` (mới), `index.html`, `style.css`, `notebook.js`, `script.js`, `kanban.js`, `sw.js`, kế hoạch này và `app-dialogs.preview.html` (mới, tám trạng thái). Không cần đổi `ui.js`, `api.js`, `auth.js`, token, Kanban CSS hoặc các file được bảo vệ.

Đã xác minh trước và sau: `node --test tests/frontend-session.test.cjs tests/frontend-text.test.cjs` **16/16 pass** và `node --test backend/GoogleAuthChecks/frontend-google.test.cjs` **6/6 pass**. Kiểm tra Edge headless với API giả lập: tạo sổ tay/validation/lỗi/retry/loading/chống submit lặp; xác nhận và hủy xóa; cảnh báo thiếu nguồn; hộp lồng trong thêm nguồn; Tab/Escape/backdrop/focus; hàng đợi; chuỗi HTML không được thực thi; đóng khi đăng xuất; các thao tác Kanban, thẻ, lịch học và luyện tập. Không phát sinh hộp thoại `alert/confirm/prompt` trình duyệt hay lỗi JavaScript trong các luồng kiểm tra. Bản xem thử tám trạng thái không tràn ngang ở bốn kích thước bắt buộc. Tự đánh giá Hallmark: Philosophy 5, Hierarchy 5, Execution 4, Specificity 5, Restraint 5, Variety 4.

### Rút gọn câu trả lời Sổ tay AI — 07/10/2026

Theo phản hồi người dùng, bỏ khối tên tài liệu và đoạn dẫn chứng bên dưới mỗi câu trả lời chat. Giữ nội dung trả lời, công thức, số trích dẫn nhỏ trong nội dung và nút **Lưu ghi chú**. Chỉ đổi template hiển thị; API, lịch sử chat, nội dung lưu ghi chú và backend giữ nguyên. Tăng phiên bản `notebook.js` và cache lên v46 để cập nhật giao diện.

### Issue #30 — Gia sư giải bài tập, 07/10/2026

Theo yêu cầu bắt đầu issue #30, bổ sung chức năng và endpoint riêng cho Gia sư; phạm vi frontend-only của các lượt thiết kế trước không áp dụng cho tính năng backend mới này. Giữ palette cam/pastel, font, khung nguồn thu gọn, quả cầu duy nhất trong Sổ tay AI và các hộp thoại trong web.

Thêm lựa chọn **Theo nguồn / Gia sư** dạng pill, hỗ trợ radiogroup với phím mũi tên/Home/End. Gia sư có **Từng bước / Ngắn gọn** và **Bài mới**, ô nhập đề tối đa 10.000 ký tự; Enter gửi, Shift+Enter xuống dòng. Hai chế độ có nháp và hội thoại riêng. Khi đang gửi, khóa chuyển chế độ/cách giải và nút Bài mới để tránh đổi ngữ cảnh. Theo nguồn giữ các chip/Studio; Gia sư ẩn công cụ tạo nội dung theo nguồn nhưng giữ vùng ghi chú, cho lưu/mở lời giải. Không thay đổi giao diện những tab khác.

Component Hallmark kế thừa token hiện có, không đổi bảng màu hay thiết kế toàn trang. Các trạng thái mặc định/hover/focus/active/disabled/loading/error/success có trong `tutor.preview.html`. Tự đánh giá: Philosophy 5, Hierarchy 5, Execution 4, Specificity 5, Restraint 5, Variety 4. Focus ring tức thì; transition ngắn; loading dùng chấm cam; reduced-motion không transform. Gradient/pill hiện có là lựa chọn đã duyệt của người dùng.

File triển khai frontend: `api.js` thêm `nbTutor`, `notebook.js`, `style.css`, `index.html`, `sw.js`; cập nhật asset/cache v47. Backend: `TutorController.cs`, `TutorService.cs`, đăng ký service trong `Program.cs`; không sửa cấu hình riêng hay migration. Kiểm thử mới đặt ở `backend/TutorChecks/`, không sửa thư mục `tests/` được bảo vệ. Chi tiết kiểm thử và giới hạn trong `backend/TutorChecks/README.md`.

#### Sửa Gia sư đọc tài liệu đã tải lên

Theo phản hồi người dùng, Gia sư sử dụng nguồn của sổ tay đang mở để tìm và giải bài được nhắc đến (ví dụ “Câu 1”). Hai chế độ vẫn giữ hội thoại riêng; Gia sư được suy luận để giải đề trong nguồn và vẫn nhận đề trực tiếp khi không có tài liệu. Dòng trợ giúp dưới hội thoại cập nhật theo số nguồn thực, kể cả sau thêm/xóa tài liệu, để người dùng biết Gia sư đang đọc tài liệu nào. Backend lấy nguồn sau khi xác minh quyền sở hữu; không đổi endpoint/payload. Cập nhật `notebook.js` và cache lên v48.

### Danh mục Thư viện và cân đối nút bộ thẻ

Mục Danh mục hiện khi chọn Thư viện, ẩn ở các tab khác, gồm Tất cả / Tiếng Anh / Lập trình / Kiến thức chung. Dùng thuộc tính `hidden` theo tab để thống nhất trạng thái, ghi đè quy tắc CSS cũ ép ẩn trên mobile. Trên mobile, danh mục sidebar chia hai cột; tránh lặp nhóm lọc bên trong thư viện khi sidebar đang mở, giữ nhóm đó khi sidebar thu gọn. Hai nút Xem thẻ / Luyện tập chia hai cột bằng nhau, cùng chiều cao/cỡ chữ, căn giữa ngang và dọc. Giữ palette, hover/click và các hàm xử lý dữ liệu. File thay đổi: `index.html`, `script.js`, `style.css`, `sw.js` và kế hoạch này; asset/cache v49.

Theo xác nhận vị trí mới nhất của người dùng, chuyển Danh mục vào ngay dưới nút Thư viện trong nhóm Học tập, dạng menu con thụt vào. Thay bố cục hai cột mobile bằng danh sách dọc để giữ quan hệ menu cha/con; không còn nhóm Danh mục ở cuối sidebar. Các mục lọc dùng button có thể Tab/Enter; trạng thái chọn và `aria-expanded` của nút Thư viện cập nhật khi chuyển mục/tab. Giữ bộ lọc bên trong thư viện làm phương án khi sidebar thu gọn. Asset/cache v50.
