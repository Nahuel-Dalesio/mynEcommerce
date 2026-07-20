import pool from "../conexion.js";

// Busca localidades por código postal. Puede devolver 0, 1 o varias filas
// (un mismo CP de 4 dígitos puede corresponder a más de una localidad).
export async function buscarPorCodigoPostal(codigoPostal) {
  const [rows] = await pool.query(
    `SELECT idLocalidad, codigoPostal, localidad, provincia
     FROM localidad
     WHERE codigoPostal = ?
     ORDER BY localidad ASC`,
    [codigoPostal]
  );
  return rows;
}

export async function obtenerPorId(idLocalidad) {
  const [rows] = await pool.query(
    `SELECT idLocalidad, codigoPostal, localidad, provincia
     FROM localidad
     WHERE idLocalidad = ?`,
    [idLocalidad]
  );
  return rows[0] || null;
}

// Buscador libre para el panel admin (pantalla de mapeo localidad -> zona)
export async function buscarPorNombre(texto) {
  const like = `%${texto}%`;
  const [rows] = await pool.query(
    `SELECT idLocalidad, codigoPostal, localidad, provincia
     FROM localidad
     WHERE localidad LIKE ? OR provincia LIKE ?
     ORDER BY localidad ASC
     LIMIT 50`,
    [like, like]
  );
  return rows;
}

// Alta manual desde el admin, para completar lo que falte en la base
// importada (o mientras no haya import todavía). No hay constraint UNIQUE
// en la tabla, así que se chequea acá para no duplicar la misma combinación
// exacta si el admin la carga sin querer dos veces.
export async function crear({ codigoPostal, localidad, provincia }) {
  const [existentes] = await pool.query(
    `SELECT idLocalidad FROM localidad
     WHERE codigoPostal = ? AND localidad = ? AND provincia = ?`,
    [codigoPostal, localidad, provincia]
  );
  if (existentes.length > 0) {
    const error = new Error("Esa localidad ya existe con ese código postal");
    error.statusCode = 409;
    throw error;
  }

  const [result] = await pool.query(
    `INSERT INTO localidad (codigoPostal, localidad, provincia) VALUES (?, ?, ?)`,
    [codigoPostal, localidad, provincia]
  );
  return obtenerPorId(result.insertId);
}