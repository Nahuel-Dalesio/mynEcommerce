import { useProductos } from "../hooks/useProductos";
import ProductoCard from "../componentes/ProductoCard";


function Remeras({abrirGaleria }) {
  const { productos, loading, error } = useProductos("Remeras");

  if (loading) return <p className="text-center">Cargando Remeras...</p>;
  if (error) return <p className="text-center">{error}</p>;

  return (
    <div>
      {productos.length === 0 && <p className="text-center">No hay Remeras</p>}
      <h5 className="text-center">Remeras disponibles</h5>

      <div id="productos">
        {productos.map((producto) => (
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

export default Remeras;
