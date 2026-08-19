# VietTravel

Website du lịch và quản trị tuyển dụng dùng Node.js, Express, Pug và SQLite. Dữ liệu mẫu được tự tạo ở lần chạy đầu tiên, không cần cài MongoDB hay SQL Server.

## Chạy trên Windows

```powershell
yarn install
yarn start
```

Sau đó mở:

- Website: http://localhost:3000
- Tuyển dụng: http://localhost:3000/tuyen-dung
- Khu HR: http://localhost:3000/hr/login
- Khu quản trị: http://localhost:3000/admin/account/login

## Tài khoản demo

| Khu vực | Email | Mật khẩu |
|---|---|---|
| Quản trị | admin@viettravel.vn | Admin@123 |
| Nhân sự | hr@viettravel.vn | Hr@123456 |

CV được lưu tại `public/uploads/cv`; dữ liệu SQLite nằm trong `data/viettravel.sqlite`.

## Triển khai demo trên Render

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/Dang-nhut-tan/demo-phong-van)

> Gói Render miễn phí dùng ổ đĩa tạm thời. Dữ liệu SQLite và CV tải lên có thể được tạo lại sau khi dịch vụ khởi động lại hoặc triển khai phiên bản mới.
