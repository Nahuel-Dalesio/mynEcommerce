//backend/controllers/adminEnvio.controller.js
import {
  obtenerTodas,
  obtenerPorId,
  existePorNombre,
  crear,
  actualizar as actualizarZona,
  TIPOS_VALIDOS_ZONA,
} from "../models/zonaEnvio.model.js";
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

export const createZona = async (req, res) => {
  const { nombre, tipo, costo, activo } = req.body;

  if (!nombre || !nombre.trim() || !tipo || costo === undefined) {
    return res.status(400).json({ error: "Datos incompletos" });
  }
  if (!TIPOS_VALIDOS_ZONA.includes(tipo)) {
    return res.status(400).json({
      error: `El tipo debe ser uno de: ${TIPOS_VALIDOS_ZONA.join(", ")}`,
    });
  }
  const costoNumerico = Number(costo);
  if (isNaN(costoNumerico) || costoNumerico < 0) {
    return res.status(400).json({ error: "El costo debe ser un número mayor o igual a 0" });
  }

  try {
    const yaExiste = await existePorNombre(nombre.trim());
    if (yaExiste) {
      return res.status(409).json({ error: "Ya existe una zona de envío con ese nombre" });
    }

    const zona = await crear({
      nombre: nombre.trim(),
      tipo,
      costo: costoNumerico,
      activo: activo === undefined ? 1 : Number(Boolean(activo)),
    });
    res.status(201).json(zona);
  } catch (error) {
    console.error("Error al crear zona:", error);
    res.status(500).json({ error: "Error DB" });
  }
};

export const updateZona = async (req, res) => {
  const { id } = req.params;
  const { nombre, tipo, costo, activo } = req.body;

  if (!nombre || !tipo || costo === undefined || activo === undefined) {
    return res.status(400).json({ error: "Datos incompletos" });
  }
  if (!TIPOS_VALIDOS_ZONA.includes(tipo)) {
    return res.status(400).json({
      error: `El tipo debe ser uno de: ${TIPOS_VALIDOS_ZONA.join(", ")}`,
    });
  }

  try {
    const zonaExistente = await obtenerPorId(id);
    if (!zonaExistente) {
      return res.status(404).json({ error: "Zona no encontrada" });
    }

    const zona = await actualizarZona(id, { nombre, tipo, costo, activo });
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