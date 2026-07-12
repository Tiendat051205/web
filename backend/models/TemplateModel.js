import db from '../config/database.js';

export const TemplateModel = {
    async getAll() {
        const [rows] = await db.execute(
            'SELECT id, templateId, name, category, description, thumbnail, isPremium FROM templates ORDER BY id'
        );
        return rows;
    },

    async getByTemplateId(templateId) {
        const [rows] = await db.execute(
            'SELECT * FROM templates WHERE templateId = ?',
            [templateId]
        );
        return rows[0];
    }
};