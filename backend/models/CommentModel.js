
import db from '../config/database.js';

export const CommentModel = {
  // Lấy bình luận theo templateId
  async findByTemplate(templateId) {
    const { sql, values } = buildCommentQuery(templateId);
    const [rows] = await db.execute(sql, values);
    return rows;
  },

  // Thêm bình luận mới
  async create(data) {
    const { authorName, templateKey, numericTemplateId, userId, content, rating } = data;
    
    const [result] = await db.execute(
      `INSERT INTO comments (authorName, templateKey, templateId, userId, content, rating)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [authorName, templateKey, numericTemplateId, userId, content, rating || null]
    );
    
    return { id: result.insertId };
  },

  // Lấy chi tiết 1 bình luận
  async findById(id) {
    const [rows] = await db.execute(
      `SELECT c.id, c.templateId, c.templateKey, c.userId, c.content, c.rating, c.createdAt,
              COALESCE(u.fullName, c.authorName, 'Người dùng') AS authorName
       FROM comments c
       LEFT JOIN users u ON c.userId = u.id
       WHERE c.id = ?`,
      [id]
    );
    return rows[0];
  },

  // Xóa bình luận
  async deleteById(id, userId) {
    const [result] = await db.execute(
      'DELETE FROM comments WHERE id = ? AND userId = ?',
      [id, userId]
    );
    return result.affectedRows > 0;
  }
};

// ===== HÀM TIỆN ÍCH =====
function normalizeTemplateRef(templateId) {
  if (templateId === undefined || templateId === null) return null;
  const value = String(templateId).trim();
  if (!value) return null;

  const aliases = {
    henry_simple: 'henry_simple',
    henry_professional: 'henry_professional',
    henry_traditional: 'henry_traditional',
    henry_modern: 'henry_modern',
    CV1: 'CV1',
    CV2: 'CV2',
    cv1: 'CV1',
    cv2: 'CV2'
  };

  return aliases[value] || value;
}

function buildCommentQuery(templateId) {
  const normalized = normalizeTemplateRef(templateId);
  const values = [];
  const clauses = [];

  if (normalized) {
    clauses.push('c.templateKey = ?');
    values.push(normalized);
  }

  if (templateId !== undefined && templateId !== null && templateId !== '') {
    const numericValue = Number(templateId);
    if (!Number.isNaN(numericValue)) {
      clauses.push('c.templateId = ?');
      values.push(numericValue);
    }
  }

  const whereClause = clauses.length ? `WHERE ${clauses.join(' OR ')}` : '';

  return {
    sql: `
      SELECT c.id, c.templateId, c.templateKey, c.userId, c.content, c.rating, c.createdAt,
             COALESCE(u.fullName, c.authorName, 'Người dùng') AS authorName
      FROM comments c
      LEFT JOIN users u ON c.userId = u.id
      ${whereClause}
      ORDER BY c.createdAt DESC
    `,
    values
  };
}