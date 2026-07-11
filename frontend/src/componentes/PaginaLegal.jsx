function PaginaLegal({ titulo, fecha, secciones, firma, className }) {
  return (
    <div className={className}>
      <h1>{titulo}</h1>
      {fecha && <p className="fecha">Última actualización: {fecha}</p>}

      {secciones.map((sec, i) => (
        <section key={i}>
          <h2>{sec.titulo}</h2>
          {sec.texto && <p>{sec.texto}</p>}
          {sec.lista && (
            <ul>
              {sec.lista.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ul>
          )}
        </section>
      ))}

      <hr />
      <p className="firma">{firma}</p>
    </div>
  );
}

export default PaginaLegal;