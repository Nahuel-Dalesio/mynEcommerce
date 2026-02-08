import { useState } from "react";
import "./GaleriaModal.css";

function GaleriaModal({ imagenes , onClose }) {
  const [index, setIndex] = useState(0);

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal galeria" onClick={(e) => e.stopPropagation()}>
        

        <button className="btnGaleria izq" disabled={index === 0} onClick={() => setIndex(i => Math.max(0, i - 1))}>◀</button>
        <img src={imagenes[index]} />
        <button className="btnGaleria der" disabled={index === imagenes.length - 1} onClick={() => setIndex(i => Math.min(imagenes.length - 1, i + 1))}>▶</button>

        <button className="btnGaleria cerrar" onClick={onClose}>✕</button>
      </div>
    </div>
  );
}
export default GaleriaModal;