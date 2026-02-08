import { useState } from "react";
import "./sugerencias.css";

function Sugerencias() {
  const [nombre, setNombre] = useState("");
  const [mensaje, setMensaje] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!nombre || !mensaje) {
      alert("Completá todos los campos");
      return;
    }

    // Por ahora solo demo (después backend / mail / DB)
    console.log("Sugerencia:", { nombre, mensaje });

    alert("¡Gracias por tu sugerencia!");

    setNombre("");
    setMensaje("");
  }

  return (
    <div className="sugerencias-container">

      <h1>Sugerencias y Reclamos</h1>

      <p className="intro">
        Tu opinión es muy importante para nosotros.
        Ayudanos a mejorar dejando tu mensaje.
      </p>

      <form onSubmit={handleSubmit} className="sugerencias-form">

        <label>Nombre</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Tu nombre"
        />

        <label>Mensaje</label>
        <textarea
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          placeholder="Escribí tu sugerencia o reclamo..."
          rows="5"
        />

        <button type="submit">
          Enviar mensaje
        </button>

      </form>

    </div>
  );
}

export default Sugerencias;
