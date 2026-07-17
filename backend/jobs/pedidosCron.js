// backend/jobs/pedidosCron.js
import cron from "node-cron";
import {
  cancelarPendientesVencidos,
  eliminarCanceladosVencidos,
} from "../models/pedido.model.js";

async function revisarPedidosVencidos() {
  try {
    const cancelados = await cancelarPendientesVencidos();
    if (cancelados > 0) {
      console.log(`[pedidosCron] ${cancelados} pedido(s) pendiente(s) vencidos -> cancelados`);
    }

    const eliminados = await eliminarCanceladosVencidos();
    if (eliminados > 0) {
      console.log(`[pedidosCron] ${eliminados} pedido(s) cancelado(s) vencidos -> eliminados`);
    }
  } catch (error) {
    console.error("[pedidosCron] Error al revisar pedidos vencidos:", error);
  }
}

export function iniciarCronPedidos() {
  // Corre cada 1 hora, en el minuto 0 (ej: 13:00, 14:00, ...)
  cron.schedule("0 * * * *", revisarPedidosVencidos);
  console.log("[pedidosCron] Job de vencimiento de pedidos programado (cada 1 hora)");

  // Corremos una vez al arrancar el server también, para no esperar
  // hasta la próxima hora en punto si el server estuvo caído un tiempo.
  revisarPedidosVencidos();
}