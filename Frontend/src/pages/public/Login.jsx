import { Button, Divider, Form, Input } from "antd";
import Headeeer from "../../components/Shared/HeaderPublico";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const onFinish = (values) => {
    console.log("Success:", values);

    navigate("/Estudiantes/Cursos");
  };
  const onFinishFailed = (errorInfo) => {
    s;
    console.log("Failed:", errorInfo);
  };
  return (
    <>
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
                <Button type="primary" htmlType="submit" onClick={onFinish}>
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
