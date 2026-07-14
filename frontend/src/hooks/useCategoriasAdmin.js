import { useEffect, useState, useContext } from "react";
import { BASE_URL } from "../config";
import { AuthContext } from "../context/AuthContext";

export function useCategoriasAdmin() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    fetch(`${BASE_URL}/api/categorias-admin`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setCategorias(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, [token]);

  return { categorias, loading };
}