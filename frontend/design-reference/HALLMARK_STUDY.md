<!-- Hallmark pre-emit critique (report only): Philosophy 4, Hierarchy 4, Execution 4, Specificity 5, Restraint 5, Variety 4. These are qualitative report scores, not a UI audit. -->

# Hallmark study — MindSprintAI

Ngày khảo sát: 2026-10-06. Nhánh: `frontend-redesign`.

Nguồn: `dribbble-minded.png`, ảnh tham khảo do người dùng cung cấp. Đã mở và kiểm tra ảnh trên đĩa. Hallmark được cài bằng `npx --yes skills add nutlope/hallmark --agent codex --global --yes`; đã đọc `SKILL.md`, `references/study.md` và quy trình redesign. `study` là quy trình của skill, không phải một chương trình shell riêng.

Đây là báo cáo khảo sát, chưa phải kế hoạch đã được duyệt. Chưa sửa code giao diện trong lượt khảo sát này. Chỉ lưu kế hoạch được duyệt vào `REDESIGN_PLAN.md` sau khi người dùng xác nhận.

## Phân tích cấu trúc ảnh

- Khung ứng dụng gồm sidebar bên trái và vùng thao tác chính bên phải. Sidebar có nhóm điều hướng, lịch sử theo thời gian, và nhóm công cụ/tài khoản ở cuối.
- Vùng chính đi từ lời chào tới gợi ý hành động, ô nhập lớn, rồi dãy bốn thẻ giới thiệu chức năng. Ô nhập là điểm thao tác chính.
- Các chip nằm ngay trên ô nhập, giúp chọn hành động mà không rời ngữ cảnh.
- Mỗi thẻ chức năng có icon, tiêu đề và mô tả ngắn; khoảng cách giữa các vùng rõ hơn khoảng cách giữa những thành phần trong cùng vùng.
- Ảnh có nhiều khoảng trống ở phần chào. Với ứng dụng học tập, thu gọn vùng này để việc học xuất hiện ngay trong màn hình đầu tiên.
- Chữ trong ảnh thuộc nhóm sans-serif, phân cấp bằng cỡ và độ đậm. Không xác định tên font chính xác từ ảnh. Không suy đoán chuyển động hoặc trạng thái tương tác từ ảnh tĩnh.
- Không lấy màu/hiệu ứng của nguồn: bỏ quả cầu trang trí, gradient pastel, glow quanh ô nhập và nút pill lớn theo yêu cầu người dùng.

## Dữ liệu study có cấu trúc

Các nhãn archetype là đối chiếu gần nhất; ảnh là giao diện ứng dụng thực tế, không khớp hoàn toàn với các mẫu trang giới thiệu của Hallmark. Các trường màu được chủ động loại khỏi trích xuất theo phạm vi người dùng yêu cầu.

```json
{
  "source_mode": "image",
  "source_url": null,
  "source": "public-reference supplied by user",
  "refusal": "ok — structural inspiration only",
  "remote_safety": {
    "public_web_url": null,
    "scheme": null,
    "ip_literal_detected": null,
    "redirects_checked": null,
    "fetched": null,
    "scripts_ignored": null,
    "prompt_injection_detected": null
  },
  "macrostructure": "Workbench (closest functional analogy; this is an application workspace, not a screenshot tour)",
  "macrostructure_alt": "unknown — no exact catalogue match",
  "hero": {
    "archetype": "custom greeting and composer",
    "knobs": {"alignment": "centred in workspace", "input": "wide", "quick_actions": "above input"}
  },
  "pitch": {
    "archetype": "custom feature row",
    "knobs": {"columns": "4", "content": "icon, title, short description"}
  },
  "nav": {
    "archetype": "custom grouped sidebar; side-rail family without rotated wordmark or dot navigation",
    "knobs": {"position": "left", "groups": "navigation, time context, utilities"}
  },
  "footer": {"archetype": "unknown — no page footer visible", "knobs": {}},
  "display_role": "regular sans-serif",
  "display_face": null,
  "body_role": "neutral grotesque",
  "body_face": null,
  "label_role": "sans-serif",
  "label_face": null,
  "pairing_logic": "apparently one family with size/weight changes; exact family unknown",
  "paper_band": "excluded by user: structure only",
  "paper_value": null,
  "paper_hue": "excluded by user: structure only",
  "accent_hue_band": "excluded by user: structure only",
  "accent_value": null,
  "accent_footprint": "excluded by user: structure only",
  "density": "generous in main workspace, denser in sidebar",
  "asymmetry": "left sidebar with centred workspace contents",
  "treatments": ["decorative orb, gradients and glow observed but explicitly excluded"],
  "reveal": "not-visible",
  "motion_library": null,
  "anti_patterns": ["decorative orb", "glowing composer border", "large pill buttons", "repeated gradient feature tiles"]
}
```

