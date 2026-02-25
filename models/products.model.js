import pool from "../conexion.js";

export const getAllProducts = async () => {
  const [rows] = await pool.query("SELECT * FROM producto WHERE activo = 1");
  return rows;
};

export const getProductById = async (id) => {
  const [rows] = await pool.query("SELECT * FROM producto WHERE idProducto = ? AND activo = 1", [id]);
  return rows[0];
};

export const createProduct = async (product) => {
  const { nombre, descripcion, precio, esDestacado, enOferta, precioOferta, categoria } = product;
  const [result] = await pool.query(
    "INSERT INTO producto (nombre, descripcion, precio, esDestacado, enOferta, precioOferta, categoria, activo) VALUES (?, ?, ?, ?, ?, ?, ?, 1)",
    [nombre, descripcion, precio, esDestacado, enOferta, precioOferta, categoria]
  );
  return result.insertId;
};

export const updateProduct = async (id, product) => {
  const { nombre, descripcion, precio, esDestacado, enOferta, precioOferta, categoria } = product;
  const [result] = await pool.query(
    "UPDATE producto SET nombre = ?, descripcion = ?, precio = ?, esDestacado = ?, enOferta = ?, precioOferta = ?, categoria = ? WHERE idProducto = ?",
    [nombre, descripcion, precio, esDestacado, enOferta, precioOferta, categoria, id]
  );
  return result.affectedRows;
};

export const deleteProduct = async (id) => {
  // Soft delete setting activo = 0
  const [result] = await pool.query("UPDATE producto SET activo = 0 WHERE idProducto = ?", [id]);
  return result.affectedRows;
};
