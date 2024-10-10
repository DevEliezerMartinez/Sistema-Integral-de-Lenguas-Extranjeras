import React, { useState, useEffect } from "react";
import { Breadcrumb, Divider } from "antd";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

function DetalleAlumno() {
  const { AlumnoId } = useParams(); // Usa el nombre del parámetro de la URL
  const [alumno, setAlumno] = useState(null); // Estado para almacenar los detalles del alumno
  const [loading, setLoading] = useState(true); // Estado para manejar el loading
  const [error, setError] = useState(null); // Estado para manejar errores

  useEffect(() => {
    console.log("ID desde useParams:", AlumnoId); // Verifica que el id se está capturando
    const fetchAlumno = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/estudiante/${AlumnoId}`,
          {
            headers: {
              Authorization: "Bearer 1|AFPPXEHDEUyWz1mnsszBCzo3QrKWNc18dAPfae4L2d901636",
              Accept: "*/*",
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Respuesta de la API:", response.data); // Verifica la respuesta de la API
        setAlumno(response.data.estudiante);
        setLoading(false);
      } catch (err) {
        console.log("Error en la petición:", err.response ? err.response.data : err.message); // Verifica el error
        setError("Error al cargar los datos del estudiante.");
        setLoading(false);
      }
    };

    if (AlumnoId) {
      fetchAlumno();
    }
  }, [AlumnoId]);

  if (loading) {
    return <p>Cargando...</p>; // Muestra un mensaje mientras los datos están cargando
  }

  if (error) {
    return <p>{error}</p>; // Muestra el error si ocurrió alguno
  }

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
          <div id="headerCard" className="w-full flex justify-between items-center">
            <div id="Actions" className="self-start flex gap-2">
              <img alt="icon" className="w-4" src="/Opt/SVG/LighArrow.svg" />
              <Link to="/Coordinador/Alumnos" className="Popins font-semibold">
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
            <p className="Montserrat">
              <span className="font-semibold">Carrera:</span> {alumno.carrera}
            </p>
            <p className="Montserrat">
              <span className="font-semibold">Género:</span> {alumno.genero}
            </p>
            <p className="Montserrat">
              <span className="font-semibold">Teléfono:</span> {alumno.telefono}
            </p>
            <p className="Montserrat">
              <span className="font-semibold">CURP:</span> {alumno.curp}
            </p>
            <p className="Montserrat">
              <span className="font-semibold">Domicilio:</span> {alumno.domicilio}
            </p>
            <p className="Montserrat">
              <span className="font-semibold">Correo:</span> {alumno.correo_electronico}
            </p>
            <p className="Montserrat">
              <span className="font-semibold">Historial de Cursos:</span> {alumno.historial_cursos}
            </p>
            <p className="Montserrat">
              <span className="font-semibold">Perfil:</span> {alumno.perfil}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetalleAlumno;
