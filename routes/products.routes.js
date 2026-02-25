import { Router } from "express";
import { getAll, getById, create, update, remove } from "../controllers/products.controller.js";

const router = Router();

router.get("/products", getAll);
router.get("/products/:id", getById);
router.post("/products", create);
router.put("/products/:id", update);
router.delete("/products/:id", remove);

export default router;
