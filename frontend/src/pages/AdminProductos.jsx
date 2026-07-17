import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAdminProductos } from "../hooks/useAdminProductos";
import FormProducto from "../componentes/FormProducto";
import Swal from "sweetalert2";

const AdminProductos = () => {
  const { loading, error, fetchItems, fetchItemById, createItem, updateItem, toggleActivoItem } = useAdminProductos();
  const [productos, setProductos] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const loadProducts = async () => {
    const data = await fetchItems();
    setProductos(data);
  };

  useEffect(() => {
    loadProducts();
  }, [fetchItems]);

  const handleEdit = async (product) => {
    try {
      const productoCompleto = await fetchItemById(product.idProducto);
      setEditingProduct(productoCompleto);
      setShowForm(true);
    } catch (err) {
      Swal.fire("Error", "No se pudo cargar el producto para editar", "error");
    }
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleToggleActivo = async (prod) => {
    const nuevoEstado = !prod.activo;
    const result = await Swal.fire({
      title: nuevoEstado ? "¿Reactivar producto?" : "¿Desactivar producto?",
      text: nuevoEstado
        ? "El producto volverá a estar visible para los clientes."
        : "El producto dejará de mostrarse a los clientes.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: nuevoEstado ? "Sí, reactivar" : "Sí, desactivar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await toggleActivoItem(prod.idProducto, nuevoEstado);
        Swal.fire(
          nuevoEstado ? "Reactivado" : "Desactivado",
          `El producto ha sido ${nuevoEstado ? "reactivado" : "desactivado"}.`,
          "success"
        );
        loadProducts();
      } catch (err) {
        Swal.fire("Error", "No se pudo actualizar el estado del producto.", "error");
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingProduct) {
        await updateItem(editingProduct.idProducto, formData);
        Swal.fire("Actualizado", "Producto actualizado con éxito", "success");
      } else {
        await createItem(formData);
        Swal.fire("Creado", "Producto creado con éxito", "success");
      }
      setShowForm(false);
      loadProducts();
    } catch (err) {
      Swal.fire("Error", "Ocurrió un error al procesar la solicitud", "error");
    }
  };

  if (loading && !productos.length) return <p>Cargando productos...</p>;

  return (
    <div className="admin-container" style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ margin: 0 }}>Administración de Productos</h2>
        <Link
          to="/admin/pedidos"
          style={{
            padding: "10px 20px",
            background: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            textDecoration: "none",
            fontSize: "0.95rem",
          }}
        >
          Ir a Gestión de Pedidos →
        </Link>
      </div>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {!showForm ? (
        <>
          <button
            onClick={handleCreate}
            style={{ padding: "10px 20px", background: "#007bff", color: "white", border: "none", borderRadius: "4px", marginBottom: "20px", cursor: "pointer" }}
          >
            Nuevo Producto
          </button>

          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ background: "#eee" }}>
                <th style={{ padding: "10px", border: "1px solid #ccc" }}>ID</th>
                <th style={{ padding: "10px", border: "1px solid #ccc" }}>Nombre</th>
                <th style={{ padding: "10px", border: "1px solid #ccc" }}>Descripción</th>
                <th style={{ padding: "10px", border: "1px solid #ccc" }}>Precio</th>
                <th style={{ padding: "10px", border: "1px solid #ccc" }}>Precio de Oferta</th>
                <th style={{ padding: "10px", border: "1px solid #ccc" }}>Categoría</th>
                <th style={{ padding: "10px", border: "1px solid #ccc" }}>Estado</th>
                <th style={{ padding: "10px", border: "1px solid #ccc" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((prod) => (
                <tr key={prod.idProducto}>
                  <td style={{ padding: "10px", border: "1px solid #ccc" }}>{prod.idProducto}</td>
                  <td style={{ padding: "10px", border: "1px solid #ccc" }}>{prod.nombre}</td>
                  <td style={{ padding: "10px", border: "1px solid #ccc" }}>{prod.descripcion}</td>
                  <td style={{ padding: "10px", border: "1px solid #ccc" }}>${prod.precio}</td>
                  <td style={{ padding: "10px", border: "1px solid #ccc" }}>${prod.precioOferta}</td>
                  <td style={{ padding: "10px", border: "1px solid #ccc" }}>{prod.categoria}</td>
                  <td style={{ padding: "10px", border: "1px solid #ccc" }}>
                    <span style={{
                      padding: "3px 8px",
                      borderRadius: "4px",
                      fontSize: "0.85rem",
                      background: prod.activo ? "#d4edda" : "#f8d7da",
                      color: prod.activo ? "#155724" : "#721c24",
                    }}>
                      {prod.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ccc", display: "flex", gap: "10px" }}>
                    <button
                      onClick={() => handleEdit(prod)}
                      style={{ padding: "5px 10px", background: "#ffc107", border: "none", borderRadius: "4px", cursor: "pointer" }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleToggleActivo(prod)}
                      style={{
                        padding: "5px 10px",
                        background: prod.activo ? "#dc3545" : "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      {prod.activo ? "Desactivar" : "Reactivar"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <FormProducto
          producto={editingProduct}
          onSubmit={handleFormSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default AdminProductos;