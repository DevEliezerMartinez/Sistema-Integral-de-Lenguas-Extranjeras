import React from "react";
import { Avatar, Breadcrumb, List, Tag } from "antd";

const data = [
  {
    nombre: "Juan",
    apellidos: "Pérez",
    carrera: "Ingeniería Informática",
    ultimoNivel: "Nivel 1",
  },
  {
    nombre: "María",
    apellidos: "García",
    carrera: "Licenciatura en Turismo",
    ultimoNivel: "Nivel 2",
  },
];

const ListaAlumno = () => (
  <div className="px-4">
    <Breadcrumb
      items={[
        {
          title: <p className="font-medium text-black">Coordinador</p>,
        },
        {
          title: <a href="">Listas de alumnos</a>,
        },
      ]}
    />
    <h2 className="Montserrat font-semibold text-2xl text-center">
      Lista de alumnos
    </h2>{" "}
    <List
      itemLayout="horizontal"
      dataSource={data}
      renderItem={(item, index) => (
        <List.Item>
          <List.Item.Meta
            avatar={
              <Avatar
                src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`}
              />
            }
            title={
              <a href={`/Coordinador/Alumnos/${index}`}>
                {item.nombre} {item.apellidos}
              </a>
            }
            description={
              <div>
                <p>
                  <strong>Carrera:</strong> {item.carrera}
                </p>
                <p>
                  <strong>Último Nivel:</strong> {item.ultimoNivel}
                </p>
              </div>
            }
          />
        </List.Item>
      )}
    />
  </div>
);

export default ListaAlumno;
