import { useProductos } from "../hooks/useProductos";
import ProductoCard from "../componentes/ProductoCard";

function Remeras({ agregarAlCarrito, carrito, abrirGaleria }) {
  const { productos, loading, error } = useProductos("Remeras");

  if (loading) return <p>Cargando Remeras...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      {productos.length === 0 && <p>No hay Remeras</p>}
      <h5>Remeras disponibles</h5>

      <div id="productos">
        {productos.map((producto) => (
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

export default Remeras;
