import { useProductos } from "../hooks/useProductos";
import ProductoCard from "../componentes/ProductoCard";

function Abrigos({abrirGaleria }) {
  const { productos, loading, error } = useProductos("Abrigos");

  if (loading) return <p>Cargando abrigos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Abrigos</h2>

      {productos.length === 0 && <p>No hay abrigos</p>}

      <div id="productos">
        {productos.map(producto => (
          <ProductoCard
            key={producto.idProducto}
            producto={producto}
            // carrito={carrito}
            // agregarAlCarrito={agregarAlCarrito}
            abrirGaleria={abrirGaleria}
          />
        ))}
      </div>
    </div>
  );
}

export default Abrigos;
