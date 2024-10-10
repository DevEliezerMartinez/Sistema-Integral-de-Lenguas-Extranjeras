import React, { useEffect, useState } from "react";
import { Avatar, Breadcrumb, Collapse, Input, Table, Tag } from "antd";
import axios from "axios";

const { Panel } = Collapse;
const { Search } = Input;

const columns = [
  {
    title: "Nombre",
    dataIndex: "nombre",
    key: "nombre",
    filterSearch: true,
    onFilter: (value, record) =>
      record.nombre.toLowerCase().includes(value.toLowerCase()),
    render: (text, record) => (
      <a href={`/Coordinador/Alumnos/${record.key}`}>
        {text} {record.apellidos}
      </a>
    ),
  },
  {
    title: "Último Nivel",
    dataIndex: "ultimoNivel",
    key: "ultimoNivel",
  },
];

const ListaAlumno = () => {
  const [cursosData, setCursosData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hacer la solicitud al endpoint
    axios
      .get("http://127.0.0.1:8000/api/cursos_con_estudiantes", {
        headers: {
          Authorization:
            "Bearer 1|AFPPXEHDEUyWz1mnsszBCzo3QrKWNc18dAPfae4L2d901636",
          Accept: "*/*",
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const cursos = response.data.cursos;
        // Procesar los datos para que coincidan con la estructura de la tabla
        const cursosFormateados = {};
        cursos.forEach((curso) => {
          const nombreCurso = curso.Curso.Nombre;
          const estudiantes = curso.Estudiantes.map((estudiante, index) => ({
            key: estudiante.ID_Inscripcion,
            nombre: estudiante.Nombre_Alumno,
            apellidos: estudiante.Apellidos_Alumno,
            ultimoNivel: estudiante.Estado_Solicitud, // Aquí puedes cambiarlo según lo que quieras mostrar
          }));
          cursosFormateados[nombreCurso] = estudiantes;
        });
        setCursosData(cursosFormateados);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener los cursos:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="px-4">
      <Breadcrumb
        items={[
          {
            title: <p className="font-medium text-black">Coordinador</p>,
          },
          {
            title: <a href="">Listas de alumnos</a>,
          },
        ]}
      />
      <h2 className="Montserrat font-semibold text-2xl text-center">
        Lista de alumnos
      </h2>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <Collapse accordion>
          {Object.keys(cursosData).map((curso) => (
            <Panel header={curso} key={curso}>
              <Search
                placeholder="Buscar alumno"
                onSearch={(value) => console.log(value)}
                style={{ marginBottom: 8 }}
              />
              <Table
                columns={columns}
                dataSource={cursosData[curso]}
                pagination={false}
                rowKey="key"
              />
            </Panel>
          ))}
        </Collapse>
      )}
    </div>
  );
};

export default ListaAlumno;
