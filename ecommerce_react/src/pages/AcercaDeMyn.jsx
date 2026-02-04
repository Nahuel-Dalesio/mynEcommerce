import "./acercaDeMyn.css"
import { Link } from 'react-router-dom';

function AcercaDeMyn() {
  return (
    <div className="acerca-container">

      <h1>Acerca de M&N Indumentaria Online</h1>

      <section>
        <h2>Nuestra Historia</h2>
        <p>
          M&N Indumentaria nace con el objetivo de ofrecer productos de calidad,
          accesibles y con atención personalizada. Empezamos como un
          emprendimiento pequeño y crecimos gracias a la confianza de nuestros
          clientes.
        </p>
      </section>

      <section>
        <h2>Nuestra Misión</h2>
        <p>
          Brindar una experiencia de compra simple, rápida y segura, acercando
          las últimas tendencias en indumentaria a nuestros clientes.
        </p>
      </section>

      <section>
        <h2>Nuestra Visión</h2>
        <p>
          Convertirnos en una marca reconocida a nivel local, destacándonos por
          la calidad, el servicio y la cercanía con nuestra comunidad.
        </p>
      </section>

      <section>
        <h2>Nuestros Valores</h2>
        <ul>
          <li>🤝 Compromiso con el cliente</li>
          <li>⭐ Calidad en cada producto</li>
          <li>🚀 Mejora continua</li>
          <li>💬 Atención personalizada</li>
        </ul>
      </section>

      <section>
        <h2>¿Por qué elegirnos?</h2>
        <ul>
          <li>Compras simples sin complicaciones</li>
          <li>Atención directa por WhatsApp</li>
          <li>Precios competitivos</li>
          <li>Entregas rápidas</li>
        </ul>
      </section>

      <section>
        <h2>Contacto</h2>
        <p>
          Si tenés alguna consulta, podés escribirnos desde la sección
          <Link to='/Contactanos' className='logoRedes'>CONTÁCTANOS</Link> o directamente por WhatsApp.
        </p>
      </section>

      <hr />

      <p className="firma">
        Gracias por confiar en M&N Indumentaria 💙
      </p>

    </div>
  );
}

export default AcercaDeMyn;
