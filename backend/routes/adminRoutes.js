import express from 'express';
import { adminController } from '../controllers/adminController.js';
import { authMiddleware } from '../middleware/auth.js';
import db from '../config/database.js';

const router = express.Router();

// Middleware kiểm tra admin (role = 'admin')
const isAdmin = async (req, res, next) => {
  try {
    const [rows] = await db.execute(
      'SELECT role FROM users WHERE id = ?',
      [req.userId]
    );
    
    if (rows.length > 0 && rows[0].role === 'admin') {
      return next();
    }
    res.status(403).json({ success: false, error: 'Không có quyền truy cập' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Lỗi kiểm tra quyền' });
  }
};

// Áp dụng auth + admin
router.use(authMiddleware);
router.use(isAdmin);

// Stats
router.get('/admin/stats', adminController.getStats);

// Views
router.get('/admin/views/pages', adminController.getViewsByPage);

// Templates
router.get('/admin/templates', adminController.getAllTemplates);
router.put('/admin/template/:templateId', adminController.updateTemplate);

// Comments
router.get('/admin/comments', adminController.getAllComments);
router.delete('/admin/comments/:id', adminController.deleteComment);

// Contacts
router.get('/admin/contacts', adminController.getAllContacts);
router.put('/admin/contacts/:id/read', adminController.markContactRead);
router.delete('/admin/contacts/:id', adminController.deleteContact);

export default router;