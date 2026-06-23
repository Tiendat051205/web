import express from 'express';
import { commentController } from '../controllers/commentController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// ✅ Đổi route cho khớp với frontend
router.get('/template/:templateId/comments', commentController.getCommentsByTemplate);
router.post('/template/:templateId/comments', authMiddleware, commentController.addCommentByTemplate);
// router.get('/cv/:cvId/comments', commentController.getCommentsByCvId);
// router.post('/cv/:cvId/comments', authMiddleware, commentController.addCommentByCvId);
router.delete('/comments/:id', authMiddleware, commentController.deleteComment);

export default router;