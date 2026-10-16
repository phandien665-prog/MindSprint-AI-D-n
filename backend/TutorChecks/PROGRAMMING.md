# Issue #34 — Trợ giảng lập trình

Trong **Sổ tay AI → Gia sư → Lập trình**, chọn Python/JavaScript, nhập code,
đề bài/kết quả mong muốn và thông báo lỗi nếu có, rồi bấm **Phân tích / Hỏi tiếp**.
Đề bài riêng không bắt buộc: khi code thiếu thông tin, AI được yêu cầu hỏi bổ sung.
Các phản hồi có chẩn đoán, dòng/đoạn liên quan, bản sửa, lý do và đầu vào/đầu ra
kiểm thử **dự kiến**. Ô Hỏi tiếp giữ cùng code và hội thoại riêng với Giải bài.

Ứng dụng chỉ gửi code dạng văn bản cho Gemini, không thực thi code trên server
hay trong trình duyệt. Backend gắn `executionStatus: "not_run"`, không tin trạng thái
thực thi từ mô hình. UI và ghi chú luôn ghi **Chưa chạy code**. Đây là phân tích
của AI, cần đọc lại và tự kiểm thử bản sửa trong môi trường phát triển phù hợp.

Code giữ nguyên thụt dòng, dòng trống, dấu backtick, `$`, `[1]` và HTML. Nội dung
AI được escape; code, vị trí lỗi và dữ liệu kiểm thử hiển thị trong `pre/code`.
Ghi chú lưu code gốc, lỗi đã nhập và phân tích qua API ghi chú hiện có; mở lại
code có backtick vẫn nguyên văn. Không có `eval`, shell, trình thông dịch hay iframe.

Nháp/hội thoại chỉ nằm trong bộ nhớ trang. Đổi code/ngôn ngữ/đề/lỗi xóa ngữ cảnh
phân tích cũ. Chuyển hoạt động giữ nháp; **Bài mới**, đổi sổ tay/tài khoản và reload
xóa nháp/hội thoại. Ghi chú đã lưu vẫn còn. Lỗi/quota giữ đầu vào và câu hỏi tiếp;
người học có thể bấm lại. Kết quả trễ bị bỏ khi đổi tài khoản/sổ tay hoặc sửa nháp.

## Hợp đồng API

Dùng JWT/refresh hiện có với `POST /api/notebooks/{id}/tutor`:

```json
{
  "action": "code",
  "language": "python",
  "question": "Hàm add trả tổng hai số nguyên",
  "code": "def add(a, b)\n    return a + b",
  "error": "SyntaxError: expected ':'",
  "history": []
}
```

`language` chỉ nhận `python` hoặc `javascript`; `code` bắt buộc và không được trim.
`question` có thể là chuỗi rỗng, `error` tùy chọn. Code, đề và lỗi mỗi phần tối đa
10.000 ký tự. UI giới hạn đề 8.000 và hỏi tiếp 1.500 để ghép dưới giới hạn API.
History tối đa 12 lượt user/assistant, mỗi lượt 10.000, tổng 40.000 ký tự.
Các trường code không được gửi vào hoạt động khác. `hintLevel` không áp dụng.

Phản hồi bổ sung hai trường, giữ tương thích các hoạt động cũ:

```json
{
  "answer": "Thiếu dấu hai chấm ở cuối dòng khai báo hàm.",
  "needsClarification": false,
  "executionStatus": "not_run",
  "programming": {
    "diagnosis": "Lỗi cú pháp",
    "location": "Dòng 1: def add(a, b)",
    "fixedCode": "def add(a, b):\n    return a + b",
    "explanation": "Dấu hai chấm mở khối lệnh của hàm Python.",
    "tests": [
      { "input": "add(2, 3)", "expectedOutput": "5", "purpose": "Hai số nguyên dương" },
      { "input": "add(-2, 2)", "expectedOutput": "0", "purpose": "Số âm và tổng bằng 0" }
    ]
  }
}
```

Khi thiếu dữ kiện, `needsClarification=true`, `fixedCode` phải null và `tests`
phải rỗng. Backend từ chối phản hồi mâu thuẫn để không trình bày bản sửa/đầu ra
chưa có căn cứ. Khi đủ dữ kiện, bắt buộc có bản sửa (hoặc code giữ nguyên nếu đúng)
và ít nhất một ca kiểm thử. Tối đa 10 ca, mỗi trường ca tối đa 2.000 ký tự;
các trường phân tích khác tối đa 10.000. Phản hồi thiếu/sai cấu trúc trả 502
`ai_invalid_response` để thử lại. JSON schema gửi cho Gemini quy định các trường này.

