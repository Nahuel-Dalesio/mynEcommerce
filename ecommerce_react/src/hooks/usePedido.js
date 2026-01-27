import { useState } from "react";

function usePedido() {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function guardarPedido({ cliente, carrito, total }) {

    try {

      setLoading(true);
      setError(null);

      const res = await fetch("http://localhost:3001/api/pedidos", {
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

      if (!res.ok) {
        throw new Error(data.error || "Error al guardar pedido");
      }

      return data; // pedidoId

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
