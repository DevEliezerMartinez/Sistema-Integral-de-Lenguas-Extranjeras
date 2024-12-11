import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Estudiantes/Header";
import Tabbar from "../../components/Estudiantes/Tabbar";
import { Outlet } from "react-router-dom";
import { Breadcrumb } from "antd";
import PrincipalFooter from "../../components/landing/PrincipalFooter";

function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
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

export default Dashboard;
