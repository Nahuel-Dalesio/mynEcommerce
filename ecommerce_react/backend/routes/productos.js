import express from "express";
import conexion from "../conexion.js";

const router = express.Router();

router.get("/", (req, res) => {
  const { categoria } = req.query;

  if (!categoria) {
    return res.status(400).json({ error: "categoria es obligatoria" });
  }

  const query = `SELECT 
  p.idProducto,
  p.nombre,
  p.descripcion,
  p.precio,
  p.stock,
  p.categoria,
  i.src AS imagen,
  i.esPrincipal
FROM producto p
LEFT JOIN imagenesproducto i ON i.idProducto = p.idProducto AND i.esPrincipal = 1
WHERE p.categoria = ?`;
  
  conexion.query(query, params, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }
    res.json(rows);
  });
});
export default router;
