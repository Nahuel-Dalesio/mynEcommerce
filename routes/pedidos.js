import express from "express";
import pool from "../conexion.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { cliente, carrito, total } = req.body;

  if (!cliente || !carrito || !total) {
    return res.status(400).json({ error: "Datos incompletos" });
  }

  let conn;

  try {
    conn = await pool.getConnection();
    console.log("✅ CONEXIÓN OK");
    await conn.beginTransaction();

    // Normalizar datos
    const nombre = cliente.nombre.trim();
    const apellido = cliente.apellido.trim();
    let telefono = cliente.telefono.replace(/\D/g, "");

    if (telefono.length < 10 || telefono.length > 15) {
      return res.status(400).json({ error: "Número inválido" });
    }

    // 1️⃣ Buscar cliente
    const [clientes] = await conn.query(
      `SELECT idCliente FROM cliente
       WHERE nombre = ? AND apellido = ? AND telefono = ?`,
      [nombre, apellido, telefono],
    );

    let clienteId;

    if (clientes.length > 0) {
      clienteId = clientes[0].idCliente;
    } else {
      // Insertar cliente
      const [result] = await conn.query(
        `INSERT INTO cliente (nombre, apellido, telefono)
         VALUES (?, ?, ?)`,
        [nombre, apellido, telefono],
      );

      clienteId = result.insertId;
    }

    // 2️⃣ Obtener último pedido
    const [ultimo] = await conn.query(
      `SELECT MAX(numeroPedido) AS maxNum FROM pedido`,
    );

    let numeroPedido = 1;

    if (ultimo[0].maxNum !== null) {
      const incremento = Math.floor(Math.random() * 20) + 1;
      numeroPedido = Number(ultimo[0].maxNum) + incremento;
    }

    // 3️⃣ Insertar pedido
    const [pedidoResult] = await conn.query(
      `INSERT INTO pedido (idCliente, total, estado, numeroPedido)
       VALUES (?, ?, 'pendiente', ?)`,
      [clienteId, total, numeroPedido],
    );

    const pedidoId = pedidoResult.insertId;
    console.log("pedidoId:", pedidoId);
    // 4️⃣ Detalle pedido
    for (const p of carrito) {
      await conn.query(
        `INSERT INTO detallepedido
         (idPedido, idProducto, nombreProducto, talle, cantidad, precioUnitario)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [pedidoId, p.idProducto, p.nombre, p.talle, p.cantidad, Number(p.precio)],
      );
    }

    await conn.commit();

    res.json({ ok: true, pedidoId, numeroPedido });
  } catch (error) {
    await conn.rollback();

    console.error("Error pedido:", error);

    res.status(500).json({
      error: "No se pudo guardar el pedido",
    });
  } finally {
    conn.release();
  }
});

export default router;
