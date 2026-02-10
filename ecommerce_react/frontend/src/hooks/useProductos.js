import { useEffect, useState } from "react";
import { BASE_URL } from "../config";

export function useProductos(categoria) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log("API:", import.meta.env.VITE_API_URL);

  useEffect(() => {
    setLoading(true);
    setError(null);

    let url = `${BASE_URL}/api/productos`;
    console.log("URL:", url);
    if (categoria) {
      url = `${BASE_URL}/api/productos/categoria?categoria=${categoria}`;
    }

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setProductos(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        setError(err.message || "Error al cargar productos");
        setProductos([]);
      })
      .finally(() => setLoading(false));
  }, [categoria]);
  
  return { productos, loading, error };
}
