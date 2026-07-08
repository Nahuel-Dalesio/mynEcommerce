import "./Header.css"
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Header({ onCrearUsuario, onIniciarSesion, onAbrirCarrito, toggleButtonRef }) {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  return (
    <header>
      <div className="barraInicio">
        {!user ? (
          <button className="boton" onClick={() => navigate("/login")}>Inicia Sesión</button>
        ) : (
          <>
            {user.rol === "admin" && (
              <button className="boton" onClick={() => navigate("/admin/productos")}>Admin</button>
            )}
            <button className="boton" onClick={logout}>Cerrar Sesión</button>
          </>
        )}
        <button className="boton" onClick={onCrearUsuario}>
          Crear Usuario
        </button>
        <button className="boton" ref={toggleButtonRef} onClick={onAbrirCarrito}>🛒</button>
      </div>
    </header>
  );
}

export default Header;