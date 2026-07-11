// import db from '../config/database.js';

// function normalizeTemplateRef(templateId) {
//   if (templateId === undefined || templateId === null) return null;
//   const value = String(templateId).trim();
//   if (!value) return null;

//   const aliases = {
//     henry_simple: 'henry_simple',
//     henry_professional: 'henry_professional',
//     henry_traditional: 'henry_traditional',
//     henry_modern: 'henry_modern',
//     CV1: 'CV1',
//     CV2: 'CV2',
//     cv1: 'CV1',
//     cv2: 'CV2'
//   };

//   return aliases[value] || value;
// }

// function buildCommentQuery(templateId) {
//   const normalized = normalizeTemplateRef(templateId);
//   const values = [];
//   const clauses = [];

//   if (normalized) {
//     clauses.push('c.templateKey = ?');
//     values.push(normalized);
//   }

//   if (templateId !== undefined && templateId !== null && templateId !== '') {
//     const numericValue = Number(templateId);
//     if (!Number.isNaN(numericValue)) {
//       clauses.push('c.templateId = ?');
//       values.push(numericValue);
//     }
//   }

//   const whereClause = clauses.length ? `WHERE ${clauses.join(' OR ')}` : '';

//   return {
//     sql: `
//       SELECT c.id, c.templateId, c.templateKey, c.userId, c.content, c.createdAt,
//              COALESCE(u.fullName, c.authorName, 'Người dùng') AS authorName
//       FROM comments c
//       LEFT JOIN users u ON c.userId = u.id
//       ${whereClause}
//       ORDER BY c.createdAt DESC
//     `,
//     values
//   };
// }

// export const commentController = {
//   async getCommentsByTemplate(req, res) {
//     try {
//       const { templateId } = req.params;
//       const { sql, values } = buildCommentQuery(templateId);
//       const [comments] = await db.execute(sql, values);

//       res.json({ success: true, comments });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ success: false, error: 'Lỗi lấy bình luận' });
//     }
//   },

//   async addCommentByTemplate(req, res) {
//     try {
//       if (!req.userId) {
//         return res.status(401).json({ success: false, error: 'Chưa đăng nhập' });
//       }

//       const { templateId } = req.params;
//       const content = String(req.body?.text ?? req.body?.content ?? '').trim();
//       console.log('COMMENT POST', { templateId, userId: req.userId, body: req.body, auth: req.headers.authorization });

//       if (!content) {
//         return res.status(400).json({ success: false, error: 'Thiếu nội dung' });
//       }

//       const normalizedTemplateKey = normalizeTemplateRef(templateId);
//       const numericTemplateId = /^\d+$/.test(String(templateId)) ? Number(templateId) : null;
//       const authorName = req.userName || req.userEmail || 'Người dùng';

//       const [insertResult] = await db.execute(
//         'INSERT INTO comments (authorName, templateKey, templateId, userId, content) VALUES (?, ?, ?, ?, ?)',
//         [authorName, normalizedTemplateKey, numericTemplateId, req.userId, content]
//       );

//       const commentId = insertResult?.insertId;
//       const [newComment] = await db.execute(
//         `SELECT c.id, c.templateId, c.templateKey, c.userId, c.content, c.createdAt,
//                 COALESCE(u.fullName, c.authorName, 'Người dùng') AS authorName
//          FROM comments c
//          LEFT JOIN users u ON c.userId = u.id
//          WHERE c.id = ?`,
//         [commentId]
//       );

//       res.status(201).json({ success: true, comment: newComment[0] || {
//         id: commentId,
//         templateId: numericTemplateId,
//         templateKey: normalizedTemplateKey,
//         userId: req.userId,
//         content,
//         createdAt: new Date().toISOString(),
//         authorName
//       } });
//     } catch (error) {
//       console.error('COMMENT POST ERROR', error);
//       res.status(500).json({ success: false, error: error.message || 'Lỗi thêm bình luận' });
//     }
//   },

