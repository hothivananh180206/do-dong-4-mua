import mysql from 'mysql2/promise';

let pool;

if (!global.__mysqlPool) {
  global.__mysqlPool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : '',
    database: process.env.DB_NAME || 'do_dong_4_mua',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    decimalNumbers: true,
    charset: 'utf8mb4',
  });
}

pool = global.__mysqlPool;

export default pool;

export async function query(sql, params = []) {
  const [rows] = await pool.query(sql, params);
  return rows;
}

