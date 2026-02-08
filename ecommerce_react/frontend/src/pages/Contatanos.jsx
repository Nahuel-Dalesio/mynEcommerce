import './contactanos.css';
import { Link } from 'react-router-dom';

function Contactanos() {
  return (
    <div className='contacto-container'>
      <h1>Contáctanos</h1>

      <section>
        <h2>Estamos para ayudarte</h2>
        <p>
          En M&N Indumentaria queremos que tengas la mejor experiencia. Si tenés
          dudas, consultas o necesitás ayuda con tu pedido, podés comunicarte
          con nosotros por los siguientes medios.
        </p>
      </section>

      <section>
        <h2>WhatsApp</h2>
        <p>📱 Atención directa y rápida</p>

        <p>Escribinos por WhatsApp y te respondemos a la brevedad.</p>

        <p>
          <strong>Horario de atención:</strong>
          <br />
          Lunes a Viernes: 9:00 a 18:00 hs
          <br />
          Sábados: 9:00 a 13:00 hs
        </p>
      </section>

      <section>
        <h2>Redes Sociales</h2>
        <ul>
          <li>
            📷 Instagram:{' '}
            <a
              href='https://www.instagram.com/mynindumentariaonline/'
              target='_blank'
              className='logoRedes'
            >
              @mynindumentariaonline
            </a>
          </li>
          <li>
            📘 Facebook:{' '}
            <a
              href='https://www.facebook.com/MYNINDUMENTARIAONLINE?locale=es_LA'
              target='_blank'
              className='logoRedes'
            >
              @MYNINDUMENTARIAONLINE
            </a>
          </li>
        </ul>
      </section>

      <section>
        <h2>Correo Electrónico</h2>
        <p>📧 mynindumentariaonline@gmail.com</p>
      </section>

      <section>
        <h2>Ubicación</h2>
        <p>📍 Argentina</p>
        <p>Realizamos envíos a todo el país.</p>
      </section>

      <section>
        <h2>Sugerencias y Reclamos</h2>
        <p>
          Tu opinión es muy importante para nosotros. Podés dejarnos tu mensaje
          en la sección{' '}
          <strong>
            <Link to='/Sugerencias' className='logoRedes'>
              Sugerencias
            </Link>
          </strong>{' '}
          o escribirnos directamente.
        </p>
      </section>

      <hr />

      <p className='firma'>Gracias por confiar en M&N Indumentaria 💙</p>
    </div>
  );
}

export default Contactanos;
