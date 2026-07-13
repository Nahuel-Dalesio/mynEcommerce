import pool from "../conexion.js";

export const getAllProducts = async () => {
  const [rows] = await pool.query(`
    SELECT p.*, c.nombre AS categoria
    FROM producto p
    INNER JOIN categoria c ON c.idCategoria = p.idCategoria
  `);
  return rows;
};

export const getProductById = async (id) => {
  const [rows] = await pool.query(`
    SELECT p.*, c.nombre AS categoria
    FROM producto p
    INNER JOIN categoria c ON c.idCategoria = p.idCategoria
    WHERE p.idProducto = ?
  `, [id]);
  return rows[0];
};
export const createProduct = async (product) => {
  const { nombre, descripcion, precio, esDestacado, enOferta, precioOferta, idCategoria } = product;
  const [result] = await pool.query(
    "INSERT INTO producto (nombre, descripcion, precio, esDestacado, enOferta, precioOferta, idCategoria, activo) VALUES (?, ?, ?, ?, ?, ?, ?, 1)",
    [nombre, descripcion, precio, esDestacado, enOferta, precioOferta, idCategoria]
  );
  return result.insertId;
};

export const updateProduct = async (id, product) => {
  const { nombre, descripcion, precio, esDestacado, enOferta, precioOferta, idCategoria } = product;
  const [result] = await pool.query(
    "UPDATE producto SET nombre = ?, descripcion = ?, precio = ?, esDestacado = ?, enOferta = ?, precioOferta = ?, idCategoria = ? WHERE idProducto = ?",
    [nombre, descripcion, precio, esDestacado, enOferta, precioOferta, idCategoria, id]
  );
  return result.affectedRows;
};

export const setProductActivo = async (id, activo) => {
  const [result] = await pool.query(
    "UPDATE producto SET activo = ? WHERE idProducto = ?",
    [activo ? 1 : 0, id]
  );
  return result.affectedRows;
};