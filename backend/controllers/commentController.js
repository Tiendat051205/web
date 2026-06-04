import { CommentModel } from '../models/CommentModel.js';

export const commentController = {
  async getCommentsByTemplate(req, res) {
    try {
      const templateName = String(req.params.templateName || '').trim();
      if (!templateName) {
        return res.status(400).json({ success: false, error: 'Thiếu tên mẫu CV' });
      }

      const comments = await CommentModel.findByTemplate(templateName);
      res.json({
        success: true,
        count: comments.length,
        comments
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        error: 'Lỗi lấy danh sách bình luận'
      });
    }
  },

  async createComment(req, res) {
    try {
      if (!req.userId) {
        return res.status(401).json({
          success: false,
          error: 'Chưa đăng nhập'
        });
      }

      const templateName = String(req.body.templateName || '').trim();
      const text = String(req.body.text || '').trim();

      if (!templateName || !text) {
        return res.status(400).json({
          success: false,
          error: 'Thiếu nội dung bình luận'
        });
      }

      const newComment = await CommentModel.create({
        templateName,
        userId: req.userId,
        text
      });

      res.status(201).json({
        success: true,
        message: 'Gửi bình luận thành công',
        commentId: newComment.id,
        comment: {
          id: newComment.id,
          templateName,
          userId: req.userId,
          userName: req.userName || 'Người dùng',
          text,
          createdAt: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        error: 'Lỗi tạo bình luận'
      });
    }
  },

  async deleteComment(req, res) {
    try {
      if (!req.userId) {
        return res.status(401).json({
          success: false,
          error: 'Chưa đăng nhập'
        });
      }

      const commentId = req.params.id;
      const deleted = await CommentModel.removeById(commentId, req.userId);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: 'Không tìm thấy bình luận hoặc không có quyền xóa'
        });
      }

      res.json({
        success: true,
        message: 'Xóa bình luận thành công'
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        error: 'Lỗi xóa bình luận'
      });
    }
  }
};
