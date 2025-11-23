import React, { useState, useEffect } from "react";
import {
  Breadcrumb,
  Button,
  Spin,
  Input,
  Switch,
  Divider,
  message,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  AppstoreOutlined,
  BarsOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import client from "../../axios";

/* --- Cards homologadas con Progreso.jsx --- */

// Card para CUADRÍCULA
const CardGrid = ({ curso }) => (
  <div className="border rounded-xl bg-white w-full md:w-full p-5 flex flex-col items-center shadow-sm hover:shadow-md transition">
    <img alt="libro" src="/Opt/SVG/book.svg" className="w-20 opacity-90" />
    <Divider />
    <p className="font-semibold text-gray-800">{curso.nombre}</p>

    {curso.descripción && (
      <p className="text-sm text-gray-600 text-center mt-1">
        {curso.descripción}
      </p>
    )}

    <Link to={`/Estudiantes/Cursos/${curso.id}`}>
      <Button type="primary" className="bg-[#1B396A] mt-4 hover:bg-[#244b8a]">
        Información
      </Button>
    </Link>
  </div>
);

// Card para LISTA
const CardList = ({ curso }) => (
  <div className="w-full bg-white border rounded-xl shadow-sm hover:shadow-md transition p-4 flex items-center justify-between">
    <div className="flex gap-4 items-center">
      <img alt="libro" src="/Opt/SVG/book.svg" className="w-14 opacity-80" />
      <div>
        <p className="font-semibold text-gray-800 text-lg">{curso.nombre}</p>
        {curso.descripción && (
          <p className="text-sm text-gray-600">{curso.descripción}</p>
        )}
      </div>
    </div>

    <Link to={`/Estudiantes/Cursos/${curso.id}`}>
      <Button type="primary" className="bg-[#1B396A] hover:bg-[#244b8a]">
        Ver más
      </Button>
    </Link>
  </div>
);

function Cursos() {
  const navigate = useNavigate();
  const [hasModules, setHasModules] = useState(false);
  const [cursos, setCursos] = useState([]);
  const [filteredCursos, setFilteredCursos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isGridView, setIsGridView] = useState(true);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        // Usar axios con autenticación por cookies (sin token)
        const response = await client.get("/api/cursos_activos");
        const data = response.data;

        if (data.cursos?.length > 0) {
          setHasModules(true);
          setCursos(data.cursos);
          setFilteredCursos(data.cursos);
        } else {
          setHasModules(false);
        }
      } catch (err) {
        console.error("Error en la solicitud:", err);

        // Manejar error 401 (no autenticado)
        if (err.response?.status === 401) {
          message.error("Sesión expirada. Inicie sesión nuevamente.");
          localStorage.clear();
          navigate("/login");
        } else {
          setError("Error al obtener los datos.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCursos();
  }, [navigate]);

  useEffect(() => {
    const filtered = cursos.filter((curso) =>
      curso.nombre.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredCursos(filtered);
  }, [searchValue, cursos]);

  return (
    <div className="min-h-[50vh] mb-52">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { title: <p className="font-medium text-black">Estudiantes</p> },
          { title: <span className="text-[#1B396A]">Cursos</span> },
        ]}
      />

      <h2 className="font-semibold text-3xl text-center mt-6 text-[#1B396A]">
        Cursos disponibles
      </h2>

      <p className="text-gray-600 text-center">
        Consulta los cursos habilitados actualmente.
      </p>

      {/* Controles superiores */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6">
        {/* Buscador */}
        <Input
          prefix={<SearchOutlined />}
          placeholder="Buscar curso..."
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
      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <Spin size="large" />
        </div>
      ) : error ? (
        <p className="text-center text-red-600 font-medium">{error}</p>
      ) : (
        <div className="mt-8 pb-20">
          {/* Vista cuadrícula */}
          {isGridView ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {hasModules ? (
                filteredCursos.length > 0 ? (
                  filteredCursos.map((curso) => (
                    <CardGrid curso={curso} key={curso.id} />
                  ))
                ) : (
                  <p className="text-center col-span-full text-gray-500">
                    No se encontraron cursos.
                  </p>
                )
              ) : (
                <div className="border rounded-xl bg-white p-6 flex flex-col items-center shadow-sm">
                  <img
                    alt="sin cursos"
                    src="/Opt/SVG/sad.svg"
                    className="w-20 opacity-80"
                  />
                  <p className="font-medium mt-3">Sin módulos disponibles</p>
                </div>
              )}
            </div>
          ) : (
            /* Vista lista */
            <div className="flex flex-col gap-4">
              {hasModules ? (
                filteredCursos.length > 0 ? (
                  filteredCursos.map((curso) => (
                    <CardList curso={curso} key={curso.id} />
                  ))
                ) : (
                  <p className="text-center text-gray-500">
                    No se encontraron cursos.
                  </p>
                )
              ) : (
                <div className="border rounded-xl bg-white p-6 flex flex-col items-center shadow-sm">
                  <img
                    alt="sin cursos"
                    src="/Opt/SVG/sad.svg"
                    className="w-20 opacity-80"
                  />
                  <p className="font-medium mt-3">Sin módulos disponibles</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Cursos;
