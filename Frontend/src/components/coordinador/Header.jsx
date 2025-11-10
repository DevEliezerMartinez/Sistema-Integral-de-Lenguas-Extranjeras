import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Dropdown, message } from "antd";
import { MoreOutlined } from "@ant-design/icons";

// ICONOS SVG
const CourseIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 
    5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" />
  </svg>
);

const RequestIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 
    16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
  </svg>
);

const ProfileIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 
    2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
);

const NotificationIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4
    c0-.83-.67-1.5-1.5-1.5S10.5 3.17 10.5 4v.68C7.64 5.36 6 7.92 6 11v5l-2 
    2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" />
  </svg>
);

const StudentIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 
    0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 
    1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 
    1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
  </svg>
);

const ArrowDownIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M7 10l5 5 5-5z" />
  </svg>
);

function Header() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const key = "updatable";

  const cerrarsesion = () => {
    messageApi.open({
      key,
      type: "loading",
      content: "Cerrando sesión...",
    });

    setTimeout(() => {
      messageApi.open({
        key,
        type: "success",
        content: "Hasta luego!",
        duration: 2,
      });
    }, 900);

    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      navigate("/");
    }, 2000);
  };

  const cursosMenu = {
    items: [
      {
        key: "activos",
        label: <Link to="/Coordinador/CursosActivos">Activos</Link>,
      },
      {
        key: "archivados",
        label: <Link to="/Coordinador/CursosArchivados">Archivados</Link>,
      },
    ],
  };

  const mobileMenu = {
    items: [
      {
        key: "logout",
        label: (
          <Button danger type="text" onClick={cerrarsesion} className="w-full text-left">
            Cerrar sesión
          </Button>
        ),
      },
    ],
  };

  return (
    <>
      {contextHolder}
      <style>{`
        .institutional-shadow {
          box-shadow: 0 1px 3px rgba(0,0,0,.1);
        }
        .nav-underline {
          position: relative;
        }
        .nav-underline::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -3px;
          width: 0;
          height: 2px;
          background: #1B396A;
          transition: width .3s ease;
        }
        .nav-underline:hover::after {
          width: 100%;
        }
        .icon-solid {
          width: 24px;
          height: 24px;
          color: #1B396A;
          transition: transform 0.2s ease;
        }
        .nav-underline:hover .icon-solid {
          transform: translateY(-2px);
        }
        .dropdown-trigger {
          display: flex;
          align-items: center;
          gap: 2px;
          cursor: pointer;
        }
        .arrow-icon {
          width: 16px;
          height: 16px;
          color: #1B396A;
          transition: transform 0.2s ease;
        }
        .dropdown-trigger:hover .arrow-icon {
          transform: rotate(180deg);
        }
      `}</style>

      <header className="fixed top-0 left-0 right-0 bg-white institutional-shadow z-50">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex justify-between items-center h-20">

            {/* LOGO */}
            <Link to="/" className="flex items-center gap-3">
              <img
                alt="Logo CLE"
                src="/Opt/TecNMBig.png"
                className="w-12 object-contain"
              />
              <div className="flex flex-col leading-tight">
                <p className="font-bold text-[#1B396A] text-sm xl:text-base">
                  TecNM | Campus San Marcos
                </p>
                <span className="font-light text-gray-600 text-xs xl:text-sm">
                  Centro de Lenguas Extranjeras
                </span>
              </div>
            </Link>

            {/* MENÚ DESKTOP */}
            <ul className="hidden md:flex items-center gap-10">
              {/* Dropdown de Cursos */}
              <Dropdown menu={cursosMenu} trigger={["click"]}>
                <div className="flex flex-col items-center nav-underline cursor-pointer">
                  <CourseIcon className="icon-solid" />
                  <div className="dropdown-trigger">
                    <span className="text-xs text-[#1B396A] font-medium mt-1">Cursos</span>
                    <ArrowDownIcon className="arrow-icon" />
                  </div>
                </div>
              </Dropdown>

              <Link to="/Coordinador/Solicitudes" className="flex flex-col items-center nav-underline">
                <RequestIcon className="icon-solid" />
                <span className="text-xs text-[#1B396A] font-medium mt-1">Solicitudes</span>
              </Link>

              <Link to="/Coordinador/Perfil" className="flex flex-col items-center nav-underline">
                <ProfileIcon className="icon-solid" />
                <span className="text-xs text-[#1B396A] font-medium mt-1">Perfil</span>
              </Link>

              <Link to="/Coordinador/Notificaciones" className="flex flex-col items-center nav-underline">
                <NotificationIcon className="icon-solid" />
                <span className="text-xs text-[#1B396A] font-medium mt-1">Notificaciones</span>
              </Link>

              <Link to="/Coordinador/Alumnos" className="flex flex-col items-center nav-underline">
                <StudentIcon className="icon-solid" />
                <span className="text-xs text-[#1B396A] font-medium mt-1">Alumnos</span>
              </Link>

              <Button danger ghost onClick={cerrarsesion}>
                Cerrar sesión
              </Button>
            </ul>

            {/* MENÚ MOBILE (3 puntos) */}
            <div className="flex md:hidden">
              <Dropdown menu={mobileMenu} placement="bottomRight" arrow>
                <Button
                  type="text"
                  icon={<MoreOutlined style={{ fontSize: 22, color: "#1B396A" }} />}
                />
              </Dropdown>
            </div>

          </div>
        </div>
      </header>

      <div className="h-20" />
    </>
  );
}

export default Header;