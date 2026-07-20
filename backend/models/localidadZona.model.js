import pool from "../conexion.js";

// Dada una localidad, trae su zona asignada (si existe). Si no hay fila,
// se interpreta como "no mapeada" -> el llamador debe asumir Provincias.
export async function obtenerZonaPorLocalidad(idLocalidad) {
  const [rows] = await pool.query(
    `SELECT lz.idLocalidad, z.idZonaEnvio, z.nombre, z.tipo, z.costo, z.activo
     FROM localidadzona lz
     JOIN zonaenvio z ON z.idZonaEnvio = lz.idZonaEnvio
     WHERE lz.idLocalidad = ?`,
    [idLocalidad]
  );
  return rows[0] || null;
}

// Upsert: una localidad solo puede tener una zona asignada a la vez.
// Requiere constraint UNIQUE en localidadzona.idLocalidad.
export async function asignarZona(idLocalidad, idZonaEnvio) {
  await pool.query(
    `INSERT INTO localidadzona (idLocalidad, idZonaEnvio)
     VALUES (?, ?)
     ON DUPLICATE KEY UPDATE idZonaEnvio = VALUES(idZonaEnvio)`,
    [idLocalidad, idZonaEnvio]
  );
  return obtenerZonaPorLocalidad(idLocalidad);
}

export async function quitarAsignacion(idLocalidad) {
  await pool.query(
    `DELETE FROM localidadzona WHERE idLocalidad = ?`,
    [idLocalidad]
  );
}

// Listado para el panel admin: localidades ya mapeadas, con su zona.
export async function listarMapeadas() {
  const [rows] = await pool.query(
    `SELECT l.idLocalidad, l.localidad, l.provincia, l.codigoPostal,
            z.idZonaEnvio, z.nombre AS nombreZona
     FROM localidadzona lz
     JOIN localidad l ON l.idLocalidad = lz.idLocalidad
     JOIN zonaenvio z ON z.idZonaEnvio = lz.idZonaEnvio
     ORDER BY l.localidad ASC`
  );
  return rows;
}