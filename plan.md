# Kế hoạch — MindSprintAI Pet Companion

## Cập nhật phạm vi hiện tại

Theo yêu cầu mới nhất, gỡ trải nghiệm pet khỏi giao diện đang dùng: entrypoint chỉ nạp dashboard Study Cockpit, không mount `PetAssistant`, Canvas 3D, widget nổi, khung chat hay điều khiển pet. Giữ nguyên các API, migrations, bảng và tiến trình pet đã lưu để tránh xóa dữ liệu; đây là thay đổi có thể hoàn tác.

## Mục tiêu và phạm vi

Nâng cấp dự án MindSprintAI hiện tại, giữ nguyên tám màn hình học tập đã có, đồng thời thêm một pet 3D đồng hành có thể mở thành trải nghiệm chat. Pet được dựng bằng React, React Three Fiber và Three.js; giao diện tiếng Việt, phong cách pastel, responsive. Pet có các trạng thái `idle`, `walk`, `jump`, `wave`, `happy`, `sad`; người dùng có thể bấm vào sàn để pet đi tới, vuốt ve pet, chat với AI, nghe giọng tiếng Việt và xem miệng cử động đơn giản khi nói. Pet tự tản bước trên màn hình khi đang ở widget nổi; người dùng vẫn có thể kéo pet hoặc mở trải nghiệm đầy đủ.

Chat gọi Manus AI qua backend; không lưu lịch sử hội thoại vào database. TTS dùng Web Speech API của trình duyệt với locale `vi-VN`, nút bật/tắt và nút đọc lại; khả năng giọng đọc thực tế phụ thuộc giọng tiếng Việt được cài trên thiết bị. Database chỉ lưu tiến trình pet tối thiểu: mã pet ngẫu nhiên theo trình duyệt, cấp độ, XP, độ thân thiết, mood và bộ đếm tương tác. Không cần đăng nhập, không lưu nội dung tin nhắn.

## Cách triển khai

- Chuyển entrypoint sang Vite + React nhưng giữ ứng dụng vanilla hiện có bên trong dự án và các chức năng hiện hữu; React mount vào một root riêng để pet không bị render lại khi điều hướng cũ thay đổi `#app`.
- `src/main.jsx` khởi tạo React; `src/pet/PetAssistant.jsx` quản lý widget nổi, hộp chat, trạng thái, TTS, vị trí và tiến trình; `src/pet/PetScene.jsx` tạo Canvas React Three Fiber; `src/pet/PetModel.jsx` dựng nhân vật bằng các mesh Three.js và hoạt ảnh theo trạng thái.
- Dựng một Node/Express server phục vụ Vite middleware ở Preview và `dist/` trong production; API giới hạn kích thước/độ dài, kiểm tra role/payload, giữ khóa Manus AI trong môi trường server, trả lỗi thân thiện và không ghi nội dung chat vào DB. Health route là `/_app/health`.
- Dùng `mysql2` với managed MySQL. Migration cộng thêm bảng `pet_progress`; endpoint tiến trình chỉ cập nhật các thống kê được cho phép. Chạy migration tách biệt trước khi publish, không tự chạy migration mỗi lần server khởi động.
- Khóa pnpm và dependency trong manifest/lockfile. Dockerfile cài dependencies, build Vite, rồi chạy server trên `PORT` (mặc định 3000). Bật server + database vì đây là yêu cầu chức năng; không bật tự publish. Publish thủ công sau khi hoàn thiện và kiểm tra Preview.

## Cấu trúc dự án dự kiến

