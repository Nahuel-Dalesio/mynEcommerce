import { useState } from "react";

export function useImagenesProducto() {
  const [imagenes, setImagenes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cargarImagenes = async (idProducto) => {
    if (!idProducto) {
      setError("ID de producto inválido");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `http://localhost:3001/api/productos/imagenes/${idProducto}`
      );

      if (!res.ok)
        throw new Error(`Error HTTP ${res.status}: ${res.statusText}`);

      const data = await res.json();
      setImagenes(data);
    } catch (err) {
      console.error("Error en cargarImagenes:", err); // Agregado para depurar
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { imagenes, cargarImagenes, loading, error };
}