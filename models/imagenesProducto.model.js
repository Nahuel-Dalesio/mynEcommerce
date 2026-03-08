import pool from "../conexion.js";

export const createImagenProducto = async ({ src, esPrincipal, idProducto }) => {
  const [result] = await pool.query(
    "INSERT INTO imagenesproducto (src, esPrincipal, idProducto) VALUES (?, ?, ?)",
    [src, esPrincipal, idProducto]
  );

  return result.insertId;
};