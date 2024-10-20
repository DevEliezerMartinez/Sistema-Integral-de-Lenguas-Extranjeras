import { Button, Divider, Card, List, Typography, Spin } from "antd";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";

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

function DetalleCurso() {
  const { cursoId } = useParams(); // Extrae cursoId de los parámetros de la URL
  const { token } = useAuth(); // Usando el token de autenticación
  const navigate = useNavigate(); // Hook para navegar a la página anterior

  const [curso, setCurso] = useState(null); // Estado para los detalles del curso
  const [docente, setDocente] = useState(null); // Estado para el docente
  const [error, setError] = useState(null); // Estado para manejo de errores
  const [loading, setLoading] = useState(true); // Estado para controlar la carga

  useEffect(() => {
    const estudiante = JSON.parse(localStorage.getItem("estudiante"));
    const id_estudiante = estudiante.id; // Extraer el id del estudiante
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_API_URL
          }/api/infocurso_alumno/${cursoId}/${id_estudiante}`, // Actualiza la URL
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "*/*",
              "Content-Type": "application/json",
            },
          }
        );

        const { curso } = response.data; // Desestructura el curso de la respuesta
        setCurso(curso);
        setDocente(curso.docente); // Asigna el docente desde el curso
      } catch (err) {
        setError(err.response?.data?.error || "Error al cargar los datos.");
      } finally {
        setLoading(false); // Finaliza el estado de carga
      }
    };

    fetchData();
  }, [cursoId, token]); // Se eliminó alumnoId de las dependencias ya que no se usa

  if (loading) {
    return <Spin tip="Cargando..." />; // Muestra un spinner mientras carga
  }

  if (error) {
    return <Text type="danger">{error}</Text>; // Muestra mensaje de error si lo hay
  }

  if (!curso) {
    return <Text>No se encontraron detalles del curso.</Text>; // Mensaje si no hay curso
  }

  return (
    <div className="container">
      <Title level={2} className="text-center my-4">
        Detalles del Curso
      </Title>

      <Card bordered={false} className="bg-slate-100 p-4">
        <div className="header flex justify-between">
          <Button type="link" onClick={() => navigate(-1)}>
            Volver
          </Button>
          <Title level={3}>{curso.nombre}</Title>
        </div>

        <Divider />

        <List
          itemLayout="horizontal"
          dataSource={[
            { label: "Nombre", value: curso.nombre },
            { label: "Descripción", value: curso.descripcion }, // Verifica que el campo sea correcto
            { label: "Modalidad", value: curso.modalidad },
            { label: "Nivel", value: curso.nivel },
            { label: "Estado", value: curso.estado },
            { label: "Horario", value: obtenerHorarioTexto(curso.horario) },
            { label: "Fecha de Inicio", value: curso.fecha_inicio },
            { label: "Fecha de Fin", value: curso.fecha_fin },
            {
              label: "Docente",
              value: docente ? docente.nombre : "No asignado",
            },
            {
              label: "Calificación del Alumno",
              value: curso.calificacion_alumno || "No disponible",
            }, // Nueva línea para la calificación
          ]}
          renderItem={(item) => (
            <List.Item>
              <Text strong>{item.label}: </Text>
              <Text>{item.value}</Text>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}

export default DetalleCurso;
