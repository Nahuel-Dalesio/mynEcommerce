import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './formDatos.css';
import usePedido from '../hooks/usePedido.js';

function FormDatos({ limpiarCarrito }) {
  const { guardarPedido, error, loading } = usePedido();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(() => {
    const guardado = localStorage.getItem('cliente');
    return guardado
      ? JSON.parse(guardado)
      : { nombre: '', apellido: '', telefono: '' };
  });

  function enviarWhatsapp({ numeroPedido, cliente, carrito, total }) {
    const telefono = '5491176194154'; // tu número de WhatsApp

    // Construir mensaje completo
    let mensaje = `¡Hola! Quiero realizar un pedido.\r\n`;

    mensaje += `🛒 Productos:\r\n`;
    carrito.forEach((p, i) => {
      mensaje += `${i + 1}. ${p.nombre} - Talle: ${p.talle} - Cantidad: ${p.cantidad} - $${p.precio}\n`;
    });

    mensaje += `💵 Total: $${total}\r\n`;
    mensaje += `📦 Número de pedido: #${numeroPedido}`;

    mensaje += `👤 Datos del cliente:\r\n`;

    mensaje += `Nombre: ${cliente.nombre}\r\n`;
    mensaje += `Apellido: ${cliente.apellido}\r\n`;
    mensaje += `Teléfono: ${cliente.telefono}\r\n`;

    // Abrir WhatsApp
    const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  }

  // Manejo de inputs
  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  // Enviar formulario
  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.nombre || !formData.apellido || !formData.telefono) {
      Swal.fire({ title: 'Completá todos los campos', icon: 'warning' });
      return;
    }

    const telefonoLimpio = formData.telefono.replace(/\D/g, '');

    // Validar formato
    if (telefonoLimpio.length < 10 || telefonoLimpio.length > 13) {
      Swal.fire({
        title: 'Teléfono inválido',
        text: 'Forma correcta:\n11 2345 6789',
        icon: 'error',
        customClass: {
          popup: 'swal-pre',
        },
      });
      return;
    }

    const result = await Swal.fire({
      title: '¿Confirmar pedido?',
      text: 'Te vamos a redirigir a WhatsApp',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar',
    });

    if (!result.isConfirmed) return;

    // Guardar cliente en localStorage
    localStorage.setItem('cliente', JSON.stringify(formData));

    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const total = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

    const data = await guardarPedido({ cliente: formData, carrito, total });

    if (!data) {
      Swal.fire('Error', 'No se pudo guardar el pedido', 'error');
      return;
    }

    // Enviar mensaje a WhatsApp
    enviarWhatsapp({
      numeroPedido: data.numeroPedido,
      cliente: formData,
      carrito,
      total,
    });
    // ✅ Limpiar campos del formulario
    setFormData({ nombre: '', apellido: '', telefono: '' });

    // ✅ Limpiar carrito si querés
    limpiarCarrito();
    localStorage.removeItem('carrito');
    localStorage.removeItem('cliente');

    // ✅ Volver a inicio
    navigate('/');
  }

  return (
    <div className='checkout-container'>
      <h2>Datos del Cliente</h2>

      <form onSubmit={handleSubmit} className='checkout-form'>
        <label>Nombre</label>
        <input
          type='text'
          name='nombre'
          value={formData.nombre}
          placeholder='Julian'
          onChange={handleChange}
          required
        />

        <label>Apellido</label>
        <input
          type='text'
          name='apellido'
          value={formData.apellido}
          placeholder='Rodriguez'
          onChange={handleChange}
          required
        />

        <label>Teléfono</label>
        <input
          type='tel'
          name='telefono'
          value={formData.telefono}
          onChange={handleChange}
          placeholder='11 2345 6789'
          required
        />

        <button type='submit' disabled={loading}>
          {loading ? 'Guardando...' : 'Continuar'}
        </button>
      </form>
    </div>
  );
}

export default FormDatos;
