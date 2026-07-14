// backend/scripts/create-admin.js
//
// Uso: node scripts/create-admin.js <email> <password>

import bcrypt from "bcryptjs";
import pool from "../conexion.js";

const [, , email, password] = process.argv;

if (!email || !password) {
  console.error("Uso: node scripts/create-admin.js <email> <password>");
  process.exit(1);
}

const run = async () => {
  try {
    const [existentes] = await pool.query(
      "SELECT idUsuario FROM usuario WHERE email = ?",
      [email],
    );

    if (existentes.length > 0) {
      console.error(`Ya existe un usuario con el email ${email}`);
      process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      "INSERT INTO usuario (email, password, rol, idCliente) VALUES (?, ?, 'admin', NULL)",
      [email, hashedPassword],
    );

    console.log(`Admin creado correctamente. idUsuario: ${result.insertId}`);
    process.exit(0);
  } catch (error) {
    console.error("Error al crear admin:", error.message);
    process.exit(1);
  }
};

run();