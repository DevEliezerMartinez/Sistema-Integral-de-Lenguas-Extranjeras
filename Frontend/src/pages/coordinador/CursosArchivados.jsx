import { Breadcrumb, Button } from "antd";
import React, { useState } from "react";
import { Link } from "react-router-dom";

function CursoActivo() {
  const [hasModules, setHasModules] = useState(true); // Initial state (adjust as needed)

  return (
    <div className="px-4">
      <Breadcrumb
        items={[
          {
            title: <p className="font-medium text-black">Coordinador</p>,
          },
          {
            title: <a href="">Cursos archivados</a>,
          },
        ]}
      />
      <h2 className="Montserrat font-semibold text-2xl text-center">
        Cursos archivados coordinador
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
                <Link to="/Coordinador/Cursos/55"> Detalles</Link>
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
                <Link to="/Coordinador/Cursos/55"> Detalles</Link>
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
                <Link to="/Coordinador/Cursos/55"> Detalles</Link>
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
    </div>
  );
}

export default CursoActivo;
