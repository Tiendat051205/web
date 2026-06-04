import db from '../config/database.js';

export const CommentModel = {
  async findByTemplate(templateName) {
    const [rows] = await db.execute(
      `SELECT c.id, c.templateName, c.userId, c.text, c.createdAt,
              COALESCE(u.fullName, 'Người dùng') AS userName
       FROM comments c
       LEFT JOIN users u ON u.id = c.userId
       WHERE c.templateName = ?
       ORDER BY c.createdAt DESC`,
      [templateName]
    );
    return rows;
  },

  async create({ templateName, userId, text }) {
    const [result] = await db.execute(
      `INSERT INTO comments (templateName, userId, text, createdAt)
       VALUES (?, ?, ?, NOW())`,
      [templateName, userId, text]
    );
    return { id: result.insertId };
  },

  async removeById(id, userId) {
    const [result] = await db.execute(
      'DELETE FROM comments WHERE id = ? AND userId = ?',
      [id, userId]
    );
    return result.affectedRows > 0;
  }
};
