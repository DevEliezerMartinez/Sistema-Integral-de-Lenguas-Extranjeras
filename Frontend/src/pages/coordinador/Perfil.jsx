import React, { useState, useEffect } from "react";
import { Breadcrumb, Button, Divider, message, Modal, Form, Input, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import TablaDocentes from "../../components/coordinador/TablaDeDocentes";

const { Option } = Select;

function Perfil() {
  // Estado para almacenar los docentes
  const [docentes, setDocentes] = useState([]);
  
  // Estado para controlar el modal
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Formulario de Ant Design
  const [form] = Form.useForm();

  // Función para hacer la petición a la API y obtener docentes
  const fetchDocentes = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/docentes", {
        headers: {
          Authorization: "Bearer 1|AFPPXEHDEUyWz1mnsszBCzo3QrKWNc18dAPfae4L2d901636",
        },
      });
      const data = await response.json();
      setDocentes(data.docentes);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Efecto para cargar los docentes al montar el componente
  useEffect(() => {
    fetchDocentes();
  }, []);

  // Función para mostrar el modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Función para cerrar el modal
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields(); // Limpiar el formulario
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (values) => {
    // Establecer tipo de usuario como 'docente' por defecto
    values.tipo_usuario = "docente"; 

    try {
      const response = await fetch("http://127.0.0.1:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer 1|AFPPXEHDEUyWz1mnsszBCzo3QrKWNc18dAPfae4L2d901636",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const data = await response.json();
        message.success(data.message);

        // Actualizar la lista de docentes
        fetchDocentes(); // Llama a la función para obtener docentes actualizados

        // Cerrar el modal y limpiar el formulario
        handleCancel();
      } else {
        const errorData = await response.json();
        message.error("Error en el registro: " + errorData.errors[0]);
      }
    } catch (error) {
      message.error("Hubo un problema con la solicitud");
      console.error("Error registrando docente:", error);
    }
  };

  // Función para eliminar un docente
  const eliminarDocente = async (docente_id) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/docentes/${docente_id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer 1|AFPPXEHDEUyWz1mnsszBCzo3QrKWNc18dAPfae4L2d901636",
          },
        }
      );

      if (response.ok) {
        message.success("Docente eliminado con éxito");
        // Actualiza la lista de docentes después de eliminar
        setDocentes(docentes.filter((docente) => docente.docente_id !== docente_id));
      } else {
        message.error("Error al eliminar el docente");
      }
    } catch (error) {
      message.error("Hubo un problema con la solicitud de eliminación");
      console.error("Error eliminando docente:", error);
    }
  };

  return (
    <div className="px-4">
      <Breadcrumb
        items={[
          {
            title: <p className="font-medium text-black">Coordinador</p>,
          },
          {
            title: <a href="#">Perfil</a>,
          },
        ]}
      />

      <div className="w-full flex justify-around items-center p-2">
        <div className="col-span-4 sm:col-span-3">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex flex-col items-center">
              <img
                src="../../../public/Opt/coverDocentes.webp"
                className="w-20 h-20 bg-gray-300 rounded-full mb-4 shrink-0"
                alt="Foto de perfil"
              />
              <h1 className="text-xl font-bold">Maricela Gallegos</h1>
              <p className="text-gray-700">Administrador</p>
            </div>
          </div>
        </div>

        <div id="right" className="w-full">
          <h2 className="Montserrat self-start font-medium text-2xl">
            Docentes registrados
          </h2>

          <Divider />

          {/* Pasar los datos de los docentes y la función de eliminación a la tabla */}
          <TablaDocentes docentes={docentes} onDocenteEliminado={eliminarDocente} />
        </div>
      </div>
      
      <Button type="primary" onClick={showModal} icon={<PlusOutlined />}>
        Agregar
      </Button>
      
      <Modal
        title="Registrar Docente"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleSubmit}>
          <Form.Item
            name="nombre"
            label="Nombre"
            rules={[{ required: true, message: "Por favor ingrese el nombre" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="apellidos"
            label="Apellidos"
            rules={[{ required: true, message: "Por favor ingrese los apellidos" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="correo_electronico"
            label="Correo Electrónico"
            rules={[
              { required: true, message: "Por favor ingrese el correo electrónico" },
              { type: "email", message: "Ingrese un correo válido" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="contrasena"
            label="Contraseña"
            rules={[{ required: true, message: "Por favor ingrese una contraseña" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="genero"
            label="Género"
            rules={[{ required: true, message: "Seleccione el género" }]}
          >
            <Select placeholder="Seleccione género">
              <Option value="masculino">Masculino</Option>
              <Option value="femenino">Femenino</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="telefono"
            label="Teléfono"
            rules={[{ required: true, message: "Por favor ingrese el teléfono" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="curp"
            label="CURP"
            rules={[{ required: true, message: "Por favor ingrese el CURP" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="domicilio"
            label="Domicilio"
            rules={[{ required: true, message: "Por favor ingrese el domicilio" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="tipo_usuario"
            label="Tipo de Usuario"
            initialValue="docente" // Establecer tipo de usuario como 'docente' por defecto
            hidden // Ocultar este campo en el formulario
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Registrar
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Perfil;
