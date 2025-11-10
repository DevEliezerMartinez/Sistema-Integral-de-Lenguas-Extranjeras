import {
  Breadcrumb,
  Button,
  Divider,
  message,
  Spin,
  Input,
  Switch,
} from "antd";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  AppstoreOutlined,
  UnorderedListOutlined,
  SearchOutlined,
} from "@ant-design/icons";

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

// Card para CUADRÍCULA
const CardGrid = ({ curso, id_estudiante }) => (
  <div className="border rounded-xl bg-white w-full md:w-90 p-5 flex flex-col items-center shadow-sm hover:shadow-md transition">
    {/* Badge */}
    <div className="w-full flex justify-end mb-2">
      <span className="inline-block bg-blue-500 text-white text-xs font-medium px-3 py-1 rounded-full">
        En progreso
      </span>
    </div>

    <img alt="libro" src="/Opt/SVG/book.svg" className="w-32 opacity-90" />
    <Divider />
    <p className="font-semibold text-gray-800 text-center">
      {curso.Nombre_Curso}
    </p>
    <p className="text-sm text-gray-600">
      Horario: {obtenerHorarioTexto(curso.Horario)}
    </p>

    {/* Botón como enlace */}
    <Link to={`/Estudiantes/CursoInfo/${curso.Curso_ID}/${id_estudiante}`}>
      <Button
        type="primary"
        className="bg-[#1B396A] mt-4 hover:bg-[#244b8a]"
      >
        Información
      </Button>
    </Link>
  </div>
);

// Card para LISTA
const CardList = ({ curso, id_estudiante }) => (
  <div className="w-full bg-white border rounded-xl shadow-sm hover:shadow-md transition p-4">
    {/* Badge */}
    <div className="flex justify-end mb-3">
      <span className="inline-block bg-blue-500 text-white text-xs font-medium px-3 py-1 rounded-full">
        En progreso
      </span>
    </div>

    <div className="flex items-center justify-between">
      <div className="flex gap-4 items-center">
        <img alt="libro" src="/Opt/SVG/book.svg" className="w-14 opacity-80" />
        <div>
          <p className="font-semibold text-gray-800 text-lg">
            {curso.Nombre_Curso}
          </p>
          <p className="text-sm text-gray-600">
            Horario: {obtenerHorarioTexto(curso.Horario)}
          </p>
        </div>
      </div>

      <Link to={`/Estudiantes/CursoInfo/${curso.Curso_ID}/${id_estudiante}`}>
        <Button
          type="primary"
          className="bg-[#1B396A] hover:bg-[#244b8a]"
        >
          Ver más
        </Button>
      </Link>
    </div>
  </div>
);

function Progreso() {
  const [cursos, setCursos] = useState([]);
  const [cursosFiltrados, setCursosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [idEstudiante, setIdEstudiante] = useState(null);
  const [vista, setVista] = useState("grid"); // grid | list
  const [search, setSearch] = useState("");

  useEffect(() => {
    const estudianteString = localStorage.getItem("estudiante");

    if (estudianteString) {
      try {
        const estudiante = JSON.parse(estudianteString);
        if (estudiante?.id) {
          setIdEstudiante(estudiante.id);
        } else {
          throw new Error("El objeto estudiante no contiene un ID válido.");
        }
      } catch {
        message.error("No se pudo recuperar la información del estudiante.");
      }
    }
  }, []);

  useEffect(() => {
    const obtenerCursos = async () => {
      if (!idEstudiante) return;

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/progreso/estudiante/${idEstudiante}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              Accept: "*/*",
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (data.exito) {
          setCursos(data.progreso);
          setCursosFiltrados(data.progreso);
        } else {
          setCursos([]);
          message.warning(data.mensaje);
        }
      } catch {
        message.error("Hubo un problema al obtener los cursos.");
      } finally {
        setLoading(false);
      }
    };

    obtenerCursos();
  }, [idEstudiante]);

  // Búsqueda
  useEffect(() => {
    const filtrados = cursos.filter((c) =>
      c.Nombre_Curso.toLowerCase().includes(search.toLowerCase())
    );
    setCursosFiltrados(filtrados);
  }, [search, cursos]);

  return (
    <div className="min-h-[60vh]">
      <Breadcrumb
        items={[
          { title: <p className="font-medium text-black">Estudiantes</p> },
          { title: <span className="text-[#1B396A]">Mi progreso</span> },
        ]}
      />

      <h2 className="font-semibold text-3xl text-center mt-6 text-[#1B396A]">
        Mi progreso
      </h2>

      <p className="text-gray-600 text-center">
        Aquí encontrarás todos los cursos que has tomado.
      </p>

      {/* Barra superior */}
      <div className="flex flex-col md:flex-row items-center justify-between mt-6 gap-4">
        <Input
          placeholder="Buscar curso..."
          prefix={<SearchOutlined />}
          className="w-full md:w-80"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="flex items-center gap-3">
          <span>Lista</span>
          <Switch
            checked={vista === "grid"}
            onChange={(checked) => setVista(checked ? "grid" : "list")}
            checkedChildren={<AppstoreOutlined />}
            unCheckedChildren={<UnorderedListOutlined />}
            style={{
              backgroundColor: vista === "grid" ? "#1B396A" : "#d9d9d9",
            }}
          />
          <span>Cuadrícula</span>
        </div>
      </div>

      {/* Contenido */}
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <Spin tip="Cargando cursos..." size="large" />
        </div>
      ) : cursosFiltrados.length === 0 ? (
        <p className="text-center mt-10 text-gray-500">
          No se encontraron cursos.
        </p>
      ) : vista === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {cursosFiltrados.map((curso) => (
            <CardGrid
              curso={curso}
              key={curso.Curso_ID}
              id_estudiante={idEstudiante}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4 mt-8">
          {cursosFiltrados.map((curso) => (
            <CardList
              curso={curso}
              key={curso.Curso_ID}
              id_estudiante={idEstudiante}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Progreso;