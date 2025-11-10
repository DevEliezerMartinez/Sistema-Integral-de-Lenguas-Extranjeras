import React, { useState, useEffect } from "react";
import { Table, Input, Button, Empty } from "antd";

const TablaAlumnos = ({ alumnos, isLoading, onSaveGrade, esArchivado }) => {
  console.log("🔍 Valor recibido de esArchivado:", esArchivado);
  console.log("📋 Alumnos recibidos en la tabla:", alumnos);

  const [calificaciones, setCalificaciones] = useState([]);

  // Inicializa las calificaciones con los alumnos recibidos
  useEffect(() => {
    if (alumnos.length > 0) {
      const inicializadas = alumnos.map((alumno) => ({
        ...alumno,
        calificacion: alumno.calificacion || "",
      }));
      setCalificaciones(inicializadas);
    }
  }, [alumnos]);

  // Formateador de fecha legible (español)
  const formatearFecha = (fecha) => {
    if (!fecha) return "N/A";
    return new Date(fecha).toLocaleString("es-MX", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleCalificacionChange = (value, record) => {
    setCalificaciones((prevState) =>
      prevState.map((alumno) =>
        alumno.ID_Inscripcion === record.ID_Inscripcion
          ? { ...alumno, calificacion: value === "" ? "" : Number(value) }
          : alumno
      )
    );
  };

  const columns = [
    {
      title: "Nombre",
      dataIndex: "Nombre_Alumno",
      key: "Nombre_Alumno",
    },
    {
      title: "Apellidos",
      dataIndex: "Apellidos_Alumno",
      key: "Apellidos_Alumno",
    },
    {
      title: "Curso",
      dataIndex: "Nombre_Curso",
      key: "Nombre_Curso",
      responsive: ["md"], // Se oculta en pantallas pequeñas
    },
    {
      title: "Fecha de Inscripción",
      dataIndex: "Fecha_Inscripcion",
      key: "Fecha_Inscripcion",
      render: (text) => formatearFecha(text),
    },
    {
      title: "Estado de Solicitud",
      dataIndex: "Estado_Solicitud",
      key: "Estado_Solicitud",
    },
    {
      title: "Calificación",
      dataIndex: "calificacion",
      key: "calificacion",
      render: (text, record) => {
        const alumno = calificaciones.find(
          (a) => a.ID_Inscripcion === record.ID_Inscripcion
        );
        return (
          <Input
            type="number"
            min="0"
            max="100"
            value={alumno ? alumno.calificacion : ""}
            disabled={esArchivado} // 👈 Aquí se aplica el disable si el curso está archivado
            onChange={(e) => handleCalificacionChange(e.target.value, record)}
          />
        );
      },
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (text, record) => (
        <Button
          disabled={esArchivado} // 👈 También deshabilita el botón guardar si está archivado
          onClick={() => {
            const payload = {
              curso_id: record.Nombre_Curso,
              alumno_id: record.alumno_id,
              calificacion: calificaciones.find(
                (a) => a.ID_Inscripcion === record.ID_Inscripcion
              ).calificacion,
            };

            if (payload.alumno_id) {
              onSaveGrade(payload);
            } else {
              console.error("⚠️ El alumno_id no está definido", record);
            }
          }}
        >
          Guardar
        </Button>
      ),
    },
  ];

  return (
    <>
      {isLoading ? (
        <div>Cargando...</div>
      ) : calificaciones.length > 0 ? (
        <div className="overflow-x-auto w-full">
          <Table
            dataSource={calificaciones}
            columns={columns}
            loading={isLoading}
            rowKey="ID_Inscripcion"
            pagination={false}
            scroll={{ x: "max-content" }} // ✅ Evita desbordamiento horizontal
            className="min-w-full"
          />
        </div>
      ) : (
        <Empty description="Sin alumnos aún" />
      )}
    </>
  );
};

export default TablaAlumnos;
