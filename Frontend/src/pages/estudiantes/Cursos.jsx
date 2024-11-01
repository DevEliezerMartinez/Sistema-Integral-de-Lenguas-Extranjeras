import React, { useState, useEffect } from "react";
import { Breadcrumb, Button, Spin } from "antd";
import { Link } from "react-router-dom";

function Cursos() {
  const [hasModules, setHasModules] = useState(false);
  const [cursos, setCursos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCursos = async () => {
      const token = localStorage.getItem("token");
      console.log("Token:", token); // Verifica el token

      if (!token) {
        setError("No autorizado, inicia sesión nuevamente.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/cursos_activos`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Respuesta de la API:", response); // Verifica la respuesta

        const data = await response.json(); // Convierte la respuesta a JSON

        if (data.cursos && data.cursos.length > 0) {
          setHasModules(true);
          setCursos(data.cursos);
        } else {
          setHasModules(false);
        }
      } catch (err) {
        console.error("Error en la solicitud:", err); // Muestra el error
        setError(err.message || "Error desconocido");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCursos();
  }, []);

  return (
    <div className=" h-[50vh] mb-52">
      <Breadcrumb
        items={[
          {
            title: <p className="font-medium text-black">Estudiantes</p>,
          },
          {
            title: <a href="">Cursos</a>,
          },
        ]}
      />

      <h2 className="Montserrat font-semibold text-2xl text-center">
        Cursos disponibles
      </h2>

      {isLoading ? (
        <Spin tip="Loading" size="large" className="" />
      ) : (
        <div>
          <div
            id="Contenedor de CARDS"
            className="flex gap-3 justify-center m-5 flex-wrap mb-42 pb-20"
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
                  <p className="Montserrat font-light">{curso.descripción}</p>
                  <Button type="primary" className="bg-green-500">
                    <Link to={`/Estudiantes/Cursos/${curso.id}`}>Detalles</Link>
                  </Button>
                </div>
              ))
            ) : (
              <div
                id="Card"
                className="border rounded bg-slate-100 w-3/5 flex flex-col px-8 py-4 items-center text-center"
              >
                <img alt="libro" src="/Opt//SVG/sad.svg" className="w-24" />
                <p className="Montserrat font-normal">
                  Sin módulos disponibles
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Cursos;
