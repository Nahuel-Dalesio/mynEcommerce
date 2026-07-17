//backend/models/pedido.model.js
import pool from "../conexion.js";

async function generarNumeroPedidoUnico(conn) {
  let numeroPedido;
  let existe = true;

  while (existe) {
    numeroPedido = Math.floor(100000 + Math.random() * 900000);
    const [rows] = await conn.query(
      `SELECT idPedido FROM pedido WHERE numeroPedido = ?`,
      [numeroPedido],
    );
    existe = rows.length > 0;
  }

  return numeroPedido;
}

async function buscarOCrearCliente(conn, { nombre, apellido, telefono }) {
  const [clientes] = await conn.query(
    `SELECT idCliente FROM cliente WHERE nombre = ? AND apellido = ? AND telefono = ?`,
    [nombre, apellido, telefono],
  );

  if (clientes.length > 0) {
    return clientes[0].idCliente;
  }

  const [result] = await conn.query(
    `INSERT INTO cliente (nombre, apellido, telefono) VALUES (?, ?, ?)`,
    [nombre, apellido, telefono],
  );
  return result.insertId;
}

export async function crearPedido({ cliente, carrito, total }) {
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const nombre = cliente.nombre.trim();
    const apellido = cliente.apellido.trim();
    const telefono = cliente.telefono.replace(/\D/g, "");

    if (telefono.length < 10 || telefono.length > 15) {
      const error = new Error("Número de teléfono inválido");
      error.statusCode = 400;
      throw error;
    }

    const idCliente = await buscarOCrearCliente(conn, { nombre, apellido, telefono });
    const numeroPedido = await generarNumeroPedidoUnico(conn);

    const [pedidoResult] = await conn.query(
      `INSERT INTO pedido (idCliente, total, estado, numeroPedido) VALUES (?, ?, 'pendiente', ?)`,
      [idCliente, total, numeroPedido],
    );
    const idPedido = pedidoResult.insertId;

    for (const p of carrito) {
      await conn.query(
        `INSERT INTO detallepedido (idPedido, idProducto, nombreProducto, talle, cantidad, precioUnitario)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [idPedido, p.idProducto, p.nombre, p.talle, p.cantidad, Number(p.precio)],
      );
    }

    await conn.commit();
    return { idPedido, numeroPedido };
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}

// --- Transiciones de estado ---

// Qué estados se puede pasar desde cada estado actual.
// pendiente y confirmado son los únicos "vivos"; entregado y cancelado son finales.
export const TRANSICIONES_VALIDAS = {
  pendiente: ["confirmado", "cancelado"],
  confirmado: ["entregado", "cancelado"],
  entregado: [],
  cancelado: [],
};

export async function obtenerEstadoPedido(idPedido) {
  const [rows] = await pool.query(
    `SELECT estado FROM pedido WHERE idPedido = ?`,
    [idPedido],
  );
  return rows[0]?.estado || null;
}

export async function actualizarEstadoPedido(idPedido, estado) {
  // Registramos la fecha del evento correspondiente, según a qué estado
  // se está pasando (para poder mostrarla en el panel y, en el caso de
  // "cancelado", para calcular el plazo de borrado automático).
  let query;
  if (estado === "cancelado") {
    query = `UPDATE pedido SET estado = ?, fechaCancelado = NOW() WHERE idPedido = ?`;
  } else if (estado === "entregado") {
    query = `UPDATE pedido SET estado = ?, fechaEntregado = NOW() WHERE idPedido = ?`;
  } else {
    query = `UPDATE pedido SET estado = ? WHERE idPedido = ?`;
  }

  const [result] = await pool.query(query, [estado, idPedido]);
  return result.affectedRows;
}

export async function obtenerPedidos() {
  const [rows] = await pool.query(`
    SELECT p.idPedido, p.numeroPedido, p.fecha, p.estado, p.total, p.fechaCancelado, p.fechaEntregado,
           c.nombre, c.apellido, c.telefono
    FROM pedido p
    INNER JOIN cliente c ON c.idCliente = p.idCliente
    ORDER BY p.fecha DESC
  `);
  return rows;
}

// --- Vencimientos automáticos (usados por el cron job) ---

// Pendientes hace más de 7 días -> se cancelan solos.
export async function cancelarPendientesVencidos() {
  const [result] = await pool.query(`
    UPDATE pedido
    SET estado = 'cancelado', fechaCancelado = NOW()
    WHERE estado = 'pendiente'
      AND fecha <= NOW() - INTERVAL 7 DAY
  `);
  return result.affectedRows;
}

// Cancelados hace más de 2 meses -> se borran (primero el detalle, por la FK).
export async function eliminarCanceladosVencidos() {
  const [pedidosVencidos] = await pool.query(`
    SELECT idPedido FROM pedido
    WHERE estado = 'cancelado'
      AND fechaCancelado IS NOT NULL
      AND fechaCancelado <= NOW() - INTERVAL 2 MONTH
  `);

  if (pedidosVencidos.length === 0) return 0;

  const ids = pedidosVencidos.map((p) => p.idPedido);

  await pool.query(`DELETE FROM detallepedido WHERE idPedido IN (?)`, [ids]);
  const [result] = await pool.query(`DELETE FROM pedido WHERE idPedido IN (?)`, [ids]);

  return result.affectedRows;
}