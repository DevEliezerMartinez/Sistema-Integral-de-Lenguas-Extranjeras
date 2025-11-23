import React from "react";
import Header from "../../components/Docentes/Header";
import Tabbar from "../../components/Docentes/Tabbar";
import { Outlet } from "react-router-dom";
import PrincipalFooter from "../../components/landing/PrincipalFooter";

function Dashboard_docentes() {
  return (
    <>
      <style>{`
        .custom-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: #cfd7df;
          border-radius: 20px;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background: #9aa5b1;
        }
        @media (max-width: 768px) {
          .custom-scroll::-webkit-scrollbar {
            display: none;
          }
        }
      `}</style>

      <div className="min-h-screen flex flex-col bg-white">
        <Header />

        {/* Contenedor principal adaptable */}
        <main
          className="
            flex-1
            overflow-y-auto
            px-4
            mt-4
            mb-28
            custom-scroll
            flex
            flex-col
          "
        >
          <div className="flex-1 flex flex-col">
            <Outlet />
          </div>
        </main>

        <div className="md:hidden">
          <Tabbar />
        </div>

        <PrincipalFooter />
      </div>
    </>
  );
}

export default Dashboard_docentes;
