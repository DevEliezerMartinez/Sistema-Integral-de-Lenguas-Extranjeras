import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/coordinador/Header";
import Tabbar from "../../components/coordinador/Tabbar";
import { Outlet } from "react-router-dom";
import PrincipalFooter from "../../components/landing/PrincipalFooter";

function Dashboard_docentes() {
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    const token = localStorage.getItem("token");

    // Verifica si el token existe y no está vacío
    if (!token) {
      navigate("/login");
      return;
    }
    

    if (storedUser) {
      const user = JSON.parse(storedUser);

      if (user.tipo_usuario !== "coordinador") {
        localStorage.clear();
        navigate("/no-autorizado");
      }
    } else {
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