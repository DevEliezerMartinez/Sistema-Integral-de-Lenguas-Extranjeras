import React from "react";
import { Button, Divider, Form, Input, message } from "antd";
import Header from "../../components/Shared/HeaderPublico"; // Renombré el import del Header
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import client from "../../axios.js";

const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

function LoginDocentes() {
  const navigate = useNavigate();

  const { login } = useAuth();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = React.useState(false);

  const onFinish = async (values) => {
    const data = {
      correo_electronico: values.correo_electronico,
      contrasena: values.contrasena,
      tipo_acceso: "accesoDocente",
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
        localStorage.setItem("docente", JSON.stringify(responseData.docente));

        // Actualizar el contexto de autenticación
        login(responseData.usuario);

        messageApi.open({
          type: "success",
          content: "Inicio de sesión exitoso.",
        });

        setTimeout(() => navigate("/Docentes/CursosActivos"), 1200);
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

      <main className="w-full flex flex-col md:h-screen md:flex-row">
        <section
          id="Left"
          className="w-full px-8 flex flex-col items-center md:w-1/2"
        >
          <img alt="Logo" className="w-32 my-8" src="/LogoTransparente.png" />
          <h2 className="Montserrat font-bold text-4xl text-center">
            Bienvenido docente
          </h2>

          <Divider className="bg-black" />

          <p className="Montserrat font-light text-2xl text-center my-4">
            Ingresa tus datos
          </p>

          <div id="bottom" className="w-5/6 px-4 m-0">
            <Form
              layout="vertical"
              name="login"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
            >
              <Form.Item
                label="Correo"
                name="correo_electronico" // Cambié 'correo' a 'correo_electronico'
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
                name="contrasena" // Cambié 'password' a 'contrasena'
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

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Ingresar
                </Button>
              </Form.Item>
            </Form>
            {/*  <div id="Actions" className="flex flex-col items-end mt-2">
              <Link to="/Recuperar" className="text-right text-blue-600">
                Olvidé mi contraseña
              </Link>
            </div> */}
          </div>
        </section>

        <section id="right" className="hidden w-1/2 h-full md:block">
          <img
            alt="imagen Docentes" // Cambié el texto alternativo para ser más específico
            className="h-full"
            src="/Opt//coverDocentes.webp"
          />
        </section>
      </main>
    </>
  );
}

export default LoginDocentes;
