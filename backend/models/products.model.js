import pool from "../conexion.js";
import { getStockByProducto } from "./stock.model.js";

// --- Lectura pública ---

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
  const producto = rows[0];
  if (!producto) return producto;

  const imagenes = await getImagesByProducto(id);
  producto.imagenes = imagenes.map((img) => img.src);

  const stockRows = await getStockByProducto(id);
  producto.stock = stockRows.map((row) => ({
    talle: row.talle,
    stock: row.stock,
  }));
  

  return producto;
};

export const getProductDetailById = async (idProducto) => {
  const query = `
    SELECT
      p.idProducto, p.nombre, p.descripcion, p.precio,
      p.esDestacado, p.enOferta, p.precioOferta,
      c.nombre AS categoria, p.activo,
      ps.idProductoStock, ps.talle, ps.stock
    FROM producto p
    INNER JOIN categoria c ON c.idCategoria = p.idCategoria
    INNER JOIN productostock ps ON ps.IdProduct = p.idProducto
    WHERE p.idProducto = ? AND p.activo = 1
  `;
  const [rows] = await pool.query(query, [idProducto]);
  return rows;
};

export const getProductsByCategoria = async (categoria) => {
  const query = `
    SELECT p.idProducto, p.nombre, p.descripcion, p.precio,
           c.nombre AS categoria, p.activo, i.src AS imagen, i.esPrincipal
    FROM producto p
    INNER JOIN categoria c ON c.idCategoria = p.idCategoria
    LEFT JOIN imagenesproducto i ON i.idProducto = p.idProducto AND i.esPrincipal = 1
    WHERE LOWER(c.nombre) = LOWER(?) AND p.activo = 1
  `;
  const [rows] = await pool.query(query, [categoria]);
  return rows;
};

export const getFeaturedProducts = async () => {
  const query = `
    SELECT p.idProducto, p.nombre, p.descripcion, p.precio,
           c.nombre AS categoria, p.activo, i.src AS imagen, i.esPrincipal
    FROM producto p
    INNER JOIN categoria c ON c.idCategoria = p.idCategoria
    LEFT JOIN imagenesproducto i ON i.idProducto = p.idProducto AND i.esPrincipal = 1
    WHERE p.esDestacado = 1 AND p.activo = 1
  `;
  const [rows] = await pool.query(query);
  return rows;
};

export const getImagesByProducto = async (idProducto) => {
  const query = `
    SELECT src, esPrincipal FROM imagenesproducto
    WHERE idProducto = ? ORDER BY esPrincipal DESC
  `;
  const [rows] = await pool.query(query, [idProducto]);
  return rows;
};

// --- Escritura (admin) ---

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

// --- Categorías ---

export const getCategoriasDisponibles = async () => {
  const query = `
    SELECT DISTINCT c.nombre
    FROM categoria c
    INNER JOIN producto p ON p.idCategoria = c.idCategoria
    WHERE p.activo = 1
    ORDER BY c.nombre ASC
  `;
  const [rows] = await pool.query(query);
  return rows.map((row) => row.nombre);
};

export const getCategoriasCompletas = async () => {
  const [rows] = await pool.query(`SELECT idCategoria, nombre FROM categoria ORDER BY nombre ASC`);
  return rows;
};

export const createCategoria = async (nombre) => {
  const [result] = await pool.query(`INSERT INTO categoria (nombre) VALUES (?)`, [nombre]);
  return result.insertId;
};