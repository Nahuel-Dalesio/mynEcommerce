import "./Header.css"

function Header({ onCrearUsuario, onIniciarSesion, onAbrirCarrito }) {
  return (
    <header>
      <div className="barraInicio">
        <button className="boton" onClick={onIniciarSesion}>Inicia Sesión</button>
        
        <button
          className="boton"
          onClick={onCrearUsuario}
        >
          Crear Usuario
        </button>

        <button className="boton" onClick={onAbrirCarrito}>🛒</button>
      </div>
    </header>
  );
}

export default Header;