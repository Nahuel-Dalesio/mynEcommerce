import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * Botón de "volver" reutilizable. Por defecto vuelve a la página anterior
 * en el historial (como el botón atrás del navegador). Si se le pasa la
 * prop `to`, navega directamente a esa ruta en vez de usar el historial
 * (útil si querés un destino fijo en vez de "lo que sea que había antes").
 *
 * Uso:
 *   <BotonVolver />                    -> vuelve a la página anterior
 *   <BotonVolver to="/admin/productos" -> vuelve siempre a esa ruta puntual
 *                texto="Volver a productos" />
 */
const BotonVolver = ({ to, texto = "Volver" }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <button
      onClick={handleClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "8px 14px",
        background: "transparent",
        color: "#333",
        border: "1px solid #ccc",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "0.9rem",
      }}
    >
      ← {texto}
    </button>
  );
};

export default BotonVolver;