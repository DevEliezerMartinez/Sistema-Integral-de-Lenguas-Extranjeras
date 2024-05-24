import React from "react";
import Header from "../../components/Docentes/Header";
import Tabbar from "../../components/Docentes/Tabbar";
import { Outlet } from "react-router-dom";

function Dashboard_docentes() {
  return (
    <div>
      <Header />

      <div className=" m-2 mb-48">
        <Outlet />
      </div>
      <Tabbar />
    </div>
  );
}

export default Dashboard_docentes;
