import { Button } from "antd";
import React, { useState } from "react";
import { Link } from "react-router-dom";

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
        <h2 className="Montserrat text-white">Campus San Marcos ||CR</h2>
      </picture>
      </Link>

      <ul className="hidden md:flex Montserrat text-white flex-row gap-4">
        <Link to="/Coordinador/CursosActivos">
          <img
            className="w-6"
            alt="Logo Progreso"
            src="/Opt/SVG/classroom.svg"
          />
        </Link>
        <Link to="/Coordinador/CursosArchivados">
          <img
            className="w-6"
            alt="Logo notification"
            src="/Opt/SVG/Curso.svg"
          />
        </Link>
        <Link to="/Coordinador/Perfil">
          <img className="w-6" alt="Logo profile" src="/Opt/SVG/profile-.svg" />
        </Link>
        <Link to="/Coordinador/Notificaciones">
          <img
            className="w-6"
            alt="Logo notification"
            src="/Opt/SVG/notification.svg"
          />
        </Link>
        <Link to="/Coordinador/Solicitudes">
          <img
            className="w-6"
            alt="Logo notification"
            src="/Opt/SVG/request.svg"
          />
        </Link>
        <Button className="" danger ghost>Cerrar sesion</Button>

        

        
      </ul>
      

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
          <Button className="absolute left-72 top-12" danger ghost>Cerrar sesion</Button>
        )}
      </div>
    </header>
  );
}

export default Header;
