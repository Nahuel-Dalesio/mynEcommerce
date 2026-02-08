import pkg from "pg";
import dotenv from 'dotenv';

const { Pool } = pkg;

dotenv.config();

const conexion = new Pool ({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 3306,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

console.log('Pool PostgreSQL creado');

export default conexion;