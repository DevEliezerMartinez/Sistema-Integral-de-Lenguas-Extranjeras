import { Breadcrumb, Button, Divider, message, Spin } from "antd";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Función para obtener el texto del horario según el valor
const obtenerHorarioTexto = (horario) => {
  switch (horario) {
    case "1":
      return "7:00 - 12:00";
    case "2":
      return "3:00 - 6:00";
    case "3":
      return "12:00 - 2:00";
    default:
      return "Horario no disponible";
  }
};

const estudiante = JSON.parse(localStorage.getItem("estudiante"));
const id_estudiante = estudiante.id; // Extraer el id del estudiante

const CursoCard = ({ curso }) => (
  <div
    key={curso.Curso_ID}
    className="border rounded bg-slate-100 w-3/5 flex flex-col px-8 py-4 items-center text-center md:w-1/5"
  >
    <img alt="libro" src="/Opt/SVG/class.svg" className="w-24" />
    <Divider />
    <p className="Montserrat font-normal">{curso.Nombre_Curso}</p>
    <p className="Montserrat font-light">
      Horario: {obtenerHorarioTexto(curso.Horario)}
    </p>

    <Button type="primary" className="bg-green-500 mt-4">
      <Link to={`/Estudiantes/CursoInfo/${curso.Curso_ID}/${id_estudiante}`}>Información</Link>
    </Button>
  </div>
);

function Progreso() {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerCursos = async () => {
      try {
        const estudiante = JSON.parse(localStorage.getItem("estudiante"));
        const id_estudiante = estudiante.id; // Extraer el id del estudiante

        const response = await fetch(
          `http://127.0.0.1:8000/api/progreso/estudiante/${id_estudiante}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              Accept: "*/*",
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (data.exito) {
          setCursos(data.progreso); // Actualiza el estado con los cursos obtenidos
        } else {
          setCursos([]); // En caso de que la consulta esté vacía
          message.warning(data.mensaje); // Muestra un mensaje si no hay cursos
        }
      } catch (err) {
        setError("Hubo un problema al obtener los cursos.");
      } finally {
        setLoading(false); // Quita el estado de carga
      }
    };

    obtenerCursos();
  }, []);

  // Muestra un mensaje si hay un error
  if (error) {
    message.error(error);
  }

  // Renderizado del componente
  return (
    <div className="md:px-8">
      <Breadcrumb
        items={[
          {
            title: <p className="font-medium text-black">Estudiantes</p>,
          },
          {
            title: <a href="">Mi progreso</a>,
          },
        ]}
      />

      <h2 className="Montserrat font-semibold text-2xl text-center md:mt-6">
        Mi progreso
      </h2>

      <p className="Montserrat">
        Aquí encontrarás todos los cursos que has tomado
      </p>

      {/* Spinner para mostrar mientras los cursos están cargando */}
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <Spin tip="Cargando cursos..." size="large" />
        </div>
      ) : cursos.length === 0 ? (
        // Si no hay cursos, muestra un mensaje
        <p>No tienes cursos asociados.</p>
      ) : (
        // Si hay cursos, muestra las tarjetas
        <div
          id="Contenedor de CARDS"
          className="flex gap-3 justify-center mt-5 flex-wrap"
        >
          {cursos.map((curso) => (
            <CursoCard curso={curso} key={curso.Curso_ID} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Progreso;
