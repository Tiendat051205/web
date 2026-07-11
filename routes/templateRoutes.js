import express from 'express';
import { templateController } from '../controllers/templateController.js';

const router = express.Router();

router.get('/templates', templateController.getAllTemplates);
router.get('/templates/:templateId', templateController.getTemplateById);

export default router;