import { useState } from "react";

export function useNavbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const toggleMenu = () => {
    setMenuAbierto(prev => !prev);
  };

  const cerrarMenu = () => {
    setMenuAbierto(false);
  };

  return {
    menuAbierto,
    toggleMenu,
    cerrarMenu
  };
}
