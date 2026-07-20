import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useAdminEnvio } from "../hooks/useAdminEnvio";
import BotonVolver from "../componentes/BotonVolver";

const AdminLocalidadesZona = () => {
  const { loading, error, fetchZonas, buscarLocalidades, crearLocalidad, fetchLocalidadesMapeadas, asignarZona, quitarZona } =
    useAdminEnvio();

  const [zonasDomicilio, setZonasDomicilio] = useState([]);
  const [mapeadas, setMapeadas] = useState([]);

  const [texto, setTexto] = useState("");
  const [resultados, setResultados] = useState([]);
  const [zonaElegida, setZonaElegida] = useState({}); // { [idLocalidad]: idZonaEnvio }

  const [mostrarFormCrear, setMostrarFormCrear] = useState(false);
  const [nuevaLocalidad, setNuevaLocalidad] = useState({ codigoPostal: "", localidad: "", provincia: "" });

  const loadZonas = async () => {
    const data = await fetchZonas();
    setZonasDomicilio(data.filter((z) => z.tipo === "domicilio"));
  };

  const loadMapeadas = async () => {
    const data = await fetchLocalidadesMapeadas();
    setMapeadas(data);
  };

  useEffect(() => {
    loadZonas();
    loadMapeadas();
  }, []);

  const handleCrearLocalidad = async (e) => {
    e.preventDefault();
    const { codigoPostal, localidad, provincia } = nuevaLocalidad;

    if (!codigoPostal || !localidad || !provincia) {
      Swal.fire({ title: "Completá todos los campos", icon: "warning" });
      return;
    }
    if (!/^\d{4}$/.test(codigoPostal)) {
      Swal.fire({ title: "El código postal tiene que tener 4 dígitos", icon: "warning" });
      return;
    }

    try {
      await crearLocalidad(nuevaLocalidad);
      Swal.fire("Creada", "Localidad creada con éxito", "success");
      setNuevaLocalidad({ codigoPostal: "", localidad: "", provincia: "" });
      setMostrarFormCrear(false);
    } catch (err) {
      Swal.fire("Error", err.message || "No se pudo crear la localidad", "error");
    }
  };

  const handleBuscar = async (e) => {
    e.preventDefault();
    if (texto.trim().length < 2) {
      Swal.fire({ title: "Ingresá al menos 2 caracteres", icon: "warning" });
      return;
    }
    const data = await buscarLocalidades(texto.trim());
    setResultados(data);
  };

  const handleAsignar = async (idLocalidad) => {
    const idZonaEnvio = zonaElegida[idLocalidad];
    if (!idZonaEnvio) {
      Swal.fire({ title: "Elegí una zona primero", icon: "warning" });
      return;
    }
    try {
      await asignarZona(idLocalidad, idZonaEnvio);
      Swal.fire("Asignada", "La localidad quedó asignada a la zona elegida", "success");
      loadMapeadas();
    } catch (err) {
      Swal.fire("Error", "No se pudo asignar la zona", "error");
    }
  };

  const handleQuitar = async (idLocalidad) => {
    const result = await Swal.fire({
      title: "¿Quitar asignación?",
      text: "La localidad va a volver a caer en Provincias por default.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Sí, quitar",
      cancelButtonText: "Cancelar",
    });
    if (!result.isConfirmed) return;

    try {
      await quitarZona(idLocalidad);
      Swal.fire("Listo", "Se quitó la asignación", "success");
      loadMapeadas();
    } catch (err) {
      Swal.fire("Error", "No se pudo quitar la asignación", "error");
    }
  };

  return (
    <div className="admin-container" style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ margin: 0 }}>Localidades → Zona</h2>
        <BotonVolver to="/admin/productos" texto="← Volver a Productos" />
      </div>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {/* Alta manual de localidad */}
      <div style={{ background: "#f8f9fa", border: "1px solid #ddd", borderRadius: "6px", padding: "20px", marginBottom: "30px" }}>
        {!mostrarFormCrear ? (
          <button
            onClick={() => setMostrarFormCrear(true)}
            style={{ padding: "10px 20px", background: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
          >
            + Nueva localidad
          </button>
        ) : (
          <form onSubmit={handleCrearLocalidad}>
            <h3 style={{ marginTop: 0 }}>Nueva localidad</h3>
            <p style={{ fontSize: "0.85rem", color: "#777", marginTop: "-8px" }}>
              Usalo solo si la base no trae una localidad que necesitás (el import general cubre la mayoría del país).
            </p>
            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              <input
                type="text"
                placeholder="Código postal (4 dígitos)"
                value={nuevaLocalidad.codigoPostal}
                onChange={(e) =>
                  setNuevaLocalidad({ ...nuevaLocalidad, codigoPostal: e.target.value.replace(/\D/g, "").slice(0, 4) })
                }
                style={{ padding: "8px 10px", border: "1px solid #ccc", borderRadius: "4px", width: "160px" }}
              />
              <input
                type="text"
                placeholder="Localidad"
                value={nuevaLocalidad.localidad}
                onChange={(e) => setNuevaLocalidad({ ...nuevaLocalidad, localidad: e.target.value })}
                style={{ flex: 1, padding: "8px 10px", border: "1px solid #ccc", borderRadius: "4px" }}
              />
              <input
                type="text"
                placeholder="Provincia"
                value={nuevaLocalidad.provincia}
                onChange={(e) => setNuevaLocalidad({ ...nuevaLocalidad, provincia: e.target.value })}
                style={{ flex: 1, padding: "8px 10px", border: "1px solid #ccc", borderRadius: "4px" }}
              />
            </div>
            <button
              type="submit"
              style={{ padding: "8px 16px", background: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", marginRight: "10px" }}
            >
              Crear
            </button>
            <button
              type="button"
              onClick={() => {
                setMostrarFormCrear(false);
                setNuevaLocalidad({ codigoPostal: "", localidad: "", provincia: "" });
              }}
              style={{ padding: "8px 16px", background: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
            >
              Cancelar
            </button>
          </form>
        )}
      </div>

      {/* Buscador */}
      <form onSubmit={handleBuscar} style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          type="text"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Buscar localidad o provincia..."
          style={{ flex: 1, padding: "8px 10px", border: "1px solid #ccc", borderRadius: "4px" }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{ padding: "8px 20px", background: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
        >
          Buscar
        </button>
      </form>

      {resultados.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", marginBottom: "40px" }}>
          <thead>
            <tr style={{ background: "#eee" }}>
              <th style={{ padding: "10px", border: "1px solid #ccc" }}>Localidad</th>
              <th style={{ padding: "10px", border: "1px solid #ccc" }}>Provincia</th>
              <th style={{ padding: "10px", border: "1px solid #ccc" }}>CP</th>
              <th style={{ padding: "10px", border: "1px solid #ccc" }}>Asignar a zona</th>
              <th style={{ padding: "10px", border: "1px solid #ccc" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {resultados.map((loc) => (
              <tr key={loc.idLocalidad}>
                <td style={{ padding: "10px", border: "1px solid #ccc" }}>{loc.localidad}</td>
                <td style={{ padding: "10px", border: "1px solid #ccc" }}>{loc.provincia}</td>
                <td style={{ padding: "10px", border: "1px solid #ccc" }}>{loc.codigoPostal}</td>
                <td style={{ padding: "10px", border: "1px solid #ccc" }}>
                  <select
                    defaultValue=""
                    onChange={(e) =>
                      setZonaElegida({ ...zonaElegida, [loc.idLocalidad]: Number(e.target.value) })
                    }
                    style={{ padding: "6px" }}
                  >
                    <option value="" disabled>
                      Elegí zona
                    </option>
                    {zonasDomicilio.map((z) => (
                      <option key={z.idZonaEnvio} value={z.idZonaEnvio}>
                        {z.nombre}
                      </option>
                    ))}
                  </select>
                </td>
                <td style={{ padding: "10px", border: "1px solid #ccc" }}>
                  <button
                    onClick={() => handleAsignar(loc.idLocalidad)}
                    style={{ padding: "5px 10px", background: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                  >
                    Asignar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Localidades ya mapeadas */}
      <h3>Localidades ya asignadas</h3>
      {mapeadas.length === 0 ? (
        <p style={{ color: "#777" }}>Todavía no asignaste ninguna localidad. Todo cae en Provincias por default.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "#eee" }}>
              <th style={{ padding: "10px", border: "1px solid #ccc" }}>Localidad</th>
              <th style={{ padding: "10px", border: "1px solid #ccc" }}>Provincia</th>
              <th style={{ padding: "10px", border: "1px solid #ccc" }}>Zona asignada</th>
              <th style={{ padding: "10px", border: "1px solid #ccc" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {mapeadas.map((m) => (
              <tr key={m.idLocalidad}>
                <td style={{ padding: "10px", border: "1px solid #ccc" }}>{m.localidad}</td>
                <td style={{ padding: "10px", border: "1px solid #ccc" }}>{m.provincia}</td>
                <td style={{ padding: "10px", border: "1px solid #ccc" }}>{m.nombreZona}</td>
                <td style={{ padding: "10px", border: "1px solid #ccc" }}>
                  <button
                    onClick={() => handleQuitar(m.idLocalidad)}
                    style={{ padding: "5px 10px", background: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                  >
                    Quitar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminLocalidadesZona;