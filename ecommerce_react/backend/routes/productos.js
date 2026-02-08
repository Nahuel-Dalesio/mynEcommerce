import express from "express";
import conexion from "../conexion.js"; // Debe exportar un Pool de pg

const router = express.Router();

/* ===============================
   Funciones reutilizables
================================ */

async function obtenerProductosPorCategoria(categoria) {
  const query = `
    SELECT 
      p."idProducto",
      p.nombre,
      p.descripcion,
      p.precio,
      p.categoria,
      i.src AS imagen,
      i."esPrincipal"
    FROM producto p
    LEFT JOIN imagenesproducto i 
      ON i."idProducto" = p."idProducto" 
      AND i."esPrincipal" = 1
    WHERE p.categoria = $1
  `;

  try {
    const { rows } = await conexion.query(query, [categoria]);
    return rows;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function obtenerProductosDestacados() {
  const query = `
    SELECT 
      p."idProducto",
      p.nombre,
      p.descripcion,
      p.precio,
      p.categoria,
      i.src AS imagen,
      i."esPrincipal"
    FROM producto p
    LEFT JOIN imagenesproducto i 
      ON i."idProducto" = p."idProducto" 
      AND i."esPrincipal" = 1
    WHERE p."esDestacado" = 1
  `;

  const { rows } = await conexion.query(query);
  return rows;
}

async function obtenerImagenesPorProducto(idProducto) {
  const query = `
    SELECT src, "esPrincipal"
    FROM imagenesproducto
    WHERE "idProducto" = $1
    ORDER BY "esPrincipal" DESC
  `;

  const { rows } = await conexion.query(query, [idProducto]);
  return rows;
}

async function obtenerProductoPorId(idProducto) {
  const query = `
    SELECT
      p."idProducto",
      p.nombre,
      p.descripcion,
      p.precio,
      p."esDestacado",
      p."enOferta",
      p."precioOferta",
      p.categoria,
      pd."idProductoStock",
      pd.talle,
      pd.stock
    FROM producto p
    INNER JOIN productostock pd 
      ON pd."idProduct" = p."idProducto"
    WHERE p."idProducto" = $1
  `;

  const { rows } = await conexion.query(query, [idProducto]);
  return rows;
}

/* ===============================
   Rutas
================================ */

router.get("/categoria", async (req, res) => {
  try {
    const { categoria } = req.query;

    if (!categoria) {
      return res.status(400).json({ error: "categoria es obligatoria" });
    }

    const productos = await obtenerProductosPorCategoria(categoria);
    res.json(productos);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

router.get("/", async (_req, res) => {
  try {
    const productos = await obtenerProductosDestacados();
    res.json(productos);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/imagenes/:idProducto", async (req, res) => {
  try {
    const { idProducto } = req.params;
    const imagenes = await obtenerImagenesPorProducto(idProducto);
    res.json(imagenes);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
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
      imagenes: []
    };

    results.forEach(row => {
      producto.talles.push({
        idProductoTalle: row.idProductoStock,
        talle: row.talle,
        stock: row.stock
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
