import { Breadcrumb, Button } from "antd";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function CursoActivo() {
  const [cursos, setCursos] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [docente, setDocente] = useState(null);
  const [token, setToken] = useState("");
  const [hasModules, setHasModules] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const usuarioData = localStorage.getItem("usuario");
    const docenteData = localStorage.getItem("docente");
    const tokenData = localStorage.getItem("token");

    if (usuarioData) {
      setUsuario(JSON.parse(usuarioData));
    }
    if (docenteData) {
      setDocente(JSON.parse(docenteData));
    }
    if (tokenData) {
      setToken(tokenData);
    }
  }, []);

  useEffect(() => {
    if (docente && token && isLoading) {
      const fetchCursos = async () => {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/cursosAsignados/${docente.id}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error("Error en la red");
          }

          const data = await response.json();
          setCursos(Object.values(data.cursos)); // Convertir a array
          setHasModules(data.cursos && Object.keys(data.cursos).length > 0); // Verificar si hay cursos
          setIsLoading(false);
        } catch (error) {
          console.error("Error al obtener los cursos:", error);
          setIsLoading(false);
        }
      };

      fetchCursos();
    }
  }, [docente, token, isLoading]);

  return (
    <div className="px-4">
      <Breadcrumb
        items={[
          {
            title: <p className="font-medium text-black">Docente</p>,
          },
          {
            title: <a href="">Cursos asignados</a>,
          },
        ]}
      />
      <h2 className="Montserrat font-semibold text-2xl text-center">
        Mis cursos asignados:
      </h2>

      {usuario && (
        <p className="text-center mt-2">
          Bienvenido, {usuario.nombre} {usuario.apellidos}!
        </p>
      )}

      <div
        id="Contenedor de CARDS"
        className="flex gap-3 justify-center mt-5 flex-wrap"
      >
        {hasModules ? (
          cursos.map((curso) => (
            <div
              key={curso.id}
              id="Card"
              className="border rounded bg-slate-100 w-3/5 flex flex-col px-8 py-4 items-center text-center md:w-1/5 md:gap-5"
            >
              <img alt="libro" src="/Opt//SVG/book.svg" className="w-24" />
              <p className="Montserrat font-normal">{curso.nombre}</p>
              <p className="Montserrat font-light">{curso.descripcion}</p>{" "}
              {/* Descripción del curso */}
              <p className="Montserrat font-light">
                Modalidad: {curso.modalidad}
              </p>{" "}
              {/* Modalidad */}
              <p className="Montserrat font-light">
                Inicio: {curso.fecha_inicio}
              </p>{" "}
              {/* Fecha de inicio */}
              <p className="Montserrat font-light">
                Fin: {curso.fecha_fin}
              </p>{" "}
              {/* Fecha de fin */}
              <Button type="primary" className="bg-green-500 my-4">
                <Link to={`/Docentes/Cursos/${curso.id}`}>Detalles</Link>
              </Button>
            </div>
          ))
        ) : (
          <div
            id="Card"
            className="border rounded bg-slate-100 w-3/5 flex flex-col px-8 py-4 items-center text-center"
          >
            <img alt="libro" src="/Opt//SVG/sad.svg" className="w-24" />
            <p className="Montserrat font-normal">Sin cursos disponibles</p>
            <span>
              Si crees que hay un error notifica al coordinador del CLE
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default CursoActivo;
