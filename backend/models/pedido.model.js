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

export async function actualizarEstadoPedido(idPedido, estado) {
  const [result] = await pool.query(
    `UPDATE pedido SET estado = ? WHERE idPedido = ?`,
    [estado, idPedido],
  );
  return result.affectedRows;
}

export async function obtenerPedidos() {
  const [rows] = await pool.query(`
    SELECT p.idPedido, p.numeroPedido, p.fecha, p.estado, p.total,
           c.nombre, c.apellido, c.telefono
    FROM pedido p
    INNER JOIN cliente c ON c.idCliente = p.idCliente
    ORDER BY p.fecha DESC
  `);
  return rows;
}