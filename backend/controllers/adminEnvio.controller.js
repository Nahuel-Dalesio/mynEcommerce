//backend/controllers/adminEnvio.controller.js
import { obtenerTodas, obtenerPorId, actualizar as actualizarZona } from "../models/zonaEnvio.model.js";
import { obtener as obtenerConfig, actualizar as actualizarConfig } from "../models/configEnvio.model.js";

// --- Zonas ---
// El cliente ahora elige la zona directamente de un select en el checkout,
// así que estas son las únicas dos operaciones que necesita el admin:
// listar (para editar) y actualizar costo/nombre/activo.

export const getZonas = async (_req, res) => {
  try {
    const zonas = await obtenerTodas();
    res.json(zonas);
  } catch (error) {
    console.error("Error al listar zonas:", error);
    res.status(500).json({ error: "Error DB" });
  }
};

export const updateZona = async (req, res) => {
  const { id } = req.params;
  const { nombre, costo, activo } = req.body;

  if (!nombre || costo === undefined || activo === undefined) {
    return res.status(400).json({ error: "Datos incompletos" });
  }

  try {
    const zonaExistente = await obtenerPorId(id);
    if (!zonaExistente) {
      return res.status(404).json({ error: "Zona no encontrada" });
    }

    const zona = await actualizarZona(id, { nombre, costo, activo });
    res.json(zona);
  } catch (error) {
    console.error("Error al actualizar zona:", error);
    res.status(500).json({ error: "Error DB" });
  }
};

// --- Config (montos mínimos) ---

export const getConfig = async (_req, res) => {
  try {
    const config = await obtenerConfig();
    res.json(config);
  } catch (error) {
    console.error("Error al obtener config de envío:", error);
    res.status(500).json({ error: "Error DB" });
  }
};

export const updateConfig = async (req, res) => {
  const { montoMinimoLocal, montoMinimoProvincias } = req.body;

  if (montoMinimoLocal === undefined || montoMinimoProvincias === undefined) {
    return res.status(400).json({ error: "Datos incompletos" });
  }

  try {
    const config = await actualizarConfig({ montoMinimoLocal, montoMinimoProvincias });
    res.json(config);
  } catch (error) {
    console.error("Error al actualizar config de envío:", error);
    res.status(500).json({ error: "Error DB" });
  }
};