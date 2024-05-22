// Dashboard.jsx
import React from "react";
import Header from "../../components/Estudiantes/Header";
import Tabbar from "../../components/Estudiantes/Tabbar";
import { Outlet } from "react-router-dom";

function Dashboard() {
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

export default Dashboard;
