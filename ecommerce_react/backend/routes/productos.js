import express from "express";
import conexion from "../conexion.js";

const router = express.Router();

function obtenerProductosPorCategoria(categoria, callback) {
  const query = `
    SELECT 
      p.idProducto,
      p.nombre,
      p.descripcion,
      p.precio,
      p.stock,
      p.categoria,
      i.src AS imagen,
      i.esPrincipal
    FROM producto p
    LEFT JOIN imagenesproducto i 
      ON i.idProducto = p.idProducto 
      AND i.esPrincipal = 1
    WHERE p.categoria = ?
  `;

  conexion.query(query, [categoria], callback);
}

router.get("/categoria", (req, res) => {
  const { categoria } = req.query;

  if (!categoria) {
    return res.status(400).json({ error: "categoria es obligatoria" });
  }

  obtenerProductosPorCategoria(categoria, (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

function obtenerProductosDestacados(callback) {
  const query = `
    SELECT 
      p.idProducto,
      p.nombre,
      p.descripcion,
      p.precio,
      p.stock,
      p.categoria,
      i.src AS imagen,
      i.esPrincipal
    FROM producto p
    LEFT JOIN imagenesproducto i 
      ON i.idProducto = p.idProducto 
      AND i.esPrincipal = 1
    WHERE p.esDestacado = 1
  `;

  conexion.query(query, callback);
}

router.get("/", (_req, res) => {
  obtenerProductosDestacados((err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

function obtenerImagenesPorProducto(idProducto, callback) {
  const query = `
    SELECT src, esPrincipal
    FROM imagenesproducto
    WHERE idProducto = ?
    ORDER BY esPrincipal DESC
  `;

  conexion.query(query, [idProducto], (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
}
router.get("/imagenes/:idProducto", (req, res) => {
  const { idProducto } = req.params;

  obtenerImagenesPorProducto(idProducto, (err, imagenes) => {
    if (err) return res.status(500).json(err);
    res.json(imagenes);
  });
});

export default router;

