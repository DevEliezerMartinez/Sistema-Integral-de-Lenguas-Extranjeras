import React from 'react';
import { Button, Form, Input, Modal } from 'antd';
import emailjs from 'emailjs-com'; // Importar la librería de EmailJS
import { UserOutlined } from '@ant-design/icons';

function RecuperarPassword() {
  const warning = () => {
    Modal.warning({
      title: 'Recuperación de contraseña',
      content: 'Se ha enviado un correo con la nueva contraseña.',
    });
  };

  const onFinish = async (values) => {
    try {
      // Realiza una solicitud al backend para validar el correo
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/recuperar-password`, {
        correo: values.correo,
      });

      if (response.status === 200) {
        // Envía el correo con la nueva contraseña utilizando EmailJS
        emailjs.send(
          'service_xxxx', // Tu Service ID de EmailJS
          'template_xxxx', // Tu Template ID de EmailJS
          {
            nombre: values.correo, // Aquí puedes pasar el nombre si es necesario
            nuevaContrasena: response.data.nuevaContrasena, // Nueva contraseña generada
            correo: values.correo, // Correo del usuario
          },
          'user_xxxx' // Tu User ID de EmailJS
        )
        .then(
          (result) => {
            console.log('Correo enviado: ', result.text);
            warning();
          },
          (error) => {
            console.log('Error al enviar correo: ', error.text);
            Modal.error({
              title: 'Error',
              content: 'Hubo un problema al enviar el correo. Intenta nuevamente.',
            });
          }
        );
      }
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
      Modal.error({
        title: 'Error',
        content: 'No se pudo conectar con el servidor. Inténtalo de nuevo más tarde.',
      });
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div>
      <h2>Recuperar Contraseña</h2>
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
              message: 'Ingresa un correo',
            },
          ]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Correo"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Enviar
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default RecuperarPassword;
