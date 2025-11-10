import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Dropdown } from "antd";

function Tabbar() {
  const location = useLocation();

  const items = [
    {
      label: <Link to="/Docentes/CursosActivos">Activos</Link>,
      key: "0",
    },
    {
      label: <Link to="/Docentes/CursosArchivados">Archivados</Link>,
      key: "1",
    },
  ];

  const isActive = (path) => location.pathname === path;
  const isCursosActive = isActive("/Docentes/CursosActivos") || isActive("/Docentes/CursosArchivados");

  return (
    <>
      {/* Espaciador para evitar que el contenido quede bajo el tabbar */}
      <div className="h-20 md:hidden" />

      {/* Tabbar con fondo sólido */}
      <nav className="fixed bottom-0 left-0 right-0 md:hidden z-50 bg-[#1B396A]">
        {/* Borde superior sutil */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/10" />

        {/* Contenido del tabbar */}
        <div className="relative flex justify-around items-center px-2 py-3 safe-area-bottom">
          
          {/* Tab Cursos con Dropdown */}
          <Dropdown
            menu={{ items }}
            trigger={["click"]}
            placement="topCenter"
          >
            <button
              className={`
                relative flex flex-col items-center justify-center gap-1.5
                min-w-[70px] py-2.5 px-3 rounded-2xl
                transition-all duration-300 ease-out
                ${isCursosActive 
                  ? 'bg-white/15 scale-105 shadow-lg shadow-black/20' 
                  : 'scale-100 active:scale-95'
                }
              `}
              onClick={(e) => e.preventDefault()}
            >
              {/* Ícono con flecha */}
              <div className="relative flex items-center gap-1">
                <div className="relative flex items-center justify-center w-6 h-6">
                  <img
                    alt="Cursos"
                    src="/Opt/SVG/classroom.svg"
                    className={`
                      w-full h-full transition-all duration-300
                      ${isCursosActive 
                        ? 'brightness-110 scale-110' 
                        : 'brightness-90 opacity-80'
                      }
                    `}
                  />
                  
                  {/* Punto indicador activo */}
                  {isCursosActive && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full shadow-lg shadow-green-400/50 animate-pulse" />
                  )}
                </div>

                {/* Flecha */}
                <img
                  className={`
                    w-3 h-3 rotate-180 transition-all duration-300
                    ${isCursosActive 
                      ? 'brightness-110 opacity-100' 
                      : 'brightness-90 opacity-70'
                    }
                  `}
                  alt="dropdown"
                  src="/Opt/SVG/arrow-down.svg"
                />
              </div>

              {/* Texto */}
              <span className={`
                text-[10px] font-medium tracking-wide
                transition-all duration-300
                ${isCursosActive 
                  ? 'text-white font-semibold' 
                  : 'text-white/70'
                }
              `}>
                Cursos
              </span>

              {/* Barra inferior del tab activo */}
              {isCursosActive && (
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-12 h-1 bg-white rounded-full animate-slideUp" />
              )}
            </button>
          </Dropdown>

          {/* Tab Perfil */}
          <Link
            to="/Docentes/Perfil"
            className={`
              relative flex flex-col items-center justify-center gap-1.5
              min-w-[70px] py-2.5 px-3 rounded-2xl
              transition-all duration-300 ease-out
              ${isActive("/Docentes/Perfil")
                ? 'bg-white/15 scale-105 shadow-lg shadow-black/20' 
                : 'scale-100 active:scale-95'
              }
            `}
          >
            {/* Ícono */}
            <div className="relative flex items-center justify-center w-6 h-6">
              <img
                alt="Perfil"
                src="/Opt/SVG/profile-.svg"
                className={`
                  w-full h-full transition-all duration-300
                  ${isActive("/Docentes/Perfil")
                    ? 'brightness-110 scale-110' 
                    : 'brightness-90 opacity-80'
                  }
                `}
              />
              
              {/* Punto indicador activo */}
              {isActive("/Docentes/Perfil") && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full shadow-lg shadow-green-400/50 animate-pulse" />
              )}
            </div>

            {/* Texto */}
            <span className={`
              text-[10px] font-medium tracking-wide
              transition-all duration-300
              ${isActive("/Docentes/Perfil")
                ? 'text-white font-semibold' 
                : 'text-white/70'
              }
            `}>
              Perfil
            </span>

            {/* Barra inferior del tab activo */}
            {isActive("/Docentes/Perfil") && (
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-12 h-1 bg-white rounded-full animate-slideUp" />
            )}
          </Link>

          {/* Tab Notificaciones */}
          <Link
            to="/Docentes/Notificaciones"
            className={`
              relative flex flex-col items-center justify-center gap-1.5
              min-w-[70px] py-2.5 px-3 rounded-2xl
              transition-all duration-300 ease-out
              ${isActive("/Docentes/Notificaciones")
                ? 'bg-white/15 scale-105 shadow-lg shadow-black/20' 
                : 'scale-100 active:scale-95'
              }
            `}
          >
            {/* Ícono */}
            <div className="relative flex items-center justify-center w-6 h-6">
              <img
                alt="Notificaciones"
                src="/Opt/SVG/notification.svg"
                className={`
                  w-full h-full transition-all duration-300
                  ${isActive("/Docentes/Notificaciones")
                    ? 'brightness-110 scale-110' 
                    : 'brightness-90 opacity-80'
                  }
                `}
              />
              
              {/* Punto indicador activo */}
              {isActive("/Docentes/Notificaciones") && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full shadow-lg shadow-green-400/50 animate-pulse" />
              )}
            </div>

            {/* Texto */}
            <span className={`
              text-[10px] font-medium tracking-wide
              transition-all duration-300
              ${isActive("/Docentes/Notificaciones")
                ? 'text-white font-semibold' 
                : 'text-white/70'
              }
            `}>
              Alertas
            </span>

            {/* Barra inferior del tab activo */}
            {isActive("/Docentes/Notificaciones") && (
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-12 h-1 bg-white rounded-full animate-slideUp" />
            )}
          </Link>
        </div>
      </nav>

      {/* Estilos personalizados */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }

        /* Safe area para dispositivos con notch */
        .safe-area-bottom {
          padding-bottom: max(0.75rem, env(safe-area-inset-bottom));
        }

        /* Evitar selección de texto en taps */
        nav {
          -webkit-tap-highlight-color: transparent;
          user-select: none;
        }
      `}</style>
    </>
  );
}

export default Tabbar;