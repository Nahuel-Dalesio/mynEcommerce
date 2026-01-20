import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useImagenesProducto } from "../hooks/useImagenesProductos.js";
import "./productoDetalle.css";

const TALLES = ["S", "M", "L", "XL", "XXL"];

function ProductoDetalle({ agregarAlCarrito, carrito }) {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [error, setError] = useState(null);
  const [talleSeleccionado, setTalleSeleccionado] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const {
    imagenes,
    cargarImagenes,
    error: errorImagenes,
  } = useImagenesProducto();

  useEffect(() => {
    fetch(`http://localhost:3001/api/productos/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Error de servidor");
        return res.json();
      })
      .then((data) => setProducto(data))
      .catch((err) => console.error("FETCH ERROR:", err));

    cargarImagenes(id);
  }, [id]);
  useEffect(() => {
    if (talleSeleccionado) {
      setCantidad(1);
    }
  }, [carrito, talleSeleccionado]);

  if (error) return <p>{error}</p>;
  if (!producto) return <p>Cargando...</p>;

  const imagenPrincipal = imagenes.find((img) => img.esPrincipal === 1);

  const obtenerTalle = (talle) =>
    producto.talles.find((t) => t.talle.trim().toUpperCase() === talle);

  const stockDisponible = talleSeleccionado
    ? obtenerTalle(talleSeleccionado).stock -
      carrito
        .filter(
          (p) =>
            p.idProducto === producto.idProducto &&
            p.talle === talleSeleccionado,
        )
        .reduce((acc, p) => acc + p.cantidad, 0)
    : 0;

  return (
    <div className="productoDetalle">
      {/* IMÁGENES SECUNDARIAS */}
      <div className="imagenesSecundarias">
        {producto.imagenes.map((img, index) => (
          <img
            key={index}
            className="imagenesSecundariasContenedor"
            src={`http://localhost:3001${img.src}`}
            alt={producto.nombre}
          />
        ))}
      </div>

      {/* IMAGEN PRINCIPAL */}
      <div>
        {imagenPrincipal ? (
          <img
            className="imagenPrincipal"
            src={`http://localhost:3001${imagenPrincipal.src}`}
            alt={producto.nombre}
          />
        ) : (
          <p>No hay imagen principal disponible</p>
        )}
        {errorImagenes && <p>{errorImagenes}</p>}
      </div>

      {/* INFO */}
      <div className="productoInfo">
        <h1>{producto.nombre}</h1>

        <p>{producto.descripcion}</p>

        {producto.enOferta ? (
          <p>
            <strong>${producto.precioOferta}</strong>
          </p>
        ) : (
          <p>
            <strong>${producto.precio}</strong>
          </p>
        )}

        {/* TALLES */}
        <h3>Talles disponibles</h3>

        <div className="talles">
          {TALLES.map((talle) => {
            const talleData = obtenerTalle(talle);
            const stockDisponibleTalle = talleData
              ? talleData.stock -
                carrito
                  .filter(
                    (p) =>
                      p.idProducto === producto.idProducto && p.talle === talle,
                  )
                  .reduce((acc, p) => acc + p.cantidad, 0)
              : 0;

            const sinStock = stockDisponibleTalle <= 0;

            return (
              <button
                key={talle}
                disabled={sinStock}
                className={`talle-btn ${
                  talleSeleccionado === talle ? "activo" : ""
                }`}
                onClick={() => setTalleSeleccionado(talle)}
              >
                {talle}
              </button>
            );
          })}
        </div>
        {talleSeleccionado  && stockDisponible > 0 && (
          <div className="contador">
            <button onClick={() => setCantidad((c) => Math.max(1, c - 1))}>
              −
            </button>

            <span>{cantidad}</span>

            <button
              onClick={() =>
                setCantidad((c) => (c < stockDisponible ? c + 1 : c))
              }
            >
              +
            </button>
          </div>
        )}

        <button
          className="btnDetalle"
          disabled={!talleSeleccionado}
          onClick={() => {
            const talleData = obtenerTalle(talleSeleccionado);

            agregarAlCarrito(
              {
                ...producto,
                imagen: imagenPrincipal
                  ? `http://localhost:3001${imagenPrincipal.src}`
                  : null,
              },
              talleSeleccionado,
              cantidad,
              talleData.stock,
            );
          }}
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  );
}

export default ProductoDetalle;
