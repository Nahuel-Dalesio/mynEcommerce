// routes/productos.js — dejar solo lo verdaderamente público
import express from "express";
import {
  getFeatured,
  getByCategoria,
  getDetalle,
  getImagenes,
  getCategorias,
} from "../controllers/products.controller.js";

const router = express.Router();

router.get("/categoria", getByCategoria);
router.get("/categorias-disponibles", getCategorias);
router.get("/", getFeatured);
router.get("/imagenes/:idProducto", getImagenes);
router.get("/:id", getDetalle);

export default router;