import { useState } from "react";

export function useImagenesProducto() {
  const [imagenes, setImagenes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cargarImagenes = async (idProducto) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `http://localhost:3001/api/productos/imagenes/${idProducto}`
      );

      if (!res.ok) throw new Error("Error al cargar imágenes");

      const data = await res.json();
      setImagenes(data.map(img => img.src));
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { imagenes, cargarImagenes, loading, error };
}