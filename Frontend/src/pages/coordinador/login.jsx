import { Button, Divider, Form, Input, message } from "antd";
import Headeeer from "../../components/Shared/HeaderPublico";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const LoginCoordinador = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Estado para controlar la carga

  const onFinish = async (values) => {
    setLoading(true); // Habilitar el estado de carga

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            correo_electronico: values.correo,
            contrasena: values.password,
            tipo_acceso: "accesoCoordinador",
          }),
        }
      );

      // Verifica si la respuesta fue exitosa
      if (!response.ok) {
        const data = await response.json();
        if (response.status === 401) {
          message.error(data.error || "Credenciales incorrectas");
        } else if (response.status === 404) {
          message.error(data.error || "Usuario no encontrado");
        } else {
          message.error("Error en el servidor, intenta más tarde.");
        }
        return; // Salir de la función si la respuesta no es exitosa
      }

      // Si la respuesta es exitosa, procesar los datos
      const data = await response.json();
      if (data.success) {
        localStorage.clear();
        // Guardar el token y el usuario en localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("usuario", JSON.stringify(data.usuario));

        // Redirigir al usuario a Cursos Activos
        navigate("/Coordinador/CursosActivos");
      } else {
        // Manejar caso donde success es false
        message.error("Error desconocido, intenta nuevamente.");
      }
    } catch (error) {
      // Error de red o de configuración
      message.error("Error en la conexión, intenta más tarde.");
    } finally {
      setLoading(false); // Deshabilitar el estado de carga una vez termine
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
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
                  {
                    type: "email",
                    message: "El correo no es válido",
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
                  block
                  loading={loading} // Añadir el estado de carga al botón
                  disabled={loading} // Deshabilitar el botón mientras se recobe la respuesta
                >
                  Ingresar
                </Button>
              </Form.Item>
            </Form>
            
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
