import "./privacidad.css";

function Privacidad() {
  return (
    <div className="privacidad-container">

      <h1>Política de Privacidad</h1>

      <p className="fecha">
        Última actualización: Enero 2026
      </p>

      <section>
        <h2>1. Información que recopilamos</h2>
        <p>
          En M&N Indumentaria recopilamos únicamente los datos necesarios
          para procesar pedidos y brindar atención al cliente, como nombre,
          apellido, teléfono, correo electrónico y dirección de entrega.
        </p>
      </section>

      <section>
        <h2>2. Uso de la información</h2>
        <p>
          Los datos personales son utilizados exclusivamente para:
        </p>

        <ul>
          <li>Procesar pedidos</li>
          <li>Coordinar envíos</li>
          <li>Brindar soporte</li>
          <li>Enviar información relacionada a compras</li>
        </ul>
      </section>

      <section>
        <h2>3. Protección de datos</h2>
        <p>
          Implementamos medidas de seguridad para proteger la información
          personal contra accesos no autorizados, pérdidas o modificaciones.
        </p>
      </section>

      <section>
        <h2>4. Compartir información</h2>
        <p>
          M&N Indumentaria no vende, alquila ni comparte datos personales
          con terceros, excepto cuando sea necesario para la entrega
          de pedidos o por requerimiento legal.
        </p>
      </section>

      <section>
        <h2>5. Cookies</h2>
        <p>
          Nuestro sitio puede utilizar cookies únicamente para mejorar
          la experiencia de navegación. No se utilizan para fines
          publicitarios sin consentimiento.
        </p>
      </section>

      <section>
        <h2>6. Derechos del usuario</h2>
        <p>
          El usuario puede solicitar en cualquier momento la modificación,
          actualización o eliminación de sus datos personales comunicándose
          con nosotros por los medios disponibles.
        </p>
      </section>

      <section>
        <h2>7. Cambios en la política</h2>
        <p>
          Nos reservamos el derecho de modificar esta política en cualquier
          momento. Los cambios serán publicados en esta página.
        </p>
      </section>

      <section>
        <h2>8. Contacto</h2>
        <p>
          Ante cualquier consulta relacionada con la privacidad de datos,
          podés comunicarte con nosotros desde la sección Contactanos.
        </p>
      </section>

      <hr />

      <p className="firma">
        M&N Indumentaria Online
      </p>

    </div>
  );
}

export default Privacidad;
