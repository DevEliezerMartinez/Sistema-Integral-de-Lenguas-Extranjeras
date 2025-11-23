import { Breadcrumb, Button, Input, Switch, Skeleton } from "antd";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  AppstoreOutlined,
  UnorderedListOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import client from "../../axios.js";

function CursoActivo() {
  const [cursos, setCursos] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [docente, setDocente] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [vista, setVista] = useState("grid");
  const [busqueda, setBusqueda] = useState("");

  const formatearFecha = (fecha) => {
    if (!fecha) return "";
    const date = new Date(fecha);
    return date.toLocaleDateString("es-MX", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Cargar datos del usuario
  useEffect(() => {
    const usuarioData = localStorage.getItem("usuario");
    const docenteData = localStorage.getItem("docente");

    if (usuarioData) setUsuario(JSON.parse(usuarioData));
    if (docenteData) setDocente(JSON.parse(docenteData));
  }, []);

  // Obtener cursos
  useEffect(() => {
    const fetchCursos = async () => {
      if (!docente) return;

      try {
        setIsLoading(true);
        const response = await client.get(`/api/cursosAsignados/${docente.id}`);
        const data = response.data;
        const lista = Object.values(data.cursos || {});
        setCursos(lista);
      } catch (error) {
        console.error("Error al obtener los cursos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCursos();
  }, [docente]);

  const cursosFiltrados = cursos.filter((curso) =>
    curso.nombre?.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Tarjeta en modo grid
  const CardGrid = ({ curso }) => (
    <div className="border rounded-xl bg-white w-full p-5 flex flex-col items-center shadow-sm hover:shadow-md transition">
      <img
        alt="libro"
        src="/Opt/SVG/book.svg"
        className="w-20 opacity-90 mb-3"
      />
      <p className="font-semibold text-gray-800 text-center">{curso.nombre}</p>
      <p className="text-sm text-gray-600 text-center mt-1">
        {curso.descripcion}
      </p>
      <p className="text-sm text-gray-600 text-center mt-1">
        Modalidad: {curso.modalidad}
      </p>
      <p className="text-sm text-gray-600 text-center mt-1">
        Inicio: {formatearFecha(curso.fecha_inicio)}
      </p>
      <p className="text-sm text-gray-600 text-center">
        Fin: {formatearFecha(curso.fecha_fin)}
      </p>
      <Button type="primary" className="bg-[#1B396A] mt-4">
        <Link to={`/Docentes/Cursos/${curso.id}`}>Detalles</Link>
      </Button>
    </div>
  );

  // Tarjeta en modo lista
  const CardList = ({ curso }) => (
    <div className="w-full bg-white border rounded-xl shadow-sm hover:shadow-md transition p-4 flex items-center justify-between">
      <div className="flex gap-4 items-center">
        <img alt="libro" src="/Opt/SVG/book.svg" className="w-14 opacity-80" />
        <div>
          <p className="font-semibold text-gray-800 text-lg">{curso.nombre}</p>
          <p className="text-sm text-gray-600">Modalidad: {curso.modalidad}</p>
          <p className="text-sm text-gray-600">
            Inicio: {formatearFecha(curso.fecha_inicio)}
          </p>
          <p className="text-sm text-gray-600">
            Fin: {formatearFecha(curso.fecha_fin)}
          </p>
        </div>
      </div>
      <Button type="primary" className="bg-[#1B396A]">
        <Link to={`/Docentes/Cursos/${curso.id}`}>Detalles</Link>
      </Button>
    </div>
  );

  return (
    <div className="px-4 min-h-[60vh]">
      <Breadcrumb
        items={[
          { title: <p className="font-medium text-black">Docente</p> },
          { title: <span className="text-[#1B396A]">Cursos asignados</span> },
        ]}
      />

      <h2 className="Montserrat font-semibold text-2xl text-center mt-6 text-[#1B396A]">
        Mis cursos asignados
      </h2>

      {usuario && (
        <p className="text-center mt-2">
          Bienvenido, {usuario.nombre} {usuario.apellidos}!
        </p>
      )}

      {/* Controles */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
        <Input
          placeholder="Buscar curso..."
          prefix={<SearchOutlined />}
          className="w-full md:w-1/2"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          disabled={isLoading}
        />

        <div className="flex items-center gap-3">
          <span className="Montserrat">Lista</span>
          <Switch
            checked={vista === "grid"}
            onChange={(checked) => setVista(checked ? "grid" : "list")}
            checkedChildren={<AppstoreOutlined />}
            unCheckedChildren={<UnorderedListOutlined />}
            style={{
              backgroundColor: vista === "grid" ? "#1B396A" : "#d9d9d9",
            }}
            disabled={isLoading}
          />
          <span className="Montserrat">Cuadrícula</span>
        </div>
      </div>

      {/* Contenido */}
      <div
        className={
          vista === "grid"
            ? "mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            : "mt-8 flex flex-col gap-4"
        }
      >
        {isLoading ? (
          Array.from({ length: 3 }).map((_, idx) => (
            <Skeleton
              key={idx}
              active
              title={false}
              paragraph={{ rows: 5 }}
              className="rounded-xl p-6 bg-white shadow-sm"
            />
          ))
        ) : cursosFiltrados.length > 0 ? (
          cursosFiltrados.map((curso) =>
            vista === "grid" ? (
              <CardGrid key={curso.id} curso={curso} />
            ) : (
              <CardList key={curso.id} curso={curso} />
            )
          )
        ) : (
          <div className="flex flex-col justify-center items-center text-center min-h-[50vh] w-full">
            <div className="border rounded bg-slate-100 px-8 py-6 w-full md:w-2/4">
              <img
                alt="triste"
                src="/Opt/SVG/sad.svg"
                className="w-24 mx-auto"
              />
              <p className="Montserrat font-medium mt-3">
                Sin cursos disponibles
              </p>
              <span className="text-sm block mt-1">
                Si consideras que existe un error, contacta al coordinador del
                CLE.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CursoActivo;
