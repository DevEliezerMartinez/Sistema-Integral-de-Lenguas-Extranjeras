import { Button, Divider, notification } from "antd";
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import TablaAlumnos from "../../components/Docentes/TablaAlumnos";
import axios from "axios";

function DetalleCurso() {
  const { cursoId } = useParams();
  const [alumnos, setAlumnos] = useState([]);
  const [curso, setCurso] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState("");

  useEffect(() => {
    const tokenData = localStorage.getItem("token");
    if (tokenData) {
      setToken(tokenData);
    }
  }, []);

  useEffect(() => {
    const fetchCursoDetalles = async () => {
      if (!token) return;
      try {
        const cursoResponse = await axios.get(`http://127.0.0.1:8000/api/cursos/${cursoId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCurso(cursoResponse.data.curso);

        const alumnosResponse = await axios.get(`http://127.0.0.1:8000/api/solicitudes/${cursoId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const calificacionesResponse = await axios.get(`http://127.0.0.1:8000/api/calificaciones/${cursoId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const alumnosConCalificaciones = alumnosResponse.data.map(alumno => {
          const calificacion = calificacionesResponse.data.find(c => c.alumno_id === alumno.alumno_id);
          return {
            ...alumno,
            calificacion: calificacion ? calificacion.calificacion : '',
          };
        });

        setAlumnos(alumnosConCalificaciones);
        setIsLoading(false);
      } catch (error) {
        console.error("Error al obtener el curso, alumnos o calificaciones:", error);
        setIsLoading(false);
      }
    };

    if (token) {
      fetchCursoDetalles();
    }
  }, [cursoId, token]);

  const onSaveGrade = async (record) => {
    try {
      const response = await axios.post(`http://127.0.0.1:8000/api/calificaciones`, {
        curso_id: cursoId,
        alumno_id: record.alumno_id,
        calificacion: Number(record.calificacion),
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      notification.success({
        message: 'Calificación guardada',
        description: 'La calificación se ha guardado exitosamente.',
      });
    } catch (error) {
      console.error("Error al guardar calificación:", error.response ? error.response.data : error);
      notification.error({
        message: 'Error al guardar calificación',
        description: error.response ? error.response.data.message : 'Ha ocurrido un error inesperado.',
      });
    }
  };

  const onArchiveCourse = async () => {
    try {
      const response = await axios.post(`http://127.0.0.1:8000/api/archivarCurso/${cursoId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      notification.success({
        message: 'Curso Archivado',
        description: response.data.mensaje,
      });

      // Opcional: Puedes redirigir o actualizar el estado si es necesario
    } catch (error) {
      console.error("Error al archivar el curso:", error.response ? error.response.data : error);
      notification.error({
        message: 'Error al archivar curso',
        description: error.response ? error.response.data.error : 'Ha ocurrido un error inesperado.',
      });
    }
  };

  return (
    <div>
      <h2 className="Montserrat font-semibold text-2xl text-center md:my-6">
        Detalles del curso {cursoId}
      </h2>

      <div id="Card" className="bg-slate-100 p-2 md:mx-16 md:p-16">
        <div id="cardContent" className="flex flex-col items-center">
          <div id="headerCard" className="w-full flex justify-between items-center">
            <div id="Actions" className="self-start flex gap-2">
              <img alt="icon" className="w-4" src="/Opt/SVG/LighArrow.svg" />
              <Link to="/Docentes/CursosActivos" className="Popins font-semibold">
                Volver
              </Link>
            </div>
            <h3 className="Montserrat font-extralight text-2xl">Detalles del curso</h3>
            <img alt="icon" className="w-8" src="/Opt/SVG/info.svg" />
          </div>
          <Divider />

          {curso ? (
            <>
              <h2 className="Montserrat font-bold self-start text-2xl text-center">
                {curso.nombre || "N/A"}
              </h2>

              <section id="Info" className="px-4 self-start w-full">
                <TablaAlumnos alumnos={alumnos} isLoading={isLoading} onSaveGrade={onSaveGrade} />
              </section>

              <div className="flex Montserrat w-full justify-between items-center">
                <p>
                  <span className="font-semibold">Periodo:</span> {curso.fecha_inicio || "N/A"} - {curso.fecha_fin || "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Docente:</span> {curso.docente ? curso.docente.nombre : "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Requisitos:</span> {curso.nivel || "N/A"}
                </p>

                <Button primaryq onClick={onArchiveCourse} className="flex flex-col items-center h-auto">
                  <img className="w-8" alt="icon" src="/Opt/SVG/archivar.svg" />
                  <span>Marcar como terminado</span>
                </Button>
              </div>
            </>
          ) : (
            <p>Cargando detalles del curso...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default DetalleCurso;
