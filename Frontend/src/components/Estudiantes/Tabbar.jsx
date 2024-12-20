import React from "react";

import { Link } from "react-router-dom";

function Tabbar() {
  return (
    <div className="bg-[#1B396A] flex justify-between fixed bottom-0 w-full p-5 rounded gap-3 md:hidden items-center ">
      <Link
        to="/Estudiantes/Perfil"
        className="Montserrat font-thin text-white flex flex-col items-center"
      >
        <img alt="icon" className="w-6" src="/Opt//SVG/profile-.svg" />
        Perfil
      </Link>

      <Link
        to="/Estudiantes/Progreso"
        className="Montserrat font-thin text-white flex flex-col items-center"
      >
        <img alt="icon" className="w-6" src="/Opt//SVG/Progress.svg" />
       Mi Progreso
      </Link>

      <Link
        to="/Estudiantes/Cursos"
        className="Montserrat font-thin text-white flex flex-col items-center"
      >
        <img alt="icon" className="w-6" src="/Opt//SVG/Curso.svg" />
        Cursos disp.
      </Link>

     

      <Link
        to="/Estudiantes/Notificaciones"
        className="Montserrat font-thin text-white flex flex-col items-center"
      >
        <img alt="icon" className="w-6" src="/Opt//SVG/notification2.svg" />
        Notificaciones
      </Link>
    </div>
  );
}

export default Tabbar;
