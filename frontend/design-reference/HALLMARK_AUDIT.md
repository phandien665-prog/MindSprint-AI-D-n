# Hallmark audit — MindSprintAI, hướng thiết kế lần 2, v39

**Hallmark · pre-emit critique: P5 H4 E4 S5 R4 V4 — 26/30.** Đây là đánh giá thiết kế thủ công trong phạm vi kiểm tra, không phải điểm do phần mềm tự tính.

Ngày 2026-10-06; nhánh `frontend-redesign`. Hệ thống hiện hành: [REDESIGN_PLAN.md](REDESIGN_PLAN.md), tham khảo `dribbble-minded.png`. Audit này thay thế kết luận thị giác của bản giấy mực trước; dữ liệu kiểm tra các lượt trước vẫn được giữ trong `VALIDATION_RESULTS.json`.

## Ngoại lệ do người dùng chủ động yêu cầu

Giữ gradient pastel, một quả cầu tím–hồng–xanh trong **Sổ tay AI**, nền sidebar trắng, sans-serif hiện đại, nút/chip pill, shadow/glow cam mờ, hover nâng card và phản hồi scale. Các gate về gradient, Inter, hero giữa trang, shadow, nhiều phản hồi hover và card công cụ icon phía trên được đánh giá theo brief này, không coi lựa chọn đã được người dùng chỉ định là lỗi. Không dùng gradient tô chữ, glow neon, ripple hay quả cầu lặp lại.

## Phát hiện và xử lý

| Tell / vấn đề | Vị trí | Mức độ | Sửa / bằng chứng |
|---|---|---|---|
| Contrast thresholds: cam sáng trên nền sáng | `index.html`, `style.css`, `tokens.css` | major | Chữ/icon dùng cam đậm `--accent-ink`; nút cam dùng chữ tối `--on-accent`; nhãn danh mục và hover lỗi có màu chữ phù hợp riêng. |
| Input / hero fit | `.nb-welcome`, `.nb-composer` | major | Nén khoảng cách hợp lý: composer dưới 770px, nút gửi dưới 749px ở 1280×800. Focus viền/shadow cam, outline bàn phím tức thì. |
| Icon tells: emoji trùng icon ở tiêu đề | Tiêu đề Thư viện; nhãn danh mục hiển thị trong `script.js` | minor | Bỏ emoji trùng, giữ chữ tiếng Việt và Font Awesome; không thêm thư viện icon. Giữ thông báo/streak cũ ngoài phần icon chức năng được thiết kế lại. |
| Motion chạy một mình | `.card-hint i`, `.widget-icon` | minor | Dừng nhấp nháy/xoay tự động; các icon mốc/victory/chuông vốn đã bị tắt animation ở lượt trước. Pulse mới chỉ dùng khi AI đang xử lý. |
| Geometry / radius consistency | Controls, card, composer, sidebar | minor | Card 16–20px, composer 24–28px, control 12px hoặc pill theo vai trò; select tùy biến/native nhất quán; không đổi border-width khi focus. |
| Display action bị gửi qua auth guard | Hai nút UI thu gọn nguồn / mở tải tài liệu | major | Dùng `data-ui-act` và listener DOM trong `ui.js`, không đi qua `data-act` xử lý dữ liệu của Notebook. |
| Reduced-motion | `style.css`, `kanban.css`, `ui.js` | major | Giảm transition/keyframe; hover không nâng/scale khi reduced-motion; click nảy có guard; loading chuyển thành chấm tĩnh. |

Các lỗi trên đã được sửa trước khi kết thúc. **Kết quả trong phạm vi đã kiểm tra: 0 critical · 0 major · 0 minor chưa xử lý.** Các ngoại lệ chủ đích nêu trên không bị tự ý bỏ.

## Kiểm tra

- Baseline cùng lệnh trước/sau: `node --test tests/frontend-session.test.cjs tests/frontend-text.test.cjs` — **16/16 đạt, 0 lỗi ở cả hai lượt**. Tests giữ nguyên.
- `node --check` cho các JS đã sửa/thêm và service worker; `git diff --check -- frontend` đạt.
- **144 kịch bản**: tám tab × chín chiều rộng (320, 375, 414, 768, 769, 1001, 1280, 1440, 1920) × sáng/tối. Không tràn ngang, không lỗi JavaScript, không lỗi tương phản chữ/icon trong phần được scan. Scanner lấy mẫu gradient tại 17 vị trí để tránh đánh giá nền gradient như trắng thuần.
- Sidebar mở trên 320, 375, 414, 768px: đủ tám nút điều hướng, không tràn root.
- **66 kịch bản Luyện tập** với nội dung dài: setup/quiz/game × 11 chiều rộng từ 320–2560 × sáng/tối; không tràn/cắt chữ. Đã kiểm tra phản hồi đáp án, ghép đủ sáu cặp, màn hình thắng, trở về cài đặt và tự luận.
- Kiểm tra hover/active/focus bằng trạng thái CSS thực trong Edge: card nâng/nhấn, nút cam hover/scale, focus tìm kiếm, avatar/quả cầu scale, chip scale, sidebar hover, switch trượt, flashcard rotateY và bóng, click Đã thuộc 150ms, gạch chân liên kết. Kiểm tra riêng pulse AI trong lúc request bị giữ lại bằng API giả lập. Có kiểm tra reduced-motion.
- API giả lập trong trình duyệt: đăng nhập, header tên/email đồng bộ, đăng xuất, nguồn/ghi chú, chat với KaTeX và citation, Studio, retry sau lỗi, Kanban chuyển cột. Kiểm tra thêm textarea `#nb-q`, loading chat/Studio, thu gọn nguồn mobile và nút cộng mở vùng tải file. Không gửi dữ liệu thử vào backend.
- Tìm kiếm header mở đúng bộ thẻ qua nút ôn tập hiện có; kết quả tìm kiếm đóng khi đổi trạng thái tài khoản.
- Service worker có controller và cache `mindsprintai-cache-v39`.
- So sánh snapshot: **93 file nguồn được bảo vệ không đổi**; tên hàm hiện có và các method API được gọi trong auth/script/notebook/kanban giữ nguyên. `auth.js` và `kanban.js` không đổi trong lượt này. API client, renderer công thức, vendor và dữ liệu từ vựng không sửa.

Đây là kiểm tra frontend; API giả lập không xác nhận Gemini hoặc backend thực tế. Các ảnh dùng hồ sơ QA riêng, số liệu trong ảnh không phải tiến độ tài khoản của người dùng.

## File của lượt đổi hướng này

**Triển khai:** `frontend/tokens.css`, `frontend/style.css`, `frontend/kanban.css`, `frontend/index.html`, `frontend/script.js`, `frontend/notebook.js`, `frontend/sw.js`, `frontend/manifest.json`; thêm `frontend/ui.js`.

**Tài liệu:** cập nhật `REDESIGN_PLAN.md`, `HALLMARK_AUDIT.md`, `VALIDATION_RESULTS.json`; thêm `PREVIEW.md`.

**Ảnh:** 16 ảnh desktop/mobile của tám tab, cùng hai ảnh Sổ tay AI có nguồn/hội thoại giả lập, tên đầy đủ trong [PREVIEW.md](PREVIEW.md). Ảnh v38 phát sinh trong lúc thử hướng đầu đã được bỏ, chỉ giao bản v39 cuối cùng. Các preview cũ trước nhiệm vụ và ảnh tham khảo gốc được giữ.

[VALIDATION_RESULTS.json](VALIDATION_RESULTS.json) lưu dữ liệu kiểm tra chi tiết. Mã nguồn chưa được commit/push trong nhiệm vụ này.
