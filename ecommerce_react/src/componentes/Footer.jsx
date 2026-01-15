import {Link} from 'react-router-dom';
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
                <Link to="/Buzos">Buzos</Link>
            </li>
            <li className="logo deco">
                <Link to="/Camperas">Camperas</Link>
            </li>
            <li className="logo deco">
                <Link to="/Contacto">Contacto</Link>
            </li>          
        </ul>

        <div className="footer-brand">
            <img className="logo" src="logoMyn.jpg" alt="logomyn" />
            <img className="logoRedes" src="logo_github1.png" alt="logogithub" />
            <img className="logoRedes" src="logo_gmail.png" alt="logogmail" />
            <img className="logoRedes" src="logo_instagram.png" alt="logoinstagram" />
        </div>

        <div className="footer-legal">
            
        </div>

        <div className="footer-bottom">
            <p>© 2026 MyN. Todos los derechos reservados.</p>            
        </div>
    </footer>
    );
}

export default Footer;