import express from 'express';
import conexion from '../conexion.js'; // Esto debe exportar un Pool de pg
const router = express.Router();

router.post('/', async (req, res) => {
  const { cliente, carrito, total } = req.body;

  if (!cliente || !carrito || !total) {
    return res.status(400).json({ error: 'Datos incompletos' });
  }

  try {
    // Normalizar los datos
    const nombre = cliente.nombre.trim();
    const apellido = cliente.apellido.trim();
    let telefono = cliente.telefono.replace(/\D/g, '');

    if (telefono.length < 10 || telefono.length > 15) {
      return res.status(400).json({ error: 'Número de teléfono inválido' });
    }

    // 1️⃣ Verificar si ya existe un cliente
    const { rows: clientes } = await conexion.query(
      `SELECT "idCliente" FROM cliente 
       WHERE nombre = $1 AND apellido = $2 AND telefono = $3`,
      [nombre, apellido, telefono]
    );

    let clienteId;

    if (clientes.length > 0) {
      // Cliente ya existe
      clienteId = clientes[0].idCliente;
    } else {
      // Insertar nuevo cliente y obtener id
      const { rows: nuevoCliente } = await conexion.query(
        `INSERT INTO cliente (nombre, apellido, telefono)
         VALUES ($1, $2, $3)
         RETURNING "idCliente"`,
        [nombre, apellido, telefono]
      );
      clienteId = nuevoCliente[0].idCliente;
    }

    // 2️⃣ Obtener último número de pedido
    const { rows: ultimo } = await conexion.query(
      `SELECT MAX("numeroPedido") as "maxNum" FROM pedido`
    );

    let numeroPedido = 1;

    if (ultimo[0].maxNum) {
      const incremento = Math.floor(Math.random() * 20) + 1;
      numeroPedido = ultimo[0].maxNum + incremento;
    }

    // 3️⃣ Guardar pedido y obtener id
    const { rows: pedidoRows } = await conexion.query(
      `INSERT INTO pedido (idCliente, total, estado, "numeroPedido")
       VALUES ($1, $2, 'pendiente', $3)
       RETURNING "idPedido"`,
      [clienteId, total, numeroPedido]
    );

    const pedidoId = pedidoRows[0].idPedido;

    // 4️⃣ Guardar detalle del pedido
    for (const p of carrito) {
      await conexion.query(
        `INSERT INTO "detallePedido"
         (idPedido, idProducto, nombreProducto, talle, cantidad, precioUnitario)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [pedidoId, p.idProducto, p.nombre, p.talle, p.cantidad, p.precio]
      );
    }

    res.json({ ok: true, pedidoId, numeroPedido });
  } catch (error) {
    console.error('Error pedido:', error);
    res.status(500).json({ error: 'No se pudo guardar el pedido' });
  }
});

export default router;
