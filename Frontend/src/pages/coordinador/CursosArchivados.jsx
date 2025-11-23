import { Breadcrumb, Button, Spin, Input, Switch, Divider } from "antd";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  AppstoreOutlined,
  BarsOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import client from "../../axios.js";

// Card para CUADRÍCULA
const CardGrid = ({ curso, formatDate }) => (
  <div className="border rounded-xl bg-white w-full md:w-full p-5 flex flex-col items-center shadow-sm hover:shadow-md transition">
    <img alt="libro" src="/Opt/SVG/book.svg" className="w-20 opacity-90" />
    <Divider />
    <p className="font-semibold text-gray-800 text-lg text-center">
      {curso.nombre}
    </p>

    <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded mt-2">
      Curso archivado
    </span>

    <div className="text-sm text-gray-600 mt-3 w-full">
      <p className="mb-1">
        <span className="font-medium">Docente:</span>{" "}
        {curso.docente ? curso.docente.nombre : "Desconocido"}
      </p>
      <p>
        <span className="font-medium">Periodo:</span>{" "}
        {curso.periodo ? (
          <>
            <span className="block">
              {formatDate(curso.periodo.fecha_inicio)}
            </span>
            <span className="block">{formatDate(curso.periodo.fecha_fin)}</span>
          </>
        ) : (
          "Desconocido"
        )}
      </p>
    </div>

    <Link to={`/Coordinador/Cursos/${curso.id}`}>
      <Button type="primary" className="bg-[#1B396A] mt-4 hover:bg-[#244b8a]">
        Detalles
      </Button>
    </Link>
  </div>
);

// Card para LISTA
const CardList = ({ curso, formatDate }) => (
  <div className="w-full bg-white border rounded-xl shadow-sm hover:shadow-md transition p-4 flex items-center justify-between">
    <div className="flex gap-4 items-center">
      <img alt="libro" src="/Opt/SVG/book.svg" className="w-14 opacity-80" />
      <div>
        <div className="flex items-center gap-2 mb-1">
          <p className="font-semibold text-gray-800 text-lg">{curso.nombre}</p>
          <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
            Archivado
          </span>
        </div>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Docente:</span>{" "}
          {curso.docente ? curso.docente.nombre : "Desconocido"}
        </p>
        {curso.periodo && (
          <p className="text-sm text-gray-600">
            <span className="font-medium">Periodo:</span>{" "}
            {formatDate(curso.periodo.fecha_inicio)} -{" "}
            {formatDate(curso.periodo.fecha_fin)}
          </p>
        )}
      </div>
    </div>

    <Link to={`/Coordinador/Cursos/${curso.id}`}>
      <Button type="primary" className="bg-[#1B396A] hover:bg-[#244b8a]">
        Ver más
      </Button>
    </Link>
  </div>
);

function CursosArchivados() {
  const [cursos, setCursos] = useState([]);
  const [filteredCursos, setFilteredCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isGridView, setIsGridView] = useState(true);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const fetchCursosArchivados = async () => {
      try {
        const response = await client.get("/api/cursosArchivados");
        const data = response.data;

        if (data.cursos && data.cursos.length > 0) {
          setCursos(data.cursos);
          setFilteredCursos(data.cursos);
        } else {
          setCursos([]);
          setFilteredCursos([]);
        }
      } catch (error) {
        console.error("Error fetching cursos archivados:", error);
        setError(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCursosArchivados();
  }, []);

  useEffect(() => {
    const filtered = cursos.filter((curso) =>
      curso.nombre.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredCursos(filtered);
  }, [searchValue, cursos]);

  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", options);
  };

  return (
    <div className="min-h-[50vh] mb-52">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { title: <p className="font-medium text-black">Coordinador</p> },
          { title: <span className="text-[#1B396A]">Cursos archivados</span> },
        ]}
      />

      <h2 className="font-semibold text-3xl text-center mt-6 text-[#1B396A]">
        Cursos archivados
      </h2>

      <p className="text-gray-600 text-center">
        Consulta el historial de cursos finalizados.
      </p>

      {/* Controles superiores */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6">
        {/* Buscador */}
        <Input
          prefix={<SearchOutlined />}
          placeholder="Buscar curso archivado..."
          className="w-full md:w-80"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          allowClear
        />

        {/* Switch de vista */}
        <div className="flex items-center gap-3">
          <span>Lista</span>

          <Switch
            checked={isGridView}
            onChange={(checked) => setIsGridView(checked)}
            checkedChildren={<AppstoreOutlined />}
            unCheckedChildren={<BarsOutlined />}
            style={{
              backgroundColor: isGridView ? "#1B396A" : "#d9d9d9",
            }}
          />

          <span>Cuadrícula</span>
        </div>
      </div>

      {/* Contenidos */}
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <Spin tip="Cargando cursos archivados..." size="large" />
        </div>
      ) : error ? (
        <p className="text-center text-red-600 font-medium mt-8">{error}</p>
      ) : (
        <div className="mt-8 pb-20">
          {/* Vista cuadrícula */}
          {isGridView ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cursos.length > 0 ? (
                filteredCursos.length > 0 ? (
                  filteredCursos.map((curso) => (
                    <CardGrid
                      curso={curso}
                      key={curso.id}
                      formatDate={formatDate}
                    />
                  ))
                ) : (
                  <p className="text-center col-span-full text-gray-500">
                    No se encontraron cursos.
                  </p>
                )
              ) : (
                <div className="border rounded-xl bg-white p-6 flex flex-col items-center shadow-sm col-span-full">
                  <img src="/Opt/SVG/sad.svg" className="w-20 opacity-80" />
                  <p className="font-medium mt-3">Sin cursos archivados</p>
                  <span className="text-sm text-gray-600 mt-1">
                    Si crees que hay un error, notifícalo.
                  </span>
                </div>
              )}
            </div>
          ) : (
            /* Vista lista */
            <div className="flex flex-col gap-4">
              {cursos.length > 0 ? (
                filteredCursos.length > 0 ? (
                  filteredCursos.map((curso) => (
                    <CardList
                      curso={curso}
                      key={curso.id}
                      formatDate={formatDate}
                    />
                  ))
                ) : (
                  <p className="text-center text-gray-500">
                    No se encontraron cursos.
                  </p>
                )
              ) : (
                <div className="border rounded-xl bg-white p-6 flex flex-col items-center shadow-sm">
                  <img src="/Opt/SVG/sad.svg" className="w-20 opacity-80" />
                  <p className="font-medium mt-3">Sin cursos archivados</p>
                  <span className="text-sm text-gray-600 mt-1">
                    Si crees que hay un error, notifícalo.
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CursosArchivados;
