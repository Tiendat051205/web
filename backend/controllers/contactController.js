import { ContactModel } from '../models/ContactModel.js';

export const contactController = {
  // Gửi liên hệ mới
  async submitContact(req, res) {
    try {
      const userId = req.userId; // Lấy từ token
      const { subject, message } = req.body;

      if (!message) {
        return res.status(400).json({
          success: false,
          error: 'Vui lòng nhập nội dung'
        });
      }

      // Lưu vào database với userId
      const newContact = await ContactModel.create({
        userId,
        subject: subject || 'Khác',
        message: message.trim()
      });

      res.status(201).json({
        success: true,
        message: 'Gửi liên hệ thành công!',
        contactId: newContact.id
      });

    } catch (error) {
      console.error('❌ Lỗi submitContact:', error);
      res.status(500).json({
        success: false,
        error: 'Lỗi server, vui lòng thử lại sau'
      });
    }
  },

  // [Dành cho admin] Lấy danh sách liên hệ
  async getAllContacts(req, res) {
    try {
      const contacts = await ContactModel.getAll();
      res.json({
        success: true,
        count: contacts.length,
        contacts
      });
    } catch (error) {
      console.error('❌ Lỗi getAllContacts:', error);
      res.status(500).json({
        success: false,
        error: 'Lỗi lấy danh sách liên hệ'
      });
    }
  },

  // [Dành cho admin] Lấy chi tiết 1 liên hệ
  async getContactById(req, res) {
    try {
      const { id } = req.params;
      const contact = await ContactModel.getById(id);

      if (!contact) {
        return res.status(404).json({
          success: false,
          error: 'Không tìm thấy liên hệ'
        });
      }

      res.json({ success: true, contact });
    } catch (error) {
      console.error('❌ Lỗi getContactById:', error);
      res.status(500).json({
        success: false,
        error: 'Lỗi lấy chi tiết liên hệ'
      });
    }
  },

  // [Dành cho admin] Đánh dấu đã đọc
  async markAsRead(req, res) {
    try {
      const { id } = req.params;
      const updated = await ContactModel.markAsRead(id);

      if (!updated) {
        return res.status(404).json({
          success: false,
          error: 'Không tìm thấy liên hệ'
        });
      }

      res.json({
        success: true,
        message: 'Đã đánh dấu đã đọc'
      });
    } catch (error) {
      console.error('❌ Lỗi markAsRead:', error);
      res.status(500).json({
        success: false,
        error: 'Lỗi cập nhật trạng thái'
      });
    }
  },

  // [Dành cho admin] Xóa liên hệ
  async deleteContact(req, res) {
    try {
      const { id } = req.params;
      const deleted = await ContactModel.delete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: 'Không tìm thấy liên hệ'
        });
      }

      res.json({
        success: true,
        message: 'Xóa liên hệ thành công'
      });
    } catch (error) {
      console.error('❌ Lỗi deleteContact:', error);
      res.status(500).json({
        success: false,
        error: 'Lỗi xóa liên hệ'
      });
    }
  }
};