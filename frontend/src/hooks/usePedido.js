//frontend/src/hooks/usePedido.js

import { useState } from "react";
import { BASE_URL } from "../config";

function usePedido() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function guardarPedido({ cliente, carrito, total, entrega }) {
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
          entrega, // undefined si es retiro: el backend lo trata como retiro por default
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al guardar pedido");
      }

      // data.total viene con el envío ya sumado (si aplicaba), lo devolvemos
      // para no tener que recalcularlo en el componente.
      return { pedidoId: data.pedidoId, numeroPedido: data.numeroPedido, total: data.total };
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