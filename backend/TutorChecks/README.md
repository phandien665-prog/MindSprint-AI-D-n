# Issue #30 — Gia sư giải bài tập

Các hoạt động **Kiểm tra bài làm** (#31) và **Tự luyện** (#32), hợp đồng API và kiểm chứng Sprint 2 được mô tả trong [SPRINT2.md](SPRINT2.md).

Trong **Sổ tay AI**, chọn **Gia sư**, chọn **Từng bước / Ngắn gọn**, nhập đề rồi gửi. Không cần tài liệu nguồn; cần đăng nhập và có sổ tay thuộc tài khoản hiện tại. Có thể hỏi tiếp về một bước, bấm **Bài mới** để xóa ngữ cảnh đang hiển thị, hoặc lưu lời giải bằng **Lưu ghi chú**. Ghi chú đã lưu không bị xóa khi bắt đầu bài mới.

Khi đã thêm tài liệu, Gia sư tự đọc nguồn trong sổ tay hiện tại: có thể nhập **“Hướng dẫn tôi làm câu 1 trong tài liệu”**. Nếu nhiều tài liệu/chương có cùng số câu, chỉ rõ tên tài liệu/chương. Không cần chép lại đề khi nguồn có đủ nội dung. Đề gõ đầy đủ vẫn là đề chính, không bị thay bằng bài khác trong nguồn.

## API mới

`POST /api/notebooks/{id}/tutor`, dùng JWT/refresh của ứng dụng.

```json
{
  "question": "Giải 2x + 3 = 11",
  "style": "steps",
  "history": []
}
```

`style`: `steps` hoặc `brief`. History gồm `{role: "user" | "assistant", text: "..."}`. Trả `{answer: "Markdown/LaTeX", needsClarification: false}`; khi thiếu dữ kiện, AI được yêu cầu hỏi bổ sung và trả `needsClarification: true`. Đây là hành vi của mô hình, không phải bảo đảm mọi lời giải đều chính xác.

Đề tối đa 10.000 ký tự. History tối đa 12 lượt, mỗi lượt 10.000 ký tự, tổng 40.000 ký tự. Frontend giữ đề gốc và các lượt gần nhất trong giới hạn này; cần mở bài mới khi đổi đề. Hội thoại chỉ nằm trong bộ nhớ của trang, xóa khi đổi sổ tay/tài khoản hoặc tải lại; lời giải lưu thành ghi chú dùng API hiện có. Backend không lưu history Gia sư và không thay đổi database schema.

Backend kiểm tra quyền sở hữu rồi tải nguồn từ database theo đúng notebook ID, không nhận nội dung nguồn hay ID của tài khoản khác từ client. Ngữ cảnh nguồn dùng `NotebookAi.BuildContext` với giới hạn hiện có khoảng 300.000 ký tự, chia theo số tài liệu. Tài liệu là dữ liệu, không phải chỉ thị đổi vai trò; thiếu đề/công thức/hình vẽ hoặc đề bị cắt thì yêu cầu bổ sung. PDF dạng ảnh scan vẫn cần OCR ở issue #33; sửa này không bổ sung OCR.

Hỏi đáp **Theo nguồn** vẫn dùng `/chat`, cần tài liệu và có hội thoại riêng. Cả hai chế độ dùng chung GeminiService để retry/fallback/timeout/quota; lỗi 429 không đăng xuất. Kết quả trễ bị bỏ khi đổi tài khoản/sổ tay.

## Kiểm tra

Chạy từ thư mục gốc dự án:

```powershell
node --test tests/frontend-session.test.cjs tests/frontend-text.test.cjs
node --test backend/GoogleAuthChecks/frontend-google.test.cjs
node --test backend/TutorChecks/frontend-tutor.test.cjs
dotnet run --project backend/TutorChecks/TutorChecks.csproj -c Release
node --test backend/TutorChecks/browser.test.cjs
```

C# checks dùng SQLite trong bộ nhớ và HTTP Gemini giả lập; không ghi database thực. Browser checks dùng Edge headless, Playwright của API (hoặc package `playwright` đã cài), mock API và storage mới; biến `TUTOR_BROWSER` có thể chỉ đường dẫn browser khác. Không gọi Gemini thực trong các kiểm tra tự động mặc định.

Kiểm thử Gemini thực tùy chọn, lấy cấu hình riêng hiện có và gửi bốn đề mẫu; không in khóa API:

```powershell
dotnet run --project backend/TutorChecks/TutorChecks.csproj -c Release -- --live
dotnet run --project backend/TutorChecks/TutorChecks.csproj -c Release -- --live-source
```

Ngày 07/10/2026: baseline và sau sửa cùng pass **16/16** frontend bắt buộc, **6/6** phiên Google. Kiểm tra mới pass **24/24** C# và **5/5** API frontend; browser integration pass các luồng không nguồn, cách giải, follow-up, thiếu dữ kiện, ghi chú, quota/retry/loading, bàn phím, HTML escaping, chuyển chế độ, chuyển sổ tay/tài khoản và responsive 320/375/414/768/1440, sáng/tối/reduced-motion. Gemini thực đã giải `2x + 3 = 11` thành `x = 4`, `3x - 6 = 9` thành `x = 5`, giải thích câu hỏi tiếp “vì sao trừ 3”, hỏi chiều dài/chiều rộng khi chưa đủ dữ kiện hình chữ nhật.

Debug API build: 0 warnings, 0 errors. TutorChecks restore có cảnh báo NU1900 do không truy cập được nguồn dữ liệu kiểm tra lỗ hổng NuGet; các bài kiểm tra vẫn chạy thành công bằng package sẵn trên máy.

Không triển khai OCR, chấm bài, gợi ý nhiều cấp hoặc thực thi code ở issue này. Không đưa khóa API hay nội dung cấu hình riêng vào mã nguồn mới.

Regression cho lỗi “đã tải tài liệu nhưng Gia sư yêu cầu nhập lại đề”: tạo PDF chữ mẫu, tải qua `NotebooksController.AddFile`, kiểm tra đề trích xuất đi vào prompt Gia sư với câu hỏi ngắn “Câu 1”; kiểm tra quyền sở hữu, không lẫn nguồn giữa sổ tay và giới hạn nguồn dài. `--live-source` dùng chính nội dung trích xuất từ PDF mẫu để thử Gemini, không đọc hay thay đổi tài liệu của người dùng.

Sau sửa: **32/32** C# checks, **16/16** frontend bắt buộc, **6/6** Google, **5/5** API frontend và browser integration pass. Gemini thực đọc Câu 1 từ PDF mẫu (`5x + 2 = 17`), giải đúng `x = 3`; đọc Câu 2 và yêu cầu chiều dài/chiều rộng còn thiếu. Không xác minh trực tiếp file `Tam_Problems` của người dùng vì không có file đính kèm trong yêu cầu này.
