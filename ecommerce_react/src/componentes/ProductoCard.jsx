import "./ProductoCard.css";
import { useState } from "react";

function ProductoCard({
  producto,
  carrito = [],
  agregarAlCarrito,
  abrirGaleria,
}) {
  const cantidadEnCarrito =
    carrito.find((p) => p.idProducto === producto.idProducto)?.cantidad || 0;
  const stockDisponible = producto.stock - cantidadEnCarrito;

  const [cantidadSeleccionada, setCantidadSeleccionada] = useState(
    producto.stock > 0 ? 1 : 0
  );
  return (
    <div className="cardProducto">
      <div className="contenedorProducto">
        <img
          src={producto.imagen}
          alt={producto.nombre}
          onClick={() => abrirGaleria(producto)}
          className="img-click"
        />

        <div className="dataCentrada">
          <h3>{producto.nombre}</h3>
          <p>{producto.descripcion}</p>
          <strong>${producto.precio}</strong>
          <p>Stock disponible: {stockDisponible}</p>

          <div className="cardContador">
            <button
              className="btnContador"
              disabled={cantidadSeleccionada <= 1}
              onClick={() => setCantidadSeleccionada((c) => Math.max(1, c - 1))}
            >
              −
            </button>

            <span>{stockDisponible > 0 ? cantidadSeleccionada : 0}</span>

            <button
              className="btnContador"
              disabled={stockDisponible === 0}
              onClick={() =>
                setCantidadSeleccionada((c) => Math.min(stockDisponible, c + 1))
              }
            >
              +
            </button>
          </div>
          <button
            onClick={() => {
              agregarAlCarrito(producto, cantidadSeleccionada);
              setCantidadSeleccionada(stockDisponible > 0 ? 1 : 0);
            }}
            className="agregar-carrito"
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductoCard;
