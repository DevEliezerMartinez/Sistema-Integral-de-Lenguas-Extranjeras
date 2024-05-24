import { Button } from "antd";
import React, { useState } from "react";
import { Link } from "react-router-dom";

function CursoActivo() {
  const [hasModules, setHasModules] = useState(true); // Initial state (adjust as needed)

  return (
    <>
      <h2 className="Montserrat font-semibold text-2xl text-center">
        Cursos archivados
      </h2>

      <div
        id="Contenedor de CARDS"
        className="flex gap-3 justify-center mt-5 flex-wrap"
      >
        {hasModules ? (
          <>
          <div
            id="Card"
            className="border rounded bg-slate-100 w-3/5 flex flex-col px-8 py-4 items-center text-center md:w-1/5 md:gap-5"
          >
            <img alt="libro" src="/Opt/SVG/book.svg" className="w-24" />
            <p className="Montserrat font-normal">Curso finalizado</p>
            <ul className="self-start text-left ">
              <li>Nombre del Curso: Programación en React</li>
              <li>Docente: Laura Garza</li>
              <li>Periodo: Semanal</li>
            </ul>
            <Button type="primary" className="bg-green-500">
              <Link to="/Docentes/Cursos/55"> Detalles</Link>
            </Button>
          </div>
          <div
            id="Card"
            className="border rounded bg-slate-100 w-3/5 flex flex-col px-8 py-4 items-center text-center md:w-1/5 md:gap-5"
          >
            <img alt="libro" src="/Opt/SVG/book.svg" className="w-24" />
            <p className="Montserrat font-normal">Curso finalizado</p>
            <ul className="self-start text-left ">
              <li>Nombre del Curso: Programación en React</li>
              <li>Docente: Laura Garza</li>
              <li>Periodo: Semanal</li>
            </ul>
            <Button type="primary" className="bg-green-500">
              <Link to="/Docentes/Cursos/55"> Detalles</Link>
            </Button>
          </div>
          <div
            id="Card"
            className="border rounded bg-slate-100 w-3/5 flex flex-col px-8 py-4 items-center text-center md:w-1/5 md:gap-5"
          >
            <img alt="libro" src="/Opt/SVG/book.svg" className="w-24" />
            <p className="Montserrat font-normal">Curso finalizado</p>
            <ul className="self-start text-left ">
              <li>Nombre del Curso: Programación en React</li>
              <li>Docente: Laura Garza</li>
              <li>Periodo: Semanal</li>
            </ul>
            <Button type="primary" className="bg-green-500">
              <Link to="/Docentes/Cursos/55"> Detalles</Link>
            </Button>
          </div>
          <div
            id="Card"
            className="border rounded bg-slate-100 w-3/5 flex flex-col px-8 py-4 items-center text-center md:w-1/5 md:gap-5"
          >
            <img alt="libro" src="/Opt/SVG/book.svg" className="w-24" />
            <p className="Montserrat font-normal">Curso finalizado</p>
            <ul className="self-start text-left ">
              <li>Nombre del Curso: Programación en React</li>
              <li>Docente: Laura Garza</li>
              <li>Periodo: Semanal</li>
            </ul>
            <Button type="primary" className="bg-green-500">
              <Link to="/Docentes/Cursos/55"> Detalles</Link>
            </Button>
          </div>
          <div
            id="Card"
            className="border rounded bg-slate-100 w-3/5 flex flex-col px-8 py-4 items-center text-center md:w-1/5 md:gap-5"
          >
            <img alt="libro" src="/Opt/SVG/book.svg" className="w-24" />
            <p className="Montserrat font-normal">Curso finalizado</p>
            <ul className="self-start text-left ">
              <li>Nombre del Curso: Programación en React</li>
              <li>Docente: Laura Garza</li>
              <li>Periodo: Semanal</li>
            </ul>
            <Button type="primary" className="bg-green-500">
              <Link to="/Docentes/Cursos/55"> Detalles</Link>
            </Button>
          </div>
          </>
        ) : (
          <div
            id="Card"
            className="border rounded bg-slate-100 w-3/5 flex flex-col px-8 py-4 items-center text-center "
          >
            <img alt="libro" src="/Opt/SVG/sad.svg" className="w-24" />
            <p className="Montserrat font-normal">Sin cursos disponibles</p>
            <span>
              Si crees que hay un error notifica al coordinador del CLE
            </span>
          </div>
        )}
      </div>
    </>
  );
}

export default CursoActivo;
