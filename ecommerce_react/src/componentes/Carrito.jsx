import "./Carrito.css";
function Carrito({ abierto, carrito, eliminarDelCarrito, totalCarrito, comprar }) {
  if (!abierto) return null;
  return (
    <div className="mostrar">
        <h2 className="tituloCarrito">Carrito de compras</h2>
        {carrito.map((p) => (
        console.log(p),
        <ul className="card-carrito" key={`${p.idProducto}-${p.talle}`}>
          <li className="lista">
            <img className="imagenCarrito" src={p.imagen} alt={p.nombre} />
          </li>
          <li className="lista art">{p.nombre}</li>
          <li className="lista talle">Talle: {p.talle}</li>
          <li className="lista">${p.precio}</li>
          <li className="lista">Cantidad: {p.cantidad}</li>
          <button className="eliminar-carrito" onClick={() => eliminarDelCarrito(p.idProducto, p.talle)}>❌</button>
        </ul>
      ))}
      <div><p className="pTota">Total: ${totalCarrito}</p></div>
      <button className="btn-comprar" onClick={comprar}>
        Comprar
      </button>
    </div>
    
    
  );
}

export default Carrito;
