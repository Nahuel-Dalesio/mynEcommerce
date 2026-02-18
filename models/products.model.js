import  pool  from "../conexion.js";

export const createProduct = async (product) => {
  const { nombre, descripcion, precio, esDestacado, enOferta, precioOferta, categoria } = product;

  const [result] = await pool.query(
    "INSERT INTO producto (nombre, descripcion, precio, esDestacado, enOferta, precioOferta, categoria) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [nombre, descripcion, precio, esDestacado, enOferta, precioOferta, categoria]
  );

  return result.insertId;
};
