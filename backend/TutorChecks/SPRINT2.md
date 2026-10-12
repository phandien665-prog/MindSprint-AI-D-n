# Gia sư — Sprint 2 của Duy (#30, #31, #32)

Trong **Sổ tay AI → Gia sư**, ba hoạt động dùng chung phiên đăng nhập và sổ tay:

- **Giải bài**: chọn Từng bước/Ngắn gọn, nhập đề hoặc câu trong tài liệu, hỏi tiếp và lưu lời giải. Không bắt buộc có nguồn.
- **Kiểm tra bài làm**: nhập đề và bài làm riêng. Nhận xét chỉ ra bước/đoạn sai đầu tiên, loại lỗi (tính toán, lập luận/phương pháp, thiếu bước), lý do và hướng sửa. Bài đúng được giải thích, bài chưa đủ dữ kiện được hỏi lại. Sửa bài ngay trong biểu mẫu và gửi lại; **Lưu ghi chú** giữ cả đề, bài làm và nhận xét. Không chấm điểm khi chưa có thang điểm.
- **Tự luyện**: nhập đề, bấm **Gợi ý tiếp** để lần lượt mở mức 1 (kiến thức/công thức), mức 2 (hướng xử lý), mức 3 (một bước tiếp theo). **Xem lời giải** là hành động riêng và chỉ gọi giải đầy đủ khi được bấm. Hết ba mức thì nút gợi ý khóa lại.

Đề và bài làm được giữ khi lỗi/hết hạn mức. Bấm nhanh không tạo yêu cầu đồng thời. Lỗi hoặc yêu cầu bổ sung dữ kiện không tăng mức gợi ý. Đổi đề đặt lại gợi ý; **Bài mới**, đổi sổ tay/tài khoản hoặc tải lại trang xóa nội dung phiên trong bộ nhớ. Ghi chú đã lưu vẫn nằm trong sổ tay. Chuyển hoạt động Giải bài/Kiểm tra/Tự luyện giữ tiến độ bài hiện tại, nhưng tách hội thoại giải bài, nhận xét và gợi ý. Kết quả trễ bị bỏ nếu người học sửa đề/bài làm hoặc đổi sổ tay/tài khoản.

## Hợp đồng API

`POST /api/notebooks/{id}/tutor` vẫn yêu cầu JWT và quyền sở hữu sổ tay. Backend tải nguồn của đúng sổ tay sau khi kiểm tra quyền. Endpoint hỏi đáp `/chat` và tạo trắc nghiệm giữ nguyên.

| `action` | Trường dùng thêm | Kết quả |
| --- | --- | --- |
| `solve` (mặc định) | `style`: `steps`/`brief`, `history` | `{answer, needsClarification}` |
| `check` | `submission` bắt buộc, riêng với `question` | Thêm `feedback`: `{status, errorType, firstErrorStep, reason, suggestion}` |
| `hint` | `hintLevel`: 1–3; `history` chỉ chứa gợi ý trước đó | Gợi ý đã qua kiểm định riêng; có `revealsAnswer: false` |
| `solution` | `style`: `steps`/`brief` | Lời giải đầy đủ do người học chủ động mở |

`feedback.status`: `correct`, `incorrect`, `incomplete`, `needs_clarification`.
`feedback.errorType`: `none`, `calculation`, `reasoning`, `missing_step`.
Bài sai phải có vị trí lỗi; bài đúng không được mang lỗi hay yêu cầu sửa sai.

Đề/bài làm mỗi trường tối đa 10.000 ký tự. Giới hạn history và nguồn như [hướng dẫn Gia sư](README.md). Action/mức gợi ý không hợp lệ trả 400 trước khi gọi AI; sổ tay không thuộc tài khoản trả 404. Phản hồi AI không đúng cấu trúc trả 502 có thể thử lại. 429 giữ `code`/`retryAfterSeconds` và không đăng xuất.

Mỗi gợi ý qua hai lượt Gemini: sinh gợi ý và kiểm định bằng prompt riêng không chứa lời tự nhận an toàn của lượt sinh. Kết luận thiếu/không an toàn bị chặn, không hiển thị candidate và không tăng mức. Kiểm định kiểm tra đáp án cuối, biểu thức nghiệm với số cụ thể, lời giải/code/bảng so sánh đầy đủ và nội dung vượt mức gợi ý. Hai lượt tiêu thụ thêm thời gian/hạn mức. Đây vẫn là kiểm định bằng mô hình, không chứng minh được mọi gợi ý/lời giải đều chính xác hay hoàn toàn không lộ đáp án.

## Kiểm thử

```powershell
node --test tests/frontend-session.test.cjs tests/frontend-text.test.cjs tests/frontend-validation.test.cjs backend/GoogleAuthChecks/frontend-google.test.cjs backend/TutorChecks/frontend-tutor.test.cjs
dotnet run --project backend/TutorChecks/TutorChecks.csproj -c Release
node --test backend/TutorChecks/browser.test.cjs
dotnet run --project tests/GeminiReliability/GeminiReliability.csproj
```

Kiểm tra C# dùng SQLite trong bộ nhớ và Gemini giả lập, không sửa database người dùng. Bộ Edge/Playwright dùng storage mới và API mô phỏng để kiểm tra payload, UI, ghi chú, công thức, lỗi/quota, bấm lặp, phản hồi trễ, chuyển đề/sổ tay/tài khoản, bàn phím và màn hình 320–1440px sáng/tối/reduced-motion.

Kiểm thử thực tùy chọn dùng cấu hình Gemini riêng hiện có; không in khóa API:

```powershell
dotnet run --project backend/TutorChecks/TutorChecks.csproj -c Release -- --live-work
dotnet run --project backend/TutorChecks/TutorChecks.csproj -c Release -- --live-hints
# Chọn riêng một nhóm khi cần đối chiếu:
dotnet run --project backend/TutorChecks/TutorChecks.csproj -c Release -- --live-hints '--case=Programming'
```

Ngày 11/10/2026: 58/58 kiểm tra backend, 32/32 kiểm tra JS và bộ trình duyệt pass sau khi tích hợp `main` (gồm các kiểm tra biểu mẫu #11). Build backend/frontend pass, backend 0 warnings/0 errors. 12/12 kiểm tra Gemini reliability pass trên checkout triển khai ban đầu. Kiểm thử mutation đảo điều kiện kiểm định làm test thất bại như dự kiến. Review độc lập không còn phát hiện bắt buộc sửa sau khi bổ sung kiểm định gợi ý. Giữ cấu hình PostgreSQL/deployment, runtime config và các kiểm tra nhập liệu của `main`; cache PWA/asset cập nhật v53.

Gemini thực đã được đối chiếu: `2x+3=11` với bài đúng, sai phép trừ, bài chưa hoàn chỉnh; `x²=9` với lỗi bỏ nghiệm âm; diện tích tam giác thiếu dữ kiện. Cả năm cho nhận xét/trạng thái phù hợp, không cho điểm. Ba mức đại số không hiển thị `x=4`; hành động mở lời giải trả đúng nghiệm. Gợi ý mẫu so sánh nguyên phân/giảm phân chỉ nêu tiêu chí cần đối chiếu, và gợi ý lập trình tổng số chẵn chỉ nhắc vòng lặp/điều kiện/phép chia dư, không đưa code hoàn chỉnh. Một số lượt thực trả phản hồi không hợp lệ hoặc bị kiểm định chặn; lỗi giữ nguyên đề/mức để thử lại. Không suy diễn mọi lượt Gemini thực đều pass từ kiểm thử giả lập.
