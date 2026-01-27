import express from "express";
import conexion from "../conexion.js";

const router = express.Router();
// router.get("/", async (req, res) => {
//   try {
//     const [pedidos] = await conexion.query(
//       `SELECT p.idPedido, c.nombre, c.apellido, c.telefono, p.total, p.estado
//        FROM pedido p
//        JOIN cliente c ON p.idCliente = c.idCliente`
//     );
//     res.json(pedidos);
//   } catch (error) {
//     console.error("Error al obtener pedidos:", error);
//     res.status(500).json({ error: "No se pudieron obtener los pedidos" });
//   }
// });

router.post("/", async (req, res) => {
  const { cliente, carrito, total } = req.body;

  if (!cliente || !carrito || !total) {
    return res.status(400).json({ error: "Datos incompletos" });
  }

  try {
    // Normalizar los datos para evitar problemas de mayúsculas/espacios
    const nombre = cliente.nombre.trim();
    const apellido = cliente.apellido.trim();
    const telefono = cliente.telefono.trim();

    // 1️⃣ Verificar si ya existe un cliente con todos los datos exactos
    const [rows] = await conexion.query(
      `SELECT idCliente FROM cliente 
       WHERE nombre = ? AND apellido = ? AND telefono = ?`,
      [nombre, apellido, telefono]
    );

    let clienteId;

    if (rows.length > 0) {
      // Cliente ya existe, usamos su ID
      clienteId = rows[0].idCliente;
    } else {
      // Cliente no existe, insertamos uno nuevo
      const [clienteResult] = await conexion.query(
        `INSERT INTO cliente (nombre, apellido, telefono)
         VALUES (?, ?, ?)`,
        [nombre, apellido, telefono]
      );
      clienteId = clienteResult.insertId;
    }

    // 2️⃣ Guardar pedido
    const [pedidoResult] = await conexion.query(
      `INSERT INTO pedido (idCliente, total, estado)
       VALUES (?, ?, 'pendiente')`,
      [clienteId, total]
    );

    const pedidoId = pedidoResult.insertId;

    // 3️⃣ Guardar detalle
    for (const p of carrito) {
      await conexion.query(
        `INSERT INTO detallePedido
         (idPedido, idProducto, nombreProducto, talle, cantidad, precioUnitario)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [pedidoId, p.idProducto, p.nombre, p.talle, p.cantidad, p.precio]
      );
    }

    res.json({ ok: true, pedidoId });

  } catch (error) {
    console.error("Error pedido:", error);
    res.status(500).json({ error: "No se pudo guardar el pedido" });
  }
});

export default router;
