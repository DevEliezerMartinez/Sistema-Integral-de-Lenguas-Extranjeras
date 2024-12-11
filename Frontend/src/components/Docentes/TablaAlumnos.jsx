import React, { useState, useEffect } from "react";
import { Table, Input, Button, Empty } from "antd";

const TablaAlumnos = ({ alumnos, isLoading, onSaveGrade, cursoEstado }) => {
  console.log("recibido en el componente de tabla", alumnos);

  const [calificaciones, setCalificaciones] = useState([]);

  useEffect(() => {
    if (alumnos.length > 0) {
      const inicializadas = alumnos.map(alumno => ({
        ...alumno,
        calificacion: alumno.calificacion || "",
      }));
      setCalificaciones(inicializadas);
    }
  }, [alumnos]);

  console.log("calificaciones estado:", calificaciones);

  const handleCalificacionChange = (value, record) => {
    setCalificaciones(prevState =>
      prevState.map(alumno =>
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
    },
    {
      title: "Fecha de Inscripción",
      dataIndex: "Fecha_Inscripcion",
      key: "Fecha_Inscripcion",
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
        const alumno = calificaciones.find(alumno => alumno.ID_Inscripcion === record.ID_Inscripcion);
        const isDisabled = cursoEstado === "Archivado"; // Verifica si el curso está archivado
        return (
          <Input
            type="number"
            min="0"
            max="100"
            value={alumno ? alumno.calificacion : ""}
            onChange={(e) => handleCalificacionChange(e.target.value, record)}
            disabled={isDisabled} // Deshabilitar si el curso está archivado
            readOnly={isDisabled} // Sólo lectura si el curso está archivado
          />
        );
      },
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (text, record) => {
        const alumno = calificaciones.find(alumno => alumno.ID_Inscripcion === record.ID_Inscripcion);
        const isDisabled = cursoEstado === "Archivado"; // Verifica si el curso está archivado
        return (
          <Button
            onClick={() => {
              const payload = {
                curso_id: record.Nombre_Curso,
                alumno_id: record.alumno_id,
                calificacion: calificaciones.find(alumno => alumno.ID_Inscripcion === record.ID_Inscripcion).calificacion
              };

              if (payload.alumno_id) {
                onSaveGrade(payload);
              } else {
                console.error("El alumno_id no está definido", record);
              }
            }}
            disabled={isDisabled} // Deshabilitar si el curso está archivado
          >
            Guardar
          </Button>
        );
      },
    },
  ];

  return (
    <>
      {isLoading ? (
        <div>Cargando...</div>
      ) : calificaciones.length > 0 ? (
        <Table
          dataSource={calificaciones}
          columns={columns}
          loading={isLoading}
          rowKey="ID_Inscripcion"
          pagination={false}
        />
      ) : (
        <Empty description="Sin alumnos aún" />
      )}
    </>
  );
};

export default TablaAlumnos;
