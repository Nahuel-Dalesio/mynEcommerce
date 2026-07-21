import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./formDatos.css";
import usePedido from "../hooks/usePedido.js";
import useEnvio from "../hooks/useEnvio.js";
import { AuthContext } from "../context/AuthContext";

function FormDatos({ limpiarCarrito }) {
  const { guardarPedido, loading } = usePedido();
  const { obtenerZonas, calcularCosto, loading: loadingEnvio } = useEnvio();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState(() => {
    if (user?.nombre && user?.apellido && user?.telefono) {
      return { nombre: user.nombre, apellido: user.apellido, telefono: user.telefono };
    }
    const guardado = localStorage.getItem("cliente");
    return guardado
      ? JSON.parse(guardado)
      : { nombre: "", apellido: "", telefono: "" };
  });

  // --- Estado de entrega ---
  const [tipoEntrega, setTipoEntrega] = useState("retiro");
  const [zonas, setZonas] = useState([]);
  const [idZonaEnvio, setIdZonaEnvio] = useState("");
  const [envioInfo, setEnvioInfo] = useState(null); // { disponible, costoEnvio, tipo, faltante }
  const [direccion, setDireccion] = useState({ calle: "", altura: "", localidad: "", provincia: "", codigoPostal: "", aclaraciones: "" });
  const [terminalInfo, setTerminalInfo] = useState({ localidad: "", provincia: "", codigoPostal: "", sucursalPreferencia: "" });
  const [confirmaTerminal, setConfirmaTerminal] = useState(false);

  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const totalProductos = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
  const costoEnvio = tipoEntrega === "envio" && envioInfo?.disponible ? envioInfo.costoEnvio : 0;
  const totalConEnvio = totalProductos + costoEnvio;

  function fmt(n) {
    return "$" + Number(n).toLocaleString("es-AR");
  }

  useEffect(() => {
    async function cargarZonas() {
      const data = await obtenerZonas();
      setZonas(data);
    }
    cargarZonas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function resetEnvio() {
    setIdZonaEnvio("");
    setEnvioInfo(null);
    setDireccion({ calle: "", altura: "", localidad: "", provincia: "", codigoPostal: "", aclaraciones: "" });
    setTerminalInfo({ localidad: "", provincia: "", codigoPostal: "", sucursalPreferencia: "" });
    setConfirmaTerminal(false);
  }

  function handleModoEntrega(modo) {
    setTipoEntrega(modo);
    if (modo === "retiro") resetEnvio();
  }

  async function handleSeleccionarZona(e) {
    const id = e.target.value;
    setIdZonaEnvio(id);
    setEnvioInfo(null);
    setConfirmaTerminal(false);

    if (!id) return;

    const resultado = await calcularCosto(Number(id), totalProductos);
    setEnvioInfo(resultado);
  }

  function handleDireccionChange(e) {
    setDireccion({ ...direccion, [e.target.name]: e.target.value });
  }

  function handleTerminalChange(e) {
    setTerminalInfo({ ...terminalInfo, [e.target.name]: e.target.value });
  }

  function enviarWhatsapp({ numeroPedido, cliente, carrito, total, entregaResumen, whatsappWindow }) {
    const telefono = "5491176194154";

    let mensaje = "";
    mensaje += "¡Hola! Quiero realizar un pedido\n\n";
    mensaje += "PRODUCTOS:\n";

    carrito.forEach((prod, i) => {
      mensaje += `${i + 1}.  ${prod.nombre} - ${prod.cantidad}u - Talle: ${prod.talle} - $${prod.precio}\n`;
    });

    mensaje += "\n" + entregaResumen;
    mensaje += "\nTOTAL: $" + total + "\n";
    mensaje += "PEDIDO: #" + numeroPedido + "\n\n";
    mensaje += "DATOS DEL CLIENTE:\n\n";
    mensaje += "Nombre: " + cliente.nombre + "\n";
    mensaje += "Apellido: " + cliente.apellido + "\n";
    mensaje += "Teléfono: " + cliente.telefono;

    const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;

    whatsappWindow.location.href = url;
  }

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function validarEnvio() {
    if (tipoEntrega !== "envio") return true;

    if (!idZonaEnvio || !envioInfo || !envioInfo.disponible) {
      Swal.fire({ title: "Elegí una zona de envío", icon: "warning" });
      return false;
    }
    if (envioInfo.tipo === "domicilio" && (!direccion.calle || !direccion.altura || !direccion.localidad || !direccion.provincia)) {
      Swal.fire({ title: "Faltan datos de la dirección", icon: "warning" });
      return false;
    }
    if (envioInfo.tipo === "terminal" && (!terminalInfo.localidad || !terminalInfo.provincia)) {
      Swal.fire({ title: "Faltan datos de destino", text: "Indicá localidad y provincia", icon: "warning" });
      return false;
    }
    if (envioInfo.tipo === "terminal" && !confirmaTerminal) {
      Swal.fire({ title: "Confirmá el envío a terminal", text: "Marcá la casilla para continuar", icon: "warning" });
      return false;
    }
    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.nombre || !formData.apellido || !formData.telefono) {
      Swal.fire({ title: "Completá todos los campos", icon: "warning" });
      return;
    }

    const telefonoLimpio = formData.telefono.replace(/\D/g, "");

    if (telefonoLimpio.length < 10 || telefonoLimpio.length > 13) {
      Swal.fire({
        title: "Teléfono inválido",
        text: "Forma correcta:\n11 2345 6789",
        icon: "error",
        customClass: { popup: "swal-pre" },
      });
      return;
    }

    if (!validarEnvio()) return;

    const result = await Swal.fire({
      title: "¿Confirmar pedido?",
      text: "Te vamos a redirigir a WhatsApp",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, continuar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    localStorage.setItem("cliente", JSON.stringify(formData));

    const entrega =
      tipoEntrega === "envio"
        ? {
            tipoEntrega: "envio",
            idZonaEnvio: Number(idZonaEnvio),
            localidadEnvio: envioInfo.tipo === "domicilio" ? direccion.localidad : terminalInfo.localidad,
            provinciaEnvio: envioInfo.tipo === "domicilio" ? direccion.provincia : terminalInfo.provincia,
            codigoPostalEnvio: envioInfo.tipo === "domicilio" ? direccion.codigoPostal : terminalInfo.codigoPostal,
            calle: envioInfo.tipo === "domicilio" ? direccion.calle : undefined,
            altura: envioInfo.tipo === "domicilio" ? direccion.altura : undefined,
            aclaracionesEnvio: envioInfo.tipo === "domicilio" ? direccion.aclaraciones : undefined,
            sucursalPreferencia: envioInfo.tipo === "terminal" ? terminalInfo.sucursalPreferencia : undefined,
          }
        : undefined;

    const whatsappWindow = window.open("about:blank", "_blank");

    const data = await guardarPedido({ cliente: formData, carrito, total: totalProductos, entrega });

    if (!data) {
      Swal.fire("Error", "No se pudo guardar el pedido", "error");
      whatsappWindow.close();
      return;
    }

    let entregaResumen;
    if (tipoEntrega === "retiro") {
      entregaResumen = "ENTREGA: Retiro\n";
    } else if (envioInfo.tipo === "domicilio") {
      entregaResumen =
        "ENTREGA: Envío a domicilio - " + fmt(costoEnvio) + " (costo aproximado, puede variar según la ubicación exacta)\n" +
        `Dirección: ${direccion.calle} ${direccion.altura}` +
        (direccion.aclaraciones ? ` (${direccion.aclaraciones})` : "") + "\n" +
        `Localidad: ${direccion.localidad}, ${direccion.provincia}` +
        (direccion.codigoPostal ? ` (CP ${direccion.codigoPostal})` : "") + "\n";
    } else {
      entregaResumen =
        "ENTREGA: Envío a terminal - " + fmt(costoEnvio) + " (costo aproximado, puede variar según la ubicación exacta)\n" +
        `Localidad: ${terminalInfo.localidad}, ${terminalInfo.provincia}` +
        (terminalInfo.codigoPostal ? ` (CP ${terminalInfo.codigoPostal})` : "") + "\n" +
        (terminalInfo.sucursalPreferencia ? `Sucursal de preferencia: ${terminalInfo.sucursalPreferencia}\n` : "");
    }

    enviarWhatsapp({
      numeroPedido: data.numeroPedido,
      cliente: formData,
      carrito,
      total: data.total,
      entregaResumen,
      whatsappWindow,
    });

    setFormData({ nombre: "", apellido: "", telefono: "" });
    limpiarCarrito();
    localStorage.removeItem("carrito");
    localStorage.removeItem("cliente");

    navigate("/");
  }

  return (
    <div className="checkout-container">
      <h2>Datos del Cliente</h2>

      <form onSubmit={handleSubmit} className="checkout-form">
        <label>Nombre</label>
        <input type="text" name="nombre" value={formData.nombre} placeholder="Julian" onChange={handleChange} required />

        <label>Apellido</label>
        <input type="text" name="apellido" value={formData.apellido} placeholder="Rodriguez" onChange={handleChange} required />

        <label>Teléfono</label>
        <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} placeholder="11 2345 6789" required />

        <div style={{ marginTop: 20, marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 8 }}>Método de entrega</label>
          <div style={{ display: "flex", gap: 8 }}>
            <button type="button" onClick={() => handleModoEntrega("retiro")} style={{ flex: 1, fontWeight: tipoEntrega === "retiro" ? "bold" : "normal" }}>
              Retiro
            </button>
            <button type="button" onClick={() => handleModoEntrega("envio")} style={{ flex: 1, fontWeight: tipoEntrega === "envio" ? "bold" : "normal" }}>
              Envío
            </button>
          </div>
        </div>

        {tipoEntrega === "envio" && (
          <div style={{ marginBottom: 16 }}>
            <label>Zona de envío</label>
            <select
              value={idZonaEnvio}
              onChange={handleSeleccionarZona}
              style={{ width: "100%", padding: "8px 10px", fontSize: 16 }}
              disabled={loadingEnvio}
            >
              <option value="">Elegí tu zona</option>
              {zonas.map((z) => (
                <option key={z.idZonaEnvio} value={z.idZonaEnvio}>
                  {z.nombre}
                </option>
              ))}
            </select>

            {envioInfo && !envioInfo.disponible && (
              <p style={{ color: "#b06a00", fontSize: 13, marginTop: 10 }}>
                Te faltan {fmt(envioInfo.faltante)} para acceder al envío a esta zona.
              </p>
            )}

            {envioInfo?.disponible && (
              <p style={{ fontSize: 13, marginTop: 10, background: "#eef4ff", padding: "8px 10px", borderRadius: 6 }}>
                Costo de envío: {fmt(costoEnvio)} — <em>costo aproximado, puede variar según la ubicación exacta.</em>
              </p>
            )}

            {envioInfo?.disponible && envioInfo.tipo === "domicilio" && (
              <div style={{ marginTop: 12 }}>
                <div style={{ display: "flex", gap: 8 }}>
                  <input type="text" name="calle" placeholder="Calle" value={direccion.calle} onChange={handleDireccionChange} style={{ flex: 2 }} />
                  <input type="text" name="altura" placeholder="Altura" value={direccion.altura} onChange={handleDireccionChange} style={{ flex: 1 }} />
                </div>
                <input
                  type="text"
                  name="localidad"
                  placeholder="Localidad"
                  value={direccion.localidad}
                  onChange={handleDireccionChange}
                  style={{ width: "100%", marginTop: 8 }}
                />
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <input
                    type="text"
                    name="provincia"
                    placeholder="Provincia"
                    value={direccion.provincia}
                    onChange={handleDireccionChange}
                    style={{ flex: 2 }}
                  />
                  <input
                    type="text"
                    name="codigoPostal"
                    placeholder="Código postal (opcional)"
                    value={direccion.codigoPostal}
                    onChange={handleDireccionChange}
                    style={{ flex: 1 }}
                  />
                </div>
                <input
                  type="text"
                  name="aclaraciones"
                  placeholder="Aclaraciones (piso, depto, entre calles)"
                  value={direccion.aclaraciones}
                  onChange={handleDireccionChange}
                  style={{ width: "100%", marginTop: 8 }}
                />
              </div>
            )}

            {envioInfo?.disponible && envioInfo.tipo === "terminal" && (
              <div style={{ marginTop: 12 }}>
                <input
                  type="text"
                  name="localidad"
                  placeholder="Localidad"
                  value={terminalInfo.localidad}
                  onChange={handleTerminalChange}
                  style={{ width: "100%", marginBottom: 8 }}
                />
                <input
                  type="text"
                  name="provincia"
                  placeholder="Provincia"
                  value={terminalInfo.provincia}
                  onChange={handleTerminalChange}
                  style={{ width: "100%", marginBottom: 8 }}
                />
                <input
                  type="text"
                  name="codigoPostal"
                  placeholder="Código postal (opcional)"
                  value={terminalInfo.codigoPostal}
                  onChange={handleTerminalChange}
                  style={{ width: "100%", marginBottom: 8 }}
                />
                <input
                  type="text"
                  name="sucursalPreferencia"
                  placeholder="Sucursal de preferencia (opcional)"
                  value={terminalInfo.sucursalPreferencia}
                  onChange={handleTerminalChange}
                  style={{ width: "100%" }}
                />
                <p style={{ fontSize: 12, color: "#777", marginTop: 4 }}>
                  Si no indicás una sucursal, el envío se hace a la más cercana a tu localidad.
                </p>
                <label style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8, fontSize: 13 }}>
                  <input type="checkbox" checked={confirmaTerminal} onChange={(e) => setConfirmaTerminal(e.target.checked)} />
                  Entiendo que mi pedido se envía a terminal
                </label>
              </div>
            )}
          </div>
        )}

        <div style={{ borderTop: "1px solid #ddd", paddingTop: 10, marginBottom: 16, fontSize: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Productos</span>
            <span>{fmt(totalProductos)}</span>
          </div>
          {costoEnvio > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Envío</span>
              <span>{fmt(costoEnvio)}</span>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", marginTop: 6 }}>
            <span>Total</span>
            <span>{fmt(totalConEnvio)}</span>
          </div>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Guardando..." : "Continuar"}
        </button>
      </form>
    </div>
  );
}

export default FormDatos;