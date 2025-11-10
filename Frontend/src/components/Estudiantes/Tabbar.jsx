import React from "react";
import { Link, useLocation } from "react-router-dom";

function Tabbar() {
  const location = useLocation();

  const tabs = [
    {
      path: "/Estudiantes/Perfil",
      icon: "/Opt/SVG/profile-.svg",
      label: "Perfil",
    },
    {
      path: "/Estudiantes/Progreso",
      icon: "/Opt/SVG/Progress.svg",
      label: "Progreso",
    },
    {
      path: "/Estudiantes/Cursos",
      icon: "/Opt/SVG/Curso.svg",
      label: "Cursos",
    },
    {
      path: "/Estudiantes/Notificaciones",
      icon: "/Opt/SVG/notification2.svg",
      label: "Alertas",
    },
  ];

  const isActive = (path) => location.pathname === path;

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
          {tabs.map((tab) => {
            const active = isActive(tab.path);
            
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={`
                  relative flex flex-col items-center justify-center gap-1.5
                  min-w-[70px] py-2.5 px-3 rounded-2xl
                  transition-all duration-300 ease-out
                  ${active 
                    ? 'bg-white/15 scale-105 shadow-lg shadow-black/20' 
                    : 'scale-100 active:scale-95'
                  }
                `}
              >
                {/* Ícono */}
                <div className="relative flex items-center justify-center w-6 h-6">
                  <img
                    alt={tab.label}
                    src={tab.icon}
                    className={`
                      w-full h-full transition-all duration-300
                      ${active 
                        ? 'brightness-110 scale-110' 
                        : 'brightness-90 opacity-80'
                      }
                    `}
                  />
                  
                  {/* Punto indicador activo */}
                  {active && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full shadow-lg shadow-green-400/50 animate-pulse" />
                  )}
                </div>

                {/* Texto del tab */}
                <span className={`
                  text-[10px] font-medium tracking-wide
                  transition-all duration-300
                  ${active 
                    ? 'text-white font-semibold' 
                    : 'text-white/70'
                  }
                `}>
                  {tab.label}
                </span>

                {/* Barra inferior del tab activo */}
                {active && (
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-12 h-1 bg-white rounded-full animate-slideUp" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Estilos personalizados */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

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

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
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