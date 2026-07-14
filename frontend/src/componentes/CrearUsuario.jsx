import { useState } from "react";
import { BASE_URL } from "../config";

function CrearUsuarioModal({ onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCrear = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password || !nombre || !telefono) {
      setError("Completá los campos obligatorios (email, contraseña, nombre y teléfono)");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, nombre, apellido, telefono }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Error al crear usuario");
        return;
      }

      onClose();
    } catch (err) {
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="modal" onSubmit={handleCrear}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>

        <h2>Crear Usuario</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <input
          className="input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="input"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          className="input"
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <input
          className="input"
          type="text"
          placeholder="Apellido"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
        />

        <input
          className="input"
          type="text"
          placeholder="Teléfono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
        />

        <button className="btnCrear" type="submit" disabled={loading}>
          {loading ? "Creando..." : "Crear"}
        </button>
      </div>
    </form>
  );
}

export default CrearUsuarioModal;