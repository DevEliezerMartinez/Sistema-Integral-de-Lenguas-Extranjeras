import React from "react";
import { Breadcrumb, Button, Divider } from "antd";
import { Link } from "react-router-dom";

function DetalleAlumno() {
  // Información del alumno (puedes reemplazar estos datos con los datos reales del estudiante)
  const alumno = {
    nombre: "Juan",
    apellidos: "Pérez",
    carrera: "Ingeniería Informática",
    ultimoNovelo: "Novelo 1",
    genero: "Masculino",
    telefono: "1234567890",
    curp: "ABCDE123456FHCXYZ",
    domicilio: "Ciudad de México, México",
    correo: "juanperez@example.com",
    contrasena: "••••••••",
  };

  return (
    <div className="px-4">
      <Breadcrumb
        items={[
          {
            title: <p className="font-medium text-black">Coordinador</p>,
          },
          {
            title: <a href="">DetalleAlumno</a>,
          },
        ]}
      />
      <div id="Card" className="bg-slate-100 p-2 md:mx-16 md:p-16 ">
        <div id="cardContent" className="flex flex-col items-center">
          <div
            id="headerCard"
            className="w-full flex justify-between items-center"
          >
            <div id="Actions" className="self-start flex gap-2">
              <img
                alt="icon"
                className="w-4"
                src="/Opt/SVG/LighArrow.svg"
              />
              <Link
                to="/Coordinador/Alumnos"
                className="Popins font-semibold"
              >
                Volver
              </Link>
            </div>
            <h3 className="Montserrat font-extralight text-2xl">
              Detalles del Alumno
            </h3>
            <img alt="icon" className="w-8" src="/Opt/SVG/info.svg" />
          </div>
          <Divider />

          {/* Información del alumno */}
          <h2 className="Montserrat font-bold self-start text-2xl text-center">
            {alumno.nombre} {alumno.apellidos}
          </h2>
          <section id="Archivos" className="p-3"></section>

          <div className="flex flex-col w-full gap-2">
            <p className="Montserrat font-semibold">
              <span className="font-semibold">Carrera:</span>{" "}
              {alumno.carrera}
            </p>
            <p className="Montserrat font-semibold">
              <span className="font-semibold">Último Novelo:</span>{" "}
              {alumno.ultimoNovelo}
            </p>
            <p className="Montserrat font-semibold">
              <span className="font-semibold">Género:</span> {alumno.genero}
            </p>
            <p className="Montserrat font-semibold">
              <span className="font-semibold">Teléfono:</span>{" "}
              {alumno.telefono}
            </p>
            <p className="Montserrat font-semibold">
              <span className="font-semibold">CURP:</span> {alumno.curp}
            </p>
            <p className="Montserrat font-semibold">
              <span className="font-semibold">Domicilio:</span>{" "}
              {alumno.domicilio}
            </p>
            <p className="Montserrat font-semibold">
              <span className="font-semibold">Correo:</span>{" "}
              {alumno.correo}
            </p>
            <p className="Montserrat font-semibold">
              <span className="font-semibold">Contraseña:</span>{" "}
              {alumno.contrasena}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetalleAlumno;
