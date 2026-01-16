import { useProductos } from "../hooks/useProductos";
import ProductoCard from "../componentes/ProductoCard";

function Zapatillas({ agregarAlCarrito, carrito, abrirGaleria }) {
  const { productos, loading, error } = useProductos("Zapatillas");

  if (loading) return <p>Cargando zapatillas...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      

      {productos.length === 0 && <p>No hay zapatillas</p>}

      <div id="productos">
        {productos.map(producto => (
          <ProductoCard
            key={producto.idProducto}
            producto={producto}
            carrito={carrito}
            agregarAlCarrito={agregarAlCarrito}
            abrirGaleria={abrirGaleria}
          />
        ))}
      </div>
    </div>
  );
}

export default Zapatillas;