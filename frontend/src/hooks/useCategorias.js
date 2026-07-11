import { useEffect, useState } from "react";
import { BASE_URL } from "../config";

export function useCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${BASE_URL}/api/productos/categorias-disponibles`)
      .then((res) => res.json())
      .then((data) => setCategorias(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message || "Error al cargar categorías"))
      .finally(() => setLoading(false));
  }, []);

  return { categorias, loading, error };
}