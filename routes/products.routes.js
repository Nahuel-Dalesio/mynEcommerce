import { Router } from "express";
import { getAll, getById, create, update, remove } from "../controllers/products.controller.js";
import { verifyToken, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// Públicas
router.get("/products", getAll);
router.get("/products/:id", getById);

// Protegidas (Solo Admin)
router.post("/products", [verifyToken, isAdmin], create);
router.put("/products/:id", [verifyToken, isAdmin], update);
router.delete("/products/:id", [verifyToken, isAdmin], remove);

export default router;
