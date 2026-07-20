import pool from "../conexion.js";

// Siempre hay una única fila (idConfigEnvio = 1). Se crea por seed/migración,
// nunca se inserta desde la app.
export async function obtener() {
  const [rows] = await pool.query(
    `SELECT idConfigEnvio, montoMinimoLocal, montoMinimoProvincias
     FROM configenvio
     WHERE idConfigEnvio = 1`
  );
  return rows[0] || null;
}

export async function actualizar({ montoMinimoLocal, montoMinimoProvincias }) {
  await pool.query(
    `UPDATE configenvio
     SET montoMinimoLocal = ?, montoMinimoProvincias = ?
     WHERE idConfigEnvio = 1`,
    [montoMinimoLocal, montoMinimoProvincias]
  );
  return obtener();
}