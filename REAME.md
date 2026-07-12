# CV Maker - Trang web tạo CV chuyên nghiệp

## 1. CÀI ĐẶT PHẦN MỀM

### Cài Node.js
- Tải tại: https://nodejs.org/
- Chọn bản LTS, cài đặt bình thường

### Cài MySQL (dùng XAMPP)
- Tải tại: https://www.apachefriends.org/
- Cài đặt, chạy XAMPP Control Panel
- Bấm Start ở dòng MySQL

## 2. CÀI ĐẶT DỰ ÁN

```bash
# Bước 1: Giải nén dự án
# Bước 2: Mở terminal trong thư mục backend
cd backend

# Bước 3: Cài đặt dependencies
npm install

# Bước 4: Tạo file .env (đã có sẵn, chỉ cần kiểm tra)
# Nếu chưa có, tạo file .env với nội dung:

PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=jobgenius_db
JWT_SECRET=my_secret_key_123456

# Bước 5: Tạo database
# Mở http://localhost/phpmyadmin
# Chạy file backend/sql/database.sql

# Bước 6: Chạy server
npm run dev

# Bước 7: Mở frontend
# Mở file frontend/pages/home.html trong trình duyệt
# Hoặc dùng Live Server trong VS Code

## 3. TEST ĐĂNG NHẬP

Email: admin@jobgenius.com
Mật khẩu: admin123

## 4. CÁC LỖI THƯỜNG GẶP

### Lỗi bcrypt trên Mac M1/M2
```bash
cd backend
npm uninstall bcrypt
npm install bcryptjs
# Sau đó sửa import trong code từ 'bcrypt' thành 'bcryptjs'