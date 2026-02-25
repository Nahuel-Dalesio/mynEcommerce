import React, { useState, useEffect } from "react";

const FormProducto = ({ producto, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    esDestacado: 0,
    enOferta: 0,
    precioOferta: "",
    categoria: "",
  });

  useEffect(() => {
    if (producto) {
      setFormData({
        nombre: producto.nombre || "",
        descripcion: producto.descripcion || "",
        precio: producto.precio || "",
        esDestacado: producto.esDestacado || 0,
        enOferta: producto.enOferta || 0,
        precioOferta: producto.precioOferta || "",
        categoria: producto.categoria || "",
      });
    }
  }, [producto]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    if (!formData.nombre || !formData.precio || !formData.categoria) {
      alert("Por favor completa los campos obligatorios (Nombre, Precio, Categoría)");
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="form-container" style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "8px", background: "#f9f9f9", maxWidth: "500px", margin: "20px auto" }}>
      <h3>{producto ? "Editar Producto" : "Nuevo Producto"}</h3>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div>
          <label>Nombre*:</label>
          <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required style={{ width: "100%" }} />
        </div>
        <div>
          <label>Descripción:</label>
          <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} style={{ width: "100%" }} />
        </div>
        <div>
          <label>Precio*:</label>
          <input type="number" name="precio" value={formData.precio} onChange={handleChange} required style={{ width: "100%" }} />
        </div>
        <div>
          <label>Categoría*:</label>
          <select name="categoria" value={formData.categoria} onChange={handleChange} required style={{ width: "100%" }}>
            <option value="">Selecciona una...</option>
            <option value="Remeras">Remeras</option>
            <option value="Abrigos">Abrigos</option>
            <option value="Zapatillas">Zapatillas</option>
          </select>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <label>¿Es Destacado?</label>
          <input type="checkbox" name="esDestacado" checked={formData.esDestacado === 1} onChange={handleChange} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <label>¿En Oferta?</label>
          <input type="checkbox" name="enOferta" checked={formData.enOferta === 1} onChange={handleChange} />
        </div>
        {formData.enOferta === 1 && (
          <div>
            <label>Precio Oferta:</label>
            <input type="number" name="precioOferta" value={formData.precioOferta} onChange={handleChange} style={{ width: "100%" }} />
          </div>
        )}
        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <button type="submit" style={{ padding: "8px 16px", background: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
            {producto ? "Actualizar" : "Guardar"}
          </button>
          <button type="button" onClick={onCancel} style={{ padding: "8px 16px", background: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormProducto;
