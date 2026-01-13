import { useProductos } from "../hooks/useProductos";
import ProductoCard from "../componentes/ProductoCard";

function Buzos({ agregarAlCarrito, carrito, abrirGaleria }) {
  const { productos, loading, error } = useProductos("Buzos");

  if (loading) return <p>Cargando buzos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Buzos</h2>

      {productos.length === 0 && <p>No hay buzos</p>}

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

export default Buzos;
