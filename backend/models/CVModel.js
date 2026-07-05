import db from '../config/database.js';

function normalizeContent(content) {
  if (!content) return {};
  if (typeof content === 'object') return content;
  if (typeof content !== 'string') return {};

  const trimmed = content.trim();
  if (!trimmed) return {};

  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return { raw: trimmed };
    }
  }

  return { raw: trimmed };
}

export const CVModel = {
  // Lấy danh sách CV của user
  async findByUserId(userId) {
    const [rows] = await db.execute(
      `SELECT id, templateId, content, createdAt, updatedAt 
       FROM cvs 
       WHERE userId = ? 
       ORDER BY createdAt DESC`,
      [userId]
    );
    return rows.map(row => ({
      ...row,
      content: normalizeContent(row.content)
    }));
  },

  // Lấy chi tiết 1 CV
  async findById(id, userId) {
    const [rows] = await db.execute(
      'SELECT * FROM cvs WHERE id = ? AND userId = ?',
      [id, userId]
    );
    if (rows[0]) {
      rows[0].content = normalizeContent(rows[0].content);
    }
    return rows[0];
  },

  // Cập nhật CV (dùng cột content JSON)
  async update(id, userId, data) {
    const content = JSON.stringify(data.content || data);
    const [result] = await db.execute(
      'UPDATE cvs SET content = ?, updatedAt = NOW() WHERE id = ? AND userId = ?',
      [content, id, userId]
    );
    return result.affectedRows > 0;
  },
  
  // Tạo CV mới
  async create(userId, templateId, content) {
    const [result] = await db.execute(
      'INSERT INTO cvs (userId, templateId, content) VALUES (?, ?, ?)',
      [userId, templateId, JSON.stringify(content)]
    );
    return { id: result.insertId };
  },

  // ✅ THÊM HÀM MỚI: Lấy CV theo userId + templateId (kiểm tra CV cũ)
  async findByUserAndTemplate(userId, templateId) {
    const [rows] = await db.execute(
      'SELECT * FROM cvs WHERE userId = ? AND templateId = ? ORDER BY createdAt DESC LIMIT 1',
      [userId, templateId]
    );
    return rows[0] || null;
  }
};