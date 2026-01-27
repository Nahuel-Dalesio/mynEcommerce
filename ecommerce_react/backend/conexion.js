import mysql from 'mysql2/promise';

const conexion = await mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'ecommersreact',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

console.log('Pool de MySQL creado');

export default conexion;
