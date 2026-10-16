# Kiểm tra xử lý đồng thời

Chạy từ thư mục gốc với .NET 8:

```powershell
dotnet run --project backend/ConcurrencyChecks/ConcurrencyChecks.csproj -c Release
```

20 kiểm tra dùng SQLite riêng trong `artifacts/concurrency-checks`, không đọc cấu
hình riêng, không gọi dịch vụ ngoài và không ghi database của ứng dụng. Hai
DbContext được chặn ngay trước SaveChanges để chắc chắn cùng giữ dữ liệu cũ.
Có thể chạy riêng bằng `-- --tokens` hoặc `-- --cards`.

- Refresh token chỉ đổi được một lần; yêu cầu thua không để lại token mới trong
  database hoặc ChangeTracker. Token hết hạn, đã thu hồi và phát lại bị từ chối.
- Đăng xuất đồng thời với rotation không gây lỗi server. Hai lượt đăng nhập có
  thể cùng dọn token cũ và giữ hai phiên hợp lệ.
- Hai chỉnh sửa cùng version trả một 200 và một 409, kèm nội dung/version hiện
  hành. Kiểm tra quyền sở hữu, thử lại và tranh chấp chỉnh sửa/xóa vẫn hoạt động.

`Flashcard.Version` và `RefreshToken.IsRevoked` là EF concurrency token: điều kiện
được kiểm tra trong câu lệnh ghi database. SaveChanges bao gồm thu hồi token cũ
và thêm token thay thế trong cùng transaction; khi xung đột, toàn bộ lần ghi bị
rollback. Dọn phiên cũ dùng ExecuteDelete để không phụ thuộc một danh sách đã đọc
trước đó. Các cột đã tồn tại; thay đổi metadata này không cần đổi schema.

Tham khảo: [EF Core concurrency](https://learn.microsoft.com/en-us/ef/core/saving/concurrency),
[SaveChanges transactions](https://learn.microsoft.com/en-us/ef/core/saving/transactions).

Kiểm tra frontend liên quan:

```powershell
node --test tests/frontend-safety-browser.test.cjs
```

Hai bài Edge headless dùng API giả lập và profile mới, xác nhận tên chủ đề/đáp án
chứa HTML được hiển thị nguyên văn; khi tải sổ tay mới thất bại, tên đang chọn và
notebook ID của câu hỏi tiếp theo vẫn khớp nhau. Thử lại chuyển thành công đổi cả
hai. Cần build API ở Release để có Playwright đi kèm hoặc cài package Playwright;
biến `TUTOR_BROWSER` có thể chỉ executable Chromium khác.
