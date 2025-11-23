import { Breadcrumb, Button, Input, Switch, Tag, message } from "antd";
import React, { useState, useEffect } from "react";
import {
  AppstoreOutlined,
  UnorderedListOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import client from "../../axios.js";

function CursoArchivado() {
  const [cursos, setCursos] = useState([]);
  const [docente, setDocente] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Estados de interfaz
  const [vista, setVista] = useState("grid"); // "grid" | "list"
  const [busqueda, setBusqueda] = useState("");

  const formatearFecha = (fecha) => {
    if (!fecha) return "";
    const date = new Date(fecha);
    return date.toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  useEffect(() => {
    const docenteData = localStorage.getItem("docente");
    if (docenteData) setDocente(JSON.parse(docenteData));
  }, []);

  useEffect(() => {
    const fetchCursosArchivados = async () => {
      if (!docente) return;

      try {
        const response = await client.get(
          `/api/cursosArchivados/${docente.id}`
        );
        const data = response.data;

        const lista = Array.isArray(data.cursos)
          ? data.cursos
          : Object.values(data.cursos || {});

        setCursos(lista);
        setHasError(false);
      } catch (error) {
        console.error("Error al obtener los cursos archivados:", error);
        message.error("Ocurrió un error al cargar los cursos archivados.");
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (docente) fetchCursosArchivados();
  }, [docente]);

  // Filtro de búsqueda
  const cursosFiltrados = cursos.filter((curso) =>
    curso.nombre?.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Card en vista GRID
  const CardGrid = ({ curso }) => (
    <div className="border rounded-xl bg-white w-full md:w-full p-5 flex flex-col items-center shadow-sm hover:shadow-md transition relative">
      <Tag color="red" className="absolute top-3 right-3 font-medium">
        Archivado
      </Tag>
      <img
        alt="libro"
        src="/Opt/SVG/book.svg"
        className="w-20 opacity-90 mb-3"
      />
      <p className="font-semibold text-gray-800 text-center">{curso.nombre}</p>
      <p className="text-sm text-gray-600 text-center mt-1">
        Periodo: {formatearFecha(curso.fecha_inicio)} -{" "}
        {formatearFecha(curso.fecha_fin)}
      </p>
      <Button type="primary" className="bg-[#1B396A] mt-4">
        <Link to={`/Docentes/Cursos/${curso.id}`}>Detalles</Link>
      </Button>
    </div>
  );

  // Card en vista LISTA (Mejorada)
  const CardList = ({ curso }) => (
    <div className="w-full bg-white border rounded-xl shadow-sm hover:shadow-md transition p-4">
      {/* Header con badge */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex gap-4 items-start flex-1">
          <img
            alt="libro"
            src="/Opt/SVG/book.svg"
            className="w-14 opacity-80 mt-1"
          />
          <div className="flex-1">
            <p className="font-semibold text-gray-800 text-lg">
              {curso.nombre}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Periodo: {formatearFecha(curso.fecha_inicio)} -{" "}
              {formatearFecha(curso.fecha_fin)}
            </p>
          </div>
        </div>
        <Tag color="red" className="font-medium ml-2">
          Archivado
        </Tag>
      </div>

      {/* Botón al final */}
      <div className="flex justify-end mt-3">
        <Button type="primary" className="bg-[#1B396A]">
          <Link to={`/Docentes/Cursos/${curso.id}`}>Ver detalles</Link>
        </Button>
      </div>
    </div>
  );

  return (
    <div className="px-4 min-h-[60vh]">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { title: <p className="font-medium text-black">Docente</p> },
          { title: <span className="text-[#1B396A]">Cursos archivados</span> },
        ]}
      />

      {/* Título */}
      <h2 className="Montserrat font-semibold text-2xl text-center mt-6 text-[#1B396A]">
        Mis cursos archivados:
      </h2>

      {/* Controles: Buscador + Vista */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
        <Input
          placeholder="Buscar curso archivado..."
          prefix={<SearchOutlined />}
          className="w-full md:w-1/2"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
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
          />
          <span className="Montserrat">Cuadrícula</span>
        </div>
      </div>

      {/* Contenedor de cursos */}
      <div
        className={
          vista === "grid"
            ? "mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            : "mt-8 flex flex-col gap-4"
        }
      >
        {isLoading ? (
          <div className="text-center col-span-full">
            <p className="Montserrat text-gray-600">Cargando cursos...</p>
          </div>
        ) : hasError || cursosFiltrados.length === 0 ? (
          <div className="border rounded bg-slate-100 px-8 py-6 text-center mx-auto w-full md:w-2/4">
            <img
              alt="sin cursos"
              src="/Opt/SVG/sad.svg"
              className="w-24 mx-auto"
            />
            <p className="Montserrat font-medium mt-3">
              Sin cursos archivados disponibles
            </p>
            <span className="text-sm block mt-1">
              Si consideras que existe un error, contacta al coordinador del
              CLE.
            </span>
          </div>
        ) : (
          cursosFiltrados.map((curso) =>
            vista === "grid" ? (
              <CardGrid key={curso.id} curso={curso} />
            ) : (
              <CardList key={curso.id} curso={curso} />
            )
          )
        )}
      </div>
    </div>
  );
}

export default CursoArchivado;
