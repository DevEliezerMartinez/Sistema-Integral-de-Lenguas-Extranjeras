import { Button, Divider, Spin, notification, Popconfirm } from "antd";
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import TablaAlumnos from "../../components/coordinador/TablaAlumnos";
import client from "../../axios.js";

function DetalleCurso() {
  const { cursoId } = useParams();
  const [curso, setCurso] = useState(null);
  const [solicitudes, setSolicitudes] = useState([]);
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
          client.get(`/api/cursos/${cursoId}`),
          client.get(`/api/solicitudes/${cursoId}`),
        ]);

        setCurso(cursoResponse.data.curso);
        setSolicitudes(
          Array.isArray(solicitudesResponse.data)
            ? solicitudesResponse.data
            : []
        );
      } catch (error) {
        const message =
          error.response?.data?.message || error.message || "Error desconocido";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [cursoId]);

  const handleToggleArchive = async () => {
    const isArchived = curso.estado === "Archivado";

    try {
      setLoading(true);

      const endpoint = isArchived
        ? `/api/desarchivarCurso/${cursoId}`
        : `/api/archivarCurso/${cursoId}`;

      const response = await client.post(endpoint);
      const data = response.data;

      if (data.success === true || data.success === "true") {
        notification.success({
          message: `Curso ${isArchived ? "Desarchivado" : "Archivado"}`,
          description: data.mensaje,
        });

        setCurso((prev) => ({
          ...prev,
          estado: isArchived ? "Activo" : "Archivado",
        }));
      } else {
        notification.error({
          message: "Error",
          description: "No se pudo completar la acción.",
        });
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: `Ocurrió un error: ${
          error.response?.data?.message || error.message
        }`,
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

  const isArchived = curso.estado === "Archivado";

  return (
    <div>
      {contextHolder}

      <h2 className="Montserrat font-semibold text-2xl text-center my-6">
        Curso activo:
      </h2>

      <div className="bg-slate-100 p-2 md:mx-16 md:p-16">
        <div className="flex flex-col items-center">
          {/* HEADER */}
          <div className="w-full flex justify-between items-center">
            <Link to="/Coordinador/CursosActivos" className="flex items-center">
              <img alt="icon" className="w-4" src="/Opt/SVG/LighArrow.svg" />
              <span className="Popins font-semibold ml-2">Volver</span>
            </Link>

            <h3 className="Montserrat font-extralight text-2xl">
              {curso.nombre}
            </h3>

            <img alt="info" className="w-8" src="/Opt/SVG/info.svg" />
          </div>

          <Divider />

          {/* NIVEL */}
          <h2 className="Montserrat font-bold self-start text-2xl text-center">
            Módulo de nivel: {curso.nivel}
          </h2>

          {/* SOLICITUDES */}
          <section className="px-4 self-start w-full">
            {solicitudes.length === 0 ? (
              <p className="my-5 text-xl">
                No se encontraron solicitudes para este curso.
              </p>
            ) : (
              <TablaAlumnos solicitudes={solicitudes} />
            )}
          </section>

          {/* INFO + BOTÓN */}
          <div className="flex flex-col md:flex-row md:items-center Montserrat w-full justify-between gap-4">
            <p>
              <span className="font-semibold">Periodo:</span>{" "}
              {`${formatDate(curso.fecha_inicio)} - ${formatDate(
                curso.fecha_fin
              )}`}
            </p>

            <p>
              <span className="font-semibold">Docente:</span>{" "}
              {curso.docente ? curso.docente.nombre : "Desconocido"}
            </p>

            <p>
              <span className="font-semibold">Requisitos:</span>{" "}
              {curso.nivel === "0" ? "Ninguno" : curso.nivel}
            </p>

            {/* BOTÓN ARCHIVAR / DESARCHIVAR CON POPCONFIRM */}
            <Popconfirm
              title={`¿${isArchived ? "Desarchivar" : "Archivar"} curso?`}
              description={`¿Estás seguro que deseas ${
                isArchived ? "desarchivar" : "archivar"
              } este curso?`}
              onConfirm={handleToggleArchive}
              okText="Sí"
              cancelText="No"
              okButtonProps={{
                danger: !isArchived,
              }}
            >
              <Button
                danger={!isArchived}
                type={isArchived ? "primary" : "default"}
                className="flex flex-col items-center h-auto"
                loading={loading}
              >
                <img
                  className={`w-8 transition-transform ${
                    isArchived ? "rotate-180" : ""
                  }`}
                  alt="icon"
                  src="/Opt/SVG/archivar.svg"
                />
                <span>{isArchived ? "Desarchivar" : "Archivar"}</span>
              </Button>
            </Popconfirm>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetalleCurso;
