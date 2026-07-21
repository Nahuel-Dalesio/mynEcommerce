import express from "express";
import { create, updateEstado, getAll } from "../controllers/pedido.controller.js";
import { verifyToken, optionalAuth, isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", optionalAuth, create);
router.get("/", [verifyToken, isAdmin], getAll);
router.patch("/:id/estado", [verifyToken, isAdmin], updateEstado);

export default router;