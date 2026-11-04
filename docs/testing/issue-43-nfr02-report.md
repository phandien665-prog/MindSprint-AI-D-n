# Báo cáo kiểm thử Issue #43 — NFR-02

**Ngày chạy:** 04/11/2026 (Asia/Saigon)

**Commit được kiểm:** `33ab2ea` (`origin/main`)

**Nhánh lưu bằng chứng:** `codex/issue-43-nfr02`

**Kết luận:** **FAIL ở smoke tải 50 VU; dừng trước profile nghiệm thu đầy đủ.**

## Tiêu chí

NFR-02 yêu cầu p95 GET không quá 1 giây, p95 thao tác ghi không quá 1,5 giây, lỗi ngoài dự kiến không quá 1%, không crash/OOM; bài đo chuẩn tăng từ 20 lên 50 VU trong 2 phút, giữ 50 VU 10 phút và lặp 3 chu kỳ để theo dõi RAM. Cần tối thiểu 100 mẫu cho mỗi route. Chi tiết nằm trong [yêu cầu phi chức năng](../architecture/non-functional-requirements.md#nfr-02).

## Môi trường

- Windows 11 (`10.0.26200`), Intel Core i5-13420H, 12 logical processors, 16,013 MiB RAM. Sau smoke, máy còn 467 MiB RAM trống.
- .NET SDK `10.0.300`, API `net8.0`; PostgreSQL Docker `17.11` trên Docker Desktop `desktop-linux`.
- API chạy loopback `127.0.0.1:5081`; API và database là môi trường thử nghiệm cục bộ, database dùng tạm, không chứa dữ liệu người dùng.
- Chụp nhanh sau smoke: API working set 373.8 MiB / private memory 298.5 MiB; PostgreSQL 582.1 MiB. Đây không phải baseline sau warm-up, nên không dùng để kết luận tiêu chí RAM.
- Không gọi Gemini thật. Kiểm tra giới hạn provider dùng fake HTTP handler.

## Fixture

Đã xác nhận 50 tài khoản thử nghiệm; 1.814 thẻ hệ thống; 25.000 thẻ riêng; 5.000 task; 500 notebook; 2.500 nguồn, mỗi nguồn 5.000 ký tự.

Có sai khác giữa tài liệu và seed: seed chính thức có 955 thẻ hệ thống, còn profile NFR ghi 1.814. Đã thêm 859 thẻ tổng hợp chỉ trong PostgreSQL tạm để khớp kích thước fixture. `DataSeeder` xóa các thẻ hệ thống tổng hợp khi API khởi động lại, nên phải khôi phục chúng sau lần restart cuối. README của harness đã cập nhật thứ tự này.

## Kết quả

| Hạng mục | Kết quả | Ghi chú |
| --- | --- | --- |
| Release build API | PASS | 0 lỗi; 2 cảnh báo `NU1900` vì không truy cập được dịch vụ kiểm tra lỗ hổng NuGet trong môi trường hiện tại. |
| Gemini/provider concurrency | PASS | `GeminiReliability`: 15/15 kiểm tra; concurrency tối đa 2 và slot được giải phóng khi hủy. |
| Renderer concurrency | FAIL | Đỉnh đồng thời 2 và hủy 2 request đạt; 8 request còn lại hết thời gian chờ. Harness ném assertion chưa bắt nên Windows hiện lỗi ứng dụng. |
| CRUD load smoke | FAIL | 798 request; 18 lỗi (2,256%). GET flashcards p95 ở giai đoạn 50 VU là 4,83 giây, cao hơn ngưỡng 1 giây. |
| RAM qua 3 chu kỳ | NOT RUN | Dừng sớm sau khi smoke đã vượt ngưỡng; không có kết luận đạt/trượt về xu hướng RAM. |

### Smoke tải cuối

Profile rút gọn: warm-up 3 giây; ramp 20→50 VU trong 5 giây; giữ 50 VU 15 giây; idle 1 giây; think time 1 giây; timeout request 5 giây. Đây là smoke chẩn đoán, không phải profile nghiệm thu 2 phút/10 phút/3 chu kỳ.

| Route (giai đoạn giữ 50 VU) | Mẫu | Lỗi | p95 | Ngưỡng NFR-02 |
| --- | ---: | ---: | ---: | ---: |
| GET flashcards | 220 | 5 timeout | 4,83 giây | ≤ 1 giây — FAIL |
| GET tasks | 187 | 0 | 966 ms | ≤ 1.000 ms — PASS trong smoke |
| GET notebooks | 127 | 0 | 587 ms | ≤ 1.000 ms — PASS trong smoke |
| POST task | 49 | 0 | 566 ms | ≤ 1.500 ms — PASS trong smoke; chưa đủ 100 mẫu |
| PATCH move task | 27 | 13 | 907 ms | ≤ 1.500 ms — p95 đạt, nhưng lỗi và số mẫu không đạt |

18 lỗi gồm 11 lỗi kết nối `fetch failed`, 5 timeout GET flashcards và 2 phản hồi HTTP 409 của PATCH move. Tỷ lệ lỗi chung 2,256% vượt ngưỡng 1%. File số liệu chi tiết: [smoke JSON](evidence/issue-43-nfr02-smoke-2026-11-04.json).

## Lỗi hộp thoại `RendererConcurrencyChecks.exe`

Mã `0xe0434352` xuất hiện khi chính tiến trình kiểm tra .NET thoát vì ngoại lệ chưa được bắt. Kết quả trước popup ghi nhận hai render request chiếm đủ hai slot, hai request bị hủy, còn tám request render hết thời gian chờ với `NotebookUrlException: Trang JavaScript phản hồi quá chậm.` Assertion cuối `the other eight render requests completed after cancellation` thất bại. Vì vậy đây là lỗi của checker sau khi phép kiểm renderer FAIL, không phải API hoặc Docker bị crash. `/healthz` vẫn trả HTTP 200.

Chưa xác định nguyên nhân gốc khiến các lần render hết thời gian chờ; cần chạy lại kiểm tra renderer sau khi khắc phục hoặc xác nhận browser/runtime trong môi trường phù hợp. Không dùng riêng cấu hình `SemaphoreSlim(2, 2)` làm bằng chứng đạt.

## Phạm vi còn thiếu

Do smoke đã vượt p95 GET và tỷ lệ lỗi, không chạy tiếp profile dài. Báo cáo này không chứng nhận ba chu kỳ, mức dùng RAM theo baseline, hoặc xu hướng RAM sau idle 5 phút. Kết quả loopback trên máy local cũng không thay thế kết quả staging có region và network RTT được ghi nhận.
