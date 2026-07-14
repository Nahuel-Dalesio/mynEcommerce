import pool from "../conexion.js";

export const findUserByEmail = async (email) => {
  const [rows] = await pool.query("SELECT * FROM usuario WHERE email = ?", [email]);
  return rows[0];
};

export const createUser = async ({ email, hashedPassword, nombre, apellido, telefono }) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [clienteResult] = await connection.query(
      "INSERT INTO cliente (nombre, apellido, telefono) VALUES (?, ?, ?)",
      [nombre, apellido, telefono]
    );
    const idCliente = clienteResult.insertId;

    const [usuarioResult] = await connection.query(
      "INSERT INTO usuario (email, password, rol, idCliente) VALUES (?, ?, 'user', ?)",
      [email, hashedPassword, idCliente]
    );

    await connection.commit();
    return usuarioResult.insertId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};