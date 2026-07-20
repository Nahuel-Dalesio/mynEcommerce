//frontend/src/hooks/useEnvio.js

import { useState } from "react";
import { BASE_URL } from "../config";

function useEnvio() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Zonas activas para poblar el <select> del checkout.
  async function obtenerZonas() {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${BASE_URL}/api/envios/zonas`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al obtener las zonas de envío");
      }

      return data; // array: [{ idZonaEnvio, nombre, tipo, costo }, ...]
    } catch (err) {
      console.error(err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }

  // Dada la zona elegida y el total de productos, devuelve
  // { disponible, costoEnvio, tipo, faltante }.
  async function calcularCosto(idZonaEnvio, total) {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${BASE_URL}/api/envios/costo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idZonaEnvio, total }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al calcular el costo de envío");
      }

      return data;
    } catch (err) {
      console.error(err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }

  return {
    obtenerZonas,
    calcularCosto,
    loading,
    error,
  };
}

export default useEnvio;