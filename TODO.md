# TODO — MindSprintAI Study Cockpit

## Khung ứng dụng responsive và điều hướng
- [x] Tạo khung giao diện responsive dùng được trên desktop và mobile, có điều hướng tương tác đến Trang chủ, Thư viện, Luyện tập, Sổ tay AI, Tổng quan, Lịch học, Công việc và Cài đặt.
- [x] Ở màn hình tablet và mobile, chuyển thanh điều hướng chính xuống cạnh dưới; giữ sidebar bên trái cho màn hình desktop và tránh để nội dung bị thanh điều hướng che khuất.
- [x] Dùng ảnh biểu tượng người dùng gửi làm logo ở góc trên bên trái website và favicon; loại bỏ nền tối, các vệt ở bốn góc và đồng màu nền với sidebar.
- [x] Giữ nguyên ngôn ngữ tiếng Việt và phong cách đã duyệt: nền kem sáng, chữ xanh mực, điểm nhấn xanh chanh và cam san hô, nhiều khoảng trắng, typography rõ ràng, card tinh gọn.

## Trang chủ Study Cockpit
- [x] Hiển thị lời chào, tiến độ học tập, lối tắt, nội dung gần đây và checklist “Mục tiêu hôm nay” có thể đánh dấu hoàn thành.

## Thư viện và luyện tập flashcard
- [x] Thư viện flashcards dùng dữ liệu demo cục bộ, hỗ trợ tìm kiếm, lọc danh mục, hiển thị trạng thái rỗng, xem thông tin và mở một bộ thẻ.
- [x] Luồng luyện tập flashcard cho phép lật thẻ, chuyển câu trước/sau, chọn mức độ ghi nhớ và xem tiến độ hoặc kết quả mẫu.
- [x] Cân đối kiểu chữ trên flashcard khi đáp án dài để nội dung dễ đọc, không phóng quá lớn hoặc làm thẻ mất cân đối.
- [x] Thẻ flashcard có hiệu ứng lật mượt giữa câu hỏi và đáp án khi chạm vào thẻ hoặc dùng nút lật; vẫn hỗ trợ thao tác bàn phím hiện có.

## Pet 3D, tương tác, chat và giọng nói — tính năng cũ, đã gỡ khỏi giao diện
- [x] Theo yêu cầu mới nhất, bỏ mount pet khỏi website để không còn widget nổi, Canvas 3D, hộp chat hay các nút điều khiển pet; giữ API/database và toàn bộ tiến trình pet hiện có, không xóa dữ liệu đã lưu.
- [x] Tạo một pet 3D bằng React, React Three Fiber và Three.js, có giao diện tiếng Việt, hiện đại, pastel, tối ưu mobile; pet mở được từ widget nổi trên các màn hình MindSprintAI hiện có.
- [x] Chỉnh tạo hình Mầm cho dễ thương và hài hòa hơn theo phản hồi của người dùng: làm mắt, nét mặt và tỉ lệ đầu/thân rõ biểu cảm, vẫn nhìn ổn ở cả widget nhỏ lẫn scene lớn và giữ phong cách pastel.
- [x] Dùng hình ảnh pet người dùng gửi làm tham chiếu tạo hình; khi pet đi, quay mặt theo vector chuyển động bằng `Math.atan2(dx, dz)` (mô hình hướng `+Z`) và làm mượt góc quay bằng `THREE.MathUtils.damp`; di chuyển theo `delta` ở khoảng `0.7` đơn vị/giây, dừng khi cách đích dưới `0.1` đơn vị; chạy `Walk` với `timeScale = 0.75` khi đang đi và `Idle` khi đứng yên để chuyển động chậm, mượt, tự nhiên.
- [x] Pet có đầy đủ trạng thái `idle`, `walk`, `jump`, `wave`, `happy`, `sad`; mỗi trạng thái có biểu hiện chuyển động riêng, mượt và phù hợp reduced-motion.
- [x] Người dùng có thể bấm vị trí trong cảnh để pet đi tới, vuốt ve pet để phản hồi cảm xúc, và vẫn có thể kéo/di chuyển pet nổi; giữ các thao tác dễ dùng trên cảm ứng.
- [x] Khung trò chuyện gửi câu hỏi đến Manus AI qua server, hiển thị phản hồi tiếng Việt, trạng thái đang trả lời, lỗi và thử lại; giữ lịch sử chat tạm trong phiên trình duyệt, không lưu nội dung chat vào database.
- [x] Cung cấp TTS tiếng Việt có bật/tắt và đọc lại; khi pet đang đọc, miệng mở/đóng đơn giản theo nhịp phát âm; xử lý được trường hợp thiết bị không có giọng `vi-VN` hoặc không hỗ trợ Speech Synthesis.
  - Ghi chú: Browser Preview hiện không cài voice `vi-*`; code yêu cầu `vi-VN` và dùng voice tiếng Việt nếu hệ điều hành/trình duyệt có cung cấp.

## Tiến trình pet và backend
- [x] Bật managed server và database theo yêu cầu; tạo API server-side, giữ Manus API key khỏi client, giới hạn/kiểm tra payload, cung cấp health endpoint `/_app/health` và chỉ phục vụ origin của ứng dụng.
- [x] Lưu tiến trình pet vào managed database theo ID ngẫu nhiên của trình duyệt: level, XP, affection, mood, số lần tương tác và thời điểm gần nhất; không lưu hội thoại, không yêu cầu tài khoản.
- [x] Thêm migration cộng thêm, có thể chạy lặp an toàn, không xóa bảng hay dữ liệu hiện có; chạy migration trước khi deploy.

## Build, lưu phiên bản và deploy
- [x] Khóa pnpm và dependencies; build dashboard Vite, đóng gói frontend cùng backend bằng Dockerfile, server lắng nghe `PORT` (mặc định 3000).
- [x] Cập nhật `public/manus-routes.json` cho toàn bộ trang website; kiểm tra Preview trên desktop/mobile và xác nhận các chức năng pet hoạt động trước khi phát hành.
- [x] Deploy/publish website theo yêu cầu người dùng và cung cấp link Preview/website hoạt động; không bật tự động xuất bản cho các commit sau.
