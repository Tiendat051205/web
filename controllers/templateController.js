import { TemplateModel } from '../models/TemplateModel.js';

export const templateController = {
    async getAllTemplates(req, res) {
        try {
            const templates = await TemplateModel.getAll();
            res.json({ success: true, count: templates.length, templates });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: 'Lỗi lấy danh sách mẫu CV' });
        }
    },

    async getTemplateById(req, res) {
        try {
            const template = await TemplateModel.getByTemplateId(req.params.templateId);
            if (!template) {
                return res.status(404).json({ success: false, error: 'Không tìm thấy mẫu CV' });
            }
            res.json({ success: true, template });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: 'Lỗi lấy chi tiết mẫu CV' });
        }
    }
};