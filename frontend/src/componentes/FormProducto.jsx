import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "./formProducto.css";
import { useCategoriasAdmin } from "../hooks/useCategoriasAdmin";
import { BASE_URL } from "../config";

const FormProducto = ({ producto, onSubmit, onCancel }) => {
  const { token } = useContext(AuthContext);
  const { categorias: categoriasApi } = useCategoriasAdmin();
  const [categoriasLocal, setCategoriasLocal] = useState([]);
  const [creandoCategoria, setCreandoCategoria] = useState(false);
  const [nuevaCategoria, setNuevaCategoria] = useState("");
  const [imagenesDisponibles, setImagenesDisponibles] = useState([]);
  const [cargandoImagenes, setCargandoImagenes] = useState(true);

  useEffect(() => {
    setCategoriasLocal(categoriasApi);
  }, [categoriasApi]);

  useEffect(() => {
    const fetchImagenes = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/products/imagenes-disponibles`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setImagenesDisponibles(data);
      } catch (err) {
        console.error("No se pudieron cargar las imágenes disponibles", err);
      } finally {
        setCargandoImagenes(false);
      }
    };
    fetchImagenes();
  }, [token]);

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    esDestacado: 0,
    enOferta: 0,
    precioOferta: "",
    idCategoria: "",
    imagenes: [],
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
        idCategoria: producto.idCategoria || "",
        imagenes: Array.isArray(producto.imagenes) ? producto.imagenes : [],
      });
    }
  }, [producto]);

  const handleCategoriaChange = (e) => {
    const value = e.target.value;
    if (value === "__nueva__") {
      setCreandoCategoria(true);
      setFormData((prev) => ({ ...prev, idCategoria: "" }));
    } else {
      setCreandoCategoria(false);
      setFormData((prev) => ({ ...prev, idCategoria: value }));
    }
  };

  const handleCrearCategoria = async () => {
    if (!nuevaCategoria.trim()) return;
    try {
      const res = await fetch(`${BASE_URL}/api/categorias`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nombre: nuevaCategoria.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Error al crear categoría");
        return;
      }
      setCategoriasLocal((prev) => [...prev, data]);
      setFormData((prev) => ({ ...prev, idCategoria: data.idCategoria }));
      setCreandoCategoria(false);
      setNuevaCategoria("");
    } catch (err) {
      alert("Error de conexión al crear categoría");
    }
  };

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
    if (!formData.nombre || !formData.precio || !formData.idCategoria) {
      alert(
        "Por favor completa los campos obligatorios (Nombre, Precio, Categoría)",
      );
      return;
    }

    const product = {
      ...formData,
      precioOferta:
        formData.enOferta === 1 && formData.precioOferta
          ? Number(formData.precioOferta)
          : null,
    };

    onSubmit(product);
  };

  return (
    <div className="form-container">
      <h3 className="title">
        {producto ? "Editar Producto" : "Nuevo Producto"}
      </h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre del producto:*</label>
          <input
            className="inputs"
            placeholder="Remera Rip Curl"
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            style={{ width: "100%" }}
          />
        </div>
        <div>
          <label>Descripción:</label>
          <textarea
            className="description"
            placeholder="Remeras corte clásico, algodón peinado 24/1"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            style={{ width: "100%" }}
          />
        </div>
        <div>
          <label>Precio:*</label>
          <input
            type="number"
            name="precio"
            value={formData.precio}
            onChange={handleChange}
            required
            style={{ width: "100%" }}
          />
        </div>
        <div>
          <label>Categoría:*</label>
          <select
            name="idCategoria"
            value={formData.idCategoria}
            onChange={handleCategoriaChange}
            required
            style={{ width: "100%" }}
          >
            <option value="">Selecciona una...</option>
            {categoriasLocal.map((cat) => (
              <option key={cat.idCategoria} value={cat.idCategoria}>
                {cat.nombre}
              </option>
            ))}
            <option value="__nueva__">+ Crear nueva categoría</option>
          </select>
          {creandoCategoria && (
            <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
              <input
                type="text"
                placeholder="Nombre de la nueva categoría"
                value={nuevaCategoria}
                onChange={(e) => setNuevaCategoria(e.target.value)}
                style={{ flex: 1 }}
              />
              <button type="button" onClick={handleCrearCategoria}>
                Crear
              </button>
            </div>
          )}
        </div>
        <div>
          <label>Imágenes</label>

          {formData.imagenes.map((img, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "5px",
              }}
            >
              {img && (
                <img
                  src={img}
                  alt={`Imagen ${index + 1}`}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                  onLoad={(e) => {
                    e.target.style.display = "block";
                  }}
                  style={{
                    width: "48px",
                    height: "48px",
                    objectFit: "cover",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    flexShrink: 0,
                  }}
                />
              )}
              <select
                value={img}
                onChange={(e) => {
                  const nuevas = [...formData.imagenes];
                  nuevas[index] = e.target.value;
                  setFormData({ ...formData, imagenes: nuevas });
                }}
                style={{ width: "100%" }}
              >
                <option value="">
                  {cargandoImagenes ? "Cargando imágenes..." : "Selecciona una imagen..."}
                </option>
                {img && !imagenesDisponibles.includes(img) && (
                  <option value={img}>{img} (no encontrada en el repo)</option>
                )}
                {imagenesDisponibles.map((ruta) => (
                  <option key={ruta} value={ruta}>
                    {ruta}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => {
                  const nuevas = formData.imagenes.filter((_, i) => i !== index);
                  setFormData({ ...formData, imagenes: nuevas });
                }}
                title="Quitar imagen"
                style={{ flexShrink: 0 }}
              >
                ✕
              </button>
            </div>
          ))}

          <button
            className="agregar-imagen"
            type="button"
            onClick={() =>
              setFormData({
                ...formData,
                imagenes: [...formData.imagenes, ""],
              })
            }
          >
            + Agregar imagen
          </button>
        </div>
        <div className="checkbox-row">
          <label>
            ¿Es Destacado? <br />
            <span className="label-span">
              (Se vera en la pagina de inicio){" "}
            </span>
          </label>

          <input
            className="check"
            type="checkbox"
            name="esDestacado"
            checked={formData.esDestacado === 1}
            onChange={handleChange}
          />
        </div>
        <div
          className="checkbox-row
        "
        >
          <label>
            ¿En Oferta? <br />
            <span className="label-span">
              (Se vera en la pagina de precio){" "}
            </span>
          </label>
          <input
            className="check"
            type="checkbox"
            name="enOferta"
            checked={formData.enOferta === 1}
            onChange={handleChange}
          />
        </div>
        {formData.enOferta === 1 && (
          <div>
            {/* TODO: Hacer que cuando estamos en en editar producto si tiene precio oferta aparesca el check de en oferta marcado y con el display block del precio en oferta activo */}

            <label>Precio Oferta:</label>
            <input
              type="number"
              name="precioOferta"
              value={formData.precioOferta}
              onChange={handleChange}
              style={{ width: "100%" }}
            />
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