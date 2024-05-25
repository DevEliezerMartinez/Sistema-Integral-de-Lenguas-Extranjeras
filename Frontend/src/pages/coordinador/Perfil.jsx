import React, { useState } from "react";
import { Breadcrumb, Button, Divider, Form, Input } from "antd";
import TablaDocentes from "../../components/coordinador/TablaDeDocentes";
import AgregarCoordinador from "../../components/coordinador/AgregarDocente";
const onFinish = (values) => {
  console.log("Success:", values);
};
const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

function Perfil() {
  return (
    <div className="px-4">
      <Breadcrumb
        items={[
          {
            title: <p className="font-medium text-black">Coordinador</p>,
          },
          {
            title: <a href="">Perfil</a>,
          },
        ]}
      />

      <div className=" w-full  flex flex-col items-center p-10">
        <div id="left" className="w-1/2">
          <h2 className="Montserrat text-center font-medium text-2xl ">
            Editar datos de mi Perfil
          </h2>
          {/* Tarjeta de Usuario */}
          <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white mx-auto  p-4">
            {/* Imagen del Usuario */}
            <img
              className="w-full h-48 object-cover"
              src="https://images.pexels.com/photos/4009599/pexels-photo-4009599.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Foto de Usuario"
            />
            {/* Contenido de la Tarjeta */}
            <div className="px-6 py-2">
              {/* Nombre del Usuario */}
              <div className="font-bold text-xl mb-2">
                Hermenegildo Cisneros
              </div>
              {/* Nombre de Usuario */}
              <p className="text-gray-700 text-base">@herme123</p>
            </div>
          </div>

          <div id="bottom" className="  px-4 m-0 md:w-full md:m-auto">
            <Form
              layout="inline"
              className="flex flex-col gap-2 p-4 "
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              requiredMark="optional"
            >
              <Form.Item
                name="Nombre"
                label="Nombre"
                rules={[
                  {
                    required: true,
                    message: "Ingresa tu nombre",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="Apellidos"
                label="Apellidos"
                rules={[
                  {
                    required: true,
                    message: "Ingresa tus Apellidos",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="Correo"
                label="Correo"
                rules={[
                  {
                    required: true,
                    message: "Ingresa un correo",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="password"
                label="Contraseña"
                rules={[
                  {
                    required: true,
                    message: "Ingresa una Contraseña",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item>
                <Button type="primary">Guardar</Button>
              </Form.Item>
            </Form>
          </div>
        </div>
        <div id="right" className="">
          <h2 className="Montserrat self-start font-medium text-2xl ">
            Docentes registrados
          </h2>

          <Divider/>
          <TablaDocentes />


          <AgregarCoordinador/>
        </div>
      </div>
    </div>
  );
}

export default Perfil;
