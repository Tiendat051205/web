import mysql from 'mysql2';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'jobgenius';
const DB_PORT = process.env.DB_PORT || 3306;

const initDbConnection = async () => {
  const adminPool = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    port: DB_PORT,
    waitForConnections: true,
    connectionLimit: 1,
    queueLimit: 0
  });
  const adminDb = adminPool.promise();

  try {
    await adminDb.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  } finally {
    await adminPool.end();
  }

  const pool = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    port: DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  const db = pool.promise();

  const initDatabase = async () => {
    try {
      await db.query('SELECT 1');
      console.log('✅ MySQL connected');

      await db.execute(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          fullName VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await db.execute(`
        CREATE TABLE IF NOT EXISTS templates (
          id INT AUTO_INCREMENT PRIMARY KEY,
          templateId VARCHAR(100) NOT NULL UNIQUE,
          name VARCHAR(255) NOT NULL,
          category VARCHAR(255),
          description TEXT,
          thumbnail VARCHAR(255),
          isPremium TINYINT(1) DEFAULT 0,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await db.execute(`
        CREATE TABLE IF NOT EXISTS cvs (
          id INT AUTO_INCREMENT PRIMARY KEY,
          userId INT NOT NULL,
          templateId VARCHAR(100) NOT NULL,
          templateName VARCHAR(255) NOT NULL,
          fullName VARCHAR(255) NOT NULL,
          title VARCHAR(255) NOT NULL,
          phone VARCHAR(100),
          email VARCHAR(255) NOT NULL,
          address VARCHAR(255),
          careerObjective TEXT,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
        )
      `);

      await db.execute(`
        CREATE TABLE IF NOT EXISTS comments (
          id INT AUTO_INCREMENT PRIMARY KEY,
          templateName VARCHAR(255) NOT NULL,
          userId INT NOT NULL,
          text TEXT NOT NULL,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
        )
      `);

      const [templateCountRows] = await db.execute('SELECT COUNT(*) AS count FROM templates');
      if (templateCountRows[0].count === 0) {
        await db.query(`
          INSERT INTO templates (templateId, name, category, description, thumbnail, isPremium)
          VALUES ?
        `, [
          [
            ['professional_modern', 'Professional Modern', 'Modern', 'Mẫu CV hiện đại, bố cục rõ ràng, phù hợp với mọi ngành nghề.', 'https://picsum.photos/id/1/400/280', 1],
            ['classic_traditional', 'Classic Traditional', 'Traditional', 'Mẫu CV truyền thống, phù hợp với vị trí quản lý cấp cao.', 'https://picsum.photos/id/2/400/280', 0],
            ['creative_design', 'Creative Design', 'Creative', 'Mẫu CV sáng tạo, màu sắc ấn tượng, phù hợp ngành thiết kế.', 'https://picsum.photos/id/3/400/280', 1],
            ['minimal_clean', 'Minimal Clean', 'Minimal', 'Bố cục tối giản, tập trung vào nội dung, dễ đọc trên mọi thiết bị.', 'https://picsum.photos/id/4/400/280', 0],
            ['executive_pro', 'Executive Pro', 'Executive', 'Dành riêng cho vị trí cấp cao, nhấn mạnh thành tích nổi bật.', 'https://picsum.photos/id/5/400/280', 1],
            ['tech_developer', 'Tech Developer', 'IT', 'Nhấn mạnh kỹ năng kỹ thuật, dự án và công nghệ sử dụng.', 'https://picsum.photos/id/6/400/280', 0]
          ]
        ]);
        console.log('✅ Templates initialized');
      }
    } catch (error) {
      console.error('❌ MySQL initialization failed:', error.message || error);
    }
  };

  await initDatabase();
  return db;
};

const db = await initDbConnection();
export default db;
