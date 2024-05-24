import { Button, Divider } from "antd";
import React from "react";
import { Link, useParams } from "react-router-dom";
import TablaAlumnos from "../../components/Docentes/TablaAlumnos";

function DetalleCurso() {
  const { cursoId } = useParams(); // Extract course ID from URL parameter

  return (
    <div className="">
      <h2 className="Montserrat font-semibold text-2xl text-center md:my-6">
        Curso activo {cursoId}
      </h2>

      <div id="Card" className="bg-slate-100 p-2 md:mx-16 md:p-16 ">
        <div id="cardContent" className=" flex flex-col items-center">
          <div
            id="headerCard"
            className=" w-full flex justify-between  items-center"
          >
            <div id="Actions" className=" self-start  flex gap-2">
              <img alt="icon" className="w-4" src="/Opt/SVG/LighArrow.svg" />
              <Link
                to="/Docentes/CursosActivos"
                className="Popins  font-semibold "
              >
                Volver
              </Link>
            </div>
            <h3 className="Montserrat font-extralight text-2xl  ">
              Detalles del curso
            </h3>
            <img alt="icon" className="w-8" src="/Opt/SVG/info.svg" />
          </div>
          <Divider />

          <h2 className="Montserrat font-bold self-start text-2xl text-center">
            Modulo de nivel:4
          </h2>
          <section id="Archivos" className="p-3"></section>

          <section id="Info" className="px-4 self-start w-full">
            <TablaAlumnos />
          </section>

          <div className="flex Montserrat w-full justify-between items-center">
            <p>
              <span className="font-semibold">Periodo:</span> Enero-junio
            </p>
            <p>
              <span className="font-semibold">Docente:</span> Laura Garza
            </p>
            <p>
              <span className="font-semibold">Requisitos:</span> Nivel 2
            </p>

            <Button ghost id="img-Archivar" className="flex flex-col items-center h-auto">
              <img className="w-8" alt="icon" src="/Opt/SVG/archivar.svg"/>
              <span>Archivar</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetalleCurso;
