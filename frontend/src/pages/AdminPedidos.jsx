import React, { useEffect, useState } from "react";
import { useAdminPedidos } from "../hooks/useAdminPedidos";
import BotonVolver from "../componentes/BotonVolver";
import Swal from "sweetalert2";

// Mismas transiciones que en el backend (pedido.model.js TRANSICIONES_VALIDAS).
// Repetido a propósito para poder decidir qué botones mostrar sin pegarle
// al servidor primero; el backend igual vuelve a validar todo.
const TRANSICIONES_VALIDAS = {
  pendiente: ["confirmado", "cancelado"],
  confirmado: ["entregado", "cancelado"],
  entregado: [],
  cancelado: [],
};

const ETIQUETAS_ESTADO = {
  pendiente: { texto: "Pendiente", color: "#fff3cd", texto_color: "#856404" },
  confirmado: { texto: "Confirmado", color: "#cce5ff", texto_color: "#004085" },
  entregado: { texto: "Entregado", color: "#d4edda", texto_color: "#155724" },
  cancelado: { texto: "Cancelado", color: "#f8d7da", texto_color: "#721c24" },
};

const ETIQUETAS_ACCION = {
  confirmado: "Confirmar",
  entregado: "Marcar entregado",
  cancelado: "Cancelar",
};

function formatearFecha(fechaIso) {
  const fecha = new Date(fechaIso);
  return fecha.toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const AdminPedidos = () => {
  const { loading, error, fetchPedidos, actualizarEstado } = useAdminPedidos();
  const [pedidos, setPedidos] = useState([]);

  const loadPedidos = async () => {
    const data = await fetchPedidos();
    setPedidos(data);
  };

  useEffect(() => {
    loadPedidos();
  }, []);

  const handleCambiarEstado = async (pedido, nuevoEstado) => {
    const esCancelacion = nuevoEstado === "cancelado";
    const result = await Swal.fire({
      title: esCancelacion ? "¿Cancelar pedido?" : `¿Marcar como ${nuevoEstado}?`,
      text: `Pedido #${pedido.numeroPedido} — ${pedido.nombre} ${pedido.apellido}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: esCancelacion ? "#dc3545" : "#3085d6",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, confirmar",
      cancelButtonText: "Volver",
    });

    if (!result.isConfirmed) return;

    try {
      await actualizarEstado(pedido.idPedido, nuevoEstado);
      Swal.fire("Listo", "El estado del pedido se actualizó", "success");
      loadPedidos();
    } catch (err) {
      Swal.fire("Error", err.message || "No se pudo actualizar el pedido", "error");
    }
  };

  if (loading && !pedidos.length) return <p>Cargando pedidos...</p>;

  return (
    <div className="admin-container" style={{ padding: "40px", maxWidth: "1300px", margin: "0 auto" }}>
      <BotonVolver to="/admin/productos" texto="Volver a Productos" />
      <h2 style={{ marginTop: "15px", marginBottom: "20px" }}>Gestión de Pedidos</h2>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      <p style={{ color: "#666", fontSize: "0.9rem", marginBottom: "15px" }}>
        Los pedidos pendientes hace más de 7 días se cancelan automáticamente.
        Los cancelados hace más de 2 meses se eliminan automáticamente.
      </p>

      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
        <thead>
          <tr style={{ background: "#eee" }}>
            <th style={{ padding: "10px", border: "1px solid #ccc" }}>N° Pedido</th>
            <th style={{ padding: "10px", border: "1px solid #ccc" }}>Cliente</th>
            <th style={{ padding: "10px", border: "1px solid #ccc" }}>Teléfono</th>
            <th style={{ padding: "10px", border: "1px solid #ccc" }}>Fecha</th>
            <th style={{ padding: "10px", border: "1px solid #ccc" }}>Total</th>
            <th style={{ padding: "10px", border: "1px solid #ccc" }}>Estado</th>
            <th style={{ padding: "10px", border: "1px solid #ccc" }}>Acciones</th>
            <th style={{ padding: "10px", border: "1px solid #ccc" }}>Fecha finalización</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((pedido) => {
            const estadoInfo = ETIQUETAS_ESTADO[pedido.estado] || {
              texto: pedido.estado,
              color: "#eee",
              texto_color: "#333",
            };
            const transicionesDisponibles = TRANSICIONES_VALIDAS[pedido.estado] || [];

            return (
              <tr key={pedido.idPedido}>
                <td style={{ padding: "10px", border: "1px solid #ccc" }}>#{pedido.numeroPedido}</td>
                <td style={{ padding: "10px", border: "1px solid #ccc" }}>
                  {pedido.nombre} {pedido.apellido}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ccc" }}>{pedido.telefono}</td>
                <td style={{ padding: "10px", border: "1px solid #ccc" }}>{formatearFecha(pedido.fecha)}</td>
                
                <td style={{ padding: "10px", border: "1px solid #ccc" }}>${pedido.total}</td>
                <td style={{ padding: "10px", border: "1px solid #ccc" }}>
                  <span
                    style={{
                      padding: "3px 8px",
                      borderRadius: "4px",
                      fontSize: "0.85rem",
                      background: estadoInfo.color,
                      color: estadoInfo.texto_color,
                    }}
                  >
                    {estadoInfo.texto}
                  </span>
                </td>
                <td style={{ padding: "10px", border: "1px solid #ccc", display: "flex", gap: "8px" }}>
                  {transicionesDisponibles.length === 0 && (
                    <span style={{ color: "#999", fontSize: "0.85rem" }}>—</span>
                  )}
                  {transicionesDisponibles.map((estadoDestino) => (
                    <button
                      key={estadoDestino}
                      onClick={() => handleCambiarEstado(pedido, estadoDestino)}
                      style={{
                        padding: "5px 10px",
                        background: estadoDestino === "cancelado" ? "#dc3545" : "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "0.85rem",
                      }}
                    >
                      {ETIQUETAS_ACCION[estadoDestino]}
                    </button>
                  ))}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ccc" }}>
                  {pedido.estado === "entregado" && pedido.fechaEntregado
                    ? formatearFecha(pedido.fechaEntregado)
                    : pedido.estado === "cancelado" && pedido.fechaCancelado
                      ? formatearFecha(pedido.fechaCancelado)
                      : "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {pedidos.length === 0 && !loading && (
        <p style={{ marginTop: "20px", color: "#666" }}>No hay pedidos todavía.</p>
      )}
    </div>
  );
};

export default AdminPedidos;