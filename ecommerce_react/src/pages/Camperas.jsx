import { useProductos } from "../hooks/useProductos";
import ProductoCard from "../componentes/ProductoCard";

function Camperas({ agregarAlCarrito, carrito, abrirGaleria }) {
  const { productos, loading, error } = useProductos("Camperas");

  if (loading) return <p>Cargando Camperas...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Camperas</h2>

      {productos.length === 0 && <p>No hay Camperas</p>}

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

export default Camperas;