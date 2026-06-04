import express from 'express';
import { commentController } from '../controllers/commentController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/comments/:templateName', commentController.getCommentsByTemplate);
router.post('/comments', authMiddleware, commentController.createComment);
router.delete('/comments/:id', authMiddleware, commentController.deleteComment);

export default router;
