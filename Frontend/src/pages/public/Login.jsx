// src/pages/public/login
import { Button, Divider, Form, Input, message } from "antd";
import Header from "../../components/Shared/HeaderPublico";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import React from "react";
import client from "../../axios.js";

function Login() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const { login } = useAuth(); // Usar login en lugar de setToken
  const [loading, setLoading] = React.useState(false);

  const onFinish = async (values) => {
    const data = {
      correo_electronico: values.correo,
      contrasena: values.password,
      tipo_acceso: "accesoEstudiante",
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
        localStorage.setItem(
          "estudiante",
          JSON.stringify(responseData.estudiante)
        );

        // Actualizar el contexto de autenticación
        login(responseData.usuario);

        messageApi.open({
          type: "success",
          content: "Inicio de sesión exitoso.",
        });

        setTimeout(() => navigate("/Estudiantes/Cursos"), 1200);
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

  return (
    <>
      {contextHolder}
      <Header />

      <main className="w-full flex flex-col md:h-screen md:flex-row bg-gray-50">
        <section className="w-full px-8 flex flex-col items-center justify-center md:w-1/2 py-10">
          <img alt="Logo" className="w-32 mb-8" src="/LogoTransparente.png" />

          <h2 className="Montserrat font-bold text-3xl text-center text-gray-800">
            Bienvenido de nuevo
          </h2>

          <Divider className="bg-gray-400" />

          <p className="Montserrat font-light text-xl text-center mb-6 text-gray-700">
            Accede para continuar con tu proceso académico
          </p>

          <div className="w-full max-w-md p-6 rounded-xl">
            <Form layout="vertical" name="basic" onFinish={onFinish}>
              <Form.Item
                label="Correo electrónico"
                name="correo"
                rules={[
                  { required: true, message: "Ingrese un correo electrónico" },
                  { type: "email", message: "Ingrese un correo válido" },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Correo institucional"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                label="Contraseña"
                name="password"
                rules={[
                  { required: true, message: "Ingrese su contraseña" },
                  { min: 6, message: "Debe tener al menos 6 caracteres" },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Contraseña"
                  size="large"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={loading}
                  className="w-full rounded-lg font-semibold"
                >
                  Ingresar
                </Button>
              </Form.Item>
            </Form>

            <p className="Montserrat text-center mt-6 text-gray-700">
              ¿Aún no tiene cuenta?{" "}
              <Link className="text-blue-600 font-medium" to="/Registro">
                Registrarse
              </Link>
            </p>
          </div>
        </section>

        <section className="hidden md:block w-1/2 h-full relative">
          <img
            alt="Alumnos"
            className="h-full w-full object-cover"
            src="/Opt/Login.jpg"
          />
          <div className="absolute inset-0 bg-black/20"></div>
        </section>
      </main>
    </>
  );
}

export default Login;
