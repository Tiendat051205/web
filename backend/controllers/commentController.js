import db from '../config/database.js';

export const commentController = {
  // ✅ Lấy bình luận theo cvId
  // async getCommentsByCvId(req, res) {
  //   try {
  //     const { cvId } = req.params;
      
  //     if (!cvId) {
  //       return res.status(400).json({ success: false, error: 'Thiếu cvId' });
  //     }

  //     const [comments] = await db.execute(
  //       `SELECT c.id, c.cvId, c.userId, c.content, c.createdAt,
  //               u.fullName as authorName
  //        FROM comments c
  //        LEFT JOIN users u ON c.userId = u.id
  //        WHERE c.cvId = ?
  //        ORDER BY c.createdAt DESC`,
  //       [cvId]
  //     );

  //     res.json({
  //       success: true,
  //       count: comments.length,
  //       comments
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ success: false, error: 'Lỗi lấy bình luận' });
  //   }
  // },

  // // ✅ Thêm bình luận theo cvId
  // async addCommentByCvId(req, res) {
  //   try {
  //     if (!req.userId) {
  //       return res.status(401).json({ success: false, error: 'Chưa đăng nhập' });
  //     }

  //     const { cvId } = req.params;
  //     const { text } = req.body;
      
  //     console.log('📝 Nhận bình luận:', { cvId, userId: req.userId, text });

  //     if (!cvId || !text) {
  //       return res.status(400).json({
  //         success: false,
  //         error: 'Thiếu cvId hoặc nội dung bình luận'
  //       });
  //     }

  //     // Lấy tên người dùng
  //     const [users] = await db.execute(
  //       'SELECT fullName FROM users WHERE id = ?',
  //       [req.userId]
  //     );
  //     const authorName = users[0]?.fullName || 'Người dùng';

  //     // Lưu bình luận
  //     const [result] = await db.execute(
  //       `INSERT INTO comments (cvId, userId, content) VALUES (?, ?, ?)`,
  //       [cvId, req.userId, text]
  //     );

  //     // Lấy bình luận vừa tạo
  //     const [newComment] = await db.execute(
  //       `SELECT c.id, c.cvId, c.userId, c.content, c.createdAt,
  //               u.fullName as authorName
  //        FROM comments c
  //        LEFT JOIN users u ON c.userId = u.id
  //        WHERE c.id = ?`,
  //       [result.insertId]
  //     );

  //     res.status(201).json({
  //       success: true,
  //       message: 'Gửi bình luận thành công',
  //       comment: newComment[0]
  //     });
  //   } catch (error) {
  //     console.error('Lỗi thêm bình luận:', error);
  //     res.status(500).json({
  //       success: false,
  //       error: 'Lỗi tạo bình luận'
  //     });
  //   }
  // },
  // Lấy bình luận theo templateId (công khai)
async getCommentsByTemplate(req, res) {
  try {
    const { templateId } = req.params;
    
    const [comments] = await db.execute(
      `SELECT c.id, c.templateId, c.userId, c.content, c.createdAt,
              u.fullName as authorName
       FROM comments c
       LEFT JOIN users u ON c.userId = u.id
       WHERE c.templateId = ?
       ORDER BY c.createdAt DESC`,
      [templateId]
    );
    
    res.json({ success: true, comments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Lỗi lấy bình luận' });
  }
},

// Thêm bình luận theo templateId
async addCommentByTemplate(req, res) {
  try {
    if (!req.userId) {
      return res.status(401).json({ success: false, error: 'Chưa đăng nhập' });
    }
    
    const { templateId } = req.params;
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ success: false, error: 'Thiếu nội dung' });
    }
    
    await db.execute(
      'INSERT INTO comments (templateId, userId, content) VALUES (?, ?, ?)',
      [templateId, req.userId, text]
    );
    
    // Lấy comment vừa tạo
    const [newComment] = await db.execute(
      `SELECT c.id, c.templateId, c.userId, c.content, c.createdAt,
              u.fullName as authorName
       FROM comments c
       LEFT JOIN users u ON c.userId = u.id
       WHERE c.id = LAST_INSERT_ID()`
    );
    
    res.status(201).json({ success: true, comment: newComment[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Lỗi thêm bình luận' });
  }
},

  // Xóa bình luận (giữ nguyên)
  async deleteComment(req, res) {
    try {
      if (!req.userId) {
        return res.status(401).json({ success: false, error: 'Chưa đăng nhập' });
      }

      const commentId = req.params.id;
      
      const [result] = await db.execute(
        'DELETE FROM comments WHERE id = ? AND userId = ?',
        [commentId, req.userId]
      );
      
      if (result.affectedRows === 0) {
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