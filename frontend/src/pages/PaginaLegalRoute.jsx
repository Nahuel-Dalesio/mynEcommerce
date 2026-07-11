import { useParams } from "react-router-dom";
import PaginaLegal from "../componentes/PaginaLegal";
import { paginasLegales } from "../data/paginasLegales.data";
import "./paginaLegal.css";

export default function PaginaLegalRoute() {
  const { pagina } = useParams();
  const data = paginasLegales[pagina];

  if (!data) return <p className="text-center">Página no encontrada</p>;

  return <PaginaLegal {...data} className="pagina-legal-container" />;
}