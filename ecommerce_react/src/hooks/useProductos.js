// hooks/useProductos.js
import { useEffect, useState } from "react";

export function useProductos(categoria) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);

    let url = "http://localhost:3001/api/productos";
    if (categoria) {
      url = `http://localhost:3001/api/productos/categoria?categoria=${categoria}`;
    }

    fetch(url)
      .then(res => res.json())
      .then(data => setProductos(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [categoria]);

  return { productos, loading, error };
}