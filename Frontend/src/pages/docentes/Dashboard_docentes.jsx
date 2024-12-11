import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Docentes/Header";
import Tabbar from "../../components/Docentes/Tabbar";
import { Outlet } from "react-router-dom";
import PrincipalFooter from "../../components/landing/PrincipalFooter";

function Dashboard_docentes() {
  const navigate = useNavigate();

  useEffect(() => {
    // Obtén el objeto usuario desde el localStorage
    const storedUser = localStorage.getItem("usuario");
    const token = localStorage.getItem("token");

    // Verifica si el token existe y no está vacío
    if (!token) {
      navigate("/login");
      return;
    }

    if (storedUser) {
      const user = JSON.parse(storedUser);

      // Verifica si el tipo de usuario es "docente"
      if (user.tipo_usuario !== "docente") {
        // Limpia el localStorage y redirige a la página de no autorizado
        localStorage.clear();
        navigate("/no-autorizado");
      }
    } else {
      // Si no hay usuario en localStorage, redirige a la página de no autorizado
      navigate("/no-autorizado");
    }
  }, [navigate]);

  return (
    <div>
      <Header />
      <div className="m-2 mb-48">
        <Outlet />
      </div>
      <Tabbar />
      <PrincipalFooter />
    </div>
  );
}

export default Dashboard_docentes;
