import React from "react";
import { Link } from "react-router-dom";
import { Dropdown } from "antd";

const items = [
  {
    label: <Link to="/Coordinador/CursosActivos">Cursos Activos</Link>,
    key: "0",
  },
  {
    label: <Link to="/Coordinador/CursosArchivados">Cursos Archivados</Link>,
    key: "1",
  },
];

function Tabbar() {
  return (
    <div className="bg-[#1B396A] flex justify-between fixed bottom-0 w-full p-5 rounded gap-3 md:hidden items-center ">
      <div
        to="/Coordinador/CursosActivos"
        className="Montserrat font-thin text-white "
      >
        <Dropdown
          menu={{
            items,
          }}
          trigger={["click"]}
        >
          <a
            className=" flex  items-center text-center"
            onClick={(e) => e.preventDefault()}
          >
            <div className=" flex flex-col justify-center items-center text-center ">
              <img alt="icon" className="w-5" src="/Opt/SVG/classroom.svg" />
              <span className="text-sm font-thin">Cursos </span>
            </div>
            <img
              className="rotate-180"
              alt="Logo profile"
              src="/Opt/SVG/arrow-down.svg"
            />
          </a>
        </Dropdown>
      </div>

      <Link
        to="/Coordinador/Solicitudes"
        className="Montserrat font-thin text-white flex flex-col items-center text-center text-sm"
      >
        <img alt="icon" className="w-5" src="/Opt/SVG/request.svg" />
        Solicit.
      </Link>

      <Link
        to="/Coordinador/Perfil"
        className="Montserrat font-thin text-white flex flex-col items-center text-center  text-sm "
      >
        <img alt="icon" className="w-5" src="/Opt/SVG/profile-.svg" />
        Perfil
      </Link>

      <Link
        to="/Coordinador/Notificaciones"
        className="Montserrat font-thin text-white flex flex-col items-center text-center  text-sm"
      >
        <img alt="icon" className="w-5" src="/Opt/SVG/notification.svg" />
        Notif.
      </Link>

      <Link
        to="/Coordinador/Notificaciones"
        className="Montserrat font-thin text-white flex flex-col items-center text-center  text-sm"
      >
        <img alt="icon" className="w-5" src="/Opt/SVG/student.svg" />
        Alumnos
      </Link>
    </div>
  );
}

export default Tabbar;
