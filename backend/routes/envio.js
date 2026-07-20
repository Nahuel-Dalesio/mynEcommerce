//backend/routes/envio.routes.js
import { Router } from "express";
import { getZonasDisponibles, calcularCosto } from "../controllers/envio.controller.js";

const router = Router();

router.get("/zonas", getZonasDisponibles);
router.post("/costo", calcularCosto);

export default router;