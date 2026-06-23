import express from 'express';
import { cvController } from '../controllers/cvController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Tất cả API CV đều cần đăng nhập
router.use(authMiddleware);

router.get('/cvs', cvController.getMyCVs);
router.get('/cv/:id', cvController.getCVById);
router.put('/cv/:id', cvController.updateCV);
router.post('/cv/create', cvController.createCV);
router.post('/cv/:id/export-pdf', cvController.exportPDF);
router.get('/cv/user/:templateId', cvController.getCVByUserAndTemplate);
router.get('/cv/:cvId/template', cvController.getTemplateIdByCvId);

export default router;