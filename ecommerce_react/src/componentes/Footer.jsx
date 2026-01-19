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
        {/* <li className="logo deco">
          <Link to="/Contacto">Contacto</Link>
        </li> */}
      </ul>

      <div className="footer-brand">
        <img className="logo" src="../logoMyn.jpg" alt="logomyn" />
        {/* #TODO Agregar paginas internas */}
        <div>
          <ul className="footer-contact">
            <li className="logo pad">
              <Link to="/AcercaDeMyn" className="font">ACERCA DE MYN</Link>
            </li>
            <li className="logo pad">
              <Link to="/Contactanos" className="font">CONTACTANOS</Link>
            </li>
            <li className="logo pad">
              <Link to="/Sugerencias" className="font">SUGERENCIAS</Link>
            </li>
          </ul>
        </div>
        <div>
          <a href="https://wa.me" target="_blank"><LogoWhatsapp className="logoRedes"/></a>
          <a href="https://www.facebook.com" target="_blank"><LogoFacebook className="logoRedes"/></a>
          <a href="https://www.instagram.com" target="_blank"><LogoInstagram className="logoRedes"/></a>
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
