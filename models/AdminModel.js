import db from '../config/database.js';

export const AdminModel = {
  // ===== STATS =====
  async getTotalUsers() {
    const [rows] = await db.execute('SELECT COUNT(*) as total FROM users');
    return rows[0].total;
  },

  async getTotalCVs() {
    const [rows] = await db.execute('SELECT COUNT(*) as total FROM cvs');
    return rows[0].total;
  },

  async getTotalComments() {
    const [rows] = await db.execute('SELECT COUNT(*) as total FROM comments');
    return rows[0].total;
  },

  async getTotalViews() {
    const [rows] = await db.execute('SELECT COUNT(*) as total FROM page_views');
    return rows[0].total;
  },

  // ===== VIEWS =====
  async getViewsByPage() {
    const [rows] = await db.execute(
      'SELECT page, COUNT(*) as views FROM page_views GROUP BY page ORDER BY views DESC'
    );
    return rows;
  },

  // ===== TEMPLATES =====
  async getAllTemplates() {
    const [rows] = await db.execute(
      'SELECT templateId, name, description FROM templates ORDER BY id'
    );
    return rows;
  },

  async updateTemplate(templateId, data) {
    const { name, description } = data;
    const [result] = await db.execute(
      'UPDATE templates SET name = ?, description = ? WHERE templateId = ?',
      [name, description, templateId]
    );
    return result.affectedRows > 0;
  },

  // ===== COMMENTS =====
  async getAllComments() {
    const [rows] = await db.execute(
      `SELECT c.id, c.cvId, c.content, c.createdAt, u.fullName, u.email 
       FROM comments c
       LEFT JOIN users u ON c.userId = u.id
       ORDER BY c.createdAt DESC`
    );
    return rows;
  },

  async deleteComment(id) {
    const [result] = await db.execute('DELETE FROM comments WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  // ===== CONTACTS =====
  async getAllContacts() {
    const [rows] = await db.execute(
      `SELECT c.id, c.subject, c.message, c.isRead, c.createdAt, u.fullName, u.email 
       FROM contacts c
       LEFT JOIN users u ON c.userId = u.id
       ORDER BY c.createdAt DESC`
    );
    return rows;
  },

  async deleteContact(id) {
    const [result] = await db.execute('DELETE FROM contacts WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  async markContactAsRead(id) {
    const [result] = await db.execute(
      'UPDATE contacts SET isRead = TRUE WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
};