import express from 'express';
import { cvController } from '../controllers/cvController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/cvs', authMiddleware, cvController.getMyCVs);
router.get('/cv/:id', authMiddleware, cvController.getCVById);
router.post('/cvs', authMiddleware, cvController.createCV);
router.put('/cv/:id', authMiddleware, cvController.updateCV);

export default router;
