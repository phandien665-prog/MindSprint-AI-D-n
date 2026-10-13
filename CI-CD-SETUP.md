# Triển khai MindSprint AI

Nhánh hiện tại dùng **ASP.NET Core 8 + PostgreSQL** cho API và HTML/CSS/JavaScript tĩnh cho giao diện. Cấu hình này triển khai API bằng Docker trên Render và giao diện bằng Git integration của Vercel. Backend tự chạy EF Core migrations khi khởi động; health check là `/healthz`.

## 1. Tạo API và PostgreSQL trên Render

1. Mở Render Dashboard, tạo Blueprint từ repository này và xác nhận dùng `render.yaml` ở thư mục gốc. Blueprint tạo `mindsprint-api` và `mindsprint-db` cùng region Singapore.
2. Nhập các giá trị Render yêu cầu:
   - `Cors__AllowedOrigins`: URL giao diện Vercel, ví dụ `https://mindsprint.vercel.app`. Có thể nhập nhiều origin, ngăn cách bằng dấu phẩy, không thêm dấu `/` cuối.
   - `Gemini__ApiKey`: API key để bật các tính năng AI.
   - `Google__ClientId`: OAuth client ID nếu cần đăng nhập Google.
3. Đợi lần deploy đầu hoàn tất. Ghi lại URL HTTPS và Service ID của `mindsprint-api` trong Render Dashboard.

Render tạo `Jwt__Key` ngẫu nhiên và cấp URL PostgreSQL nội bộ qua `ConnectionStrings__Default`. API tự chuyển URL `postgresql://...` thành định dạng Npgsql, tự bind vào `PORT`, chỉ mở CORS cho origin đã cấu hình, và tắt Swagger ngoài môi trường Development. Tài khoản demo mật khẩu cố định chỉ được tạo ở Development.

## 2. Đưa giao diện lên Vercel

1. Import repository vào Vercel và đặt **Root Directory** là `frontend`.
2. Chọn framework **Other**. `vercel.json` đã đặt build command `npm run build` và output directory `dist`.
3. Trong Environment Variables, đặt `API_BASE` thành URL HTTPS của API Render, ví dụ `https://mindsprint-api.onrender.com`. Đặt biến cho cả **Production** và **Preview** để mọi lần build đều có cấu hình backend. Nếu muốn gọi API từ preview, thêm chính xác origin Vercel preview vào `Cors__AllowedOrigins` ở Render.
4. Deploy. Vercel Git integration tự build lại khi có push; `build.mjs` đưa `API_BASE` vào `runtime-config.js` của bản tĩnh. Nếu bật Google Sign-In, thêm cùng origin Vercel vào Authorized JavaScript origins ở Google Cloud Console.

## 3. Bật deploy backend tự động

Thêm hai repository secrets tại **GitHub → Settings → Secrets and variables → Actions**:

| Secret | Giá trị |
| --- | --- |
| `RENDER_SERVICE_ID` | Service ID của `mindsprint-api` |
| `RENDER_API_KEY` | API key của Render |

Workflow `.github/workflows/ci-cd.yml` build API và frontend cho pull request/push. Khi push lên `main`, nếu build thành công, workflow gọi Render deploy API. Vercel deploy độc lập qua Git integration. Blueprint tắt auto-deploy ở Render để tránh chạy deploy hai lần.

## 4. Kiểm tra sau deploy

- Mở `https://<api-host>/healthz`; kết quả mong đợi: `{"status":"ok"}`.
- Mở Vercel URL, đăng ký tài khoản mới rồi kiểm tra đăng nhập, thư viện thẻ, AI (nếu có Gemini key), ghi chú và công việc.
- Trong trình duyệt, kiểm tra Network: API request dùng HTTPS của Render và không có lỗi CORS.
- Render Logs không được có lỗi PostgreSQL/migration. Lần khởi động đầu tạo schema và bộ thẻ dùng chung.

## Cấu hình lưu trữ

Blueprint mặc định chọn free plans để phù hợp bản demo. Theo giới hạn hiện hành của Render, PostgreSQL free có giới hạn 1 GB và hết hạn sau 30 ngày; nâng cấp database trước khi dùng để lưu dữ liệu cần giữ lâu dài. Xem [giới hạn free trên Render](https://render.com/docs/free) và [Blueprint spec](https://render.com/docs/blueprint-spec).

Vercel cấp HTTPS cho domain triển khai. Render yêu cầu web service bind `0.0.0.0`; API đã đọc cổng `PORT` do Render cấp. Tham khảo [Render Web Services](https://render.com/docs/web-services) và [Vercel GitHub deployments](https://vercel.com/docs/git/vercel-for-github).
