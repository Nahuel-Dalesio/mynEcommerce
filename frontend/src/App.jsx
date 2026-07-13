import { useState, useRef } from 'react';
import Header from './componentes/Header.jsx';
import CrearUsuarioModal from './componentes/CrearUsuario.jsx';
import Carrito from './componentes/Carrito.jsx';
import Navbar from './componentes/Navbar.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GaleriaModal from './componentes/GaleriaModal.jsx';
import Footer from './componentes/Footer.jsx';
import { AuthProvider } from "./context/AuthContext";
import ScrollToTop from "./componentes/ScrollToTop";
import AppRoutes from "./routes/AppRoutes";
import { useCategorias } from "./hooks/useCategorias";
import { useCarrito } from "./hooks/useCarrito";
import { useGaleria } from "./hooks/useGaleria";

function App() {
  const [mostrarModal, setMostrarModal] = useState(null);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const { categorias } = useCategorias();
  const { carrito, setCarrito, agregarAlCarrito, eliminarDelCarrito, totalCarrito } = useCarrito();
  const { imagenesGaleria, mostrarGaleria, abrirGaleria, cerrarGaleria } = useGaleria();
  const toggleButtonRef = useRef(null);

  const toggleCarrito = () => setMostrarCarrito((prev) => !prev);
  const cerrarCarrito = () => setMostrarCarrito(false);

  return (
    <AuthProvider>
      <Header
        onCrearUsuario={() => setMostrarModal('crear')}
        onIniciarSesion={() => setMostrarModal('login')}
        onAbrirCarrito={toggleCarrito}
        toggleButtonRef={toggleButtonRef}
      />
      <Navbar categories={categorias} />
      <AppRoutes
        abrirGaleria={abrirGaleria}
        carrito={carrito}
        agregarAlCarrito={agregarAlCarrito}
        setCarrito={setCarrito}
      />
      {mostrarModal === 'crear' && (
        <CrearUsuarioModal onClose={() => setMostrarModal(null)} />
      )}
      <Carrito
        abierto={mostrarCarrito}
        carrito={carrito}
        eliminarDelCarrito={eliminarDelCarrito}
        totalCarrito={totalCarrito}
        cerrarCarrito={cerrarCarrito}
        toggleButtonRef={toggleButtonRef}
      />
      <ScrollToTop />
      {mostrarGaleria && (
        <GaleriaModal imagenes={imagenesGaleria} onClose={cerrarGaleria} />
      )}
      <Footer categories={categorias} />
      <ToastContainer />
    </AuthProvider>
  );
}

export default App;