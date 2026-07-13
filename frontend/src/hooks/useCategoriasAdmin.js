// hooks/useCategoriasAdmin.js
import { useEffect, useState } from "react";
import { BASE_URL } from "../config";

export function useCategoriasAdmin() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE_URL}/api/productos/categorias-admin`)
      .then((res) => res.json())
      .then((data) => setCategorias(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  return { categorias, loading };
}