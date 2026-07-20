import pool from "../conexion.js";

// Inserta el detalle de envío de un pedido. Recibe la conexión (conn) de la
// transacción que ya está abierta en crearPedido, para que forme parte del
// mismo commit/rollback que el pedido y el detalle.
export async function crear(conn, idPedido, datos) {
  const {
    nombreZonaEnvio,
    costoEnvio,
    localidadEnvio,
    provinciaEnvio = null,
    codigoPostalEnvio = null,
    calle = null,
    altura = null,
    aclaracionesEnvio = null,
    sucursalPreferencia = null,
  } = datos;

  await conn.query(
    `INSERT INTO pedidoenvio
       (idPedido, nombreZonaEnvio, costoEnvio, localidadEnvio, provinciaEnvio,
        codigoPostalEnvio, calle, altura, aclaracionesEnvio, sucursalPreferencia)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      idPedido,
      nombreZonaEnvio,
      costoEnvio,
      localidadEnvio,
      provinciaEnvio,
      codigoPostalEnvio,
      calle,
      altura,
      aclaracionesEnvio,
      sucursalPreferencia,
    ]
  );
}

// Trae el detalle de envío de un pedido (null si era retiro y nunca se creó fila).
export async function obtenerPorPedido(idPedido) {
  const [rows] = await pool.query(
    `SELECT idPedido, nombreZonaEnvio, costoEnvio, localidadEnvio, provinciaEnvio,
            codigoPostalEnvio, calle, altura, aclaracionesEnvio, sucursalPreferencia
     FROM pedidoenvio
     WHERE idPedido = ?`,
    [idPedido]
  );
  return rows[0] || null;
}