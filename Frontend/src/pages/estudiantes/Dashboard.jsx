import React from "react";
import Header from "../../components/Estudiantes/Header";
import Tabbar from "../../components/Estudiantes/Tabbar";
import { Outlet } from "react-router-dom";
import PrincipalFooter from "../../components/Estudiantes/Footer";

function Dashboard() {
  return (
    <>
      {/* Estilos internos */}
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
            mb-28  /* espacio para Tabbar en móvil */
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

        {/* El footer se mantiene abajo sin importar la altura del contenido */}
        <PrincipalFooter />
      </div>
    </>
  );
}

export default Dashboard;
