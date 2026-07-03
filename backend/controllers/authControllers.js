// controllers/authController.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/UserModel.js';

export const authController = {
  // ĐĂNG KÝ
  async register(req, res) {
    try {
      const { fullName, email, password } = req.body;

      // Kiểm tra email đã tồn tại
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ 
          success: false, 
          error: 'Email đã được đăng ký' 
        });
      }

      // Mã hóa mật khẩu
      const hashedPassword = await bcrypt.hash(password, 10);

      // Tạo user mới
      const newUser = await UserModel.create({ 
        fullName, 
        email, 
        password: hashedPassword 
      });

      res.status(201).json({
        success: true,
        message: 'Đăng ký thành công',
        userId: newUser.id
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ 
        success: false, 
        error: 'Lỗi server' 
      });
    }
  },

  // ĐĂNG NHẬP
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Tìm user theo email
      const user = await UserModel.findByEmail(email);
      console.log('🔑 user.role:', user.role);
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          error: 'Email hoặc mật khẩu sai' 
        });
      }

      // Kiểm tra mật khẩu
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ 
          success: false, 
          error: 'Email hoặc mật khẩu sai' 
        });
      }

      // Tạo token
      const token = jwt.sign(
        { userId: user.id, email: user.email, fullName: user.fullName },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        message: 'Đăng nhập thành công',
        token,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role
        }
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ 
        success: false, 
        error: 'Lỗi server' 
      });
    }
  }
};