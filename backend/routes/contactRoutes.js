import express from 'express';
import { contactController } from '../controllers/contactController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// === CÔNG KHAI (Không cần đăng nhập) ===
router.post('/contact', authMiddleware, contactController.submitContact);

// === DÀNH CHO ADMIN (Cần đăng nhập + quyền admin) ===
// Lưu ý: Thêm middleware checkAdmin sau này
router.get('/admin/contacts', authMiddleware, contactController.getAllContacts);
router.get('/admin/contacts/:id', authMiddleware, contactController.getContactById);
router.put('/admin/contacts/:id/read', authMiddleware, contactController.markAsRead);
router.delete('/admin/contacts/:id', authMiddleware, contactController.deleteContact);

export default router;