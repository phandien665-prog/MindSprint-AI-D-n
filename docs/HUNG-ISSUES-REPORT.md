# Báo cáo phần việc Đình Hùng — 16/10/2026

Người thực hiện: James / Đình Hùng. Múi giờ Asia/Bangkok. Nhánh `hung/issues-16-37`, nền `cc5c2a78249160dcd9c22bec7a987c6c62fb51e0`. **Đã commit/push và tạo [PR nháp #70](https://github.com/tungtungsahul/MindSprint-AI-D-n/pull/70) sau khi người dùng duyệt publication.** Commit triển khai: `fdc5343`. Chưa đóng issue hoặc merge main; kết quả kiểm tra trong báo cáo không phải nghiệm thu production.

Báo cáo đã đăng dưới James-Lloyd20: [#16](https://github.com/tungtungsahul/MindSprint-AI-D-n/issues/16#issuecomment-6219194588), [#37](https://github.com/tungtungsahul/MindSprint-AI-D-n/issues/37#issuecomment-6219195086), [#45](https://github.com/tungtungsahul/MindSprint-AI-D-n/issues/45#issuecomment-6219195683), [#51](https://github.com/tungtungsahul/MindSprint-AI-D-n/issues/51#issuecomment-6219196170), [#54](https://github.com/tungtungsahul/MindSprint-AI-D-n/issues/54#issuecomment-6219196707). Các issue kiểm thử vẫn ghi rõ một phần/Blocked.

## Phạm vi đã xác nhận và tiên quyết

- Người dùng yêu cầu xử lý các issue được giao, đọc mô tả và kiểm tra tiên quyết trước khi làm; đồng ý giữ nguyên ngưỡng NFR và ghi rõ phần thiếu môi trường/mock/live.
- #16 phụ thuộc #10; #37 phụ thuộc #30. #10/#30 và phụ thuộc gián tiếp #4/#6/#7 đã đóng, chức năng đã có lại trên main. #36 đang mở nhưng mô tả #37 cho phép làm song song khi API/dữ liệu có sẵn, không phải tiên quyết kỹ thuật bắt buộc.
- Main đã revert import Study Cockpit tại `a5948d1`, trở lại ASP.NET Core 8/PostgreSQL; nền mới nhất đọc được là `cc5c2a7`. Người dùng cho phép tiếp tục sau khi được báo nền đã khôi phục. Không code tiếp nhánh Issue #11 hoặc nền Study Cockpit đã revert.
- #54 phụ thuộc NFR-05/#46. #46 còn mở theo GitHub ngày 16/10: **chưa chạy chiến dịch nghiệm thu #54**. Không tự nhận hoàn thành phần của đồng đội.
- Giữ phân công/deadline/tiêu chí tại GitHub Issues và docs/architecture/sprint-4-test-plan.md. Không thay ngưỡng để báo đạt. Script chiến dịch Sprint 4 cần tách PR khỏi tính năng Sprint 3 khi publication.

## Kết quả từng issue

| Issue | Kết quả local | Còn thiếu để đóng issue |
|---|---|---|
| [#16 Responsive](https://github.com/tungtungsahul/MindSprint-AI-D-n/issues/16) | Đã sửa touch targets, composer và tùy chọn không che nút; kiểm tra 320/360/390/768/1440 px đạt; giữ nguồn thu gọn, dialog, chat mở rộng và Kanban hiện có | Review/PR, nghiệm thu thiết bị thật; không nhận toàn bộ responsive có sẵn trên main là code mới |
| [#37 Giọng nói](https://github.com/tungtungsahul/MindSprint-AI-D-n/issues/37) | Đã triển khai nhận tiếng Việt chủ động, sửa trước gửi, đúng route Theo nguồn/Gia sư, đọc/dừng và fallback; logic/browser giả lập đạt | Nhận diện/micro/loa/quyền thực trên desktop/mobile; giới hạn hỗ trợ tùy browser và giọng cài trên máy |
| [#45 NFR-04](https://github.com/tungtungsahul/MindSprint-AI-D-n/issues/45) | Pass một phần UI/XSS/validation mock; chưa đủ nghiệm thu | .NET 8 runtime, staging/PostgreSQL cô lập, server nguồn test; chạy đủ SSRF/DNS/redirect, biên HTTP/upload/nguồn và kiểm tra DB trước/sau |
| [#51 NFR-10](https://github.com/tungtungsahul/MindSprint-AI-D-n/issues/51) | Pass một phần responsive/bàn phím/dialog; chưa đủ nghiệm thu | Screen reader NVDA/VoiceOver, zoom browser 200%, contrast toàn ma trận, scanner không còn serious/critical và backend test riêng |
| [#54 NFR-13](https://github.com/tungtungsahul/MindSprint-AI-D-n/issues/54) | Blocked trước chạy: #46 chưa xong | Kết quả NFR-05 và staging/log/metrics được cấp quyền; sau đó mới đo correlation, redaction và truy vết lỗi dưới 10 phút |

## Thay đổi #16/#37

- `frontend/voice.js`: Web Speech API, không thêm dependency/backend/schema. Chỉ bật micro khi bấm; `lang=vi-VN`; không tự gửi câu khi nhận diện xong. Câu nằm trong ô `nb-q` để chỉnh, sau đó dùng nút Gửi hoặc Enter hiện có.
- Nối câu nhận diện vào draft; không ghi đè nếu người dùng đã sửa draft. Không cắt âm thầm câu vượt maxlength: giữ phần nhận diện trong vùng xem, yêu cầu rút ngắn. Không nội suy HTML từ transcript.
- Dừng nghe/đọc khi đổi mode/hoạt động, gửi câu, render sổ tay, rời tab, thu vùng mở rộng, đổi tài khoản/đăng xuất, ẩn trang hoặc pagehide. Bỏ callback cũ và không đọc response muộn khi notebook đã ẩn.
- “Đọc câu trả lời” mặc định tắt, không nhớ qua logout/reload. Đọc text của câu trả lời thành công, có nút Dừng đọc. Ưu tiên voice vi nếu được cài; không cam kết chất lượng phát âm nếu máy thiếu giọng tiếng Việt.
- Từ chối quyền/không có micro/im lặng/lỗi mạng/không hỗ trợ/khởi tạo service lỗi đều có thông báo và giữ bàn phím. Lỗi AI giữ luồng retry của notebook hiện có.
- Giữ aria-pressed/controls/describedby, checkbox có label và status aria-live. Tùy chọn dùng details/summary. Panel neo phía trên composer, giới hạn chiều cao và cuộn riêng.
- #16: giữ breakpoint/thu gọn nguồn có sẵn, thêm min-width, footer wrap và vùng bấm micro/nút Kanban tối thiểu 44×44 px ở mobile. Không viết lại Kanban. Lỗi panel che nút Dừng nghe ở 320 px đã được bài browser tìm ra và sửa.
- Giữ nguyên assertions vùng đọc desktop (kể cả >=750 px ở chế độ mở rộng 1440×1000), không hạ kiểm tra để chứa control mới.
- Index/service worker load voice trước notebook; style/notebook/cache v64. Build tĩnh chứa module mới.

## Bằng chứng kiểm tra

| Bộ kiểm tra | Kết quả | Phạm vi |
|---|---|---|
| Node logic: validation/session/text/fallback/Google/tutor/voice | **44/44 pass**, 0 skipped | VM/API mock, gồm 5 bài voice mới |
| tests/kanban-browser.test.cjs | Pass 1 bài | CRUD, ordered drops, reload, filter, lỗi move, touch/keyboard controls; API mock |
| backend/TutorChecks/browser.test.cjs | Pass 1 bài | Theo nguồn/Gia sư/nguồn/check/hint/notes/quota/isolation và responsive cũ; API mock |
| backend/TutorChecks/programming-browser.test.cjs | Pass 1 bài | Code/follow-up/retry/escaping/isolation; API mock |
| tests/frontend-safety-browser.test.cjs | Pass 3 bài | HTML trong tên bộ thẻ/câu trả lời/danh mục không thực thi; đổi notebook lỗi không đổi nhầm tài nguyên |
| tests/notebook-mobile-voice.test.cjs | Pass 1 bài | Sửa tiếng Việt trước gửi; đúng route, đọc/dừng, permission/network/fallback/logout, touch và viewport 320/360/390/768/1440; speech/API mock |
| Frontend build | Pass | Không deploy |
| Backend build --no-restore | **0 warning / 0 error** | SDK 10.0.402 build target net8.0, không chứng minh backend đã chạy |
| Syntax/diff | Pass | JS parse, git diff --check |
| C# UrlImportChecks/KanbanChecks | **Blocked lúc chạy** | Restore/build được; thiếu runtime .NET 8, máy chỉ có runtime 10; không có test C# pass của lượt này |

Tổng browser: **7/7 bài**. Sau chỉnh cuối vòng đời speech, đã chạy lại 5 voice unit, notebook-mobile-voice và frontend build: pass. Không cộng số lần chạy lại thành test mới.

Edge **155.0.4283.45**, Windows, headless; context có hasTouch cho tap. Đây là viewport/cảm ứng giả lập, không phải điện thoại thật. Speech adapter và synthesis đều giả lập; không thu âm người dùng, không gọi Gemini thật hoặc dịch vụ nhận diện thật trong tests. Đã xem ảnh mobile sau chạy.

### Lệnh tái lập tại Git root

```powershell
node --test --test-isolation=none tests/frontend-voice.test.cjs tests/frontend-validation.test.cjs tests/frontend-session.test.cjs tests/frontend-text.test.cjs tests/fallback-cards.test.cjs backend/GoogleAuthChecks/frontend-google.test.cjs backend/TutorChecks/frontend-tutor.test.cjs
node --test --test-force-exit tests/notebook-mobile-voice.test.cjs tests/kanban-browser.test.cjs backend/TutorChecks/browser.test.cjs tests/frontend-safety-browser.test.cjs backend/TutorChecks/programming-browser.test.cjs
node frontend/build.mjs
dotnet build backend/MindSprint.Api/MindSprint.Api.csproj --no-restore
git diff --check
```

Node có thể dùng runtime có sẵn trên máy. Browser cần Playwright đã cài (NODE_PATH nếu cần), Edge hoặc TUTOR_BROWSER. Dùng --test-force-exit do lượt gộp không isolation trước đó còn handle/process sau test; kết quả pass/fail và assertions vẫn đầy đủ, không skip. Không thêm dependency JS.

Các lệnh C# đã thử nhưng không chạy được app net8.0:

```powershell
dotnet restore backend/UrlImportChecks/UrlImportChecks.csproj
dotnet restore backend/KanbanChecks/KanbanChecks.csproj
dotnet run --project backend/UrlImportChecks/UrlImportChecks.csproj --no-restore
dotnet run --project backend/KanbanChecks/KanbanChecks.csproj --no-restore
```

Các bộ này dùng HTTP mock/SQLite riêng; kể cả chạy được cũng không thay nghiệm thu PostgreSQL bắt buộc của NFR. Không đổi target framework hoặc ép runtime 10 để báo đạt runtime 8. Không chạy app thật vì startup tự migrate/seed DB.

Ảnh dữ liệu test riêng tại [evidence/hung-issues](evidence/hung-issues/): `notebook-mobile.png` (390 px), `notebook-desktop.png` (1440 px), `kanban-mobile.png` (390 px).

## Ma trận nghiệm thu NFR

| Tiêu chí | Trạng thái và bằng chứng |
|---|---|
| #45 SSRF/private/IPv4/IPv6/DNS/redirect, không gửi credential | Blocked nghiệm thu: runtime 8/staging/server nguồn test; có bộ UrlImportChecks sẵn nhưng chưa chạy được trong lượt này |
| #45 XSS title/task/card/Markdown/LaTeX/AI/link javascript | Pass một phần ở text/safety browser; còn thiếu toàn ma trận trường và HTTP/DB thật |
| #45 4xx cho file/task sai, 19/20/21 nguồn, 200000/200001 ký tự, multipart | Blocked nghiệm thu: chỉ client/API mock đã chạy. Source hiện tại đã trả BadRequest khi quá 200000 thay vì cắt âm thầm; đó là code có trước nhánh này, không phải phần mình mới sửa |
| #51 viewport/keyboard/dialog | Pass một phần theo các bài browser trên; không có đủ flow với staging thật |
| #51 contrast/zoom200/screen-reader/scanner | Blocked: Tutor test có contrast cục bộ; chưa có ma trận đầy đủ, chưa chạy zoom browser/NVDA. Không tìm thấy axe-core trong module runtime và NVDA ở các vị trí đã kiểm tra; chưa tự cài |
| #54 correlation/redaction/metrics/truy vết <10 phút | Blocked trước chạy vì #46 còn mở. Đọc Program.cs chưa thấy instrumentation/correlation/metrics end-to-end riêng; không biến quan sát tĩnh này thành kết quả đo |

Chưa có failure NFR live được xác nhận để đăng bug. Không tự giảm ngưỡng, đăng issue/comment hoặc đóng các issue kiểm thử.

## Việc cần tiếp tục

1. Review #16/#37 và nghiệm thu micro/loa thật, cả browser desktop/mobile và fallback không hỗ trợ. SpeechRecognition hỗ trợ hạn chế; browser có thể gửi âm thanh đến dịch vụ mạng. UI có thông báo điều này. Xem [MDN Recognition](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition), [Synthesis](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis).
2. Publication đã được duyệt và thực hiện qua PR nháp #70 dưới James. Nhánh hiện chỉ có code/kiểm tra hồi quy tính năng Sprint 3 và báo cáo tiến độ NFR; script chiến dịch Sprint 4 bổ sung sau này vẫn cần PR riêng. Chờ nhóm review, thử micro thật và quyết định merge; không tự đóng issue.
3. #45/#51 cần runtime .NET 8, staging/PostgreSQL test riêng, server nguồn test và công cụ/người kiểm tra accessibility. Giữ ngưỡng đã duyệt.
4. #54 cần kết quả #46 trước; sau đó mới chạy canary/log/metrics/đo chẩn đoán. Không tự nhận làm thay người phụ trách #46.
