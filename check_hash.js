import pool from "./conexion.js";

const checkAdminHash = async () => {
  const [rows] = await pool.query("SELECT email, password, LENGTH(password) as len FROM usuario WHERE email = 'admin@myn.com'");
  console.log(rows);
  process.exit(0);
};

checkAdminHash();
