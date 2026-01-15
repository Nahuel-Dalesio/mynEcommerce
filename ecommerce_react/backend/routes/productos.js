// import express from "express";
// import conexion from "../conexion.js";

// const router = express.Router();

// function obtenerProductosPorCategoria(categoria, callback) {
//   const query = `SELECT 
//   p.idProducto,
//   p.nombre,
//   p.descripcion,
//   p.precio,
//   p.stock,
//   p.categoria,
//   i.src AS imagen,
//   i.esPrincipal
// FROM producto p
// LEFT JOIN imagenesproducto i ON i.idProducto = p.idProducto AND i.esPrincipal = 1
// WHERE p.categoria = ?`;

//   conexion.query(query, [categoria], callback);
// }

// router.get("/", (req, res) => {
//   const { categoria } = req.query;

//   if (!categoria) {
//     return res.status(400).json({ error: "categoria es obligatoria" });
//   }

//   obtenerProductosPorCategoria(categoria, (err, rows) => {
//     if (err) {
//       return res.status(500).json(err);
//     }
//     res.json(rows);
//   });
// });

// function obtenerProductosDestacados(callback) {
//   const query = `SELECT 
//   p.idProducto,
//   p.nombre,
//   p.descripcion,
//   p.precio,
//   p.stock,
//   p.categoria,
//   i.src AS imagen,
//   i.esPrincipal
// FROM producto p
// LEFT JOIN imagenesproducto i ON i.idProducto = p.idProducto
// WHERE p.esDestacado = 1 AND i.esPrincipal = 1 `;

//   conexion.query(query, (err, rows) => {
//     if (err) return callback(err);
//     callback(null, rows);
//   });
// }
// router.get("/", (req, res) => {
//   obtenerProductosDestacados((err, rows) => {
//     if (err) {
//       return res.status(500).json(err);
//     }
//     res.json(rows);
//   });
// });


// export default router;

import express from "express";
import conexion from "../conexion.js";

const router = express.Router();

/* ===============================
   POR CATEGORÍA
================================ */
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

/* ===============================
   DESTACADOS (HOME)
================================ */
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

export default router;

