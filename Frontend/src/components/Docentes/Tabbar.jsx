import React from "react";
import { Link } from "react-router-dom";
import { Dropdown } from "antd";

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

function Tabbar() {
  return (
    <div className="bg-[#1B396A] flex justify-between fixed bottom-0 w-full p-5 rounded gap-3 md:hidden items-center ">
      <div
        to="/Docentes/CursosActivos"
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
              <img alt="icon" className="w-5" src="/CLE/Opt/SVG/classroom.svg" />
              <span className="text-sm font-thin">Cursos </span>
            </div>
            <img
              className="rotate-180"
              alt="Logo profile"
              src="/CLE/Opt/SVG/arrow-down.svg"
            />
          </a>
        </Dropdown>
      </div>

  

      <Link
        to="/Docentes/Perfil"
        className="Montserrat font-thin text-white flex flex-col items-center text-center  text-sm "
      >
        <img alt="icon" className="w-5" src="/CLE/Opt/SVG/profile-.svg" />
        Perfil
      </Link>

      <Link
        to="/Docentes/Notificaciones"
        className="Montserrat font-thin text-white flex flex-col items-center text-center  text-sm"
      >
        <img alt="icon" className="w-5" src="/CLE/Opt/SVG/notification.svg" />
        Notif.
      </Link>

      
    </div>
  );
}

export default Tabbar;
