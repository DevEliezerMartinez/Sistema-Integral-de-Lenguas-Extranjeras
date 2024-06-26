import React, { useState } from "react";
import { Breadcrumb, Button, Divider, Form, Input, Result, Select, Space } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const onFinish = (values) => {
  console.log("Success:", values);
};
const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

function Perfil() {
  return (
    <div className="px-12">
    <Breadcrumb
        items={[
          {
            title: <p className="font-medium text-black">Estudiantes</p>,
          },
          {
            title: <a href="">Mi perfil</a>,
          },
        ]}
      />
      <h2 className="Montserrat font-medium text-2xl text-center">Mi perfil</h2>

      {/* Tarjeta de Usuario */}
      <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white mx-auto  p-4">
        {/* Imagen del Usuario */}
        <img className="w-full h-48 object-cover" src="https://images.pexels.com/photos/4009599/pexels-photo-4009599.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Foto de Usuario" />
        {/* Contenido de la Tarjeta */}
        <div className="px-6 py-2">
          {/* Nombre del Usuario */}
          <div className="font-bold text-xl mb-2">Nombre del Usuario</div>
          {/* Nombre de Usuario */}
          <p className="text-gray-700 text-base">@nombredeusuario</p>
        </div>
      </div>

      <div id="bottom" className=" w-5/6 px-4 m-0 md:w-2/6 md:m-auto">
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
       

          <Form.Item label="Carrera">
            <Select>
              <Select.Option value="INF">
                Ingenieria Informatica
              </Select.Option>
              <Select.Option value="IGE">
                Ingenieria en Gestion empresarial
              </Select.Option>
              <Select.Option value="TUR">Lic en Turismo</Select.Option>
              <Select.Option value="EXT">Externo</Select.Option>
            </Select>
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

          <Form.Item>
            <Button type="primary">
              Guardar
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default Perfil;
