// const jwt = require('jsonwebtoken');

// function checkAuth(req, res, next) {
//   const token = req.headers.authorization?.replace('Bearer ', '');
  
//   if (!token) {
//     return res.status(401).json({ success: false, error: 'Chưa đăng nhập' });
//   }
  
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.userId = decoded.userId;
//     req.userEmail = decoded.email;
//     req.userName = decoded.fullName;
//     next();
//   } catch (error) {
//     return res.status(401).json({ success: false, error: 'Token không hợp lệ' });
//   }
// }

// module.exports = checkAuth;
import jwt from 'jsonwebtoken';

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || req.headers.Authorization || req.headers['x-access-token'];
  const token = typeof authHeader === 'string' && authHeader.startsWith('Bearer ')
    ? authHeader.slice(7).trim()
    : typeof authHeader === 'string'
      ? authHeader.trim()
      : '';

  console.log('AUTH DEBUG', { authHeader, tokenPresent: Boolean(token), path: req.originalUrl });

  if (!token) {
    return res.status(401).json({ success: false, error: 'Chưa đăng nhập' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    req.userName = decoded.fullName || decoded.name || decoded.email;
    next();
  } catch (error) {
    console.error('AUTH ERROR', error.message);
    return res.status(401).json({ success: false, error: 'Token không hợp lệ' });
  }
}