import { Button, message, Dropdown } from "antd";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const items = [
  {
    label: <Link to="/Coordinador/CursosActivos">Activos</Link>,
    key: "0",
  },
  {
    label: <Link to="/Coordinador/CursosArchivados">Archivados</Link>,
    key: "1",
  },
];

function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const key = "updatable";
  const navigate = useNavigate();

  const toggleMenu = () => {
    console.log("cerrar sesion");
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
    <header className="flex bg-[#1B396A] m-auto md:m-0 justify-between items-center px-4 ">
      {contextHolder}

      <div className="flex items-center  text-white  md:items-center justify-center  md:mb-0 py-4 gap-3  ">
        <Link to="/">
          <img
            alt="Logo CLE"
            src="/CLE/Opt/TecNMBig.png"
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
        <div className="flex flex-col items-center">
          <img
            className="w-6"
            alt="Logo Progreso"
            src="/CLE/Opt/SVG/classroom.svg"
          />
          <Dropdown
            menu={{
              items,
            }}
            trigger={["click"]}
          >
            <a className="flex" onClick={(e) => e.preventDefault()}>
              <span className="text-sm font-thin">Cursos </span>
              <img
                className=""
                alt="Logo profile"
                src="/CLE/Opt/SVG/arrow-down.svg"
              />
            </a>
          </Dropdown>
        </div>

        <Link
          to="/Coordinador/Solicitudes"
          className="flex flex-col items-center"
        >
          <img
            className="w-6"
            alt="Logo notification"
            src="/CLE/Opt/SVG/request.svg"
          />
          <span className="text-sm font-thin">Solicitudes</span>
        </Link>

        <Link to="/Coordinador/Perfil" className="flex flex-col items-center">
          <img className="w-6" alt="Logo profile" src="/CLE/Opt/SVG/profile-.svg" />
          <span className="text-sm font-thin">Perfil</span>
        </Link>
        <Link
          to="/Coordinador/Notificaciones"
          className="flex flex-col items-center"
        >
          <img
            className="w-6"
            alt="Logo notification"
            src="/CLE/Opt/SVG/notification.svg"
          />
          <span className="text-sm font-thin">Notificaciones</span>
        </Link>
        
        <Link to="/Coordinador/Alumnos" className="flex flex-col items-center">
          <img
            className="w-6"
            alt="Logo notification"
            src="/CLE/Opt/SVG/student.svg"
          />
          <span className="text-sm font-thin">Alumnos</span>
        </Link>
        <Button className="" danger ghost onClick={cerrarsesion}>
          Cerrar sesion
        </Button>
      </ul>

      {/* Menú de hamburguesa */}
      <div className="md:hidden ">
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
          <Button className="relative flex top-2 "   onClick={cerrarsesion} type="link" danger>
            Cerrar sesion
          </Button>
        )}
      </div>
    </header>
  );
}

export default Header;
