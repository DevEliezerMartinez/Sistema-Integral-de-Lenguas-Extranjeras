import React from "react";
import { Link } from "react-router-dom";
import CountUp from "react-countup";

import "../../styles/Landing/main.css";

function MainHero() {
  return (
    <div className="h-screen max-h-[90dvh] overflow-hidden flex flex-col">
      <main
        id="Banner"
        className="flex-1 flex flex-col-reverse lg:flex-row items-center  lg:items-start md:pt-12 justify-center px-4 sm:px-8 lg:px-16 gap-6 lg:gap-12"
      >
        {/* Contenido de texto */}
        <div
          id="Descripciones"
          className="w-full lg:w-1/2 flex flex-col gap-4 lg:gap-6 items-center lg:items-start"
        >
          <h1 className="Poppins font-bold text-2xl sm:text-4xl lg:text-5xl text-center lg:text-left leading-tight">
            Centro de Lenguas Extranjeras
          </h1>

          <p className="Montserrat text-xs sm:text-base lg:text-lg text-center lg:text-left text-gray-700 max-w-2xl">
            <strong>Tu plataforma oficial para inscribirte y llevar el control de tu aprendizaje del inglés.</strong> El sistema del Centro de Lenguas del TecNM Campus San Marcos te permite gestionar tu progreso desde nivel básico hasta B1. Nuestro equipo de facilitadores certificados te acompañará en cada etapa. ¡Inscríbete ahora y abre las puertas a nuevas oportunidades! 🌐🗣️📚
          </p>

          <div
            id="Actions"
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center w-full sm:w-auto"
          >
            {/* Acceso estudiantes */}
            <Link
              to="/login"
              className="relative group flex items-center justify-center gap-3 w-full sm:w-auto 
    px-6 sm:px-8 py-3 sm:py-4 Montserrat font-semibold overflow-hidden
    bg-[#1B396A] text-white rounded-lg transition-all duration-200 ease-in-out
    hover:scale-105 hover:-translate-y-1 active:scale-95"
            >
              {/* Decoraciones sin bordes redondeados y animación más rápida */}
              <span className="absolute top-0 right-0 w-4 h-4 bg-[#1a52ad]
      transition-all duration-250 ease-in-out group-hover:-mr-4 group-hover:-mt-4">
                <span className="absolute top-0 right-0 w-5 h-5 bg-white rotate-45 
        translate-x-1/2 -translate-y-1/2"></span>
              </span>

              <span className="absolute bottom-0 left-0 rotate-180 w-4 h-4 bg-[#1a52ad]
      transition-all duration-250 ease-in-out group-hover:-ml-4 group-hover:-mb-4">
                <span className="absolute top-0 right-0 w-5 h-5 bg-white rotate-45
        translate-x-1/2 -translate-y-1/2"></span>
              </span>

              <span className="absolute bottom-0 left-0 w-full h-full bg-[#1a52ad]
      transition-all duration-250 ease-in-out delay-100 -translate-x-full 
      group-hover:translate-x-0"></span>

              <span className="relative z-[2] flex items-center gap-3">
                Acceso estudiantes
                <img
                  alt="icon"
                  src="/Opt//Go.svg"
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </span>
            </Link>


            {/* Acceso docentes */}
            <Link
              to="/LoginDocentes"
              className="relative group flex items-center justify-center gap-2 w-full sm:w-auto
    px-6 sm:px-8 py-3 sm:py-4 Montserrat font-semibold overflow-hidden
    border-2 border-[#1B396A] text-[#1B396A] rounded-lg transition-all duration-200 ease-in-out
    hover:scale-105 hover:-translate-y-1 active:scale-95"
            >
              {/* Decoraciones actualizadas al color institucional */}
              <span className="absolute top-0 right-0 w-4 h-4 bg-[#1a52ad]
      transition-all duration-250 ease-in-out group-hover:-mr-4 group-hover:-mt-4">
                <span className="absolute top-0 right-0 w-5 h-5 bg-white rotate-45 
        translate-x-1/2 -translate-y-1/2"></span>
              </span>

              <span className="absolute bottom-0 left-0 rotate-180 w-4 h-4 bg-[#1a52ad]
      transition-all duration-250 ease-in-out group-hover:-ml-4 group-hover:-mb-4">
                <span className="absolute top-0 right-0 w-5 h-5 bg-white rotate-45
        translate-x-1/2 -translate-y-1/2"></span>
              </span>

              <span className="absolute bottom-0 left-0 w-full h-full bg-[#1a52ad]
      transition-all duration-250 ease-in-out delay-100 -translate-x-full 
      group-hover:translate-x-0"></span>

              <span className="relative z-[2] group-hover:text-white">
                Acceso docentes
              </span>
            </Link>

          </div>


          {/* Estadísticas integradas debajo de los botones */}
          <section
            id="Stadistics"
            className="flex flex-row justify-center sm:justify-start items-center gap-6 sm:gap-8 lg:gap-12 mt-4 w-full"
          >
            <div className="flex flex-col items-center">
              <span className="Montserrat font-extrabold text-4xl sm:text-5xl lg:text-6xl text-center text-[#0F5DD2]">
                <CountUp end={2} duration={2} />
              </span>
              <p className="Poppins text-center text-gray-700 font-medium text-xs sm:text-sm mt-1">Modalidades</p>
            </div>

            <div className="flex flex-col items-center">
              <span className="Montserrat font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[#0F5DD2]">
                <CountUp end={5} duration={2} />
                <span className="font-medium">+</span>
              </span>
              <p className="Poppins text-gray-700 font-medium text-xs sm:text-sm mt-1">Grupos</p>
            </div>

            <div className="flex flex-col items-center">
              <span className="Montserrat font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[#0F5DD2]">
                <CountUp end={125} duration={2} />
                <span className="font-medium">+</span>
              </span>
              <p className="Poppins text-center text-gray-700 font-medium text-xs sm:text-sm mt-1">Alumnos</p>
            </div>
          </section>
        </div>

        {/* Imagen */}
        <picture
          id="Fotografia principal"
          className="w-full sm:w-2/5 md:w-1/2 lg:w-2/5  max-w-72 lg:max-w-96"
        >
          <img
            className="rounded-2xl w-full h-auto shadow-2xl transition-transform duration-300 hover:scale-105"
            alt="Estudiantes en el salón de clases"
            src="/Opt//Salon.png"
          />
        </picture>
      </main>
    </div>
  );
}

export default MainHero;