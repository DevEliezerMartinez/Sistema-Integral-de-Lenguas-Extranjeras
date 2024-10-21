import React, { useState } from "react";
import { Button, Divider, Form, Input, Result, Select, Space } from "antd";
import Headeeer from "../../components/Shared/HeaderPublico";
import { LockOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import Modal from "antd/es/modal/Modal";

function Registro() {
  const [selectedCarrera, setSelectedCarrera] = useState("");
  const navigate = useNavigate();

  const handleChange = (value) => {
    setSelectedCarrera(value);
  };

  const onFinish = async (values) => {
    const data = {
      nombre: values.Nombre,
      apellidos: values.Apellidos,
      numero_control: values.Ncontrol,
      carrera: selectedCarrera,
      correo_electronico: values.Correo, // Ajustado
      contrasena: values.Contraseña, // Ajustado
      genero: values.Genero,
      telefono: values.Telefono,
      curp: values.Curp,
      domicilio: values.Domicilio,
      tipo_usuario: "estudiante", // Añadido
      historial_cursos: "", // Añadido
      perfil: "", // Añadido
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        Modal.info({
          title: "Usuario creado con éxito",
          content: (
            <Result
              status="success"
              title="¡Felicidades! Has creado un nuevo usuario en nuestro sistema."
              subTitle="Ahora serás redirigido a nuestro login"
            />
          ),
          onOk() {
            console.log("Usuario creado con éxito");
            navigate("/login"); // Redirigir al login
          },
        });
      } else {
        const errorData = await response.json();

        // Verificar si el error está relacionado con el correo electrónico
        if (errorData.errors && errorData.errors.correo_electronico) {
          Modal.error({
            title: "Error en el registro",
            content: (
              <Result
                status="error"
                title="Correo electrónico ya registrado"
                subTitle={errorData.errors.correo_electronico[0]} // Mostramos el mensaje de error
              />
            ),
            onOk() {
              console.log("Correo electrónico ya registrado");
            },
          });
        } else {
          Modal.error({
            title: "Error",
            content: (
              <Result
                status="error"
                title="Lo sentimos, ocurrió un error"
                subTitle={`Error: ${errorData.message || "Inténtalo más tarde"}`}
              />
            ),
            onOk() {
              console.log("Error en la creación de usuario");
            },
          });
        }
        console.error("Error al hacer la solicitud:", response.status, errorData);
      }
    } catch (error) {
      if (error.message === "Failed to fetch") {
        Modal.error({
          title: "Error de conexión",
          content: (
            <Result
              status="error"
              title="Error de CORS"
              subTitle="Parece que hay un problema de CORS. Asegúrate de que el servidor esté configurado correctamente para aceptar solicitudes desde tu origen."
            />
          ),
          onOk() {
            console.log("Error de CORS");
          },
        });
      } else {
        Modal.error({
          title: "Error de red",
          content: (
            <Result
              status="error"
              title="Error de red"
              subTitle={`Error: ${error.message}`}
            />
          ),
          onOk() {
            console.log("Error de red:", error);
          },
        });
      }
      console.error("Error de red:", error);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <Headeeer />

      <main className="w-full flex flex-col md:h-screen md:flex-row ">
        <section id="Left" className="w-full px-8 flex flex-col items-center md:w-1/2">
          <img alt="Logo" className="w-28 my-4" src="/LogoTransparente.png" />
          <h2 className="Montserrat font-bold text-2xl text-center">
            ¡Bienvenido a tu nueva aventura como alumno!
          </h2>

          <Divider className="bg-black" />

          <p className="Montserrat font-light text-xl text-center my-4">
            Completa tus datos y comienza a aprender
          </p>

          <div id="bottom" className="w-5/6 px-4 m-0">
            <Form
              layout="inline"
              className="flex flex-col gap-5 p-4"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              requiredMark="optional"
            >
              <Form.Item
                name="Nombre"
                label="Nombre"
                rules={[{ required: true, message: "Ingresa tu nombre" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="Apellidos"
                label="Apellidos"
                rules={[{ required: true, message: "Ingresa tus Apellidos" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item label="Carrera">
                <Select onChange={handleChange}>
                  <Select.Option value="INF">Ingenieria Informatica</Select.Option>
                  <Select.Option value="IGE">Ingenieria en Gestion empresarial</Select.Option>
                  <Select.Option value="TUR">Lic en Turismo</Select.Option>
                  <Select.Option value="EXT">Externo</Select.Option>
                </Select>
              </Form.Item>

              {selectedCarrera !== "EXT" && (
                <Form.Item
                  name="Ncontrol"
                  label="Numero de control"
                  rules={[{ required: true, message: "Ingresa tu Numero de control" }]}
                >
                  <Space>
                    <Space.Compact>
                      <Input className="w-full" placeholder="191230060" />
                    </Space.Compact>
                  </Space>
                </Form.Item>
              )}

              <Form.Item
                name="Correo"
                label="Correo"
                rules={[{ required: true, message: "Ingresa un correo" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="Contraseña"
                label="Contraseña"
                rules={[{ required: true, message: "Ingresa una Contraseña" }]}
              >
                <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} />
              </Form.Item>

              <Form.Item
                name="Genero"
                label="Género"
                rules={[{ required: true, message: "Selecciona tu género" }]}
              >
                <Select>
                  <Select.Option value="Masculino">Masculino</Select.Option>
                  <Select.Option value="Femenino">Femenino</Select.Option>
                  <Select.Option value="Otro">Otro</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="Telefono"
                label="Teléfono"
                rules={[{ required: true, message: "Ingresa tu número de teléfono" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="Curp"
                label="CURP"
                rules={[{ required: true, message: "Ingresa tu CURP" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="Domicilio"
                label="Domicilio"
                rules={[{ required: true, message: "Ingresa tu domicilio" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Registrarme
                </Button>
              </Form.Item>
            </Form>

            <p className="mt-6 Montserrat text-center ">
              ¿Ya tienes una cuenta?{" "}
              <Link className="text-blue-600 font-medium" to="/login">
                ¡Iniciar sesión!
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
