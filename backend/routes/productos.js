// backend/routes/productos.js

import express from "express";
import pool from "../conexion.js";

const router = express.Router();

/* ===============================
   Funciones reutilizables
================================ */




async function obtenerProductosPorCategoria(categoria) {
  const query = `
    SELECT 
      p.idProducto,
      p.nombre,
      p.descripcion,
      p.precio,
      c.nombre AS categoria,
      p.activo,
      i.src AS imagen,
      i.esPrincipal
    FROM producto p
    INNER JOIN categoria c ON c.idCategoria = p.idCategoria
    LEFT JOIN imagenesproducto i 
      ON i.idProducto = p.idProducto 
      AND i.esPrincipal = 1
    WHERE LOWER(c.nombre) = LOWER(?) AND p.activo = 1
  `;

  const [rows] = await pool.query(query, [categoria]);
  return rows;
}

async function obtenerProductosDestacados() {
  const query = `
    SELECT 
      p.idProducto,
      p.nombre,
      p.descripcion,
      p.precio,
      c.nombre AS categoria,
      p.activo,
      i.src AS imagen,
      i.esPrincipal
    FROM producto p
    INNER JOIN categoria c ON c.idCategoria = p.idCategoria
    LEFT JOIN imagenesproducto i 
      ON i.idProducto = p.idProducto 
      AND i.esPrincipal = 1
    WHERE p.esDestacado = 1 and p.activo = 1
  `;

  const [rows] = await pool.query(query);
  return rows;
}

async function obtenerImagenesPorProducto(idProducto) {
  const query = `
    SELECT src, esPrincipal
    FROM imagenesproducto
    WHERE idProducto = ?
    ORDER BY esPrincipal DESC
  `;

  const [rows] = await pool.query(query, [idProducto]);
  return rows;
}

async function obtenerProductoPorId(idProducto) {
  const query = `
    SELECT
      p.idProducto,
      p.nombre,
      p.descripcion,
      p.precio,
      p.esDestacado,
      p.enOferta,
      p.precioOferta,
      c.nombre AS categoria,
      p.activo,
      ps.idProductoStock,
      ps.talle,
      ps.stock
    FROM producto p
    INNER JOIN categoria c ON c.idCategoria = p.idCategoria
    INNER JOIN productostock ps 
      ON ps.IdProduct = p.idProducto
    WHERE p.idProducto = ? and p.activo = 1
  `;

  const [rows] = await pool.query(query, [idProducto]);
  return rows;
}
async function obtenerCategorias() {
  const query = `
    SELECT DISTINCT c.nombre
    FROM categoria c
    INNER JOIN producto p ON p.idCategoria = c.idCategoria
    WHERE p.activo = 1
    ORDER BY c.nombre ASC
  `;
  const [rows] = await pool.query(query);
  return rows.map((row) => row.nombre);
}
async function obtenerCategoriasCompletas() {
  const query = `SELECT idCategoria, nombre FROM categoria ORDER BY nombre ASC`;
  const [rows] = await pool.query(query);
  return rows;
}
async function crearCategoria(nombre) {
  const query = `INSERT INTO categoria (nombre) VALUES (?)`;
  const [result] = await pool.query(query, [nombre]);
  return result.insertId;
}
/* ===============================
   Rutas
================================ */
router.post("/categorias", async (req, res) => {
  try {
    const { nombre } = req.body;
    if (!nombre || !nombre.trim()) {
      return res.status(400).json({ error: "El nombre de categoría es obligatorio" });
    }
    const idCategoria = await crearCategoria(nombre.trim());
    res.status(201).json({ idCategoria, nombre: nombre.trim() });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "Esa categoría ya existe" });
    }
    console.error(error);
    res.status(500).json({ error: "Error DB" });
  }
});

router.get("/categorias-admin", async (_req, res) => {
  try {
    const categorias = await obtenerCategoriasCompletas();
    res.json(categorias);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error DB" });
  }
});

router.get("/categoria", async (req, res) => {
  try {
    const { categoria } = req.query;

    if (!categoria) {
      return res.status(400).json({ error: "categoria es obligatoria" });
    }

    const productos = await obtenerProductosPorCategoria(categoria);
    res.json(productos);
  } catch (error) {
    console.error("Error al obtener productos por categoría:", error);
    res.status(500).json({ error: "Error DB" });
  }
});

router.get("/categorias-disponibles", async (_req, res) => {
  try {
    const categorias = await obtenerCategorias();
    res.json(categorias);
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    res.status(500).json({ error: "Error DB" });
  }
});

router.get("/", async (_req, res) => {
  try {
    const productos = await obtenerProductosDestacados();
    res.json(productos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error DB" });
  }
});

router.get("/imagenes/:idProducto", async (req, res) => {
  try {
    const { idProducto } = req.params;

    const imagenes = await obtenerImagenesPorProducto(idProducto);
    res.json(imagenes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error DB" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const results = await obtenerProductoPorId(id);

    if (results.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    const producto = {
      idProducto: results[0].idProducto,
      nombre: results[0].nombre,
      descripcion: results[0].descripcion,
      precio: results[0].precio,
      esDestacado: results[0].esDestacado,
      enOferta: results[0].enOferta,
      precioOferta: results[0].precioOferta,
      categoria: results[0].categoria,
      talles: [],
      imagenes: [],
    };

    results.forEach((row) => {
      producto.talles.push({
        idProductoTalle: row.idProductoStock,
        talle: row.talle,
        stock: row.stock,
      });
    });

    const imagenes = await obtenerImagenesPorProducto(id);
    producto.imagenes = imagenes;

    res.json(producto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error DB" });
  }
});

export default router;
