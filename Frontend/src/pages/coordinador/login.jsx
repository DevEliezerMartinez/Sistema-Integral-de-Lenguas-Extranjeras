import { Button, Divider, Form, Input, message } from "antd";
import Headeeer from "../../components/Shared/HeaderPublico";
import { useAuth } from "../../AuthContext";
import React from "react";
import client from "../../axios.js";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";

const LoginCoordinador = () => {
  const navigate = useNavigate();

  const { login } = useAuth();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = React.useState(false);

  const onFinish = async (values) => {
    const data = {
      correo_electronico: values.correo,
      contrasena: values.password,
      tipo_acceso: "accesoCoordinador",
    };

    try {
      setLoading(true);

      // Obtener CSRF cookie
      await client.get("/sanctum/csrf-cookie");

      // Hacer login
      const response = await client.post("/api/login", data);
      const responseData = response.data;

      if (responseData.success) {
        // Limpiar y guardar datos del usuario
        localStorage.clear();
        localStorage.setItem("usuario", JSON.stringify(responseData.usuario));
        // Note: The original code stored 'token' which is no longer needed for cookie-based auth
        // It also didn't store a specific 'coordinador' object, just 'usuario'.
        // If the backend returns 'coordinador' data similar to 'estudiante', we might want to store it,
        // but I will stick to the previous behavior of just clearing and setting what was there, minus the token.
        // Wait, the original code DID NOT store 'coordinador' object, but the public one stored 'estudiante'.
        // I will follow the public pattern but adapt to what the backend likely returns.
        // The original code stored: token, usuario.

        // Actualizar el contexto de autenticación
        login(responseData.usuario);

        messageApi.open({
          type: "success",
          content: "Inicio de sesión exitoso.",
        });

        setTimeout(() => navigate("/Coordinador/CursosActivos"), 1200);
      }
    } catch (error) {
      console.error("Error en login:", error);

      if (error.response) {
        const errorMessage =
          error.response.data.error || "Error al iniciar sesión.";
        messageApi.open({
          type: "error",
          content: errorMessage,
        });
      } else {
        messageApi.open({
          type: "error",
          content: "Error de conexión. Intente más tarde.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      {contextHolder}
      <Headeeer />

      <main className="w-full flex flex-col md:h-screen md:flex-row">
        <section
          id="Left"
          className="w-full px-8 flex flex-col items-center md:w-1/2"
        >
          <img alt="Logo" className="w-32 my-8" src="/LogoTransparente.png" />
          <h2 className="Montserrat font-bold text-4xl text-center">
            Bienvenido coordinador
          </h2>

          <Divider className="bg-black" />

          <p className="Montserrat font-light text-2xl text-center my-4">
            Ingresa tus datos para acceder.
          </p>

          <div id="bottom" className="w-5/6 px-4 m-0">
            <Form
              layout="vertical"
              name="basic"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
            >
              <Form.Item
                label="Correo"
                name="correo"
                rules={[
                  {
                    required: true,
                    message: "Ingresa un correo",
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="Correo electrónico"
                />
              </Form.Item>

              <Form.Item
                label="Contraseña"
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
                <Button type="primary" htmlType="submit" loading={loading}>
                  Ingresar
                </Button>
              </Form.Item>
            </Form>
            <div id="Actions" className="flex flex-col items-end mt">
              <Link
                to="/Recuperar"
                className="text-right text-blue-600"
                href="#"
              >
                Olvide mi contraseña
              </Link>
            </div>
          </div>
        </section>

        <section id="right" className="hidden w-1/2 h-full md:block">
          <img
            alt="imagen Alumnos"
            className="h-full"
            src="/Opt//coverDocentes.webp"
          />
        </section>
      </main>
    </>
  );
};

export default LoginCoordinador;
