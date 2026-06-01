import { CVModel } from '../models/CVModel.js';

export const cvController = {
  // Lấy danh sách CV của user (lịch sử)
  async getMyCVs(req, res) {
    try {
      const userId = req.userId;
      const cvs = await CVModel.findByUserId(userId);
      
      res.json({
        success: true,
        count: cvs.length,
        cvs: cvs
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ 
        success: false, 
        error: 'Lỗi lấy danh sách CV' 
      });
    }
  },

  // Lấy chi tiết 1 CV
  async getCVById(req, res) {
    try {
      const cvId = req.params.id;
      const userId = req.userId;
      
      const cv = await CVModel.findById(cvId, userId);
      
      if (!cv) {
        return res.status(404).json({ 
          success: false, 
          error: 'Không tìm thấy CV' 
        });
      }
      
      res.json({
        success: true,
        cv: cv
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ 
        success: false, 
        error: 'Lỗi lấy chi tiết CV' 
      });
    }
  },

  // Cập nhật CV
  async updateCV(req, res) {
    try {
      const cvId = req.params.id;
      const userId = req.userId;
      const updateData = req.body;
      
      const updated = await CVModel.update(cvId, userId, updateData);
      
      if (!updated) {
        return res.status(404).json({ 
          success: false, 
          error: 'Không tìm thấy CV hoặc không có quyền sửa' 
        });
      }
      
      res.json({
        success: true,
        message: 'Cập nhật CV thành công'
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ 
        success: false, 
        error: 'Lỗi cập nhật CV' 
      });
    }
  }
};