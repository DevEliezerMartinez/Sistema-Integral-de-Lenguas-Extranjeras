// Dashboard.jsx
import React from "react";
import Header from "../../components/Docentes/Header";
import Tabbar from "../../components/Docentes/Tabbar";
import { Outlet } from "react-router-dom";

function DashboardDocentes() {
  return (
    <div>
      <Header />
      <div className=" m-2">

      <Outlet /> 
      </div>
      <Tabbar />
    </div>
  );
}

export default DashboardDocentes;
