//frontend/src/hooks/useAdminEnvio.js
import { useState, useCallback } from "react";
import { BASE_URL } from "../config";

// Asumo el mismo patrón de auth que useAdminProductos: token guardado en
// localStorage y mandado como Bearer. Si tu proyecto lo maneja distinto
// (cookie, otro nombre de key, etc.), avisame y ajusto esta única función.
function authHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export function useAdminEnvio() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function request(path, options = {}) {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${BASE_URL}/api/admin/envios${path}`, {
        headers: authHeaders(),
        ...options,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error en la solicitud");
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  // --- Zonas ---
  const fetchZonas = useCallback(() => request("/zonas"), []);
  const createZona = useCallback(
    ({ nombre, tipo, costo, activo }) =>
      request("/zonas", { method: "POST", body: JSON.stringify({ nombre, tipo, costo, activo }) }),
    []
  );
  const updateZona = useCallback(
    (id, { nombre, costo, activo }) =>
      request(`/zonas/${id}`, { method: "PUT", body: JSON.stringify({ nombre, costo, activo }) }),
    []
  );

  // --- Config (montos mínimos) ---
  const fetchConfig = useCallback(() => request("/config"), []);
  const updateConfig = useCallback(
    (config) => request("/config", { method: "PUT", body: JSON.stringify(config) }),
    []
  );

  return {
    loading,
    error,
    fetchZonas,
    createZona,
    updateZona,
    fetchConfig,
    updateConfig,
  };
}