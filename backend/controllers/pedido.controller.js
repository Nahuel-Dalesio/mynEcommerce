import { crearPedido, actualizarEstadoPedido, obtenerPedidos } from "../models/pedido.model.js";

export const create = async (req, res) => {
  const { cliente, carrito, total } = req.body;

  if (!cliente || !carrito || !total) {
    return res.status(400).json({ error: "Datos incompletos" });
  }

  try {
    const { idPedido, numeroPedido } = await crearPedido({ cliente, carrito, total });
    res.json({ ok: true, pedidoId: idPedido, numeroPedido });
  } catch (error) {
    console.error("Error pedido:", error);
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message || "No se pudo guardar el pedido" });
  }
};

export const updateEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const estadosValidos = ["pendiente", "confirmado", "cancelado", "entregado"];
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ error: "Estado inválido" });
    }

    const affectedRows = await actualizarEstadoPedido(id, estado);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Pedido no encontrado" });
    }

    res.json({ message: `Pedido actualizado a ${estado}` });
  } catch (error) {
    console.error("Error al actualizar estado:", error);
    res.status(500).json({ error: "Error DB" });
  }
};

export const getAll = async (_req, res) => {
  try {
    const pedidos = await obtenerPedidos();
    res.json(pedidos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error DB" });
  }
};