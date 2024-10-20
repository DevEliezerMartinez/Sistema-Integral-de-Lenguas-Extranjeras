import { Breadcrumb, Button, message } from "antd";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function CursoArchivado() {
  const [cursosArchivados, setCursosArchivados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [docente, setDocente] = useState(null);

  useEffect(() => {
    const docenteData = localStorage.getItem("docente");
    if (docenteData) {
      setDocente(JSON.parse(docenteData));
    }
  }, []);

  useEffect(() => {
    const fetchCursosArchivados = async () => {
      const token = localStorage.getItem("token");

      if (docente && token) {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/cursosArchivados/${
              docente.id
            }`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          if (response.status === 200) {
            const dataCursos = response.data.cursos
              ? Object.values(response.data.cursos)
              : [];
            setCursosArchivados(dataCursos);
            setHasError(false);
          } else {
            message.error("No se pudieron cargar los cursos archivados.");
            setHasError(true);
          }
        } catch (error) {
          console.error("Error al obtener los cursos archivados:", error);
          message.error("Ocurrió un error al cargar los cursos.");
          setHasError(true);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCursosArchivados();
  }, [docente]);

  return (
    <div className="px-4">
      <Breadcrumb
        items={[
          {
            title: <p className="font-medium text-black">Docente</p>,
          },
          {
            title: <a href="">Mis cursos archivados</a>,
          },
        ]}
      />
      <h2 className="Montserrat font-semibold text-2xl text-center">
        Cursos archivados
      </h2>

      <div
        id="Contenedor de CARDS"
        className="flex gap-3 justify-center mt-5 flex-wrap"
      >
        {loading ? (
          <p>Cargando...</p>
        ) : hasError || cursosArchivados.length === 0 ? (
          <div
            id="Card"
            className="border rounded bg-slate-100 w-3/5 flex flex-col px-8 py-4 items-center text-center"
          >
            <img alt="libro" src="/Opt/SVG/sad.svg" className="w-24" />
            <p className="Montserrat font-normal">
              Sin cursos archivados disponibles
            </p>
            <span>
              Si crees que hay un error notifica al coordinador del CLE
            </span>
          </div>
        ) : (
          cursosArchivados.map((curso) => (
            <div
              key={curso.id}
              id="Card"
              className="border rounded bg-slate-100 w-3/5 flex flex-col px-8 py-4 items-center text-center md:w-1/5 md:gap-5"
            >
              <img alt="libro" src="/Opt/SVG/book.svg" className="w-24" />
              <p className="Montserrat font-normal">Curso archivado</p>
              <ul className="self-start text-left">
                <li>Nombre del Curso: {curso.nombre}</li>
                <li>
                  Periodo: {curso.fecha_inicio} - {curso.fecha_fin}
                </li>
              </ul>
              <Button type="primary" className="bg-green-500">
                <Link to={`/Docentes/Cursos/${curso.id}`}> Detalles</Link>
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CursoArchivado;
