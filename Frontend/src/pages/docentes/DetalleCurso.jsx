import {
  Breadcrumb,
  Button,
  Divider,
  notification,
  Spin,
  Tag,
  Modal,
  Space,
  Badge,
  Tooltip,
} from "antd";
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import TablaAlumnos from "../../components/Docentes/TablaAlumnos";
import {
  NotificationOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import client from "../../axios.js";

const { confirm } = Modal;

function DetalleCurso() {
  const { cursoId } = useParams();
  const [alumnos, setAlumnos] = useState([]);
  const [curso, setCurso] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState("");

  // Obtener token del localStorage (aunque ya no se usa para auth, puede ser util para otras cosas o se puede quitar si no se usa)
  useEffect(() => {
    const tokenData = localStorage.getItem("token");
    if (tokenData) setToken(tokenData);
  }, []);

  // Obtener detalles del curso, alumnos y calificaciones
  useEffect(() => {
    const fetchCursoDetalles = async () => {
      try {
        const cursoResponse = await client.get(`/api/cursos/${cursoId}`);
        const cursoData = cursoResponse.data;
        setCurso(cursoData.curso);

        const [alumnosResponse, calificacionesResponse] = await Promise.all([
          client.get(`/api/solicitudes/${cursoId}`),
          client.get(`/api/calificaciones/${cursoId}`),
        ]);

        const alumnosData = alumnosResponse.data;
        const calificacionesData = calificacionesResponse.data;

        // Vincular calificaciones con alumnos
        const alumnosConCalificaciones = alumnosData.map((alumno) => {
          const calificacion = calificacionesData.find(
            (c) => c.alumno_id === alumno.alumno_id
          );
          return {
            ...alumno,
            calificacion: calificacion ? calificacion.calificacion : "",
          };
        });

        setAlumnos(alumnosConCalificaciones);
      } catch (error) {
        console.error("Error al obtener curso/alumnos/calificaciones:", error);
        notification.error({
          message: "Error al cargar el curso",
          description: "Ocurrió un error al obtener los detalles del curso.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCursoDetalles();
  }, [cursoId]);

  // Guardar calificación
  const onSaveGrade = async (record) => {
    try {
      await client.post("/api/calificaciones", {
        curso_id: cursoId,
        alumno_id: record.alumno_id,
        calificacion: Number(record.calificacion),
      });

      notification.success({
        message: "Calificación guardada",
        description: "Se ha guardado exitosamente.",
      });
    } catch (error) {
      notification.error({
        message: "Error al guardar calificación",
        description: "Ha ocurrido un error inesperado.",
      });
    }
  };

  // Función para archivar el curso
  const onArchiveCourse = async () => {
    try {
      const response = await client.post(`/api/archivarCurso/${cursoId}`);
      const data = response.data;

      notification.success({
        message: "Curso Archivado",
        description: data.mensaje,
      });

      // Cambiar estado local sin recargar
      setCurso((prev) => ({ ...prev, estado: "Archivado" }));
    } catch (error) {
      notification.error({
        message: "Error al archivar curso",
        description: "Ha ocurrido un error inesperado.",
      });
    }
  };

  const esArchivado = curso?.estado === "Archivado";

  // Función para mostrar fecha legible
  const formatearFecha = (fecha) => {
    if (!fecha) return "N/A";
    const date = new Date(fecha);
    return date.toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="px-4">
      {/* Breadcrumb dinámico */}
      <Breadcrumb
        items={[
          { title: <p className="font-medium text-black">Docente</p> },
          {
            title: (
              <p>{esArchivado ? "Cursos archivados" : "Cursos activos"}</p>
            ),
          },
          { title: <a>Detalles del curso</a> },
        ]}
      />

      {/* Header */}
      <div className="flex justify-between items-center my-6">
        <Link
          to={
            esArchivado
              ? "/Docentes/CursosArchivados"
              : "/Docentes/CursosActivos"
          }
          className="Montserrat font-semibold flex items-center gap-2"
        >
          <img alt="volver" className="w-4" src="/Opt/SVG/LighArrow.svg" />
          Volver
        </Link>

        <h2 className="Montserrat font-semibold text-2xl md:text-3xl text-center">
          {curso ? curso.nombre : "Detalles del curso"}
        </h2>

        {esArchivado ? (
          <div className="flex flex-row items-center justify-center gap-2">
            {/* Etiqueta principal */}
            <Tag color="gray" className="px-3 py-1 text-base font-medium">
              Archivado
            </Tag>

            {/* Ícono con tooltip */}
            <div className="flex items-end gap-2">
              {/* Icono de ayuda con tooltip */}
              <Tooltip
                title="Si necesitas volver a activar este curso, solicítalo a tu coordinador"
                placement="right"
              >
                <QuestionCircleOutlined
                  style={{
                    fontSize: 18,
                    color: "#1890ff",
                    cursor: "pointer",
                  }}
                />
              </Tooltip>
            </div>
          </div>
        ) : (
          <Button
            type="text"
            onClick={() => {
              Modal.confirm({
                title: "¿Archivar curso?",
                content:
                  "Una vez archivado, no podrás modificar las calificaciones y el curso se moverá a la categoría de 'Cursos Archivados'.",
                okText: "Sí, archivar",
                cancelText: "Cancelar",
                okType: "primary",
                centered: true,
                onOk: onArchiveCourse,
              });
            }}
            className="flex flex-col items-center"
          >
            <img className="w-8" alt="archivar" src="/Opt/SVG/archivar.svg" />
            <span className="Montserrat text-sm">Archivar curso</span>
          </Button>
        )}
      </div>

      <Divider />

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spin size="large" />
        </div>
      ) : curso ? (
        <div className="bg-white shadow-md rounded-xl p-6 flex flex-col gap-6">
          {/* Información general */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-col gap-2">
              <p className="Montserrat font-medium">
                <span className="font-semibold">Periodo:</span>{" "}
                {formatearFecha(curso.fecha_inicio)} -{" "}
                {formatearFecha(curso.fecha_fin)}
              </p>
              <p className="Montserrat font-medium">
                <span className="font-semibold">Docente:</span>{" "}
                {curso.docente ? curso.docente.nombre : "N/A"}
              </p>
              <p className="Montserrat font-medium">
                <span className="font-semibold">Requisitos:</span>{" "}
                {curso.nivel || "N/A"}
              </p>
            </div>
          </div>

          {/* Tabla de alumnos */}
          <div className="bg-slate-50 rounded-xl p-4 shadow-sm">
            <TablaAlumnos
              alumnos={alumnos}
              isLoading={isLoading}
              onSaveGrade={onSaveGrade}
              esArchivado={esArchivado}
            />
          </div>
        </div>
      ) : (
        <p className="Montserrat text-center text-gray-500">
          No se encontraron detalles del curso.
        </p>
      )}
    </div>
  );
}

export default DetalleCurso;
