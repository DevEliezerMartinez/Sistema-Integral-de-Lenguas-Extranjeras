import React, { useState } from "react";
import { Button, Divider, Form, Input, Result, Select, Space } from "antd";
import Headeeer from "../../components/Shared/HeaderPublico";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import Modal from "antd/es/modal/Modal";

//form
const onFinish = (values) => {
  console.log("Success:", values);
};
const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

function Registro() {
  //modal
  const info = () => {
    Modal.info({
      title: "Usuario creado con exito!",
      content: (
        <Result
          status="success"
          title="¡Felicidades! Has creado un nuevo usuario en nuestro sistema."
          subTitle="Guarda tu usuario y contraseña para siempre poder acceder al sistema"
        />
      ),
      onOk() {},
    });
  };

  return (
    <>
      <Headeeer />

      <main className="w-full flex flex-col  md:h-screen md:flex-row ">
        <section
          id="Left"
          className=" w-full px-8 flex flex-col items-center md:w-1/2 "
        >
          <img alt="Logo" className="w-28 my-4" src="/LogoTransparente.png" />
          <h2 className="Montserrat font-bold text-4xl text-center">
            Registrate para empezar tu tramite
          </h2>

          <Divider className="bg-black" />

          <p className="Montserrat font-light text-xl text-center my-4">
            Ingresa y completa tus datos
          </p>

          <div id="bottom" className=" w-5/6 px-4 m-0">
            <Form
              layout="inline"
              className="flex flex-col gap-5 p-4 "
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
                name="Ncontrol"
                label="Numero de control"
                rules={[
                  {
                    required: true,
                    message: "Ingresa tu Numero de control",
                  },
                ]}
              >
                <Space>
                  <Space.Compact>
                    <Input className="w-full" placeholder="191230060" />
                  </Space.Compact>
                </Space>
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
              <Form.Item
                name="Contraseña"
                label="Contraseña"
                rules={[
                  {
                    required: true,
                    message: "Ingresa una Contraseña",
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="site-form-item-icon" />}
                />
              </Form.Item>

              <Form.Item>
                <Button type="primary" onClick={info}>
                  Registrarme
                </Button>
              </Form.Item>
            </Form>

            <p className="mt-6 Montserrat text-center ">
              Ya tienes una cuenta?{" "}
              <Link className="text-blue-600 font-medium" to="/login">
                Iniciar sesion!
              </Link>
            </p>
          </div>
        </section>

        <section id="right" className="hidden w-1/2 h-full md:block ">
          <img
            alt="imagen Alumnos"
            className="h-full"
            src="/Opt/CoverLogin.webp"
          />
        </section>

       
      </main>
    </>
  );
}

export default Registro;
