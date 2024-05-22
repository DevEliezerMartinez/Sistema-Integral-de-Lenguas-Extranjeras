import React, { useState } from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="flex bg-[#1B396A] m-auto md:m-0 justify-between items-center px-4">
      <picture className="p-4 m-auto flex items-center md:items-center gap-4 md:m-0">
        <img alt="Logo CLE" src="/Opt/TecNM_blanco.png" />
        <h2 className="Montserrat text-white">Campus San Marcos EST </h2>
      </picture>

      <ul className="hidden md:flex Montserrat text-white flex-row gap-4">
        <Link to="/Estudiantes/Progreso">
          <img
            className="w-6"
            alt="Logo Progreso"
            src="/Opt/SVG/Progress.svg"
          />
        </Link>
        <Link to="/Estudiantes/Cursos">
          <img
            className="w-6"
            alt="Logo notification"
            src="/Opt/SVG/Curso.svg"
          />
        </Link>
        <Link to="/Estudiantes/Perfil">
          <img className="w-6" alt="Logo profile" src="/Opt/SVG/profile-.svg" />
        </Link>
        <Link to="/Estudiantes/Notificaciones">
          <img
            className="w-6"
            alt="Logo notification"
            src="/Opt/SVG/notification.svg"
          />
        </Link>
      </ul>
    </header>
  );
}

export default Header;
