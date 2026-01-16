import { Link } from "react-router-dom";
import LogoInstagram from "../assets/logoInstagram.svg?react";
import LogoFacebook from "../assets/logoFacebook.svg?react";
import LogoWhatsapp from "../assets/logowhatsapp.svg?react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <ul className="footer-top">
        <li className="logo deco">
          <Link to="/">Inicio</Link>
        </li>
        <li className="logo deco">
          <Link to="/Remeras">Remeras</Link>
        </li>
        <li className="logo deco">
          <Link to="/Abrigos">Abrigos</Link>
        </li>
        <li className="logo deco">
          <Link to="/Zapatillas">Zapatillas</Link>
        </li>
        <li className="logo deco">
          <Link to="/Contacto">Contacto</Link>
        </li>
      </ul>

      <div className="footer-brand">
        <img className="logo" src="logoMyn.jpg" alt="logomyn" />
        <div>
          <LogoWhatsapp className="logoRedes"/>
          <LogoFacebook className="logoRedes"/>
          <LogoInstagram className="logoRedes"/>
        </div>
      </div>

      <div className="footer-legal"></div>

      <div className="footer-bottom">
        <p>© 2026 MyN. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;
