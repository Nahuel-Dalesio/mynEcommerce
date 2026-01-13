import "./Navbar.css";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <ul className="barra">
      <li className="logo deco">
        <Link to="/">
          <img
            src="../public/logoMyn.jpg"
            alt="Logo"
          />
        </Link>
      </li>
      <li className="barraItems">
        <Link to="/" className="barraLinks">Inicio</Link>
      </li>
      <li className="barraItems">
        <Link to="/remeras" className="barraLinks">Remeras</Link>
      </li>
      <li className="barraItems">
        <Link to="/buzos" className="barraLinks">Buzos</Link>
      </li>
      <li className="barraItems">
        <Link to="/camperas" className="barraLinks">Camperas</Link>
      </li>
    </ul>
  );
}

export default Navbar;