Quyền sở hữu sổ tay được kiểm tra trước khi đọc nguồn/gọi Gemini. Nguồn chỉ thuộc
sổ tay hiện tại. Không đổi database schema cho #34; tiếp tục dùng chính sách Gemini
retry/fallback/timeout/quota sẵn có. Lỗi 429 giữ `retryAfterSeconds` và phiên đăng nhập.

## Kiểm tra và giới hạn nghiệm thu — 16/10/2026

```powershell
dotnet run --project backend/TutorChecks/TutorChecks.csproj -c Release -- --programming
dotnet run --project backend/TutorChecks/TutorChecks.csproj -c Release
node --test tests/frontend-session.test.cjs tests/frontend-text.test.cjs tests/frontend-validation.test.cjs backend/TutorChecks/frontend-tutor.test.cjs
node --test backend/TutorChecks/programming-browser.test.cjs backend/TutorChecks/browser.test.cjs
dotnet build backend/MindSprint.Api/MindSprint.Api.csproj -c Release
node frontend/build.mjs
```

Nếu package đã restore, có thể thêm `--no-restore` cho dotnet để kiểm tra offline.
Browser checks dùng Edge headless và Playwright đi kèm API, profile/storage tạm,
API giả lập; không đọc hay ghi database thật. `TUTOR_BROWSER` chọn executable khác;
`TUTOR_SCREENSHOT_DIR` lưu ảnh giao diện nếu cần.

- **Pass:** 19 kiểm tra backend #34 với Gemini giả lập/SQLite trong bộ nhớ;
  59 kiểm tra Gia sư hiện có. Kiểm tra byte code, quyền sở hữu, validation,
  schema, phản hồi sai/thiếu, yêu cầu bổ sung, trạng thái chưa chạy và quota/outage.
- **Pass:** 36 kiểm tra frontend, 2 bài tích hợp trình duyệt; code/ký tự đặc biệt, ghi chú mở lại
  nguyên văn, hỏi tiếp, bàn phím, quota/outage/retry, sửa nháp khi chờ, đổi sổ tay/
  tài khoản; responsive 320/375/768/1024/1440. Hồi quy Gia sư/Theo nguồn hiện có.
- **Pass — Gemini thực:** sau khi người dùng cấu hình khóa hợp lệ trong file riêng
  được Git bỏ qua, 8 mẫu bên dưới và 1 câu hỏi tiếp đều trả phản hồi hợp lệ với
  `executionStatus=not_run`. Đọc đối chiếu chẩn đoán/vị trí/lý do và kiểm thử dự kiến.
  Hai mẫu thiếu định nghĩa `helper` hỏi bổ sung, không tự tạo hàm thay thế.
- **Pass — chạy đối chiếu trong môi trường phát triển:** đã đọc cả 6 bản sửa do
  Gemini thực đề xuất, đối chiếu nguyên văn với các snippet đã duyệt trước khi chạy;
  10 lượt chạy Python/Node kiểm tra kết quả thông thường, rỗng, số âm và sai kiểu.
  Không chạy code chưa duyệt, không có trình thực thi code trong ứng dụng.
  Kết quả cụ thể nằm trong bảng dưới. Đây là kiểm chứng các mẫu đã nêu, không bảo đảm
  mọi đề xuất AI trong tương lai đều đúng.
- **Pass:** build Release API, 0 warnings / 0 errors; frontend build thành công.

Main nền `e501102` còn thiếu `20261014120000_AddWeakArea.cs`, làm build lỗi CS0115
ở file Designer. Nhánh này khôi phục nguyên migration từ nhánh sửa hiện có trong
commit riêng để build lại được; không tạo migration mới cho tính năng Lập trình.

Lần thử đầu với khóa hợp lệ đã phát hiện AI tự thêm `helper` mẫu cho code thiếu
thông tin. Đã sửa prompt ưu tiên hỏi ngữ cảnh còn thiếu, cấm tự thêm stub/`return data`,
thêm chặn phản hồi mâu thuẫn và kiểm tra hồi quy backend/trình duyệt. Chạy riêng hai
mẫu thiếu dữ kiện rồi chạy lại toàn bộ ma trận đã đạt. Lệnh live hiện trả exit code
khác 0 nếu mẫu thiếu dữ kiện không hỏi bổ sung hoặc tự đưa code/đầu ra dự kiến.

