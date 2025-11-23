import React, { useState, useEffect } from "react";
import { Breadcrumb, Divider, message } from "antd";
import { Link, useParams } from "react-router-dom";
import client from "../../axios";

function DetalleAlumno() {
  const { AlumnoId } = useParams();
  const [alumno, setAlumno] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("ID desde useParams:", AlumnoId);

    const fetchAlumno = async () => {
      try {
        const response = await client.get(`/api/estudiante/${AlumnoId}`);
        console.log("Respuesta API:", response.data);

        setAlumno(response.data.estudiante);
      } catch (err) {
        setError("Error al cargar los datos del estudiante.");
        message.error("Error al cargar los datos del estudiante.");
      } finally {
        setLoading(false);
      }
    };

    if (AlumnoId) {
      fetchAlumno();
    }
  }, [AlumnoId]);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="px-4">
      <Breadcrumb
        items={[
          {
            title: <p className="font-medium text-black">Coordinador</p>,
          },
          {
            title: "Detalle Alumno",
          },
        ]}
      />

      <div className="bg-slate-100 p-2 md:mx-16 md:p-16">
        <div className="flex flex-col items-center">
          <div className="w-full flex justify-between items-center">
            <div className="flex gap-2">
              <img alt="icon" className="w-4" src="/Opt/SVG/LighArrow.svg" />
              <Link to="/Coordinador/Alumnos" className="Popins font-semibold">
                Volver
              </Link>
            </div>

            <h3 className="Montserrat font-extralight text-2xl">
              Detalles del Alumno
            </h3>

            <img alt="info" className="w-8" src="/Opt/SVG/info.svg" />
          </div>

          <Divider />

          <h2 className="Montserrat font-bold self-start text-2xl">
            {alumno.nombre} {alumno.apellidos}
          </h2>

          <div className="flex flex-col w-full gap-2 mt-4">
            <Info label="Carrera" value={alumno.carrera} />
            <Info label="Género" value={alumno.genero} />
            <Info label="Teléfono" value={alumno.telefono} />
            <Info label="CURP" value={alumno.curp} />
            <Info label="Domicilio" value={alumno.domicilio} />
            <Info label="Correo" value={alumno.correo_electronico} />
            <Info label="Historial de Cursos" value={alumno.historial_cursos} />
            <Info label="Perfil" value={alumno.perfil} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <p className="Montserrat">
      <span className="font-semibold">{label}:</span> {value}
    </p>
  );
}

export default DetalleAlumno;
