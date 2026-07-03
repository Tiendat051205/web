import express from 'express';
import { commentController } from '../controllers/commentController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
console.log('✅ Đang tạo route: GET /template/:templateId/comments');
// ✅ Đổi route cho khớp với frontend
router.get('/template/:templateId/comments', commentController.getCommentsByTemplate);
console.log('✅ Đang tạo route: POST /template/:templateId/comments');
router.post('/template/:templateId/comments', authMiddleware, commentController.addCommentByTemplate);
console.log('✅ Đang tạo route: DELETE /comments/:id');
// router.get('/cv/:cvId/comments', commentController.getCommentsByCvId);
// router.post('/cv/:cvId/comments', authMiddleware, commentController.addCommentByCvId);
router.delete('/comments/:id', authMiddleware, commentController.deleteComment);

export default router;