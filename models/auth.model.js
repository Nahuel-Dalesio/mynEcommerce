import pool from "../conexion.js";

export const findUserByEmail = async (email) => {
  const [rows] = await pool.query("SELECT * FROM usuario WHERE email = ?", [email]);
  return rows[0];
};

export const createUser = async (email, hashedPassword) => {
  const [result] = await pool.query(
    "INSERT INTO usuario (email, password, rol) VALUES (?, ?, 'admin')",
    [email, hashedPassword]
  );
  return result.insertId;
};
