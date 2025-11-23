import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Dropdown } from "antd";

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

function Tabbar() {
  const location = useLocation();

  const tabs = [
    {
      path: ["/Coordinador/CursosActivos", "/Coordinador/CursosArchivados"],
      icon: "/Opt/SVG/classroom.svg",
      label: "Cursos",
      isDropdown: true,
    },
    {
      path: "/Coordinador/Perfil",
      icon: "/Opt/SVG/profile-.svg",
      label: "Perfil",
    },
    {
      path: "/Coordinador/Notificaciones",
      icon: "/Opt/SVG/notification.svg",
      label: "Notif.",
    },
    {
      path: "/Coordinador/Solicitudes",
      icon: "/Opt/SVG/request.svg",
      label: "Solicitudes",
    },
    {
      path: "/Coordinador/Alumnos",
      icon: "/Opt/SVG/student.svg",
      label: "Alumnos",
    },
  ];

  const isActive = (path) => {
    if (Array.isArray(path)) {
      return path.includes(location.pathname);
    }
    return location.pathname === path;
  };

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
          {tabs.map((tab, index) => {
            const active = isActive(tab.path);

            if (tab.isDropdown) {
              return (
                <Dropdown key={index} menu={{ items }} trigger={["click"]}>
                  <div
                    className={`
                      relative flex flex-col items-center justify-center gap-1.5
                      min-w-[70px] py-2.5 px-3 rounded-2xl cursor-pointer
                      transition-all duration-300 ease-out
                      ${
                        active
                          ? "bg-white/15 scale-105 shadow-lg shadow-black/20"
                          : "scale-100 active:scale-95"
                      }
                    `}
                    onClick={(e) => e.preventDefault()}
                  >
                    {/* Ícono */}
                    <div className="relative flex items-center justify-center w-6 h-6">
                      <img
                        alt={tab.label}
                        src={tab.icon}
                        className={`
                          w-full h-full transition-all duration-300
                          ${
                            active
                              ? "brightness-110 scale-110"
                              : "brightness-90 opacity-80"
                          }
                        `}
                      />

                      {/* Punto indicador activo */}
                      {active && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full shadow-lg shadow-green-400/50 animate-pulse" />
                      )}
                    </div>

                    {/* Texto del tab con flecha */}
                    <div className="flex items-center gap-1">
                      <span
                        className={`
                        text-[10px] font-medium tracking-wide
                        transition-all duration-300
                        ${active ? "text-white font-semibold" : "text-white/70"}
                      `}
                      >
                        {tab.label}
                      </span>
                      <img
                        className="rotate-180 w-3 h-3 opacity-70"
                        alt="dropdown"
                        src="/Opt/SVG/arrow-down.svg"
                      />
                    </div>

                    {/* Barra inferior del tab activo */}
                    {active && (
                      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-12 h-1 bg-white rounded-full animate-slideUp" />
                    )}
                  </div>
                </Dropdown>
              );
            }

            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={`
                  relative flex flex-col items-center justify-center gap-1.5
                  min-w-[70px] py-2.5 px-3 rounded-2xl
                  transition-all duration-300 ease-out
                  ${
                    active
                      ? "bg-white/15 scale-105 shadow-lg shadow-black/20"
                      : "scale-100 active:scale-95"
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
                      ${
                        active
                          ? "brightness-110 scale-110"
                          : "brightness-90 opacity-80"
                      }
                    `}
                  />

                  {/* Punto indicador activo */}
                  {active && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full shadow-lg shadow-green-400/50 animate-pulse" />
                  )}
                </div>

                {/* Texto del tab */}
                <span
                  className={`
                  text-[10px] font-medium tracking-wide
                  transition-all duration-300
                  ${active ? "text-white font-semibold" : "text-white/70"}
                `}
                >
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
      <style>{`
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

  .safe-area-bottom {
    padding-bottom: max(0.75rem, env(safe-area-inset-bottom));
  }

  nav {
    -webkit-tap-highlight-color: transparent;
    user-select: none;
  }
`}</style>
    </>
  );
}

export default Tabbar;
