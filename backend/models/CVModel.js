import db from '../config/database.js';

export const CVModel = {
  // Lấy danh sách CV của user (lịch sử)
  async findByUserId(userId) {
    const [rows] = await db.execute(
      `SELECT id, templateId, templateName, fullName, title, 
              createdAt, updatedAt 
       FROM cvs 
       WHERE userId = ? 
       ORDER BY createdAt DESC`,
      [userId]
    );
    return rows;
  },

  // Lấy chi tiết 1 CV
  async findById(id, userId) {
    const [rows] = await db.execute(
      'SELECT * FROM cvs WHERE id = ? AND userId = ?',
      [id, userId]
    );
    return rows[0];
  },

  // Cập nhật CV
  async update(id, userId, data) {
    const [result] = await db.execute(
      `UPDATE cvs SET 
        fullName = ?, title = ?, phone = ?, email = ?, 
        address = ?, careerObjective = ?, updatedAt = NOW()
       WHERE id = ? AND userId = ?`,
      [data.fullName, data.title, data.phone, data.email, 
       data.address, data.careerObjective, id, userId]
    );
    return result.affectedRows > 0;
  }
};