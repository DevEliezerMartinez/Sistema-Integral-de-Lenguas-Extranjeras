import { Button, Divider, Form, Input, message } from "antd";
import Header from "../../components/Shared/HeaderPublico";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import React from "react";

function Login() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const { setToken } = useAuth();

  const onFinish = async (values) => {
    // Crear un objeto con los valores del formulario
    const data = {
      correo_electronico: values.correo,
      contrasena: values.password,
      tipo_acceso: "accesoEstudiante",
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Establecer el Content-Type a application/json
        },
        body: JSON.stringify(data), // Convertir el objeto a JSON
       
      });

      console.log("respuesta raw",response)

      if (response.ok) {
        const responseData = await response.json();

        // Verifica si la respuesta indica éxito
        if (responseData.success) {
          console.log("Petición POST exitosa");
          console.log(responseData.estudiante);
          console.log("Token:", responseData.token);

          // Almacenar el token y los datos en localStorage
          localStorage.clear();
          localStorage.setItem("token", responseData.token);
          localStorage.setItem("usuario", JSON.stringify(responseData.usuario));
          localStorage.setItem("estudiante", JSON.stringify(responseData.estudiante));

          // Almacenar el token en el contexto de autenticación
          setToken(responseData.token);

          messageApi.open({
            type: "success",
            content: "Inicio de sesión exitoso!",
          });

          setTimeout(() => {
            navigate("/Estudiantes/Cursos");
          }, 2000);
        } else {
          // Manejo de errores en caso de que success sea false
          messageApi.open({
            type: "error",
            content: "Error desconocido, intenta nuevamente.",
          });
        }
      } else {
        const errorData = await response.json();
        console.log("Error:", errorData);

        if (response.status === 401) {
          messageApi.open({
            type: "error",
            content: "Datos inválidos!",
          });
        } else {
          messageApi.open({
            type: "error",
            content: errorData.error || "Error al iniciar sesión. Intenta nuevamente.",
          });
        }
      }
    } catch (error) {
      console.error("Error al enviar la petición POST:", error);
      messageApi.open({
        type: "error",
        content: "Error en la conexión, intenta más tarde.",
      });
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
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
          <h2 className="Montserrat font-bold text-3xl text-center">
            ¡Nos alegra verte de nuevo!
          </h2>
          <Divider className="bg-black" />
          <p className="Montserrat font-light text-2xl text-center my-4">
            Inicia sesión para continuar tu viaje educativo
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
                  { required: true, message: "Ingresa un correo" },
                  { type: 'email', message: "Ingresa un correo válido" },
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
                  { required: true, message: "Ingrese una contraseña" },
                  { min: 6, message: "La contraseña debe tener al menos 6 caracteres" },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="site-form-item-icon" />}
                />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Ingresar
                </Button>
              </Form.Item>
            </Form>
            <div id="Actions" className="flex flex-col items-end mt">
              <Link to="/Recuperar" className="text-right text-blue-600">
                Olvidé mi contraseña
              </Link>
            </div>
            <p className="mt-6 Montserrat text-center">
              ¿No tienes cuenta aún?{" "}
              <Link className="text-blue-600 font-medium" to="/Registro">
                ¡Regístrate!
              </Link>
            </p>
          </div>
        </section>
        <section id="right" className="hidden w-1/2 h-full md:block">
          <img
            alt="imagen Alumnos"
            className="h-full"
            src="/Opt//CoverLogin.webp"
          />
        </section>
      </main>
    </>
  );
}

export default Login;
