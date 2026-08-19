import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;
let pool = null;

const getPoolConfig = () => ({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3307),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'hr_flow',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: false
});

const ensureDatabaseExists = async () => {
    const databaseName = process.env.DB_NAME || 'hr_flow';
    const config = getPoolConfig();

    const adminPool = mysql.createPool({
        host: config.host,
        port: config.port,
        user: config.user,
        password: config.password,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

    await adminPool.query(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\``);
    await adminPool.end();
};

export const getDb = async () => {
    if (!pool) {
        await ensureDatabaseExists();
        pool = mysql.createPool(getPoolConfig());
    }
    return pool;
};

const initializeDatabase = async () => {
    const db = await getDb();

    await db.query(`
        CREATE TABLE IF NOT EXISTS users (
            id INT PRIMARY KEY AUTO_INCREMENT,
            username VARCHAR(255) NOT NULL UNIQUE,
            email VARCHAR(255) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            role_id INT NOT NULL
        )
    `);

    const [userRows] = await db.query('SELECT COUNT(*) AS total FROM users');
    if (Number(userRows[0].total) === 0) {
        await db.query(`
            INSERT INTO users (username, email, password_hash, role_id)
            VALUES (?, ?, ?, ?)
        `, ['admin', 'admin@test.com', '$2b$10$micBhbUvbwlQN/tc2TuNr.l099BtBRlTXwuIc0sQgiPnUz47vQEXO', 1]);
    }
};

export const query = async (sql, params = []) => {
    const db = await getDb();
    try {
        const [rows] = await db.execute(sql, params);
        return rows;
    } catch (error) {
        console.error('Query error:', error);
        throw error;
    }
};

export const testConnection = async () => {
    try {
        const db = await getDb();
        await db.query('SELECT 1 AS ok');
        await initializeDatabase();
        console.log('✅ MySQL database connected successfully');
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        return false;
    }
};
