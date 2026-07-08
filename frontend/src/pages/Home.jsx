import { useProductos } from "../hooks/useProductos";
import ProductoCard from "../componentes/ProductoCard";

function Home({ abrirGaleria }) {
  const { productos, loading, error } = useProductos();

  if (loading) return <p className="text-center">Cargando Home...</p>;
  if (error) return <p className="text-center">{error}</p>;

  return (
    <div>

      {productos.length === 0 && <p className="text-center">No hay productos</p>}

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

export default Home;
