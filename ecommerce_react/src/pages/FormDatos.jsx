import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './formDatos.css';
import usePedido from '../hooks/usePedido.js';

function FormDatos({limpiarCarrito}) {
  const { guardarPedido, error, loading } = usePedido();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(() => {
    const guardado = localStorage.getItem('cliente');
    return guardado
      ? JSON.parse(guardado)
      : { nombre: '', apellido: '', telefono: '' };
  });

  function enviarWhatsapp({ pedidoId, cliente, carrito, total }) {
    const telefono = '5491176194154'; // tu número de WhatsApp

    // Construir mensaje completo
    let mensaje = `¡Hola! Quiero realizar un pedido.\n\n`;
    mensaje += `Cliente:\n`;
    mensaje += `Nombre: ${cliente.nombre}\n`;
    mensaje += `Apellido: ${cliente.apellido}\n`;
    mensaje += `Teléfono: ${cliente.telefono}\n\n`;

    mensaje += `Productos:\n`;
    carrito.forEach((p, i) => {
      mensaje += `${i + 1}. ${p.nombre} - Talle: ${p.talle} - Cantidad: ${p.cantidad} - $${p.precio}\n`;
    });

    mensaje += `\nTotal: $${total}\n`;
    mensaje += `Pedido ID: ${pedidoId}`;

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
      pedidoId: data.pedidoId,
      cliente: formData,
      carrito,
      total,
    });
    // ✅ Limpiar campos del formulario
    setFormData({ nombre: '', apellido: '', telefono: '' });

    // ✅ Limpiar carrito si querés
    limpiarCarrito();
    localStorage.removeItem('carrito');

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
          onChange={handleChange}
          required
        />

        <label>Apellido</label>
        <input
          type='text'
          name='apellido'
          value={formData.apellido}
          onChange={handleChange}
          required
        />

        <label>Teléfono</label>
        <input
          type='tel'
          name='telefono'
          value={formData.telefono}
          onChange={handleChange}
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
