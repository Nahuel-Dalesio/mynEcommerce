import { useState } from "react";
import { BASE_URL } from "../config";

export function useGaleria() {
  const [imagenesGaleria, setImagenesGaleria] = useState([]);
  const [mostrarGaleria, setMostrarGaleria] = useState(false);

  const abrirGaleria = async (producto) => {
    if (Array.isArray(producto.imagenes)) {
      setImagenesGaleria(producto.imagenes);
    } else {
      const res = await fetch(
        `${BASE_URL}/api/productos/imagenes/${producto.idProducto}`,
      );
      const data = await res.json();
      setImagenesGaleria(data.map((img) => img.src));
    }
    setMostrarGaleria(true);
  };

  const cerrarGaleria = () => setMostrarGaleria(false);

  return { imagenesGaleria, mostrarGaleria, abrirGaleria, cerrarGaleria };
}