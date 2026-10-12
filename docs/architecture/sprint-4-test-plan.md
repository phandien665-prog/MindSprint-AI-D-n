# Kế hoạch kiểm thử phi chức năng — Sprint 4

**Sprint:** [Sprint 4 - Tuần 4: Kiểm thử, triển khai, đóng gói](https://github.com/tungtungsahul/MindSprint-AI-D-n/milestone/4). **Ngày lập:** 12/10/2026. **Phạm vi:** main/9ba7acd và bản staging C#/PostgreSQL.

## Mục tiêu và danh sách công việc

Mỗi ID trong [yêu cầu phi chức năng](non-functional-requirements.md) có một GitHub issue riêng, gồm tiêu chí đạt, bước chạy, phụ thuộc và bằng chứng. Không gán người phụ trách hoặc ngày sprint khi nhóm chưa cung cấp. Liên quan công việc tài liệu [#40](https://github.com/tungtungsahul/MindSprint-AI-D-n/issues/40) và kiểm thử thủ công [#19](https://github.com/tungtungsahul/MindSprint-AI-D-n/issues/19).

| Yêu cầu | Issue kiểm thử | Ưu tiên | Phụ thuộc NFR |
| --- | --- | --- | --- |
| [NFR-01: Hiệu năng phản hồi](non-functional-requirements.md#nfr-01) | [#42](https://github.com/tungtungsahul/MindSprint-AI-D-n/issues/42) | P1 | Không |
| [NFR-02: Khả năng chịu tải và giới hạn tài nguyên](non-functional-requirements.md#nfr-02) | [#43](https://github.com/tungtungsahul/MindSprint-AI-D-n/issues/43) | P1 | NFR-01 |
| [NFR-03: Xác thực, phân quyền và cô lập tài khoản](non-functional-requirements.md#nfr-03) | [#44](https://github.com/tungtungsahul/MindSprint-AI-D-n/issues/44) | P0 | Không |
| [NFR-04: An toàn dữ liệu đầu vào và nguồn ngoài](non-functional-requirements.md#nfr-04) | [#45](https://github.com/tungtungsahul/MindSprint-AI-D-n/issues/45) | P0 | Không |
| [NFR-05: Bảo mật cấu hình, truyền tải và quyền riêng tư](non-functional-requirements.md#nfr-05) | [#46](https://github.com/tungtungsahul/MindSprint-AI-D-n/issues/46) | P0 | Không |
| [NFR-06: Khả năng phục hồi khi AI và mạng lỗi](non-functional-requirements.md#nfr-06) | [#47](https://github.com/tungtungsahul/MindSprint-AI-D-n/issues/47) | P1 | Không |
| [NFR-07: Toàn vẹn dữ liệu và cập nhật đồng thời](non-functional-requirements.md#nfr-07) | [#48](https://github.com/tungtungsahul/MindSprint-AI-D-n/issues/48) | P0 | NFR-03 |
| [NFR-08: Tính sẵn sàng và phát hiện trạng thái dịch vụ](non-functional-requirements.md#nfr-08) | [#49](https://github.com/tungtungsahul/MindSprint-AI-D-n/issues/49) | P1 | NFR-12 |
| [NFR-09: Sao lưu và khôi phục dữ liệu](non-functional-requirements.md#nfr-09) | [#50](https://github.com/tungtungsahul/MindSprint-AI-D-n/issues/50) | P1 | NFR-12 |
| [NFR-10: Khả dụng và tiếp cận giao diện](non-functional-requirements.md#nfr-10) | [#51](https://github.com/tungtungsahul/MindSprint-AI-D-n/issues/51) | P1 | Không |
| [NFR-11: Tương thích trình duyệt và chế độ offline](non-functional-requirements.md#nfr-11) | [#52](https://github.com/tungtungsahul/MindSprint-AI-D-n/issues/52) | P1 | NFR-03 |
| [NFR-12: Khả năng bảo trì và triển khai tái lập](non-functional-requirements.md#nfr-12) | [#53](https://github.com/tungtungsahul/MindSprint-AI-D-n/issues/53) | P1 | Không |
| [NFR-13: Khả năng quan sát và chẩn đoán lỗi](non-functional-requirements.md#nfr-13) | [#54](https://github.com/tungtungsahul/MindSprint-AI-D-n/issues/54) | P1 | NFR-05 |
| [NFR-14: Chất lượng và an toàn đầu ra AI](non-functional-requirements.md#nfr-14) | [#55](https://github.com/tungtungsahul/MindSprint-AI-D-n/issues/55) | P1 | NFR-04, NFR-06 |

## Điều kiện bắt đầu

- Chốt ngưỡng đề xuất, fixture và scope với nhóm trước chạy; ghi phiên bản tài liệu/commit/image và cấu hình đã ẩn giá trị nhạy cảm.
- Có staging/database cô lập; tài khoản A/B + tài khoản tải riêng. Không dùng tài khoản demo chung để đo ownership hoặc isolation.
- Có quyền quan sát log/metrics và backup/restore ở môi trường test; có browser matrix và người chấm fixture AI.
- Lưu output gốc, timestamp Asia/Saigon, phiên bản công cụ và lệnh chạy tái lập trong issue hoặc artifact liên kết.
- Nếu môi trường thiếu Chromium, credential test, staging hay quyền DB thì ghi **Blocked**, không coi bài giả lập là đã xác minh live.
- Mọi thao tác thêm script/test trong quá trình Sprint 4 phải qua PR riêng; yêu cầu này hiện chỉ chuẩn bị tài liệu và issues.

## Thứ tự đề xuất

1. NFR-12 chuẩn bị build/image/migration/staging và baseline; NFR-03/04/05 kiểm tra các ranh giới bảo mật sớm.
2. NFR-07 kiểm chứng race/toàn vẹn; NFR-06 fault AI/mạng; NFR-13 quan sát log/metrics.
3. NFR-01 baseline hiệu năng → NFR-02 tăng tải. Dùng cùng fixture/cấu hình, tách provider thật khỏi benchmark.
4. NFR-08 chạy monitor 24 giờ sau khi staging sẵn sàng; NFR-09 thực hành restore trong DB riêng.
5. NFR-10/11 chạy ma trận UI/browser/offline; NFR-14 chấm chất lượng AI sau khi các ranh giới dữ liệu/error ổn định.
6. Tổng hợp kết quả, mở bug cho failure và chạy lại các ca bị ảnh hưởng trước nghiệm thu.

Các nhóm kiểm thử độc lập có thể chạy cùng thời gian nếu không dùng chung dữ liệu/tài nguyên làm sai số đo. Không chạy load test trong cùng cửa sổ đo chất lượng AI hoặc monitor nghiệm thu mà không ghi rõ tải.

## Công cụ/harness hiện có

| Công việc | Cách chạy từ root | Giới hạn bằng chứng |
| --- | --- | --- |
| Build backend | `dotnet build backend/MindSprint.Api/MindSprint.Api.csproj -c Release` | Build không chứng minh migration/DB hoạt động |
| Build frontend | `npm run build --prefix frontend` | Kiểm tra thêm API_BASE trong staging artifact |
| Session/text frontend | `node --test tests/frontend-session.test.cjs tests/frontend-text.test.cjs` | Harness JS, không thay browser/live API |
| Kanban logic | `dotnet run --project backend/KanbanChecks/KanbanChecks.csproj -c Release` | Không chứng minh race PostgreSQL |
| Gemini failure/retry | `dotnet run --project tests/GeminiReliability/GeminiReliability.csproj` | Provider giả lập; không chấm chất lượng model thật |
| Google frontend | `node --test backend/GoogleAuthChecks/frontend-google.test.cjs` | Xem thêm [validation đã ghi](https://github.com/tungtungsahul/MindSprint-AI-D-n/blob/9ba7acd2de05bf017ad5c2711644c9ee98bd6542/backend/GoogleAuthChecks/VALIDATION.md) |
| Tutor | `dotnet run --project backend/TutorChecks/TutorChecks.csproj -c Release` | Xem [SPRINT2](https://github.com/tungtungsahul/MindSprint-AI-D-n/blob/9ba7acd2de05bf017ad5c2711644c9ee98bd6542/backend/TutorChecks/SPRINT2.md) để phân biệt mock/live |
| URL import | Theo [URL_IMPORT](https://github.com/tungtungsahul/MindSprint-AI-D-n/blob/9ba7acd2de05bf017ad5c2711644c9ee98bd6542/backend/URL_IMPORT.md) | Renderer cần Edge/Chromium; live cần mạng có kiểm soát |
| Browser Kanban/tutor | `node --test tests/kanban-browser.test.cjs backend/TutorChecks/browser.test.cjs` | Browser với API mock không thay API thật |
| HTTP Kanban | Đặt `MINDSPRINT_TEST_API` trỏ API test rồi `node --test tests/kanban-integration.test.cjs` | Tạo dữ liệu test riêng; không tự chứng minh mọi NFR |

Race/ownership/migrations/restore cần PostgreSQL thật của staging. Các test Python tier1…tier4 dành cho FastAPI/SQLite, không dùng để kết luận API C# pass.

## Cách ghi kết quả

| Trường | Nội dung bắt buộc |
| --- | --- |
| NFR / test case | ID NFR và scenario/tiêu chí tương ứng |
| Baseline | Commit/image, cấu hình, fixture và browser/tool version |
| Kỳ vọng | Ngưỡng hoặc hành vi từ spec đã chốt |
| Thực tế | Số đo/status/invariant; không ghi “OK” chung chung |
| Bằng chứng | Artifact/log/ảnh/report, đã che token và dữ liệu nhạy cảm |
| Kết luận | Pass / Fail / Blocked, người chạy và thời điểm |
| Theo dõi | Bug liên kết, mức độ và kết quả chạy lại |

## Điều kiện nghiệm thu Sprint 4

- [ ] Mỗi NFR có bằng chứng cho từng tiêu chí và trace về đúng issue/commit.
- [ ] Mọi P0 pass; mọi failure P1 có quyết định xử lý rõ ràng và bug liên kết. Có failure chưa sửa không được tổng hợp là “14/14 pass”.
- [ ] Bug ảnh hưởng nghiệm thu đã sửa và chạy lại; không giảm ngưỡng hoặc bỏ scenario để đóng issue.
- [ ] Báo cáo tách số liệu lab, mock và live; ghi giới hạn hosting/offline/model.
- [ ] Backup/restore, deploy/rollback và thông tin luồng dữ liệu AI đã có tài liệu bàn giao.

**Trạng thái khi lập kế hoạch:** chưa chạy các bài NFR và chưa nghiệm thu. Tạo issues là hoàn thành bước chuẩn bị kiểm thử.
