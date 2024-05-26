import { Button, Divider, Form, Input, message } from "antd";
import Headeeer from "../../components/Shared/HeaderPublico";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import React, { useState } from 'react';

function Login() {
  const navigate = useNavigate();



  const [messageApi, contextHolder] = message.useMessage();

  const { setToken } = useAuth();


  const onFinish = async (values) => {
    // Construye el cuerpo de la petición
    const requestBody = {
      correo_electronico: values.correo,
      contrasena: values.password,
    };

    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      // Verifica si la petición fue exitosa
      if (response.ok) {
        // Parsea el cuerpo de la respuesta como JSON
        const responseData = await response.json();

        // Imprime los datos de la respuesta en la consola
        console.log("Petición POST exitosa");
        console.log("Token:", responseData.token);
        console.log("Tipo de token:", responseData.token_type);
        console.log("Usuario:", responseData.usuario);
        messageApi.open({
          type: "success",
          content: "Inicio de sesion exitoso!",
        });


          // Lógica para iniciar sesión
          setToken(responseData.token);
        


        setTimeout(() => {
          navigate("/Estudiantes/Cursos");
        }, 2000);
      } else {
        // Maneja errores de respuesta aquí
        console.log("status:", response.status);
        console.log("completo:", response);
        console.log("Error:", response.statusText);

        if (response.status == 401)
          messageApi.open({
            type: "error",
            content: "Datos invalidos!",
          });
      }
    } catch (error) {
      // Maneja errores de red o de cliente aquí
      console.error("Error al enviar la petición POST:", error);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <>
      {contextHolder}
      <Headeeer />

      <main className="w-full flex flex-col  md:h-screen md:flex-row ">
        <section
          id="Left"
          className=" w-full px-8 flex flex-col items-center md:w-1/2 "
        >
          <img alt="Logo" className="w-32 my-8" src="/LogoTransparente.png" />
          <h2 className="Montserrat font-bold text-3xl text-center">
            ¡Nos alegra verte de nuevoo!
          </h2>

          <Divider className="bg-black" />

          <p className="Montserrat font-light text-2xl text-center my-4">
            Inicia sesión para continuar tu viaje educativo
          </p>

          <div id="bottom" className=" w-5/6 px-4 m-0">
            <Form
              layout="vertical"
              name="basic"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
            >
              <Form.Item
                label="Correo"
                name="correo"
                type="email"
                rules={[
                  {
                    required: true,
                    message: "Ingresa un correo",
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="Username"
                />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Ingrese una contraseña!",
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="site-form-item-icon" />}
                />
              </Form.Item>

              <Form.Item
                wrapperCol={{
                  offset: 8,
                  span: 16,
                }}
              >
                <Button type="primary" htmlType="submit">
                  Ingresar
                </Button>
              </Form.Item>
            </Form>
            <div id="Actions" className=" flex flex-col items-end mt">
              <Link
                to="/Recuperar"
                className="text-right text-blue-600 "
                href="#"
              >
                Olvide mi contraseña
              </Link>
            </div>

            <p className="mt-6 Montserrat text-center ">
              No tienes cuenta aun?{" "}
              <Link className="text-blue-600 font-medium" to="/Registro">
                Registrarme!
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

export default Login;
