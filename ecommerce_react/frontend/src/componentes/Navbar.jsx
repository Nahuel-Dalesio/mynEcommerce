import { NavLink } from "react-router-dom";
import { useNavbar } from "./useNavBar";
import "./Navbar.css";
import IconClose from "../assets/iconClose.svg?react";

function Navbar() {
  const { menuAbierto, toggleMenu, cerrarMenu } = useNavbar();

  return (
    <nav className="navbar">
      <div className="hamburguesa" onClick={toggleMenu}>
        ☰
      </div>

      <ul className={`barra ${menuAbierto ? "activo" : ""}`}>
        <div>
          <IconClose className="iconClose" onClick={cerrarMenu} />
        </div>
        <li>
          <NavLink to="/" end onClick={cerrarMenu} className="logo">
            <img src="logoMyn.jpg" alt="Logo" />
          </NavLink>
        </li>
        <li className="barraItems">
          <NavLink to="/" end onClick={cerrarMenu} className="barraLinks">
            Inicio
          </NavLink>
        </li>

        <li className="barraItems">
          <NavLink to="/remeras" onClick={cerrarMenu} className="barraLinks">
            Remeras
          </NavLink>
        </li>

        <li className="barraItems">
          <NavLink to="/Abrigos" onClick={cerrarMenu} className="barraLinks">
            Abrigos
          </NavLink>
        </li>

        <li className="barraItems">
          <NavLink to="/Zapatillas" onClick={cerrarMenu} className="barraLinks">
            Zapatillas
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
