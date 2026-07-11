import { NavLink } from "react-router-dom";
import { useNavbar } from "./useNavBar";
import "./Navbar.css";
import IconClose from "../assets/iconClose.svg?react";

function Navbar({ categories = [] }) {
  const { menuAbierto, toggleMenu, cerrarMenu } = useNavbar();

  return (
    <nav className="navbar">
      <div className="hamburguesa" onClick={toggleMenu}>☰</div>

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

        {categories.map((cat) => (
          <li className="barraItems" key={cat}>
            <NavLink to={`/categoria/${cat.toLowerCase()}`} onClick={cerrarMenu} className="barraLinks">
              {cat}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navbar;