import { useState } from "react";
import { BASE_URL } from "../config";

function usePedido() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function guardarPedido({ cliente, carrito, total }) {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${BASE_URL}/api/pedidos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cliente,
          carrito,
          total,
        }),
      });

      const data = await res.json();
      console.log("STATUS:", res.status);
      console.log("RESPUESTA BACKEND:", data);
      

      if (!res.ok) {
        throw new Error(data.error || "Error al guardar pedido");
      }

      return { pedidoId: data.pedidoId, numeroPedido: data.numeroPedido }; // pedidoId
    } catch (err) {
      console.error(err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }

  return {
    guardarPedido,
    loading,
    error,
  };
}

export default usePedido;
