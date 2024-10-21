import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, message } from "antd";
function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const key = "updatable";

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };


  const cerrarsesion = () => {
    messageApi.open({
      key,
      type: "loading",
      content: "Cerrando sesión",
    });
  
    setTimeout(() => {
      messageApi.open({
        key,
        type: "success",
        content: "Hasta luego!",
        duration: 2,
      });
    }, 1000);
  
    setTimeout(() => {
      // Eliminar el token y el usuario del localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      
      navigate("/"); // Redirigir al inicio
    }, 2000); // 2000 milisegundos = 2 segundos
  };

  return (
    <header className="flex bg-[#1B396A] m-auto md:m-0 justify-between items-center px-4">
      {contextHolder}

      <div className="flex items-center  text-white  md:items-center justify-center  md:mb-0 py-4 gap-3  ">
      <Link to="/">
          <img
            alt="Logo CLE"
            src="/Opt/TecNMBig.png"
            className="w-12 mb-4 md:mb-0"
          />
        </Link>
        <div className="text-center md:text-left flex flex-col items-center ">
          <p className="font-bold text-sm xl:text-base  Poppins md:hidden lg:block">
            TecNM | Campus San Marcos
          </p>
          <span className="font-extralight text-sm xl:text-base md:hidden lg:block">
            Centro de Lenguas Extranjeras
          </span>
        </div>
      </div>

      <ul className="hidden md:flex Montserrat text-white flex-row gap-4">
        <Link to="/Estudiantes/Progreso" className="flex flex-col items-center">
          <img
            className="w-6"
            alt="Logo Progreso"
            src="/Opt/SVG/Progress.svg"
          />
          <span className="text-sm font-thin">Mi Progreso</span>
        </Link>
        <Link to="/Estudiantes/Cursos" className="flex flex-col items-center">
          <img
            className="w-6"
            alt="Logo notification"
            src="/Opt/SVG/Curso.svg"
          />
          <span className="text-sm font-thin">Cursos disp.</span>
        </Link>
        <Link to="/Estudiantes/Perfil" className="flex flex-col items-center">
          <img className="w-6" alt="Logo profile" src="/Opt/SVG/profile-.svg" />
          <span className="text-sm font-thin">Perfil</span>
        </Link>
        <Link
          to="/Estudiantes/Notificaciones"
          className="flex flex-col items-center"
        >
          <img
            className="w-6"
            alt="Logo notification"
            src="/Opt/SVG/notification.svg"
          />
          <span className="text-sm font-thin">Notificaciones</span>
        </Link>

        <Button danger ghost onClick={cerrarsesion}>
          Cerrar sesion
        </Button>
      </ul>

      {/* Menú de hamburguesa */}
      <div className="md:hidden">
        <button className="text-white" onClick={toggleMenu}>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>
        {showMenu && (
          <Button
            className="absolute left-72 top-12"
            danger
            ghost
            onClick={cerrarsesion}
          >
            Cerrar sesion
          </Button>
        )}
      </div>
    </header>
  );
}

export default Header;
