import db from '../config/database.js';

export const ContactModel = {
  // Lưu liên hệ mới
  async create(data) {
    const { userId, subject, message } = data;
    const [result] = await db.execute(
      'INSERT INTO contacts (userId, subject, message) VALUES (?, ?, ?)',
      [userId, subject, message]
    );
    return { id: result.insertId };
  },

  // Lấy tất cả liên hệ (cho admin)
  async getAll() {
    const [rows] = await db.execute(
      'SELECT * FROM contacts ORDER BY createdAt DESC'
    );
    return rows;
  },

  // Lấy chi tiết 1 liên hệ
  async getById(id) {
    const [rows] = await db.execute(
      'SELECT * FROM contacts WHERE id = ?',
      [id]
    );
    return rows[0];
  },

  // Đánh dấu đã đọc
  async markAsRead(id) {
    const [result] = await db.execute(
      'UPDATE contacts SET isRead = TRUE WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  },

  // Xóa liên hệ
  async delete(id) {
    const [result] = await db.execute(
      'DELETE FROM contacts WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
};