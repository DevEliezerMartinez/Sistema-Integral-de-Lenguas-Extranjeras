import React, { useState } from "react";
import { Link } from "react-router-dom";

function Header() {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <header className="flex bg-[#1B396A] m-auto md:m-0 justify-between items-center px-4 sticky top-0 z-30">
      <div className="flex  text-white  md:items-center justify-center  md:mb-0 py-4 gap-3">
        <Link to="/">
          <img
            alt="Logo CLE"
            src="/CLE/Opt/TecNMBig.png"
            className="w-8 h-8 mb-4 md:mb-0"
          />
        </Link>
        <div className="text-center md:text-left flex flex-col items-center ">
          <p className="font-bold text-lg Poppins">TecNM | Campus San Marcos</p>
          <span className="font-extralight text-lg">
            Centro de Lenguas Extranjeras
          </span>
        </div>
      </div>

      {/* Menú de hamburguesa */}
      <div className="md:hidden">
        <button className="text-white" onClick={toggleMenu}>
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
              <a
                href="#acerca-del-cle"
                className="text-white hover:font-semibold transition duration-300"
              >
                Acerca del CLE
              </a>
            </li>
            <li>
              <a
                href="#requisitos"
                className="text-white hover:font-semibold transition duration-300"
              >
                Requisitos
              </a>
            </li>
            <li>
              <Link
                to="/Documentacion"
                className="text-white hover:font-semibold transition duration-300"
              >
                Documentación 
              </Link>
            </li>
            <li>
              <Link
                to="/LoginCoordinador"
                className="text-white hover:font-semibold transition duration-300"
              >
                Coordinador
              </Link>
            </li>
          </ul>
        )}
      </div>

      {/* Menú principal (visible en pantallas grandes) */}
      <ul className="hidden md:flex Montserrat text-white flex-row gap-4 items-center">
        <li>
          <a
            href="#acerca-del-cle"
            className="hover:font-semibold transition duration-300"
          >
            Acerca del CLE
          </a>
        </li>
        <li>
          <a
            href="#requisitos"
            className="hover:font-semibold transition duration-300"
          >
            Requisitos
          </a>
        </li>
        <li>
          <Link
            to="/Documentacion"
            className="hover:font-semibold transition duration-300"
          >
            Documentación y centro de ayuda
          </Link>
        </li>
        <li className="bg-[#0F5DD2] px-2 py-3 rounded-sm">
          <Link
            to="/LoginCoordinador"
            className="hover:font-semibold transition duration-300"
          >
            Coordinador
          </Link>
        </li>
      </ul>
    </header>
  );
}

export default Header;
