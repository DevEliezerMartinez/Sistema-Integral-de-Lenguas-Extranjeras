import { Button, Divider, Form, Input, message } from "antd";
import Headeeer from "../../components/Shared/HeaderPublico";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";

const LoginCoordinador = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
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

      // Guardar el token en localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("usuario", JSON.stringify(response.data.usuario));

      // Redirigir al usuario a Cursos Activos
      navigate("/Coordinador/CursosActivos");
    } catch (error) {
      if (error.response) {
        // Manejar errores de respuesta del servidor
        const { status, data } = error.response;
        if (status === 401) {
          message.error(data.error || "Credenciales incorrectas");
        } else if (status === 404) {
          message.error(data.error || "Usuario no encontrado");
        } else {
          message.error("Error en el servidor, intenta más tarde.");
        }
      } else {
        // Error de red o de configuración
        message.error("Error en la conexión, intenta más tarde.");
      }
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
                <Button type="primary" htmlType="submit">
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
            src="/Opt/coverDocentes.webp"
          />
        </section>
      </main>
    </>
  );
};

export default LoginCoordinador;
