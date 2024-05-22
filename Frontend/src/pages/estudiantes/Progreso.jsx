import { Button, Divider } from "antd";
import React, { useState } from "react";
import { Link } from "react-router-dom";

function Progreso() {

  const DetalleCursoActual = {
    Nombre: "Curso basico",
    Perido: "Enero Junio",
    Modalidad: "Fines de semana",
    Horario: "8:00 AM - 1:00PM",
    Docente: "Laura Garza",
    Requisitos: 2,
  };

  return (
    <div className="md:px-8">
      <h2 className="Montserrat font-semibold text-2xl text-center md:mt-6 ">
        Mi progreso
      </h2>

      <p className="Montserrat">Aqui encontraras todos los cursos que has tomado</p>

      <div
        id="Contenedor de CARDS"
        className="flex gap-3 justify-center mt-5 flex-wrap"
      >
        <div
          id="Card"
          className="border rounded bg-slate-100 w-3/5 flex flex-col px-8 py-4 items-center text-center md:w-1/5 "
        >
          <img alt="libro" src="/Opt/SVG/class.svg" className="w-24" />
          <Divider></Divider>
          <p className="Montserrat font-normal">{DetalleCursoActual.Nombre}</p>
          <Button type="primary" className="bg-green-500 mt-4">
            <Link to="/Estudiantes/Cursos/3"> Informacion</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Progreso;
