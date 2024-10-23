import { Button, Divider, Form, Input, Modal, Space } from "antd";
import Headeeer from "../../components/landing/PrincipalHeader";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const onFinish = (values) => {
  console.log("Success:", values);
};
const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

function RecuperarPassword() {
  const warning = () => {
    Modal.warning({
      title: "Restablecer contraseña",
      content: "Se ha enviado un enlace de restablecimiento de contraseña a tu correo electrónico",
    });
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
            Recuperacion de contraseña
          </h2>

          <Divider className="bg-black" />

          <p className="Montserrat font-light text-2xl text-center my-4">
            Escribe tu correo y recibiras notificaciones pronto
          </p>

          <div id="bottom" className=" w-5/6 px-4 m-0">
            <Form
              layout="vertical"
              name="basic"
              onFinish={onFinish}
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
                wrapperCol={{
                  offset: 8,
                  span: 16,
                }}
              >
                <Button type="primary" onClick={warning} htmlType="submit" >
                  Enviar
                </Button>
              </Form.Item>
            </Form>
          </div>
        </section>

        <section id="right" className="hidden w-1/2 h-full md:block ">
          <img
            alt="imagen Alumnos"
            className="h-full"
            src="/Opt//CoverLogin.webp"
          />
        </section>
      </main>

      <Space wrap>
      </Space>
    </>
  );
}

export default RecuperarPassword;