## Đối chiếu ứng dụng

- HTML/CSS/JavaScript thuần; sidebar dùng `data-tab` và tám panel `tab-content-*`.
- CSS đang có thay đổi chưa commit theo hướng giấy, sử dụng Lora và Inter; tiếp tục từ trạng thái này sau khi kế hoạch được duyệt.
- `index.html` tải CSS: `style.css`, `kanban.css`, `vendor/katex/katex.min.css`; JS: `vendor/katex/katex.min.js`, `vendor/katex/contrib/auto-render.min.js`, `text-renderer.js`, `vocab_data.js`, `api.js`, `auth.js`, `notebook.js`, `script.js`, `kanban.js`; tài nguyên link khác: `manifest.json`, `icon-192.jpg`, Google Fonts (Inter, Lora, Material Symbols) và Font Awesome CDN.
- `sw.js` là service worker cần cập nhật tên cache và phiên bản trong bước triển khai, không phải script trực tiếp trong index.
- `kanban.js` chính đã được chuyển thể để dùng API/auth chung, không import `frontend/js/kanban.js`. `standalone.html` tải `frontend/js/app.js`, thuộc bản FastAPI riêng.
- Sổ tay AI đã có `#nb-suggest` ngay trên `#nb-q`; có thể thiết kế chip từ dữ liệu gợi ý hiện có mà không thay logic/API.
- Thương hiệu còn sót trong `auth.js`, thông báo và lời chúc ở `script.js`, và văn bản README. Giữ nguyên từ Flashcard khi chỉ loại chức năng/thẻ học.

## Baseline kiểm thử

Lệnh đã chạy:

```text
node --test tests/frontend-session.test.cjs tests/frontend-text.test.cjs
```

Kết quả: 16 test, 16 pass, 0 fail. Đã đọc hai file test. Không sửa tests.

- Session tests giữ hợp đồng `MindSprintApi`, `MindSprintAuth`, storage, đăng nhập/refresh và xử lý lỗi API.
- Text tests kiểm tra nội dung tiếng Việt, KaTeX/MathML, `.nb-cite`, tiêu đề `h4`, code, escape HTML và công thức lỗi. Giữ nguyên các hợp đồng này.
- Các test hiện có không thay thế kiểm tra hình ảnh, responsive, bàn phím hay các luồng thật trên trình duyệt.

## Giới hạn và bước tiếp theo

Chờ duyệt palette/font/layout trước khi triển khai. Bản kế hoạch được duyệt sẽ là nguồn quyết định trong `REDESIGN_PLAN.md`, ưu tiên hơn hướng dẫn mẫu của skill. Không tạo `design.md` hoặc `.hallmark/` ngoài frontend.

Chỉ sửa frontend chính và phần mô tả README; giữ nguyên backend, tests, frontend thử nghiệm và hợp đồng dữ liệu/API. `backend/MindSprint.Api/appsettings.json` đã có thay đổi cục bộ từ trước; báo cáo diff cuối phải phân biệt thay đổi có sẵn với thay đổi của nhiệm vụ này.

Chưa chạy audit giao diện sau redesign và chưa có điểm audit sản phẩm. Sau triển khai sẽ chạy lại baseline, kiểm tra trình duyệt ở 320/375/414/768px và desktop, rồi báo từng gate áp dụng; các gate dành riêng cho marketing/template không áp dụng phải được giải thích.
