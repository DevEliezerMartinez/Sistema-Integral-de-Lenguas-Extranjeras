import React, { useState } from "react";
import { Link } from 'react-router-dom';

function Header() {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <header className="flex bg-[#1B396A] m-auto md:m-0 justify-between items-center px-4">
      <Link to="/">
      <picture className="p-4 m-auto flex items-center md:items-center gap-4 md:m-0">
        <img alt="Logo CLE" src="/Opt/TecNM_blanco.png" />
        <h2 className="Montserrat text-white">Campus San Marcos</h2>
      </picture>
      </Link>

      {/* Menú de hamburguesa */}
      <div className="md:hidden">
        <button
          className="text-white"
          onClick={toggleMenu}
        >
           <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16m-7 6h7"
          ></path>
        </svg>
        </button>
        {showMenu && (
          <ul className="absolute top-16 right-4 bg-[#1B396A] p-4 rounded-md">
            <li>
              <a href="#acerca-del-cle" className="text-white hover:font-semibold transition duration-300">Acerca del CLE</a>
            </li>
            <li>
              <a href="#requisitos" className="text-white hover:font-semibold transition duration-300">Requisitos</a>
            </li>
            <li>
              <Link to="/Documentacion" className="text-white hover:font-semibold transition duration-300">
                Documentación y centro de ayuda
              </Link>
            </li>
            <li>
              <Link to="/LoginDocentes" className="text-white hover:font-semibold transition duration-300">
                Docentes
              </Link>
            </li>
          </ul>
        )}
      </div>

      {/* Menú principal (visible en pantallas grandes) */}
      <ul className="hidden md:flex Montserrat text-white flex-row gap-4 items-center">
        <li>
          <a href="#acerca-del-cle" className="hover:font-semibold transition duration-300">Acerca del CLE</a>
        </li>
        <li>
          <a href="#requisitos" className="hover:font-semibold transition duration-300">Requisitos</a>
        </li>
        <li>
          <Link to="/Documentacion" className="hover:font-semibold transition duration-300">
            Documentación y centro de ayuda
          </Link>
        </li>
        <li className="bg-[#0F5DD2] px-2 rounded-md">
          <Link to="/LoginDocentes" className="hover:font-semibold transition duration-300">
            Docentes
          </Link>
        </li>
      </ul>
    </header>
  );
}

export default Header;
