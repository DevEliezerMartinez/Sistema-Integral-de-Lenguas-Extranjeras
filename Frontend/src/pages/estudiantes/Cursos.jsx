import React, { useState, useEffect } from "react";
import { Breadcrumb, Button, Spin } from "antd";
import { Link } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import axios from "axios";

function Cursos() {
  const [hasModules, setHasModules] = useState(false); // Initial state (adjust as needed)
  const [cursos, setCursos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { token } = useAuth();

  console.log("🚀 ~ Notificaciones ~ token->", token);

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/cursosDisponibles",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.cursos.length === 0) {
          setHasModules(false);
        } else {
          setHasModules(true);
          setCursos(response.data.cursos); // Guarda todos los cursos en el estado
          console.log(cursos)
        }
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCursos();
  }, [token]);

  const content = <div />;

  return (
    <div className="px-12 h-[18rem]">
      <Breadcrumb
        items={[
          {
            title: <p className="font-medium text-black">Estudiantes</p>,
          },
          {
            title: <a href="">Cursos </a>,
          },
        ]}
      />

      <h2 className="Montserrat font-semibold text-2xl text-center">
        Cursos disponibles
      </h2>

      {isLoading ? (
        <Spin tip="Loading" size="large" className="mt-56">
          {content}
        </Spin>
      ) : (
        <div>
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
                  <img alt="libro" src="/Opt/SVG/book.svg" className="w-24" />
                  <p className="Montserrat font-normal">{curso.nombre}</p>
                  <p className="Montserrat font-light">{curso.descripción}</p> {/* Agrega la descripción del curso */}
                  <Button type="primary" className="bg-green-500">
                    <Link to={`/Estudiantes/Cursos/${curso.id}`}>Detalles</Link>
                  </Button>
                </div>
              ))
            ) : (
              <div
                id="Card"
                className="border rounded bg-slate-100 w-3/5 flex flex-col px-8 py-4 items-center text-center "
              >
                <img alt="libro" src="/Opt/SVG/sad.svg" className="w-24" />
                <p className="Montserrat font-normal">Sin módulos disponibles</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Cursos;