- `index.html`: entrypoint Vite, giữ logo và root MindSprintAI/React.
- `app.js`, `styles.css`, `assets/`: ứng dụng học tập hiện tại; tiếp tục giữ nguyên chức năng và nhận diện.
- `src/main.jsx`: nạp CSS và mount component pet vào root riêng.
- `src/pet/PetAssistant.jsx`: widget, chat, input, trạng thái tương tác, TTS và tiến trình.
- `src/pet/PetScene.jsx`, `src/pet/PetModel.jsx`: cảnh R3F, mô hình 3D procedural, click-to-move và các hoạt ảnh.
- `src/pet/pet.css`: overlay/chat/mobile styles; không phá layout dashboard hiện có.
- `server.mjs`, `server/`: API Manus AI, MySQL, kiểm tra dữ liệu và giới hạn request.
- `migrations/001_pet_progress.sql`, `scripts/migrate.mjs`: schema migration cộng thêm, không xóa dữ liệu.
- `public/manus-routes.json`: manifest trang website.
- `Dockerfile`, `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`: build/deployment và dependency được khóa.

## Thiết kế

- **Design Movement:** soft 3D / toy-like editorial; nhân vật có vật liệu mờ mềm, ánh sáng dịu và biểu cảm nhỏ, đặt trong dashboard học tập sạch sẽ.
- **Mascot Form:** lấy ảnh pet người dùng gửi làm tham chiếu cho tạo hình chibi chồi lá; đầu tròn hơi lớn, thân gọn, tay chân ngắn, mắt nâu lớn có đồng tử và hai điểm sáng, má san hô nhẹ, bụng sáng và miệng cười nhỏ; giữ silhouette và chi tiết đủ rõ ở widget mini.
- **Core Principles:** dễ thương nhưng không trẻ con; pet nổi bật nhưng không lấn át nội dung; mọi hành động có phản hồi rõ; ưu tiên mobile và khả năng giảm chuyển động.
- **Color Philosophy:** giữ nền kem và chữ xanh mực của dashboard; dùng xanh sage/xanh chanh cho năng lượng và tiến độ, cam san hô cho khoảnh khắc vui, lavender làm sắc nền phụ để phân biệt khu vực 3D.
- **Layout Paradigm:** ứng dụng học tập hiện tại giữ nguyên; một nút pet 3D nổi mở trải nghiệm dạng overlay. Desktop chia cảnh pet và hội thoại thành hai vùng; mobile xếp theo chiều dọc, có vùng bấm đủ lớn và không che navigation.
- **Signature Elements:** chồi lá nhỏ trên đầu pet; vòng sáng mềm dưới chân; bong bóng hội thoại màu kem với chỉ báo cảm xúc.
- **Interaction Philosophy:** click sàn để pet bước tới; vuốt ve tạo phản ứng vui; điều khiển animation luôn có nút rõ ràng; chat chỉ gửi khi người dùng chủ động; TTS bật/tắt được.
- **Animation:** `idle` thở/chớp mắt; `walk` bước chân và vung tay lệch nhịp, di chuyển theo `delta` ở `0.7` đơn vị/giây, dừng dưới `0.1` đơn vị; mặt hướng theo `Math.atan2(dx, dz)` vì model hướng `+Z`, và góc quay được làm mượt bằng `THREE.MathUtils.damp`; Walk dùng `timeScale = 0.75`, khi đứng chuyển sang Idle. Các trạng thái `jump`, `wave`, `happy`, `sad` vẫn có biểu cảm riêng; khi TTS đọc, miệng mở/đóng theo nhịp đơn giản. Tôn trọng `prefers-reduced-motion`.
- **Typography System:** kế thừa DM Sans cho nội dung và Manrope cho tiêu đề từ dashboard; tiêu đề chat gọn, thông điệp dễ đọc, chữ phụ không nhỏ hơn mức phù hợp mobile.
- **Brand Essence:** bạn đồng hành giúp việc học mỗi ngày nhẹ nhàng và có cảm xúc — ấm áp, tinh nghịch, khích lệ.
- **Brand Voice:** câu ngắn, thân thiện, không phán xét. Ví dụ: “Mình cùng học một chút nhé?” và “Không sao đâu, mình chia nhỏ ra làm cùng nhau.”
- **Wordmark & Logo:** giữ wordmark MindSprintAI và logo người dùng đã chọn; pet là một nhân vật phụ, không thay thế thương hiệu.
- **Signature Brand Color:** xanh chanh `#c7e977` của MindSprintAI, phối xanh sage để vật liệu 3D không quá chói.
