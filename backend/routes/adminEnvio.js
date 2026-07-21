//backend/routes/adminEnvio.routes.js
import { Router } from "express";
import { verifyToken, isAdmin } from "../middlewares/auth.middleware.js";
import { getZonas, createZona, updateZona, getConfig, updateConfig } from "../controllers/adminEnvio.controller.js";

const router = Router();

// Zonas (costeo interno)
router.get("/zonas", [verifyToken, isAdmin], getZonas);
router.post("/zonas", [verifyToken, isAdmin], createZona);
router.put("/zonas/:id", [verifyToken, isAdmin], updateZona);

// Configuración de montos mínimos
router.get("/config", [verifyToken, isAdmin], getConfig);
router.put("/config", [verifyToken, isAdmin], updateConfig);

export default router;