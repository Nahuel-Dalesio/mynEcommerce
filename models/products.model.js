import  pool  from "../conexion.js";

export const createProduct = async (product) => {
  const { name, description, price, esDestacado, enOferta, precioOferta, categoria } = product;

  const [result] = await pool.query(
    "INSERT INTO products (name, description, price, esDestacado, enOferta, precioOferta, categoria) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [name, description, price, esDestacado, enOferta, precioOferta, categoria]
  );

  return result.insertId;
};
