import "./Navbar.css";
import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <ul className="barra w-full">
      <li className="logo deco">
        <NavLink to="/" end>
          <img
            src="logoMyn.jpg"
            alt="Logo"
          />
        </NavLink>
      </li>

      <li className="barraItems">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `barraLinks ${isActive ? "activo" : ""}`
          }
        >
          Inicio
        </NavLink>
      </li>

      <li className="barraItems">
        <NavLink
          to="/remeras"
          className={({ isActive }) =>
            `barraLinks ${isActive ? "activo" : ""}`
          }
        >
          Remeras
        </NavLink>
      </li>

      <li className="barraItems">
        <NavLink
          to="/Abrigos"
          className={({ isActive }) =>
            `barraLinks ${isActive ? "activo" : ""}`
          }
        >
          Abrigos
        </NavLink>
      </li>

      <li className="barraItems">
        <NavLink
          to="/Zapatillas"
          className={({ isActive }) =>
            `barraLinks ${isActive ? "activo" : ""}`
          }
        >
          Zapatillas
        </NavLink>
      </li>
    </ul>
  );
}

export default Navbar;
