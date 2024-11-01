import React from "react";
import { Link } from "react-router-dom";
import CountUp from "react-countup";
import { Button } from "antd";

import "../../styles/Landing/main.css";
function MainHero() {
  return (
    <>
      <main
        id="Banner"
        className="flex flex-col-reverse sm:flex-row md:mt-8 md:py-10 "
      >
        <div
          id="Descripciones"
          className="w-full sm:w-3/5  flex flex-col gap-8 p-8 h-full items-center"
        >
          <h1 className="Poppins font-bold text-4xl text-center sm:text-left ">
            Centro de Lenguas Extranjeras
          </h1>
          <p className="Montserrat text-center sm:w-4/5 sm:text-left">
            El Centro de Lenguas extranjeras del TecNM: Campus San Marcos es tu
            puerta de entrada para dominar el inglés y abrirte a nuevas
            oportunidades Nuestro equipo de facilitadores certificados te
            guiarán en tu aprendizaje. Desde los conceptos básicos hasta el
            nivel B1 requerido por el TecNM. ¡Inscríbete en nuestros cursos y
            descubre un mundo de posibilidades! 🌐🗣️📚
          </p>

          <div
            id="Actions"
            className="flex flex-col sm:flex-row gap-10 items-center"
          >
            <Link
              to="/login"
              className="bg-[#0F5DD2] px-6 py-3 Montserrat font-semibold text-white  flex justify-center gap-2"
            >
              Acceso estudiantes
              <img alt="icon" src="/Opt//Go.svg" />
            </Link>
            <Link
              to="/LoginDocentes"
              className="border border-[#0F5DD2] px-6 py-3 Montserrat font-semibold   flex items-center justify-center gap-2"
            >
              Acceso docentes
            </Link>
          </div>
        </div>

        <picture
          id="Fotografia principal"
          className="m-auto px-6 py-4 md:w-1/3 "
        >
          <img
            className="rounded-xl m-auto"
            alt="Imagen de alumnos"
            src="/Opt//Salon.png"
          />
        </picture>
      </main>

      <svg
        className=" hidden md:block md:relative md:top-[-12rem] md:z-0"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
      >
  <path fill="#0F5DD2" fill-opacity="1" d="M0,224L80,202.7C160,181,320,139,480,149.3C640,160,800,224,960,229.3C1120,235,1280,181,1360,154.7L1440,128L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>

      </svg>

      <section
        id="Stadistics"
        className=" md:absolute  md:top-3/4 flex justify-center gap-8 sm:w-1/2 md:gap-32 md:pb-10"
      >
        <div className="Card flex flex-col items-center">
          <span className="Montserrat font-extrabold text-6xl text-center">
            <CountUp end={2} duration={2} />
          </span>
          <p className="Poppins text-center">Modalidades</p>
        </div>
        <div className="Card">
          <span className="Montserrat font-extrabold text-6xl">
            <CountUp end={5} duration={2} />
            <span className="font-medium text-blue-600">+</span>
          </span>
          <p className="Poppins">Grupos</p>
        </div>
        <div className="Card flex flex-col items-center">
          <span className="Montserrat font-extrabold text-6xl">
            <CountUp end={125} duration={2} />
            <span className="font-medium text-blue-600">+</span>
          </span>
          <p className="Poppins">Alumnos</p>
        </div>
      </section>
    </>
  );
}

export default MainHero;
