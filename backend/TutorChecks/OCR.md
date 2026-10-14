# Nguồn ảnh/tài liệu dùng chung cho sổ tay (#33)

Trong **Sổ tay AI**, bấm **Thêm nguồn** hoặc **Thêm ảnh/tài liệu vào nguồn**,
chọn tệp ở tab **Tải tệp lên** và tải lên. Tệp được lưu trong sổ tay hiện tại.
Sau đó chọn **Theo nguồn** để đọc/hỏi đáp có trích dẫn, hoặc **Gia sư** để hỏi
“Giải câu 1”, kiểm tra bài làm hay tự luyện. Không cần tải lại khi chuyển chế độ,
không có ô chép toàn bộ đề nhận diện hay bước xác nhận OCR.

Tải lên chỉ lưu nguồn, không tự gọi AI hoặc giải bài. Khi bạn hỏi, backend tải
nguồn đúng sổ tay và gửi tệp gốc tới Gemini để đọc công thức, bố cục và hình vẽ.
Studio, câu hỏi gợi ý và kiểm định gợi ý Gia sư cũng đọc cùng nguồn.

Nguồn được giữ sau tải lại trang, đăng nhập lại và **Bài mới**. Thêm nguồn giữ
hội thoại hiện có. Xóa nguồn bỏ tệp đã lưu và xóa ngữ cảnh hội thoại/gợi ý đang
hiển thị để tránh dùng tài liệu đã xóa hoặc số trích dẫn cũ; ghi chú đã lưu vẫn
được giữ. Đổi sổ tay/tài khoản không mang nguồn của sổ tay/tài khoản trước sang.

## Giới hạn và cách đọc

- JPG/JPEG, PNG, WebP, PDF, TXT, MD, CSV; tệp tối đa **10 MB**.
- Tổng ảnh/PDF trong mỗi sổ tay tối đa **10 MB**, tối đa **20 nguồn** để AI đọc
  đủ nguồn trong giới hạn request, không bỏ tệp âm thầm.
- PDF tối đa **20 trang**. Lưu PDF gốc và đọc lớp chữ hiện có bằng PdfPig;
  PDF scan/hỗn hợp vẫn được nhận, AI đọc trực tiếp PDF gốc khi hỏi.
- TXT/MD/CSV cần UTF-8, tối đa **200.000 ký tự**. Nguồn quá dài bị từ chối,
  không cắt rồi lưu mà không thông báo. Ngữ cảnh chữ giữ giới hạn 300.000 ký tự
  hiện có; khi phải rút ngắn phần chữ, prompt đánh dấu phần chưa được đưa vào.
- AI ưu tiên tệp gốc nếu lớp chữ làm mất ký hiệu/số mũ. Khi ảnh/trang/công thức
  không rõ, AI được yêu cầu nói rõ phần thiếu và hỏi bổ sung, không tự đoán.

Tệp gốc được lưu trong database cùng nguồn, không có URL tệp công khai. Danh
sách nguồn chỉ trả metadata (tên/loại/số ký tự/hasFile/số byte), không trả bytes
hoặc nội dung ảnh. JWT và kiểm tra sở hữu sổ tay bảo vệ mọi thao tác. Xóa sổ tay
xóa các nguồn theo quan hệ cascade hiện có. Nội dung tệp vẫn có thể được AI
đọc/giải sai; có thể thay nguồn hoặc hỏi lại.

## API và dữ liệu

`POST /api/notebooks/{id}/sources/file`, multipart trường `file`, dùng JWT chung.
Thêm 64 KB cho overhead multipart; giới hạn riêng tệp 10 MB vẫn kiểm tra phía
server. Upload ảnh/scan không chạy OCR hay gọi Gemini. Upload lỗi giữ lựa chọn
file ở frontend để thử lại; kết quả cũ không cập nhật sổ tay/tài khoản mới.

`/chat`, `/tutor`, `/suggestions` và `/generate` đọc các nguồn của notebook ở
backend, gửi nhiều tệp gốc với nhãn `[S1]`, `[S2]`... theo cùng thứ tự nguồn.
Theo nguồn giữ chính sách trả lời từ nguồn và dẫn `[n]`; Gia sư dùng kiến thức
học tập để giải/kiểm tra/gợi ý. Không đổi hợp đồng hỏi đáp hiện có.

