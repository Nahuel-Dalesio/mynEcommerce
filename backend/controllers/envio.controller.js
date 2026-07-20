//backend/controllers/envio.controller.js
import pool from "../conexion.js";
import { obtenerActivas } from "../models/zonaEnvio.model.js";
import { calcularCostoEnvio } from "../models/envio.model.js";

// Listado público de zonas activas, para poblar el <select> del checkout.
// No expone nada más allá de lo que el cliente necesita ver.
export const getZonasDisponibles = async (_req, res) => {
  try {
    const zonas = await obtenerActivas();
    res.json(zonas.map((z) => ({ idZonaEnvio: z.idZonaEnvio, nombre: z.nombre, tipo: z.tipo, costo: z.costo })));
  } catch (error) {
    console.error("Error al listar zonas:", error);
    res.status(500).json({ error: "Error DB" });
  }
};

export const calcularCosto = async (req, res) => {
  const { idZonaEnvio, total } = req.body;

  if (!idZonaEnvio || total === undefined || total === null) {
    return res.status(400).json({ error: "Datos incompletos" });
  }

  try {
    const resultado = await calcularCostoEnvio(pool, { idZonaEnvio, total });
    res.json({
      disponible: resultado.disponible,
      costoEnvio: resultado.costoEnvio,
      tipo: resultado.tipo,
      faltante: resultado.faltante,
    });
  } catch (error) {
    console.error("Error cálculo de costo de envío:", error);
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message || "Error DB" });
  }
};