# Dự án Quản lý Giải đấu Esports (BTL Cuối Kỳ)

Hệ thống quản lý giải đấu Esports chuyên nghiệp sử dụng công nghệ Node.js, React (UmiJS) và MySQL.

## 🛠 Công nghệ sử dụng
- **Frontend:** React, UmiJS, Ant Design Pro
- **Backend:** Node.js, Express, TypeScript
- **Database:** MySQL, Prisma ORM

## 🚀 Hướng dẫn cài đặt và chạy

### 1. Cấu hình Database
- Tạo database mới trong MySQL với tên: `esports_tournament`
- Vào thư mục `backend`, copy file `.env.example` thành `.env` và sửa lại mật khẩu MySQL của bạn.

### 2. Cài đặt Backend
```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npm run prisma:seed  
npm run dev
```
*Tài khoản admin mẫu: `admin@esports.com` / `Admin@123`*

### 3. Cài đặt Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📝 Tính năng chính
1. **Xác thực:** Đăng ký/Đăng nhập (Phân quyền Admin & User).
2. **Quản lý giải đấu:** Admin tạo, sửa, xóa giải đấu.
3. **Đăng ký tham gia:** User đăng ký đội và chờ Admin duyệt.
4. **Thông báo:** Hệ thống thông báo thời gian thực.
5. **Thống kê:** Biểu đồ dữ liệu và xuất file Excel.
