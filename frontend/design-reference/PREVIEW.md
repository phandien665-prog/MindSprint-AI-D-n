# Preview — cam / gradient pastel, v39

Ảnh Edge từ hồ sơ thử nghiệm riêng. Desktop 1440×1000; mobile 375×1000, sidebar thu gọn. Các tab dài tiếp tục cuộn, không cắt dữ liệu để vừa một ảnh. Số liệu thuộc hồ sơ QA, không phải tài khoản của người dùng.

| Tab | Diện mạo sau thay đổi | Desktop | Mobile |
|---|---|---|---|
| Trang chủ | Lời chào căn trái, không còn quả cầu; chip cam, thống kê trắng, bộ thẻ và card chức năng pastel. | [home-desktop-v39.png](home-desktop-v39.png) | [home-mobile-v39.png](home-mobile-v39.png) |
| Thư viện | Bộ lọc và SRS rõ ràng; card pastel luân phiên, icon tròn, nút pill cam; Danh mục giữ tại đây. | [flashcards-desktop-v39.png](flashcards-desktop-v39.png) | [flashcards-mobile-v39.png](flashcards-mobile-v39.png) |
| Luyện tập | Thanh chọn chế độ pill, panel ôn tập trắng bo góc, nút cam; giữ nội dung đáp án dài và game. | [quiz-desktop-v39.png](quiz-desktop-v39.png) | [quiz-mobile-v39.png](quiz-mobile-v39.png) |
| Lịch học | Lưới trắng bo góc, tiêu đề ngày cam nhạt, widget bên cạnh/dưới theo màn hình; lưới rộng cuộn trong vùng lịch. | [timetable-desktop-v39.png](timetable-desktop-v39.png) | [timetable-mobile-v39.png](timetable-mobile-v39.png) |
| Công việc | Ba cột trắng; task dùng card pastel, icon và nút chuyển cột rõ ràng; giữ kéo thả. | [kanban-desktop-v39.png](kanban-desktop-v39.png) | [kanban-mobile-v39.png](kanban-mobile-v39.png) |
| Tổng quan | Thống kê trên ba card pastel, số liệu sans-serif và thanh tiến độ gọn. | [overview-desktop-v39.png](overview-desktop-v39.png) | [overview-mobile-v39.png](overview-mobile-v39.png) |
| Sổ tay AI | Quả cầu duy nhất, lời chào giữa trang, chip trên composer lớn; tám card Studio bên dưới, nguồn ở trái, nguồn mobile thu gọn. | [notebook-desktop-v39.png](notebook-desktop-v39.png) | [notebook-mobile-v39.png](notebook-mobile-v39.png) |
| Cài đặt | Nhóm thiết lập trắng bo góc; controls pill, trạng thái bật màu cam. | [settings-desktop-v39.png](settings-desktop-v39.png) | [settings-mobile-v39.png](settings-mobile-v39.png) |

Hai ảnh bổ sung ở 1440×1200, dùng API giả lập:

- [notebook-welcome-desktop-v39.png](notebook-welcome-desktop-v39.png): có nguồn và ghi chú; orb/composer/card theo ảnh gốc.
- [notebook-conversation-desktop-v39.png](notebook-conversation-desktop-v39.png): hội thoại với KaTeX/citation và kết quả Studio; hero thu gọn nhường chỗ đọc.

## Hiệu ứng đã triển khai

1. Card chức năng/bộ thẻ/task/Studio: hover nâng 4px và bóng cam; active hạ còn 1px.
2. Nút chính: cam đậm hơn khi hover, bóng tăng; click scale .97.
3. Tìm kiếm/ô hỏi/form: focus cam mờ, outline bàn phím tức thì.
4. Avatar header/quả cầu Notebook: hover scale 1.05, không tự xoay.
5. Chip hành động/gợi ý: hover 1.03, click .96.
6. Sidebar: chuyển màu nền/chữ/icon cam mượt.
7. Flashcard: giữ lật 3D, easing .4/0/.2/1, bóng cam tăng khi lật.
8. Đã thuộc/Chưa thuộc: nảy nhẹ trong 150ms theo mỗi click.
9. Switch/SRS: núm trượt và đổi nền cam 150ms; checkbox/radio/range accent cam.
10. Loading AI: chấm cam pulse khi đang xử lý; reduced-motion dùng chấm tĩnh.
11. Liên kết chữ: gạch chân cam chạy từ trái sang phải.

[Kế hoạch hiện hành](REDESIGN_PLAN.md) · [Hallmark audit](HALLMARK_AUDIT.md) · [Kết quả kiểm tra](VALIDATION_RESULTS.json).
