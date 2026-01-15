import { useProductos } from "../hooks/useProductos";
import ProductoCard from "../componentes/ProductoCard";

function Home({ agregarAlCarrito, carrito, abrirGaleria }) {
  const { productos, loading, error } = useProductos();

  if (loading) return <p>Cargando Home...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Home</h2>

      {productos.length === 0 && <p>No hay productos</p>}

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

export default Home;
