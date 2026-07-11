import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'jobgenius',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const db = pool.promise();

// Kiểm tra kết nối
const testConnection = async () => {
    try {
        await db.query('SELECT 1');
        console.log('✅ MySQL connected');
    } catch (error) {
        console.error('❌ MySQL connection failed:', error.message);
    }
};

testConnection();

export default db;