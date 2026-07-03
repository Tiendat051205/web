import { AdminModel } from '../models/AdminModel.js';

export const adminController = {
  // ===== STATS =====
  async getStats(req, res) {
    try {
      const totalUsers = await AdminModel.getTotalUsers();
      const totalCVs = await AdminModel.getTotalCVs();
      const totalComments = await AdminModel.getTotalComments();
      const totalViews = await AdminModel.getTotalViews();

      res.json({
        success: true,
        stats: { totalUsers, totalCVs, totalComments, totalViews }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Lỗi lấy thống kê' });
    }
  },

  // ===== VIEWS =====
  async getViewsByPage(req, res) {
    try {
      const views = await AdminModel.getViewsByPage();
      res.json({ success: true, views });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Lỗi lấy view' });
    }
  },

  // ===== TEMPLATES =====
  async getAllTemplates(req, res) {
    try {
      const templates = await AdminModel.getAllTemplates();
      res.json({ success: true, templates });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Lỗi lấy templates' });
    }
  },

  async updateTemplate(req, res) {
    try {
      const { templateId } = req.params;
      const { name, description } = req.body;

      if (!name) {
        return res.status(400).json({ success: false, error: 'Tên không được để trống' });
      }

      const updated = await AdminModel.updateTemplate(templateId, { name, description });

      if (!updated) {
        return res.status(404).json({ success: false, error: 'Không tìm thấy template' });
      }

      res.json({ success: true, message: 'Cập nhật thành công' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Lỗi cập nhật' });
    }
  },

  // ===== COMMENTS =====
  async getAllComments(req, res) {
    try {
      const comments = await AdminModel.getAllComments();
      res.json({ success: true, comments });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Lỗi lấy bình luận' });
    }
  },

  async deleteComment(req, res) {
    try {
      const { id } = req.params;
      const deleted = await AdminModel.deleteComment(id);

      if (!deleted) {
        return res.status(404).json({ success: false, error: 'Không tìm thấy bình luận' });
      }

      res.json({ success: true, message: 'Xóa thành công' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Lỗi xóa bình luận' });
    }
  },

  // ===== CONTACTS =====
  async getAllContacts(req, res) {
    try {
      const contacts = await AdminModel.getAllContacts();
      res.json({ success: true, contacts });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Lỗi lấy liên hệ' });
    }
  },

  async deleteContact(req, res) {
    try {
      const { id } = req.params;
      const deleted = await AdminModel.deleteContact(id);

      if (!deleted) {
        return res.status(404).json({ success: false, error: 'Không tìm thấy liên hệ' });
      }

      res.json({ success: true, message: 'Xóa thành công' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Lỗi xóa liên hệ' });
    }
  },

  async markContactRead(req, res) {
    try {
      const { id } = req.params;
      const updated = await AdminModel.markContactAsRead(id);

      if (!updated) {
        return res.status(404).json({ success: false, error: 'Không tìm thấy liên hệ' });
      }

      res.json({ success: true, message: 'Đã đánh dấu đã đọc' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Lỗi cập nhật' });
    }
  }
};