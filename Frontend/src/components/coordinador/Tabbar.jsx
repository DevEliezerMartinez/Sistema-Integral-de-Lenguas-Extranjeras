import React from "react";
import { Link } from "react-router-dom";

function Tabbar() {
  return (
    <div className="bg-[#1B396A] flex justify-between fixed bottom-0 w-full p-5 rounded gap-3 sm:hidden items-center ">
      <Link
        to="/Docentes/CursosActivos"
        className="Montserrat font-thin text-white flex flex-col items-center text-center"
      >
        <img alt="icon" className="w-6" src="/Opt/SVG/classroom.svg" />
        Cursos Activos
      </Link>

      <Link
        to="/Docentes/CursosArchivados"
        className="Montserrat font-thin text-white flex flex-col items-center text-center"
      >
        <img alt="icon" className="w-6" src="/Opt/SVG/Curso.svg" />
        Cursos Archivados
      </Link>

      <Link
        to="/Docentes/Perfil"
        className="Montserrat font-thin text-white flex flex-col items-center text-center"
      >
        <img alt="icon" className="w-6" src="/Opt/SVG/profile-.svg" />
        Perfil
      </Link>

      <Link
        to="/Docentes/Notificaciones"
        className="Montserrat font-thin text-white flex flex-col items-center text-center"
      >
        <img alt="icon" className="w-6" src="/Opt/SVG/notification.svg" />
        Notificaciones
      </Link>
    </div>
  );
}

export default Tabbar;
