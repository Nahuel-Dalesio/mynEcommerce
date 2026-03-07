import React, { useState, useEffect } from "react";
import "./formProducto.css";

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
    <div className="form-container">
      <h3 className="title">{producto ? "Editar Producto" : "Nuevo Producto"}</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre del producto:</label>
          <input className="inputs" placeholder="Remera Rip Curl" type="text" name="nombre" value={formData.nombre} onChange={handleChange} required style={{ width: "100%" }} />
        </div>
        <div>
          <label>Descripción:</label>
          <textarea className="description" placeholder="Remeras corte clásico, algodón peinado 24/1" name="descripcion" value={formData.descripcion} onChange={handleChange} style={{ width: "100%" }} />
        </div>
        <div>
          <label>Precio:</label>
          <input type="number" name="precio" value={formData.precio} onChange={handleChange} required style={{ width: "100%" }} />
        </div>
        <div>
          <label>Categoría:</label>
          <select name="categoria" value={formData.categoria} onChange={handleChange} required style={{ width: "100%" }}>
            <option value="">Selecciona una...</option>
            <option value="Remeras">Remeras</option>
            <option value="Abrigos">Abrigos</option>
            <option value="Zapatillas">Zapatillas</option>
          </select>
        </div>
        <div className="checkbox-row">
          <label>
            ¿Es Destacado? <br />
            <span className="label-span">(Se vera en la pagina de inicio) </span>
          </label>
          
          <input className="check" type="checkbox" name="esDestacado" checked={formData.esDestacado === 1} onChange={handleChange} />
        </div>
        <div className="checkbox-row
        ">
          <label>¿En Oferta?  <br />
            <span className="label-span">(Se vera en la pagina de precio) </span>
          </label>
          <input className="check" type="checkbox" name="enOferta" checked={formData.enOferta === 1} onChange={handleChange} />
        </div>
        {formData.enOferta === 1 && (
          <div>
            {/* TODO: Hacer que cuando estamos en en editar producto si tiene precio oferta aparesca el check de en oferta marcado y con el display block del precio en oferta activo */}
            
            <label>Precio Oferta:</label>
            <input type="number" name="precioOferta" value={formData.precioOferta} onChange={handleChange} style={{ width: "100%" }} />
          </div>
        )}
        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <button type="submit" className="form-buttons">
            {producto ? "Actualizar" : "Guardar"}
          </button>
          <button type="button" onClick={onCancel} className="form-buttons">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormProducto;
