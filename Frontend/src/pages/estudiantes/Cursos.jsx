import { Button } from "antd";
import React, { useState } from "react";
import { Link } from "react-router-dom";

function Cursos() {
  const [hasModules, setHasModules] = useState(true); // Initial state (adjust as needed)

  return (
    <>
      <h2 className="Montserrat font-semibold text-2xl text-center">
        Cursos disponibles
      </h2>

      <div id="Contenedor de CARDS" className="flex gap-3 justify-center mt-5 flex-wrap">
        {hasModules ? (
          <div id="Card" className="border rounded bg-slate-100 w-3/5 flex flex-col px-8 py-4 items-center text-center md:w-1/5 md:gap-5">
            <img alt="libro" src="/Opt/SVG/book.svg" className="w-24" />
            <p className="Montserrat font-normal">Nuevo modulo disponible</p>
            <Button type="primary" className="bg-green-500">
             <Link to="/Estudiantes/Cursos/3"> Detalles</Link>
            </Button>
          </div>
        ) : (
          <div id="Card" className="border rounded bg-slate-100 w-3/5 flex flex-col px-8 py-4 items-center text-center ">
            <img alt="libro" src="/Opt/SVG/sad.svg" className="w-24" />
            <p className="Montserrat font-normal">Sin modulos disponibles</p>
          </div>
        )}
      </div>
    </>
  );
}

export default Cursos;
