import { Breadcrumb, Button, Divider, Card, List, Typography, Spin, message } from "antd";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

// Función para convertir el horario numérico a texto
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

// Función para formatear fechas de manera legible
const formatFecha = (fecha) => {
  if (!fecha) return "";
  const d = new Date(fecha);
  return d.toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

function DetalleCurso() {
  const { cursoId } = useParams();
  const navigate = useNavigate();

  const [curso, setCurso] = useState(null);
  const [docente, setDocente] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const estudiante = JSON.parse(localStorage.getItem("estudiante"));
    const id_estudiante = estudiante?.id;

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/infocurso_alumno/${cursoId}/${id_estudiante}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "*/*",
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) throw new Error("Error al obtener los detalles del curso.");

        const data = await response.json();
        if (!data.curso) throw new Error("No se encontraron detalles del curso.");

        setCurso(data.curso);
        setDocente(data.curso.docente);
      } catch (err) {
        setError(err.message);
        message.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [cursoId]);

  return (
    <div className="container ">
      {/* Breadcrumb siempre visible */}
       <Breadcrumb
             items={[
               { title: <p className="font-medium text-black">Estudiantes</p> },
               { title: <span className="text-[#1B396A]">Mi progreso</span> },
               { title: <span className="text-[#1B396A]">Detalles de mi curso</span> },
             ]}
           />

      {loading ? (
        <div className="flex justify-center py-10">
          <Spin tip="Cargando detalles del curso..." size="large" />
        </div>
      ) : error ? (
        <Text type="danger">{error}</Text>
      ) : curso ? (
        <Card bordered={false} className="bg-white shadow-md rounded-xl p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <Button type="link" onClick={() => navigate(-1)}>
              Volver
            </Button>
            <Title level={3} className="text-center md:text-left">{curso.nombre}</Title>
          </div>

          <Divider />

          <List
            itemLayout="horizontal"
            dataSource={[
              { label: "Nombre", value: curso.nombre },
              { label: "Descripción", value: curso.descripcion },
              { label: "Modalidad", value: curso.modalidad },
              { label: "Nivel", value: curso.nivel },
              { label: "Estado", value: curso.estado },
              { label: "Horario", value: obtenerHorarioTexto(curso.horario) },
              { label: "Fecha de Inicio", value: formatFecha(curso.fecha_inicio) },
              { label: "Fecha de Fin", value: formatFecha(curso.fecha_fin) },
              { label: "Docente", value: docente ? docente.nombre : "No asignado" },
              { label: "Calificación del curso", value: curso.calificacion_alumno || "No disponible" },
            ]}
            renderItem={(item) => (
              <List.Item className="px-2 py-1 md:px-4 md:py-2">
                <Text strong className="w-40 inline-block">{item.label}:</Text>
                <Text>{item.value}</Text>
              </List.Item>
            )}
            className="bg-slate-50 rounded-lg shadow-sm p-4"
          />
        </Card>
      ) : (
        <Text>No se encontraron detalles del curso.</Text>
      )}
    </div>
  );
}

export default DetalleCurso;
