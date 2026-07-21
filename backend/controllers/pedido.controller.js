//backend/controllers/pedido.controller.js
import {
  crearPedido,
  actualizarEstadoPedido,
  obtenerPedidos,
  obtenerEstadoPedido,
  TRANSICIONES_VALIDAS,
} from "../models/pedido.model.js";

export const create = async (req, res) => {
  const { cliente, carrito, total, entrega } = req.body;

  if (!cliente || !carrito || !total) {
    return res.status(400).json({ error: "Datos incompletos" });
  }

  // entrega es opcional (retiro por defecto), pero si viene marcada como
  // envío, tiene que traer al menos la zona elegida.
  if (entrega?.tipoEntrega === "envio" && !entrega.idZonaEnvio) {
    return res.status(400).json({ error: "Falta indicar la zona de envío" });
  }

  try {
    const idUsuario = req.user?.id || null;
    const { idPedido, numeroPedido, total: totalFinal } = await crearPedido({
      cliente,
      carrito,
      total,
      entrega,
      idUsuario,
    });
    res.json({ ok: true, pedidoId: idPedido, numeroPedido, total: totalFinal });
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

    const estadosValidos = ["pendiente", "confirmado", "entregado", "cancelado"];
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ error: "Estado inválido" });
    }

    const estadoActual = await obtenerEstadoPedido(id);
    if (!estadoActual) {
      return res.status(404).json({ error: "Pedido no encontrado" });
    }

    const transicionesPermitidas = TRANSICIONES_VALIDAS[estadoActual] || [];
    if (!transicionesPermitidas.includes(estado)) {
      return res.status(400).json({
        error: `No se puede pasar de "${estadoActual}" a "${estado}"`,
      });
    }

    await actualizarEstadoPedido(id, estado);
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