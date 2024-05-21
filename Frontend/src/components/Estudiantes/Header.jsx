import React, { useState } from "react";
import { Link } from 'react-router-dom';

function Header() {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <header className="flex bg-[#1B396A] m-auto md:m-0 justify-between items-center px-4">
      <picture className="p-4 m-auto flex items-center md:items-center gap-4 md:m-0">
        <img alt="Logo CLE" src="/Opt/TecNM_blanco.png" />
        <h2 className="Montserrat text-white">Campus San Marcos EST </h2>
      </picture>



      {/* Menú principal (visible en pantallas grandes) */}
      <ul className="hidden md:flex Montserrat text-white flex-row gap-4">
        <Link to="/Login">
          <a  className="hover:font-semibold transition duration-300">Login</a>
        </Link>
        <Link to="/Registro">
          <a className="hover:font-semibold transition duration-300">Registro</a>
        </Link>
        <li>
          <Link to="/Documentacion" className="hover:font-semibold transition duration-300">
            Documentación y centro de ayuda
          </Link>
        </li>
      </ul>
    </header>
  );
}

export default Header;