## Ma trận Gemini thực và đối chiếu thủ công

```powershell
dotnet run --project backend/TutorChecks/TutorChecks.csproj -c Release -- --live-programming
```

Lệnh dùng cấu hình riêng hiện có, gửi chỉ dữ liệu mẫu và ghi phản hồi vào
`artifacts/issue-34/live-programming.json` (gitignored), không in khóa và không chạy
code do mô hình sinh. Đọc, kiểm tra độ an toàn rồi chạy bản sửa thủ công trong
môi trường phát triển của người kiểm thử, ghi kết quả thực riêng với dự đoán.

| Mẫu | Code/lỗi | Kỳ vọng cần đối chiếu |
| --- | --- | --- |
| Python cú pháp | `def add(a,b)` thiếu `:` | Đúng dòng 1, thêm `:`, `add(2,3) → 5` |
| Python kiểu | `age=input(...); print(age+1)` | Phân biệt str/int; nhập `21 → 22`, chỉ rõ xử lý đầu vào không phải số |
| Python logic | Tổng chẵn lọc `% 2 != 0` | Đổi điều kiện, `[1,2,4] → 6`, `[] → 0`, số âm |
| Python thiếu dữ kiện | `return helper(data)` chưa có helper/yêu cầu | Hỏi hàm/phụ thuộc, đầu vào và kết quả mong muốn; không bịa implementation |
| JavaScript cú pháp | Hàm add thiếu `}` | Chỉ đoạn thiếu ngoặc, bổ sung, `add(2,3) → 5` |
| JavaScript kiểu | `'21' + 1` in `211` | Giải thích nối chuỗi, đổi sang số để ra `22`, kiểm tra `NaN` |
| JavaScript logic | Tổng chẵn lọc `% 2 !== 0` | Điều kiện chẵn, ca rỗng và số âm |
| JavaScript thiếu dữ kiện | `return helper(data)` | Hỏi định nghĩa/phụ thuộc, không tự đoán yêu cầu |

Kết quả chạy đối chiếu ngày 16/10/2026 (code được Gemini đề xuất, đã đọc trước khi chạy):

| Bản sửa | Kết quả thực tế trong môi trường phát triển |
| --- | --- |
| Python `add` thêm `:` | `add(2,3) → 5`, `add(-1,1) → 0`, `add(0,0) → 0` |
| Python `print(int(age) + 1)` | Nhập `21 → 22`, `0 → 1`; `abc` gây `ValueError` |
| Python `total_even` đổi sang `% 2 == 0` | `[1,2,4] → 6`, `[1,3,5] → 0`, `[] → 0`, `[-2,-1,0,4] → 2` |
| JavaScript `add` thêm `}` | `add(2,3) → 5`, `add(-1,1) → 0`, `add(0,0) → 0` |
| JavaScript `Number(age) + 1` | Chuỗi `21 → 22`, `0 → 1`, `abc → NaN` |
| JavaScript `totalEven` đổi sang `% 2 === 0` | `[1,2,4] → 6`, `[1,3,5] → 0`, `[] → 0`, `[-2,-1,0,4] → 2` |
| Python/JavaScript thiếu `helper` | `needsClarification=true`, `fixedCode=null`, `tests=[]`; không có bản sửa để chạy |

Mẫu chuyển tuổi chỉ sửa phép chuyển kiểu; không tự thêm quy tắc tuổi hợp lệ hoặc xử lý
mọi đầu vào sai. `ValueError`/`NaN` ở ca chữ được ghi đúng, không coi là kết quả số hợp lệ.
Phản hồi live và log đối chiếu lưu cục bộ ở `artifacts/issue-34/live-programming.json`
và `artifacts/issue-34/live-runtime-verification.json` (Git bỏ qua), không có khóa API.

Sau mẫu Python cú pháp có thêm câu hỏi “Vì sao dòng 1 cần dấu hai chấm?” để kiểm tra
ngữ cảnh. Kiểm tra mọi phản hồi đều không nói “đã chạy/đã pass”; màn hình/ghi chú ghi
“Chưa chạy code”, ví dụ đầu ra là dự kiến. Mở lại ghi chú và thử cả lỗi mạng/quota.
