// routes/products.routes.js — agregar las 2 rutas de categoría que eran admin
import { Router } from "express";
import {
  getAll,
  getById,
  create,
  update,
  toggleActivo,
  getCategoriasAdmin,
  postCategoria,
  getImagenesDisponibles,
} from "../controllers/products.controller.js";
import { verifyToken, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// OJO: esta ruta específica va ANTES de "/products/:id",
// si no, Express interpretaría "imagenes-disponibles" como un :id
router.get("/products/imagenes-disponibles", [verifyToken, isAdmin], getImagenesDisponibles);
router.get("/products", getAll);
router.get("/products/:id", getById);

router.post("/products", [verifyToken, isAdmin], create);
router.put("/products/:id", [verifyToken, isAdmin], update);
router.patch("/products/:id/activo", [verifyToken, isAdmin], toggleActivo);
router.get("/categorias-admin", [verifyToken, isAdmin], getCategoriasAdmin);
router.post("/categorias", [verifyToken, isAdmin], postCategoria);

export default router;