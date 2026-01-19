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

function obtenerProductoPorId(idProducto, callback) {
  const query = `
    SELECT
      p.idProducto,
      p.nombre,
      p.descripcion,
      p.precio,
      p.esDestacado,
      p.enOferta,
      p.precioOferta,
      p.categoria,
      pd.idProductoTalle,
      pd.talle,
      pd.stock
    FROM producto p
    INNER JOIN productotalle pd 
      ON pd.idProduct = p.idProducto
    WHERE p.idProducto = ?
  `;

  conexion.query(query, [idProducto], callback);
}
router.get("/:id", (req, res) => {
  const { id } = req.params;

  obtenerProductoPorId(id, (err, results) => {
    if (err) {
      console.error(err.sqlMessage);
      return res.status(500).json({ error: "Error de base de datos" });
    }

    if (!results || results.length === 0) {
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
      talles: []
    };

    results.forEach(row => {
      producto.talles.push({
        idProductoTalle: row.idProductoTalle,
        talle: row.talle,
        stock: row.stock
      });
    });

  obtenerImagenesPorProducto(id, (err, imagenes) => {
      if (err) return res.status(500).json(err);

      producto.imagenes = imagenes;
      res.json(producto);
    });
  });
});

export default router;

