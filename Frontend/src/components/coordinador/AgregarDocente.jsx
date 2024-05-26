import React from "react";
import { Form, Input, Button, Select, Divider } from "antd";

function AgregarCoordinador() {
  const onFinish = (values) => {
    console.log("Received values:", values);
    // Aquí puedes manejar el envío de los datos a tu API
  };

  return (
    <div>
    <Divider/>
      <h2 className="Montserrat self-start font-medium  text-center  my-10 text-2xl ">
        Agregar Docentes
      </h2>
      <Form
        name="agregarDocenteForm"
        onFinish={onFinish}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
      >
        <Form.Item
          name="nombre"
          label="Nombre"
          rules={[
            {
              required: true,
              message: "Por favor ingresa el nombre del docente",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="apellidos"
          label="Apellidos"
          rules={[
            {
              required: true,
              message: "Por favor ingresa los apellidos del docente",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="genero"
          label="Género"
          rules={[
            {
              required: true,
              message: "Por favor selecciona el género del docente",
            },
          ]}
        >
          <Select>
            <Select.Option value="masculino">Masculino</Select.Option>
            <Select.Option value="femenino">Femenino</Select.Option>
            <Select.Option value="otro">Otro</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="telefono"
          label="Teléfono"
          rules={[
            {
              required: true,
              message: "Por favor ingresa el teléfono del docente",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="curp"
          label="CURP"
          rules={[
            {
              required: true,
              message: "Por favor ingresa el CURP del docente",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="domicilio"
          label="Domicilio"
          rules={[
            {
              required: true,
              message: "Por favor ingresa el domicilio del docente",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="correo"
          label="Correo"
          rules={[
            {
              required: true,
              message: "Por favor ingresa el correo del docente",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="contrasena"
          label="Contraseña"
          rules={[
            { required: true, message: "Por favor ingresa una contraseña" },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 6, span: 14 }}>
          <Button type="primary" htmlType="submit">
            Agregar Docente
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default AgregarCoordinador;
