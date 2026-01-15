import "./Navbar.css";
import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <ul className="barra">
      <li className="logo deco">
        <NavLink to="/" end>
          <img
            src="../public/logoMyn.jpg"
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
          to="/buzos"
          className={({ isActive }) =>
            `barraLinks ${isActive ? "activo" : ""}`
          }
        >
          Buzos
        </NavLink>
      </li>

      <li className="barraItems">
        <NavLink
          to="/camperas"
          className={({ isActive }) =>
            `barraLinks ${isActive ? "activo" : ""}`
          }
        >
          Camperas
        </NavLink>
      </li>
    </ul>
  );
}

export default Navbar;
