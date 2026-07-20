//backend/models/envio.model.js

// Recibe "db" (pool para consultas sueltas, o la conn de una transacción
// abierta, ya que pool.query y conn.query tienen la misma firma).
//
// El cliente elige la zona directamente de un select, así que acá ya no hay
// resolución de localidad: solo se valida que la zona exista/esté activa y
// que el total alcance el mínimo correspondiente a su tipo.
//
// Devuelve { disponible, costoEnvio, nombreZonaEnvio, tipo, faltante }
// o lanza error 404 si la zona no existe/no está activa.
export async function calcularCostoEnvio(db, { idZonaEnvio, total }) {
  const [zonaRows] = await db.query(
    `SELECT idZonaEnvio, nombre, tipo, costo FROM zonaenvio WHERE idZonaEnvio = ? AND activo = 1`,
    [idZonaEnvio],
  );
  const zona = zonaRows[0];
  if (!zona) {
    const error = new Error("Zona inválida o no disponible");
    error.statusCode = 404;
    throw error;
  }

  const [configRows] = await db.query(
    `SELECT montoMinimoLocal, montoMinimoProvincias FROM configenvio WHERE idConfigEnvio = 1`,
  );
  const config = configRows[0];

  const montoMinimo =
    zona.tipo === "domicilio" ? Number(config.montoMinimoLocal) : Number(config.montoMinimoProvincias);

  const disponible = Number(total) >= montoMinimo;

  return {
    disponible,
    costoEnvio: disponible ? Number(zona.costo) : null,
    nombreZonaEnvio: zona.nombre,
    tipo: zona.tipo,
    faltante: disponible ? 0 : Number((montoMinimo - Number(total)).toFixed(2)),
  };
}

// Igual que calcularCostoEnvio, pero corta con error si no está disponible
// (para usar dentro de crearPedido, donde no tiene sentido persistir un
// pedido "no disponible" y hay que rechazarlo directamente).
export async function calcularCostoEnvioOFallar(db, { idZonaEnvio, total }) {
  const resultado = await calcularCostoEnvio(db, { idZonaEnvio, total });
  if (!resultado.disponible) {
    const error = new Error(
      resultado.tipo === "domicilio"
        ? `El monto mínimo para envío a domicilio no fue alcanzado (faltan $${resultado.faltante})`
        : `El monto mínimo para envío a Provincias no fue alcanzado (faltan $${resultado.faltante})`,
    );
    error.statusCode = 400;
    throw error;
  }
  return resultado;
}