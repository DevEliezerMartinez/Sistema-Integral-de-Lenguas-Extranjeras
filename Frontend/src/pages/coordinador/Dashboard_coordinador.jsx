import React from "react";
import Header from "../../components/coordinador/Header";
import Tabbar from "../../components/Docentes/Tabbar";
import { Outlet } from "react-router-dom";
import PrincipalFooter from "../../components/landing/PrincipalFooter";

function Dashboard_docentes() {
  return (
    <div>
      <Header />

      <div className=" m-2 mb-48">
      
        <Outlet />
      </div>
      <Tabbar />
      <PrincipalFooter/>

    </div>
  );
}

export default Dashboard_docentes;
