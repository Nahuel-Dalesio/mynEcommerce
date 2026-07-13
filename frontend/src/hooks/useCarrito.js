import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export function useCarrito() {
  const [carrito, setCarrito] = useState(() => {
    const guardado = localStorage.getItem("carrito");
    return guardado ? JSON.parse(guardado) : [];
  });

  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  const eliminarDelCarrito = (idProducto, talle) => {
    setCarrito((prev) =>
      prev.flatMap((p) => {
        if (p.idProducto !== idProducto || p.talle !== talle) return p;
        if (p.cantidad > 1) {
          return { ...p, cantidad: p.cantidad - 1 };
        }
        return [];
      }),
    );
  };

  const agregarAlCarrito = (producto, talle, cantidad, stockTalle) => {
    setCarrito((prev) => {
      const existe = prev.find(
        (p) => p.idProducto === producto.idProducto && p.talle === talle,
      );

      if (existe) {
        if (existe.cantidad + cantidad > stockTalle) {
          toast.error(`No hay suficiente stock de "${producto.nombre}"`, {
            toastId: `${producto.idProducto}-${talle}`,
            autoClose: 500,
            hideProgressBar: true,
          });
          return prev;
        }
        toast.info(`Se agregó otra unidad de "${producto.nombre}"`, {
          toastId: `${producto.idProducto}-${talle}`,
          autoClose: 500,
          hideProgressBar: true,
        });
        return prev.map((p) =>
          p.idProducto === producto.idProducto && p.talle === talle
            ? { ...p, cantidad: p.cantidad + cantidad }
            : p,
        );
      }
      toast.success(`Producto "${producto.nombre}" agregado al carrito`, {
        toastId: `${producto.idProducto}-${talle}`,
        autoClose: 500,
        hideProgressBar: true,
      });
      return [
        ...prev,
        {
          idProducto: producto.idProducto,
          nombre: producto.nombre,
          precio: producto.precioOferta ?? producto.precio,
          talle,
          cantidad,
          stock: stockTalle,
          imagen: producto.imagenes.find((img) => img.esPrincipal === 1)?.src,
        },
      ];
    });
  };

  const totalCarrito = carrito.reduce(
    (acc, prod) => acc + prod.precio * prod.cantidad,
    0,
  );

  return { carrito, setCarrito, agregarAlCarrito, eliminarDelCarrito, totalCarrito };
}