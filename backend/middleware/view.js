import db from '../config/database.js';

export const trackViews = async (req, res, next) => {
  // Lấy thông tin từ request
  const page = req.originalUrl || req.url || 'unknown';
  const ip = req.ip || req.connection?.remoteAddress || 'unknown';
  const userAgent = req.headers['user-agent'] || '';

  // Chỉ track các trang HTML, không track API
  const isApi = page.startsWith('/api');
  const isStatic = page.match(/\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf)$/i);
  
  // Bỏ qua API và file tĩnh để tránh tràn dữ liệu
  if (!isApi && !isStatic) {
    try {
      await db.execute(
        'INSERT INTO page_views (page, ip, userAgent) VALUES (?, ?, ?)',
        [page, ip, userAgent]
      );
    } catch (error) {
      // Chỉ log lỗi, không làm hỏng request
      console.error('❌ Lỗi track view:', error.message);
    }
  }

  next();
};