import { Button, Divider, Spin, notification } from "antd";
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import TablaAlumnos from "../../components/coordinador/TablaAlumnos";

function DetalleCurso() {
  const { cursoId } = useParams();
  const [curso, setCurso] = useState(null);
  const [solicitudes, setSolicitudes] = useState([]); // Inicializar como un array vacío
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [api, contextHolder] = notification.useNotification();

  function formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [cursoResponse, solicitudesResponse] = await Promise.all([
          fetch(`http://127.0.0.1:8000/api/cursos/${cursoId}`, {
            method: "GET",
            headers: {
              Authorization:
                "Bearer 1|AFPPXEHDEUyWz1mnsszBCzo3QrKWNc18dAPfae4L2d901636",
              Accept: "*/*",
              "Content-Type": "application/json",
            },
          }),
          fetch(`http://127.0.0.1:8000/api/solicitudes/${cursoId}`, {
            method: "GET",
            headers: {
              Authorization:
                "Bearer 1|AFPPXEHDEUyWz1mnsszBCzo3QrKWNc18dAPfae4L2d901636",
              Accept: "*/*",
              "Content-Type": "application/json",
            },
          }),
        ]);

        // Manejo de respuestas
        const cursoData = await cursoResponse.json();
        const solicitudesData = await solicitudesResponse.json();

        if (!cursoResponse.ok) {
          throw new Error(
            `Error ${cursoResponse.status}: ${
              cursoData.message || "Error desconocido"
            }`
          );
        }

        // Asignar datos
        setCurso(cursoData.curso);
        setSolicitudes(Array.isArray(solicitudesData) ? solicitudesData : []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [cursoId]);

  const handleArchive = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`http://127.0.0.1:8000/api/archivarCurso/${cursoId}`, null, {
        headers: {
          Authorization:
            "Bearer 1|AFPPXEHDEUyWz1mnsszBCzo3QrKWNc18dAPfae4L2d901636",
        },
      });

      if (response.data.success === "true") {
        notification.success({
          message: "Curso Archivado",
          description: "El curso ha sido archivado exitosamente.",
        });
      } else {
        notification.error({
          message: "Error al Archivar",
          description: "No se pudo archivar el curso.",
        });
      }
    } catch (error) {
      notification.error({
        message: "Error al Archivar",
        description: `Ocurrió un error: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex gap-4 flex-col h-[40vh] justify-center items-center">
        <Spin size="large" />
        <p>Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex gap-4 flex-col h-[40vh] justify-center items-center">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!curso) {
    return (
      <div className="flex gap-4 flex-col h-[40vh] justify-center items-center">
        <p>No se encontró el curso.</p>
      </div>
    );
  }

  return (
    <div>
      {contextHolder} {/* Necesario para las notificaciones de antd */}
      <h2 className="Montserrat font-semibold text-2xl text-center my-6">
        Curso activo:
      </h2>

      <div id="Card" className="bg-slate-100 p-2 md:mx-16 md:p-16">
        <div id="cardContent" className="flex flex-col items-center">
          <div
            id="headerCard"
            className="w-full flex justify-between items-center"
          >
            <div id="Actions" className="self-start flex gap-2">
              <img alt="icon" className="w-4" src="/Opt/SVG/LighArrow.svg" />
              <Link
                to="/Coordinador/CursosActivos"
                className="Popins font-semibold"
              >
                Volver
              </Link>
            </div>
            <h3 className="Montserrat font-extralight text-2xl">
              {curso.nombre}
            </h3>
            <img alt="icon" className="w-8" src="/Opt/SVG/info.svg" />
          </div>
          <Divider />

          <h2 className="Montserrat font-bold self-start text-2xl text-center">
            Módulo de nivel: {curso ? curso.nivel : "Desconocido"}
          </h2>
          <section id="Archivos" className="p-3"></section>

          <section id="Info" className="px-4 self-start w-full">
            {solicitudes.length === 0 ? (
              <p>No se encontraron solicitudes para este curso.</p>
            ) : (
              <TablaAlumnos solicitudes={solicitudes} />
            )}
          </section>

          <div className="flex flex-col md:flex-row md:items-center Montserrat w-full justify-between items-left gap-4">
            <p>
              <span className="font-semibold">Periodo:</span>{" "}
              {curso
                ? `${formatDate(curso.fecha_inicio)} - ${formatDate(
                    curso.fecha_fin
                  )}`
                : "Desconocido"}
            </p>
            <p>
              <span className="font-semibold">Docente:</span>{" "}
              {curso && curso.docente && curso.docente.usuario
                ? `${curso.docente.usuario.nombre} ${curso.docente.usuario.apellidos}`
                : "Desconocido"}
            </p>
            <p>
              <span className="font-semibold">Requisitos:</span>{" "}
              {curso
                ? curso.nivel === "0"
                  ? "Ninguno"
                  : curso.nivel
                : "Desconocido"}
            </p>

            <Button
              danger
              id="img-Archivar"
              className="flex flex-col items-center h-auto"
              onClick={handleArchive}
            >
              <img className="w-8" alt="icon" src="/Opt/SVG/archivar.svg" />
              <span>Archivar</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetalleCurso;
