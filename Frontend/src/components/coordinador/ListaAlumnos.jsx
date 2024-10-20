import React, { useEffect, useState } from "react";
import { Avatar, Breadcrumb, Collapse, Input, Table, Tag } from "antd";

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
    const token = localStorage.getItem("token");

    // Hacer la solicitud al endpoint
    fetch(`${import.meta.env.VITE_API_URL}/api/cursos_con_estudiantes`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "*/*",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error en la respuesta de la red");
        }
        return response.json();
      })
      .then((data) => {
        const cursos = data.cursos;

        // Verificar si el array de cursos está vacío
        if (!cursos || cursos.length === 0) {
          console.log("No se encontraron cursos.");
          setCursosData({}); // Establecer los datos de los cursos como un objeto vacío
          setLoading(false);
          return; // Salir de la función si no hay cursos
        }

        // Procesar los datos para que coincidan con la estructura de la tabla
        const cursosFormateados = {};
        cursos.forEach((curso) => {
          const nombreCurso = curso.Curso.Nombre;
          const estudiantes = curso.Estudiantes.map((estudiante) => ({
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
        <>
          {Object.keys(cursosData).length === 0 ? (
            <p>No hay cursos disponibles.</p>
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
        </>
      )}
    </div>
  );
};

export default ListaAlumno;
