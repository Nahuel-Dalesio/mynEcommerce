import mysql from "mysql2/promise";

const pool = await mysql.createPool({
  uri: process.env.DATABASE_URL,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true, // <- Esto es clave
});

console.log("Pool MySQL listo");

export default pool;
