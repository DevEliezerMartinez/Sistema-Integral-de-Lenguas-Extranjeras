import React, { useState, useEffect } from "react";
import { Breadcrumb, Button, Form, Input, Select, Modal, message, Card } from "antd";
import { UserOutlined, PhoneOutlined, HomeOutlined, IdcardOutlined } from '@ant-design/icons';

const Perfil = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem("usuario");
    const token = localStorage.getItem("token");
    if (user && token) {
      const userParse = JSON.parse(user);
      const userid = userParse.id;
      
      const fetchUserData = async () => {
        try {
          const response = await fetch(`http://127.0.0.1:8000/api/infoUser/${userid}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();

          if (response.ok) {
            setFormValues(data.user);
          } else {
            message.error(data.message || "Error al cargar la información del usuario");
          }
        } catch (error) {
          message.error("Ocurrió un error al cargar la información del usuario");
        } finally {
          setLoading(false);
        }
      };

      fetchUserData();
    } else {
      message.error("Token no encontrado, por favor inicia sesión.");
    }
  }, []);

  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => setIsModalVisible(false);

  const onFinish = async (values) => {
    setFormValues(values);
    setIsModalVisible(false);

    const token = localStorage.getItem("token");
    const user = localStorage.getItem("usuario");
    if (user && token) {
      const userParse = JSON.parse(user);
      const userid = userParse.id;

      try {
        const response = await fetch(`http://127.0.0.1:8000/api/updateUser/${userid}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(values),
        });

        if (response.ok) {
          message.success("Información actualizada correctamente");
        } else {
          const errorData = await response.json();
          message.error(errorData.message || "Error al actualizar la información");
        }
      } catch (error) {
        message.error("Ocurrió un error al actualizar la información");
      }
    } else {
      message.error("Token no encontrado, por favor inicia sesión.");
    }
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="p-4">
      <Breadcrumb
        items={[
          { title: <p className="font-medium text-black">Docente</p> },
          { title: <a href="">Perfil Docente</a> },
        ]}
      />
      <h2 className="font-medium text-2xl text-center mb-4">Mi perfil docente</h2>

      <Card 
        className="max-w-md mx-auto text-center shadow-lg"
        cover={
          <img
            className="object-cover h-48 w-full rounded-t-md"
            src="https://images.pexels.com/photos/4009599/pexels-photo-4009599.jpeg?auto=compress&cs=tinysrgb&w=600"
            alt="Foto de Usuario"
          />
        }
      >
        <Card.Meta
          title={`${formValues.nombre} ${formValues.apellidos}`}
          description={
            <div className="text-left">
              <p className="text-gray-600"><PhoneOutlined /> {formValues.telefono}</p>
              <p className="text-gray-600"><HomeOutlined /> {formValues.domicilio}</p>
            </div>
          }
        />
        <Button type="primary" className="mt-4" onClick={showModal}>
          Editar
        </Button>
      </Card>

      <Modal
        title="Editar Perfil"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          layout="vertical"
          initialValues={formValues}
          onFinish={onFinish}
        >
          <Form.Item label="Nombre" name="nombre" rules={[{ required: true, message: 'Ingresa tu nombre' }]}>
            <Input prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item label="Apellidos" name="apellidos" rules={[{ required: true, message: 'Ingresa tus apellidos' }]}>
            <Input prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item label="Género" name="genero" rules={[{ required: true, message: 'Selecciona tu género' }]}>
            <Select>
              <Select.Option value="Masculino">Masculino</Select.Option>
              <Select.Option value="Femenino">Femenino</Select.Option>
              <Select.Option value="Otro">Otro</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Teléfono" name="telefono" rules={[{ required: true, message: 'Ingresa tu teléfono' }]}>
            <Input prefix={<PhoneOutlined />} />
          </Form.Item>

          <Form.Item label="CURP" name="curp" rules={[{ required: true, message: 'Ingresa tu CURP' }]}>
            <Input prefix={<IdcardOutlined />} />
          </Form.Item>

          <Form.Item label="Domicilio" name="domicilio" rules={[{ required: true, message: 'Ingresa tu domicilio' }]}>
            <Input prefix={<HomeOutlined />} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Guardar
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Perfil;
