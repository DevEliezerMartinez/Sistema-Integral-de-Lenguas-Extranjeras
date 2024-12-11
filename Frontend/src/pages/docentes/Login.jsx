import React, { useState } from "react";
import { Button, Divider, Form, Input, message } from "antd";
import Header from "../../components/Shared/HeaderPublico"; // Renombré el import del Header
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";

const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

function LoginDocentes() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Estado para controlar el botón de carga

  const onFinish = async (values) => {
    setLoading(true); // Activar estado de carga (deshabilitar el botón)
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            correo_electronico: values.correo_electronico, // Cambiado a 'correo_electronico'
            contrasena: values.contrasena, // Cambiado a 'contrasena'
            tipo_acceso: "accesoDocente", // Añadido el tipo de acceso
          }),
        }
      );

      // Verifica si la respuesta fue exitosa
      if (response.ok) {
        const data = await response.json();

        // Verifica si la respuesta indica éxito
        if (data.success) {
          localStorage.clear();
          // Guardar el token y los datos del usuario en localStorage
          localStorage.setItem("token", data.token);
          localStorage.setItem("usuario", JSON.stringify(data.usuario));
          localStorage.setItem("docente", JSON.stringify(data.docente));

          // Navegar a la ruta de Cursos Activos
          navigate("/Docentes/CursosActivos");
        } else {
          // Manejo de errores en caso de que success sea false
          message.error("Error desconocido, intenta nuevamente.");
        }
      } else {
        const errorData = await response.json();

        // Manejo de errores para credenciales incorrectas
        if (errorData.error === "Credenciales incorrectas") {
          message.error(
            "Credenciales incorrectas. Por favor, verifica tu correo y contraseña."
          );
        } else {
          message.error("Error en el inicio de sesión. Inténtalo de nuevo.");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("Hubo un problema con la solicitud de inicio de sesión.");
    } finally {
      setLoading(false); // Desactivar el estado de carga
    }
  };

  return (
    <>
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
                  {
                    type: "email",
                    message: "Por favor ingresa un correo electrónico válido",
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
                  {
                    min: 6,
                    message: "La contraseña debe tener al menos 6 caracteres",
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="site-form-item-icon" />}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading} // Muestra el indicador de carga
                  disabled={loading} // Deshabilita el botón mientras se espera la respuesta
                >
                  Ingresar
                </Button>
              </Form.Item>
            </Form>
          
          </div>
        </section>

        <section id="right" className="hidden w-1/2 h-full md:block">
          <img
            alt="imagen Docentes" // Cambié el texto alternativo para ser más específico
            className="h-full"
            src="/Opt/itsmAzul.jpg"
          />
        </section>
      </main>
    </>
  );
}

export default LoginDocentes;