Migration **AddNotebookSourceFiles** chỉ thêm hai cột nullable `FileBytes` và
`FileMediaType`, không sửa/xóa nguồn cũ. Nullable giúp các nguồn văn bản/URL/PDF
đã có vẫn dùng được. Chỉ file tải lên từ phiên bản này được giữ tệp gốc; PDF cũ
chỉ có lớp chữ cần tải lại nếu muốn AI nhìn đúng bố cục/hình/công thức gốc.
Không chạy migration Down sau khi đã lưu tệp, vì Down xóa các cột chứa tệp;
rollback ứng dụng có thể giữ nguyên schema bổ sung.

Trên `main` PostgreSQL, migration `20261014013142_AddNotebookSourceFiles` dùng
`bytea` cho tệp và `text` cho media type. Các migration SQL Server lịch sử
AddRefreshTokens/AddFlashcardVersioning/AddStudyStats được giữ trong repo nhưng
không biên dịch vào assembly PostgreSQL; baseline PostgreSQL đã bao gồm chúng.
Cache chat/Studio tính cả media type và hash nội dung tệp: đổi ảnh/PDF phải tạo
lại kết quả, còn nguồn không đổi tiếp tục dùng cache của #12.

Các endpoint riêng `/tutor/file` và `/tutor/ocr` được giữ cho tương thích với
client cũ; giao diện mới dùng một bộ nhập nguồn chung, không có đính kèm riêng
trong Gia sư. Bộ nhập URL và các định dạng URL của #27 tiếp tục hoạt động.

## Kiểm chứng

```powershell
dotnet run --project backend/TutorChecks/TutorChecks.csproj -- --shared-sources
dotnet run --project backend/TutorChecks/TutorChecks.csproj
dotnet run --project backend/TutorChecks/TutorChecks.csproj -- --ocr
dotnet run --project backend/TutorChecks/TutorChecks.csproj -- --file-tutor
node --test tests/frontend-session.test.cjs tests/frontend-text.test.cjs backend/TutorChecks/frontend-tutor.test.cjs backend/GoogleAuthChecks/frontend-google.test.cjs
node --test backend/TutorChecks/browser.test.cjs
dotnet run --project tests/GeminiReliability/GeminiReliability.csproj
```

Kiểm tra nguồn chung dùng SQLite trong bộ nhớ và Gemini giả lập: lưu/reload,
Theo nguồn/Gia sư/Studio/gợi ý, ánh xạ trích dẫn, xóa/đổi sổ tay/tài khoản, loại/
dung lượng, tổng dung lượng, dữ liệu cũ và migration chỉ bổ sung cột nullable.
Browser dùng Edge với hồ sơ riêng, kiểm tra tải một lần dùng hai chế độ, Bài mới,
reload, xóa nguồn và giao diện 320–1440 px.

Kiểm thử Gemini thật tùy chọn, chỉ dùng ảnh đề và PDF scan giả lập:

```powershell
node backend/TutorChecks/ocr-fixture.cjs
dotnet run --project backend/TutorChecks/TutorChecks.csproj -- --live-shared-sources backend/TutorChecks/bin/ocr-fixtures/vietnamese.png
```

API multimodal theo tài liệu Google: [ảnh](https://ai.google.dev/gemini-api/docs/generate-content/image-understanding),
[PDF](https://ai.google.dev/gemini-api/docs/generate-content/document-processing),
[generationConfig](https://ai.google.dev/api/generate-content).

Ngày 12/10/2026: **26/26** kiểm tra nguồn chung, **58/58** Gia sư,
**23/23** OCR tương thích, **18/18** endpoint file tương thích, **30/30** frontend/
session/Google và **13/13** Gemini reliability đều qua (168 kiểm tra).
Browser integration qua; Gemini thật đọc và dẫn nguồn công thức từ ảnh/PDF đã
lưu, rồi Gia sư giải được A = 5/2 từ cùng nguồn. Backend cục bộ đã áp dụng
AddNotebookSourceFiles, chạy trên 5000/5100; upload không đăng nhập trả 401.
Build có cảnh báo NU1900 vì sandbox không truy cập nguồn kiểm tra lỗ hổng NuGet.

Tích hợp `main` ngày 14/10/2026: **264 kiểm tra đạt**, gồm 34 frontend,
2 browser, 59 Gia sư, 32 nguồn chung/cache, 23 OCR, 18 file tutor,
33 Google auth, 19 Kanban, 31 URL import và 13 Gemini reliability.
Backend Release và frontend build đạt; EF xác nhận model khớp snapshot và
tạo được SQL migration PostgreSQL idempotent. Chưa chạy SQL này trên PostgreSQL
thật trong lượt tích hợp; kiểm tra lưu dữ liệu dùng SQLite cô lập, còn kiểm tra
dịch truy vấn và sinh migration dùng provider Npgsql, không kết nối database.
