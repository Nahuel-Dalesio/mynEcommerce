// routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import ProductoDetalle from "../pages/ProductoDetalle";
import FormDatos from "../pages/FormDatos";
import AcercaDeMyn from "../pages/AcercaDeMyn";
import Contactanos from "../pages/Contatanos";
import Sugerencias from "../pages/Sugerencias";
import AdminProductos from "../pages/AdminProductos";
import Login from "../pages/Login";
import ProtectedRoute from "../componentes/ProtectedRoute";
import PaginaLegalRoute from "../pages/PaginaLegalRoute";
import AdminPedidos from "../pages/AdminPedidos";

export default function AppRoutes({ abrirGaleria, carrito, agregarAlCarrito, setCarrito }) {
  return (
    <Routes>
        <Route path="/" element={<Home abrirGaleria={abrirGaleria} />} />
        <Route
          path={`/categoria/:categoria`}
          element={<Home abrirGaleria={abrirGaleria} />}
        />

      <Route
        path="/producto/:id"
        element={<ProductoDetalle agregarAlCarrito={agregarAlCarrito} carrito={carrito} />}
      />

      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute requiredRole="admin" />}>
        <Route path="/admin/productos" element={<AdminProductos />} />
        <Route path="/admin/pedidos" element={<AdminPedidos />} />
      </Route>

      <Route path="/checkout" element={<FormDatos limpiarCarrito={() => setCarrito([])} />} />
      <Route path="/AcercaDeMyn" element={<AcercaDeMyn />} />
      <Route path="/Contactanos" element={<Contactanos />} />
      <Route path="/Sugerencias" element={<Sugerencias />} />
      <Route path="/legal/:pagina" element={<PaginaLegalRoute />} />

    </Routes>
  );
}