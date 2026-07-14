import express from "express";
import { create, updateEstado, getAll } from "../controllers/pedido.controller.js";
import { verifyToken, isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", create);
router.get("/", [verifyToken, isAdmin], getAll);
router.patch("/:id/estado", [verifyToken, isAdmin], updateEstado);

export default router;