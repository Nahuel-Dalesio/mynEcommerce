import { useProductos } from "../hooks/useProductos";
import ProductoCard from "../componentes/ProductoCard";

function Abrigos({abrirGaleria }) {
  const { productos, loading, error } = useProductos("Abrigos");

  if (loading) return <p className="text-center">Cargando abrigos...</p>;
  if (error) return <p className="text-center">{error}</p>;

  return (
    <div>
      <h2 className="text-center">Abrigos</h2>

      {productos.length === 0 && <p className="text-center">No hay abrigos</p>}

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
