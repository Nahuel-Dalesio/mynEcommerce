import { useState } from "react";
// TODO: Terminar la implementación del modal para crear usuario al finalizar el proyecto.
function CrearUsuarioModal({ onClose }) {
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");

  const handleCrear = () => {
    // Validación simple
    if (!nombre || !password) {
      alert("Completa todos los campos");
      return;
    }

    // Simulación de guardado (después va API)
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    usuarios.push({ nombre, password });
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    // Cerrar modal
    onClose();
  };

  return (
    <form className="modal">  
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>

        <h2>Crear Usuario</h2>

        <input
          className="input"
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <input
          className="input"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="btnCrear" onClick={handleCrear}>
          Crear
        </button>
      </div>
    </form>
  );
}

export default CrearUsuarioModal;
