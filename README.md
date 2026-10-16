# MindSprintAI Study Cockpit

Ứng dụng học tập tiếng Việt chạy bằng Vite, Node.js/Express và MySQL. Giao diện hiện dùng dữ liệu mẫu lưu trong trình duyệt; tiến trình pet được lưu qua API khi đã cấu hình database. Chat pet gửi nội dung đến dịch vụ AI được cấu hình và không lưu hội thoại vào database.

## Yêu cầu

- Node.js `>=22.13.0`
- pnpm `11.25.0`
- MySQL với quyền tạo bảng

## Cấu hình local

Đặt `DATABASE_URL`, `MANUS_API_URL` và `MANUS_API_KEY` trong environment của shell hoặc nền tảng deploy. `.env.example` chỉ là mẫu tham khảo; ứng dụng chưa tự đọc file `.env`. Không commit khóa API.

```sh
pnpm install --frozen-lockfile
$env:DATABASE_URL = 'mysql://user:password@127.0.0.1:3306/mindsprint'
$env:MANUS_API_URL = 'https://api.example.com'
$env:MANUS_API_KEY = 'replace-with-server-side-key'
pnpm db:migrate
pnpm dev
```

Mở địa chỉ được in trong terminal (mặc định `http://localhost:3000`). Migration tạo bảng `pet_progress` và có thể chạy lại an toàn.

## Kiểm tra và build

```sh
pnpm test
pnpm build
pnpm start
```

Trong production, đặt các biến môi trường ở server, bao gồm `NODE_ENV=production`, rồi chạy migration trước khi deploy và chạy `pnpm start`. Dockerfile có thể dùng để build và chạy ứng dụng; server lắng nghe `PORT` (mặc định `3000`). Endpoint health check là `/_app/health`.

## Biến môi trường

| Tên | Bắt buộc | Mô tả |
| --- | --- | --- |
| `DATABASE_URL` | Có cho API tiến trình và health check | URL kết nối MySQL |
| `MANUS_API_URL` | Có cho chat AI | URL gốc của dịch vụ tương thích endpoint `/v1/chat/completions` |
| `MANUS_API_KEY` | Có cho chat AI | Khóa dịch vụ AI; chỉ đặt ở server |
| `PORT` | Không | Cổng HTTP, mặc định `3000` |
| `NODE_ENV` | Không | Đặt thành `production` để phục vụ bản build trong `dist/` |
