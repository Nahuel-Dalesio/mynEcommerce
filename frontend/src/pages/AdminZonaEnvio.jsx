import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useAdminEnvio } from "../hooks/useAdminEnvio";
import BotonVolver from "../componentes/BotonVolver";

const AdminZonasEnvio = () => {
  const { loading, error, fetchZonas, updateZona, fetchConfig, updateConfig } = useAdminEnvio();
  const [zonas, setZonas] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [borrador, setBorrador] = useState({ nombre: "", costo: "", activo: true });

  const [config, setConfig] = useState({ montoMinimoLocal: "", montoMinimoProvincias: "" });
  const [editandoConfig, setEditandoConfig] = useState(false);

  const loadZonas = async () => {
    const data = await fetchZonas();
    setZonas(data);
  };

  const loadConfig = async () => {
    const data = await fetchConfig();
    setConfig(data);
  };

  useEffect(() => {
    loadZonas();
    loadConfig();
  }, []);

  const handleEditar = (zona) => {
    setEditandoId(zona.idZonaEnvio);
    setBorrador({ nombre: zona.nombre, costo: zona.costo, activo: !!zona.activo });
  };

  const handleGuardar = async (idZonaEnvio) => {
    try {
      await updateZona(idZonaEnvio, borrador);
      Swal.fire("Actualizado", "Zona actualizada con éxito", "success");
      setEditandoId(null);
      loadZonas();
    } catch (err) {
      Swal.fire("Error", "No se pudo actualizar la zona", "error");
    }
  };

  const handleToggleActivo = async (zona) => {
    const nuevoEstado = !zona.activo;
    const result = await Swal.fire({
      title: nuevoEstado ? "¿Reactivar zona?" : "¿Desactivar zona?",
      text: nuevoEstado
        ? "La zona volverá a estar disponible para los clientes."
        : "Los clientes ya no van a poder elegir esta zona.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: nuevoEstado ? "Sí, reactivar" : "Sí, desactivar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      await updateZona(zona.idZonaEnvio, { nombre: zona.nombre, costo: zona.costo, activo: nuevoEstado });
      Swal.fire(
        nuevoEstado ? "Reactivada" : "Desactivada",
        `La zona ha sido ${nuevoEstado ? "reactivada" : "desactivada"}.`,
        "success"
      );
      loadZonas();
    } catch (err) {
      Swal.fire("Error", "No se pudo actualizar el estado de la zona.", "error");
    }
  };

  const handleGuardarConfig = async () => {
    try {
      await updateConfig(config);
      Swal.fire("Actualizado", "Montos mínimos actualizados", "success");
      setEditandoConfig(false);
      loadConfig();
    } catch (err) {
      Swal.fire("Error", "No se pudo actualizar la configuración", "error");
    }
  };

  if (loading && !zonas.length) return <p>Cargando zonas...</p>;

  return (
    <div className="admin-container" style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ margin: 0 }}>Zonas de Envío</h2>
        <BotonVolver to="/admin/productos" texto="← Volver a Productos" />
      </div>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {/* Montos mínimos */}
      <div style={{ background: "#f8f9fa", border: "1px solid #ddd", borderRadius: "6px", padding: "20px", marginBottom: "30px" }}>
        <h3 style={{ marginTop: 0 }}>Montos mínimos de compra</h3>
        {!editandoConfig ? (
          <>
            <p style={{ margin: "6px 0" }}>Envío local: ${config.montoMinimoLocal}</p>
            <p style={{ margin: "6px 0" }}>Envío a Provincias: ${config.montoMinimoProvincias}</p>
            <button
              onClick={() => setEditandoConfig(true)}
              style={{ padding: "8px 16px", background: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", marginTop: "10px" }}
            >
              Editar
            </button>
          </>
        ) : (
          <>
            <div style={{ display: "flex", gap: "16px", marginBottom: "10px" }}>
              <label>
                Local
                <input
                  type="number"
                  value={config.montoMinimoLocal}
                  onChange={(e) => setConfig({ ...config, montoMinimoLocal: e.target.value })}
                  style={{ display: "block", padding: "6px", marginTop: "4px" }}
                />
              </label>
              <label>
                Provincias
                <input
                  type="number"
                  value={config.montoMinimoProvincias}
                  onChange={(e) => setConfig({ ...config, montoMinimoProvincias: e.target.value })}
                  style={{ display: "block", padding: "6px", marginTop: "4px" }}
                />
              </label>
            </div>
            <button
              onClick={handleGuardarConfig}
              style={{ padding: "8px 16px", background: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", marginRight: "10px" }}
            >
              Guardar
            </button>
            <button
              onClick={() => setEditandoConfig(false)}
              style={{ padding: "8px 16px", background: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
            >
              Cancelar
            </button>
          </>
        )}
      </div>

      {/* Tabla de zonas */}
      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
        <thead>
          <tr style={{ background: "#eee" }}>
            <th style={{ padding: "10px", border: "1px solid #ccc" }}>Nombre</th>
            <th style={{ padding: "10px", border: "1px solid #ccc" }}>Tipo</th>
            <th style={{ padding: "10px", border: "1px solid #ccc" }}>Costo</th>
            <th style={{ padding: "10px", border: "1px solid #ccc" }}>Estado</th>
            <th style={{ padding: "10px", border: "1px solid #ccc" }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {zonas.map((zona) => (
            <tr key={zona.idZonaEnvio}>
              {editandoId === zona.idZonaEnvio ? (
                <>
                  <td style={{ padding: "10px", border: "1px solid #ccc" }}>
                    <input
                      type="text"
                      value={borrador.nombre}
                      onChange={(e) => setBorrador({ ...borrador, nombre: e.target.value })}
                      style={{ width: "100%", padding: "4px" }}
                    />
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ccc" }}>{zona.tipo}</td>
                  <td style={{ padding: "10px", border: "1px solid #ccc" }}>
                    <input
                      type="number"
                      value={borrador.costo}
                      onChange={(e) => setBorrador({ ...borrador, costo: e.target.value })}
                      style={{ width: "100%", padding: "4px" }}
                    />
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ccc" }}>
                    {borrador.activo ? "Activo" : "Inactivo"}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ccc", display: "flex", gap: "10px" }}>
                    <button
                      onClick={() => handleGuardar(zona.idZonaEnvio)}
                      style={{ padding: "5px 10px", background: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                    >
                      Guardar
                    </button>
                    <button
                      onClick={() => setEditandoId(null)}
                      style={{ padding: "5px 10px", background: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                    >
                      Cancelar
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td style={{ padding: "10px", border: "1px solid #ccc" }}>{zona.nombre}</td>
                  <td style={{ padding: "10px", border: "1px solid #ccc" }}>{zona.tipo}</td>
                  <td style={{ padding: "10px", border: "1px solid #ccc" }}>${zona.costo}</td>
                  <td style={{ padding: "10px", border: "1px solid #ccc" }}>
                    <span
                      style={{
                        padding: "3px 8px",
                        borderRadius: "4px",
                        fontSize: "0.85rem",
                        background: zona.activo ? "#d4edda" : "#f8d7da",
                        color: zona.activo ? "#155724" : "#721c24",
                      }}
                    >
                      {zona.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ccc", display: "flex", gap: "10px" }}>
                    <button
                      onClick={() => handleEditar(zona)}
                      style={{ padding: "5px 10px", background: "#ffc107", border: "none", borderRadius: "4px", cursor: "pointer" }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleToggleActivo(zona)}
                      style={{
                        padding: "5px 10px",
                        background: zona.activo ? "#dc3545" : "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      {zona.activo ? "Desactivar" : "Reactivar"}
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminZonasEnvio;