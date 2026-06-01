// models/UserModel.js
import pool from '../config/database.js';

export const UserModel = {
  // Tạo user mới
  async create(data) {
    const { fullName, email, password } = data;
    const [result] = await pool.execute(
      'INSERT INTO users (fullName, email, password) VALUES (?, ?, ?)',
      [fullName, email, password]
    );
    return { id: result.insertId };
  },

  // Tìm user theo email
  async findByEmail(email) {
    const [rows] = await pool.execute(
      'SELECT id, fullName, email, password, createdAt FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  },

  // Tìm user theo id
  async findById(id) {
    const [rows] = await pool.execute(
      'SELECT id, fullName, email, createdAt FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  }
};