//   async deleteComment(req, res) {
//     try {
//       if (!req.userId) {
//         return res.status(401).json({ success: false, error: 'Chưa đăng nhập' });
//       }

//       const commentId = req.params.id;

//       const [result] = await db.execute(
//         'DELETE FROM comments WHERE id = ? AND userId = ?',
//         [commentId, req.userId]
//       );

//       if (result.affectedRows === 0) {
//         return res.status(404).json({
//           success: false,
//           error: 'Không tìm thấy bình luận hoặc không có quyền xóa'
//         });
//       }

//       res.json({
//         success: true,
//         message: 'Xóa bình luận thành công'
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ success: false, error: 'Lỗi xóa bình luận' });
//     }
//   }
// };
import { CommentModel } from '../models/CommentModel.js';

function normalizeTemplateRef(templateId) {
  if (templateId === undefined || templateId === null) return null;
  const value = String(templateId).trim();
  if (!value) return null;

  const aliases = {
    henry_simple: 'henry_simple',
    henry_professional: 'henry_professional',
    henry_traditional: 'henry_traditional',
    henry_modern: 'henry_modern',
    CV1: 'CV1',
    CV2: 'CV2',
    cv1: 'CV1',
    cv2: 'CV2'
  };

  return aliases[value] || value;
}

export const commentController = {
  // ===== LẤY BÌNH LUẬN =====
  async getCommentsByTemplate(req, res) {
    try {
      const { templateId } = req.params;
      const comments = await CommentModel.findByTemplate(templateId);

      res.json({ success: true, comments });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Lỗi lấy bình luận' });
    }
  },

  // ===== THÊM BÌNH LUẬN =====
  async addCommentByTemplate(req, res) {
    try {
      if (!req.userId) {
        return res.status(401).json({ success: false, error: 'Chưa đăng nhập' });
      }

      const { templateId } = req.params;
      const content = String(req.body?.text ?? req.body?.content ?? '').trim();
      const rating = req.body.rating ? parseInt(req.body.rating) : null;

      // Kiểm tra: phải có nội dung HOẶC rating
      if (!content && rating === null) {
        return res.status(400).json({
          success: false,
          error: 'Vui lòng nhập bình luận hoặc đánh giá sao'
        });
      }

      if (rating !== null && (rating < 1 || rating > 5)) {
        return res.status(400).json({
          success: false,
          error: 'Đánh giá phải từ 1 đến 5 sao'
        });
      }

      const normalizedTemplateKey = normalizeTemplateRef(templateId);
      const numericTemplateId = /^\d+$/.test(String(templateId)) ? Number(templateId) : null;
      const authorName = req.userName || req.userEmail || 'Người dùng';

      // ✅ GỌI MODEL, KHÔNG DÙNG db TRỰC TIẾP
      const result = await CommentModel.create({
        authorName,
        templateKey: normalizedTemplateKey,
        numericTemplateId,
        userId: req.userId,
        content: content || '',
        rating
      });

      // Lấy comment vừa tạo
      const newComment = await CommentModel.findById(result.id);

      res.status(201).json({
        success: true,
        comment: newComment || {
          id: result.id,
          templateId: numericTemplateId,
          templateKey: normalizedTemplateKey,
          userId: req.userId,
          content: content || '',
          rating,
          createdAt: new Date().toISOString(),
          authorName
        }
      });
    } catch (error) {
      console.error('COMMENT POST ERROR', error);
      res.status(500).json({ success: false, error: error.message || 'Lỗi thêm bình luận' });
    }
  },

  // ===== XÓA BÌNH LUẬN =====
  async deleteComment(req, res) {
    try {
      if (!req.userId) {
        return res.status(401).json({ success: false, error: 'Chưa đăng nhập' });
      }

      const commentId = req.params.id;
      
      // ✅ GỌI MODEL
      const deleted = await CommentModel.deleteById(commentId, req.userId);

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
      res.status(500).json({ success: false, error: 'Lỗi xóa bình luận' });
    }
  }
};