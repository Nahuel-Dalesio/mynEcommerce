import "./Carrito.css";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import IconClose from "../assets/iconClose.svg?react";

function Carrito({
  abierto,
  carrito,
  eliminarDelCarrito,
  totalCarrito,
  cerrarCarrito,
  toggleButtonRef, // ← ref al botón del Header
}) {
  const carritoRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickFuera(e) {
      // Ignorar clicks dentro del carrito
      if (carritoRef.current && carritoRef.current.contains(e.target)) return;

      // Ignorar clicks en el botón toggle del Header
      if (
        toggleButtonRef?.current &&
        toggleButtonRef.current.contains(e.target)
      )
        return;

      // Ignorar clicks dentro de modales de SweetAlert2
      if (Swal.isVisible()) return;

      // Click afuera → cerrar carrito
      if (abierto) cerrarCarrito();
    }

    function handleKeyDown(e) {
      if (e.key === "Escape" && abierto) cerrarCarrito();
    }

    document.addEventListener("mousedown", handleClickFuera);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickFuera);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [abierto, cerrarCarrito, toggleButtonRef]);

  function irACheckout() {
    if (carrito.length === 0) {
      Swal.fire({
        title: "El carrito está vacío",
        icon: "warning",
      });
      return;
    }
    Swal.fire({
      title: "Antes de continuar...",
      text: "Solo necesitamos algunos datos mínimos para completar tu pedido (nombre, apellido y teléfono).",
      icon: "info",
      showCancelButton: true, // ← Muestra botón de cancelar
      confirmButtonText: "Continuar",
      cancelButtonText: "Volver", // ← Texto del botón de cancelar
    }).then((result) => {
      if (result.isConfirmed) {
        cerrarCarrito();
        navigate("/checkout");
      }
      // Si canceló, no hacemos nada, el carrito queda abierto
    });
  }
  if (!abierto) return null;

  return (
    <div className="mostrar" ref={carritoRef}>
      
      <IconClose className="iconClose" onClick={cerrarCarrito} />
      
      <h2 className="tituloCarrito">Carrito de compras</h2>
      {carrito.map((p) => (
        <ul className="card-carrito" key={`${p.idProducto}-${p.talle}`}>
          
          <li className="lista">
            <img className="imagenCarrito" src={p.imagen} alt={p.nombre} />
          </li>
          <li className="lista art">
            {p.nombre} {p.talle}
          </li>
          {/* <li className='lista talle'> {p.talle}</li> */}
          <li className="lista">${p.precio}</li>
          <li className="lista">Cantidad: {p.cantidad}</li>
          <button
            className="eliminar-carrito"
            onClick={() => eliminarDelCarrito(p.idProducto, p.talle)}
          >
            ❌
          </button>
        </ul>
      ))}
      <div>
        <p className="pTota">Total: ${totalCarrito}</p>
      </div>
      <button className="btn-comprar" onClick={irACheckout}>
        Hacer pedido
      </button>
    </div>
  );
}

export default Carrito;
