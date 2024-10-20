import { Breadcrumb, Button, Spin } from "antd";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function CursosArchivados() {
  const [cursos, setCursos] = useState([]); // Estado para almacenar los cursos
  const [loading, setLoading] = useState(true); // Estado para el indicador de carga
  const [error, setError] = useState(null); // Estado para manejar errores

  useEffect(() => {
    const fetchCursosArchivados = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/cursosArchivados`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              Accept: "*/*",
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        // Verificar si hay cursos en la respuesta
        if (data.cursos && data.cursos.length > 0) {
          setCursos(data.cursos); // Asignar cursos si existen
        } else {
          setCursos([]); // Si no hay cursos, asignar un array vacío
        }
      } catch (error) {
        setError(error.message); // Asignar el mensaje de error
      } finally {
        setLoading(false); // Detener el estado de carga
      }
    };

    fetchCursosArchivados();
  }, []);

  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", options);
  };

  if (loading)
    return (
      <div className="flex gap-4 flex-col h-[40vh] justify-center items-center">
        <Spin size="large" />
        <p>Cargando...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex gap-4 flex-col h-[40vh] justify-center items-center">
        <p className="text-red-500">{error}</p>
      </div>
    );

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

      <div
        id="Contenedor de CARDS"
        className="flex gap-3 justify-center mt-5 flex-wrap"
      >
        {cursos.length > 0 ? (
          cursos.map((curso) => (
            <div
              key={curso.id}
              id="Card"
              className="border rounded bg-slate-100 w-3/5 flex flex-col px-8 py-4 items-center text-center md:w-1/5 md:gap-5"
            >
              <img alt="libro" src="/Opt/SVG/book.svg" className="w-24" />

              <ul className="self-start text-left font-medium">
                <li className="Montserrat text-xl text-center my-4">
                  {curso.nombre}
                </li>
                <span className="Montserrat bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">
                  Curso archivado
                </span>
                <li>
                  Docente:{" "}
                  <span className="font-light">
                    {curso.docente ? curso.docente.nombre : "Desconocido"}
                  </span>
                </li>
                <li>
                  Periodo:{" "}
                  <span className="font-light">
                    {curso.periodo ? (
                      <>
                        <span className="block mb-1">
                          {formatDate(curso.periodo.fecha_inicio)}
                        </span>
                        <span className="block">
                          {formatDate(curso.periodo.fecha_fin)}
                        </span>
                      </>
                    ) : (
                      "Desconocido"
                    )}
                  </span>
                </li>
              </ul>
              <Button type="primary" className="bg-green-500 my-4">
                <Link to={`/Coordinador/Cursos/${curso.id}`}>Detalles</Link>
              </Button>
            </div>
          ))
        ) : (
          <div
            id="Card"
            className="border rounded bg-slate-100 w-3/5 flex flex-col px-8 py-4 items-center text-center"
          >
            <img alt="libro" src="/Opt/SVG/sad.svg" className="w-24" />
            <p className="Montserrat font-normal">Sin cursos disponibles</p>
            <span>
              Si crees que hay un error, notificalo.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default CursosArchivados;
