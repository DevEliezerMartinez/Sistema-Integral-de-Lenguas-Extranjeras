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
    const data = {
      correo_electronico: values.correo,
      contrasena: values.password,
      tipo_acceso: "accesoEstudiante",
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });


      if (response.ok) {
        const responseData = await response.json();

        if (responseData.success) {
          localStorage.clear();
          localStorage.setItem("token", responseData.token);
          localStorage.setItem("usuario", JSON.stringify(responseData.usuario));
          localStorage.setItem("estudiante", JSON.stringify(responseData.estudiante));

          setToken(responseData.token);

          messageApi.open({
            type: "success",
            content: "Inicio de sesión exitoso.",
          });

          setTimeout(() => navigate("/Estudiantes/Cursos"), 1200);
        } else {
          messageApi.open({
            type: "error",
            content: "Error inesperado. Intente nuevamente.",
          });
        }
      } else {
        const errorData = await response.json();

        if (response.status === 401) {
          messageApi.open({
            type: "error",
            content: "Credenciales incorrectas.",
          });
        } else {
          messageApi.open({
            type: "error",
            content: errorData.error || "Error al iniciar sesión.",
          });
        }
      }
    } catch (error) {
      console.error("Error en la petición:", error);

      messageApi.open({
        type: "error",
        content: "Error de conexión. Intente más tarde.",
      });
    }
  };

  return (
    <>
      {contextHolder}
      <Header />

      <main className="w-full flex flex-col md:h-screen md:flex-row bg-gray-50">
        {/* Panel izquierdo */}
        <section className="w-full px-8 flex flex-col items-center justify-center md:w-1/2 py-10">
          <img alt="Logo" className="w-32 mb-8" src="/LogoTransparente.png" />

          <h2 className="Montserrat font-bold text-3xl text-center text-gray-800">
            Bienvenido de nuevo
          </h2>

          <Divider className="bg-gray-400" />

          <p className="Montserrat font-light text-xl text-center mb-6 text-gray-700">
            Accede para continuar con tu proceso académico
          </p>

          <div className="w-full max-w-md  p-6 rounded-xl ">
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
                  className="w-full rounded-lg font-semibold"
                >
                  Ingresar
                </Button>
              </Form.Item>
            </Form>

          {/*   <div className="flex justify-end">
              <Link to="/Recuperar" className="text-blue-600 text-sm">
                ¿Olvidó su contraseña?
              </Link>
            </div>
 */}
            <p className="Montserrat text-center mt-6 text-gray-700">
              ¿Aún no tiene cuenta?{" "}
              <Link className="text-blue-600 font-medium" to="/Registro">
                Registrarse
              </Link>
            </p>
          </div>
        </section>

        {/* Panel derecho */}
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
