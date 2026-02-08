import "./ProductoCard.css";
import { useNavigate } from "react-router-dom";

function ProductoCard({
  producto,
  abrirGaleria,
}) {
  const navigate = useNavigate();
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
        </div>
        <button
        className="btnDetalle"
        onClick={() => navigate(`/producto/${producto.idProducto}`)}
      >
        Talle
      </button>
      </div>
    </div>
  );
}

export default ProductoCard;
