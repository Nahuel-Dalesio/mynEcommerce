import pool from "../conexion.js";

// Nota: la columna se llama "IdProduct" en productostock (inconsistencia de
// nombre pendiente de normalizar junto con el resto de la tabla).

export const getStockByProducto = async (idProducto) => {
  const [rows] = await pool.query(
    `SELECT idProductoStock, talle, stock FROM productostock WHERE IdProduct = ?`,
    [idProducto],
  );
  return rows;
};

export const deleteStockByProducto = async (idProducto) => {
  const [result] = await pool.query(
    `DELETE FROM productostock WHERE IdProduct = ?`,
    [idProducto],
  );
  return result.affectedRows;
};

export const upsertStockRow = async ({ idProducto, talle, stock }) => {
  const [result] = await pool.query(
    `INSERT INTO productostock (IdProduct, talle, stock)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE stock = VALUES(stock)`,
    [idProducto, talle, stock],
  );
  return result.insertId;
};