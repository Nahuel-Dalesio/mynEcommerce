import "./Carrito.css";
import { useEffect, useRef } from "react";

function Carrito({ abierto, carrito, eliminarDelCarrito, totalCarrito, comprar, cerrarCarrito}) {
  const carritoRef = useRef(null);

  useEffect(() => {
    function handleClickFuera(e) {
      if (e.target.closet(".modal")) return;
      
      if (
        abierto &&
        carritoRef.current &&
        !carritoRef.current.contains(e.target)
      ) {
        cerrarCarrito();
      }
    }
    
    function handleKeyDown(e) {
      if (e.key === "Escape" && abierto) {
        cerrarCarrito();
      }
    }

    document.addEventListener("mousedown", handleClickFuera);
    document.addEventListener("keydown", handleKeyDown);

    return () => {

      document.removeEventListener("mousedown", handleClickFuera);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [abierto, cerrarCarrito]);
    

  if (!abierto) return null;

  return (
    <div className="mostrar" ref={carritoRef}>
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
