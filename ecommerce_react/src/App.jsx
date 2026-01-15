import { useState, useEffect } from "react";
import Header from "./componentes/Header.jsx";
import CrearUsuarioModal from "./componentes/CrearUsuario.jsx";
import Carrito from "./componentes/Carrito.jsx";
import Navbar from "./componentes/Navbar.jsx";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Remeras from "./pages/Remeras.jsx";
import Buzos from "./pages/Buzos.jsx";
import Camperas from "./pages/Camperas.jsx";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import GaleriaModal from "./componentes/GaleriaModal.jsx";

function App() {
  const [imagenesGaleria, setImagenesGaleria] = useState([]);
  const [mostrarGaleria, setMostrarGaleria] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(null);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const toggleCarrito = () => {
    setMostrarCarrito((prev) => !prev);
  };
  const [carrito, setCarrito] = useState(() => {
    const guardado = localStorage.getItem("carrito");
    return guardado ? JSON.parse(guardado) : [];
  });
  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);
  const eliminarDelCarrito = (idProducto) => {
    setCarrito((prev) =>
      prev.flatMap((p) => {
        if (p.idProducto !== idProducto) return p;
        if (p.cantidad > 1) {
          return { ...p, cantidad: p.cantidad - 1 };
        }
        return [];
      })
    );
  };
  const agregarAlCarrito = (producto, cantidad) => {
    setCarrito((prev) => {
      const existe = prev.find((p) => p.idProducto === producto.idProducto);

      if (existe) {
        if (existe.cantidad + cantidad > producto.stock) {
          toast.error(`No hay suficiente stock de "${producto.nombre}"`, {
            toastId: producto.idProducto, // id único
            autoClose: 2000,
            hideProgressBar: true,
          });
          return prev;
        }
        toast.info(`Se agregó otra unidad de "${producto.nombre}"`, {
          toastId: producto.idProducto, // id único
          autoClose: 1000,
          hideProgressBar: true,
        });
        return prev.map((p) =>
          p.idProducto === producto.idProducto
            ? { ...p, cantidad: p.cantidad + cantidad }
            : p
        );
      }
      toast.success(`Producto "${producto.nombre}" agregado al carrito`, {
        toastId: producto.idProducto, // id único
        autoClose: 1000,
        hideProgressBar: true,
      });
      return [...prev, { ...producto, cantidad }];
    });
  };
  const totalCarrito = carrito.reduce(
    (acc, prod) => acc + prod.precio * prod.cantidad,
    0
  );
  const comprar = () => {
    if (carrito.length === 0)
      return Swal.fire({
        title: "El carrito está vacío",
      });
    Swal.fire({
      title: "¿Desea confirmar su compra?",
      text: `Total a pagar: $${totalCarrito}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Comprar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        setMostrarCarrito(false);
        setCarrito([]);
        Swal.fire({
          title: "¡Compra realizada con éxito!",
          text: "Gracias por tu compra 😊",
          icon: "success",
          confirmButtonText: "Aceptar",
        });
      }
    });
  };
  const abrirGaleria = async (producto) => {
  // Si ya vienen imágenes (raro)
  if (Array.isArray(producto.imagenes)) {
    setImagenesGaleria(producto.imagenes);
  } else {
    // pedirlas al backend
    const res = await fetch(
      `http://localhost:3001/api/productos/imagenes/${producto.idProducto}`
    );
    const data = await res.json();

    setImagenesGaleria(data.map(img => img.src));
  }

  setMostrarGaleria(true);
};
  return (
    <>
      <Header
        onCrearUsuario={() => setMostrarModal("crear")}
        onIniciarSesion={() => setMostrarModal("login")}
        onAbrirCarrito={toggleCarrito}
      />
      {mostrarModal === "crear" && (
        <CrearUsuarioModal onClose={() => setMostrarModal(null)} />
      )}
      {/* {mostrarModal === "login" && (
        <IniciarSesionModal onClose={() => setMostrarModal(null)} />
      )} */}
      <Carrito
        abierto={mostrarCarrito}
        carrito={carrito}
        eliminarDelCarrito={eliminarDelCarrito}
        totalCarrito={totalCarrito}
        comprar={comprar}
      />
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <Home
              abrirGaleria={abrirGaleria}
              carrito={carrito}
              agregarAlCarrito={agregarAlCarrito}
            />
          }
        />
        <Route
          path="/remeras"
          element={
            <Remeras
              abrirGaleria={abrirGaleria}
              carrito={carrito}
              agregarAlCarrito={agregarAlCarrito}
            />
          }
        />
        <Route
          path="/buzos"
          element={
            <Buzos
              abrirGaleria={abrirGaleria}
              carrito={carrito}
              agregarAlCarrito={agregarAlCarrito}
            />
          }
        />
        <Route
          path="/camperas"
          element={
            <Camperas
              abrirGaleria={abrirGaleria}
              carrito={carrito}
              agregarAlCarrito={agregarAlCarrito}
            />
          }
        />
      </Routes>
      {mostrarGaleria && (
        <GaleriaModal
          imagenes={imagenesGaleria}
          onClose={() => setMostrarGaleria(false)}
        />
      )}

      <ToastContainer />
    </>
  );
}

export default App;
