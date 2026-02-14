import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useImagenesProducto } from "../hooks/useImagenesProductos.js";
import "./productoDetalle.css";
import { BASE_URL } from "../config";

const TALLES = ["S", "M", "L", "XL", "XXL"];

function ProductoDetalle({ agregarAlCarrito, carrito }) {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [error, setError] = useState(null);
  const [talleSeleccionado, setTalleSeleccionado] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const {
    cargarImagenes,
    error: errorImagenes,
  } = useImagenesProducto();
  const [imagenPrincipal, setImagenPrincipal] = useState(null);

  useEffect(() => {
    fetch(`${BASE_URL}/api/productos/${id}`)
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

  useEffect(() => {
  if (producto?.imagenes?.length > 0) {
    setImagenPrincipal(producto.imagenes.find(img => img.esPrincipal) || producto.imagenes[0]);
  }
}, [producto]);

  if (error) return <p>{error}</p>;
  if (!producto) return <p>Cargando...</p>;


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
            src={`${img.src}`}
            alt={producto.nombre}
            onClick={() => setImagenPrincipal(img)}
          />
        ))}
      </div>

      {/* IMAGEN PRINCIPAL */}
      <div>
        {imagenPrincipal ? (
          <img
            className="imagenPrincipal"
            src={`${BASE_URL}${imagenPrincipal.src}`}
            alt={producto.nombre}
          />
        ) : (
          <p>No hay imagen principal disponible</p>
        )}
        {errorImagenes && <p>{errorImagenes}</p>}
      </div>

      {/* INFO */}
      <div className="productoInfo">
        <h1 className="espacio">{producto.nombre}</h1>

        <p className="espacio">{producto.nombre} {producto.descripcion}</p>

        {producto.enOferta ? (
          <p className="espacio">
            <p className="precioAnterior">Precio anterior</p>
            <p className="espacio precioTachado" >${producto.precio}</p>
            <p className="tprecioOferta">Precio Oferta</p>
            <strong className="espacio precioOferta">${producto.precioOferta}</strong>
          </p>
        ) : (
          <p>
            <strong className="espacio">${producto.precio}</strong>
          </p>
        )}

        {/* TALLES */}
        <h3 className="espacio">Talles disponibles</h3>

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
            <button disabled = {cantidad == 1 } onClick={() => setCantidad((c) => Math.max(1, c - 1))}>
              −
            </button>

            <span>{cantidad}</span>

            <button
              disabled= {cantidad == stockDisponible }
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
                  ? `${BASE_URL}${imagenPrincipal.src}`
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
