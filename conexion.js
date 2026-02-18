import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config(); 

const pool = await mysql.createPool(
  process.env.DATABASE_URL,

  {
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true, // <- Esto es clave
});

console.log("Pool MySQL listo");

export default pool;
