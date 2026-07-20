import pool from "../conexion.js";

// Devuelve todas las zonas (para el admin: incluye activas e inactivas)
export async function obtenerTodas() {
  const [rows] = await pool.query(
    `SELECT idZonaEnvio, nombre, tipo, costo, activo
     FROM zonaenvio
     ORDER BY idZonaEnvio ASC`
  );
  return rows;
}

// Devuelve solo las zonas activas (para uso interno al calcular costo de envío)
export async function obtenerActivas() {
  const [rows] = await pool.query(
    `SELECT idZonaEnvio, nombre, tipo, costo
     FROM zonaenvio
     WHERE activo = 1
     ORDER BY idZonaEnvio ASC`
  );
  return rows;
}

export async function obtenerPorId(idZonaEnvio) {
  const [rows] = await pool.query(
    `SELECT idZonaEnvio, nombre, tipo, costo, activo
     FROM zonaenvio
     WHERE idZonaEnvio = ?`,
    [idZonaEnvio]
  );
  return rows[0] || null;
}

// Solo se edita costo/activo (y nombre por si hace falta corregir un typo).
// No se crean ni eliminan zonas dinámicamente: son 5 filas fijas del negocio.
export async function actualizar(idZonaEnvio, { nombre, costo, activo }) {
  await pool.query(
    `UPDATE zonaenvio
     SET nombre = ?, costo = ?, activo = ?
     WHERE idZonaEnvio = ?`,
    [nombre, costo, activo, idZonaEnvio]
  );
  return obtenerPorId(idZonaEnvio);
}