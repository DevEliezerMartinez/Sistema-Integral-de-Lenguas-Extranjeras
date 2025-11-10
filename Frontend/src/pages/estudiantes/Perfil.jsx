import React, { useState, useEffect } from "react";
import {
  Breadcrumb,
  Button,
  Form,
  Input,
  Select,
  Modal,
  message,
  Upload,
  Spin,
} from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  HomeOutlined,
  IdcardOutlined,
  UploadOutlined,
} from "@ant-design/icons";

const fallbackImage =
  "https://images.pexels.com/photos/4009599/pexels-photo-4009599.jpeg?auto=compress&cs=tinysrgb&w=600";

const Perfil = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [fileImage, setFileImage] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const user = localStorage.getItem("usuario");
    const token = localStorage.getItem("token");

    if (user && token) {
      const userParse = JSON.parse(user);
      const userid = userParse.id;

      const fetchUserData = async () => {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/infoUser/${userid}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const data = await response.json();

          if (response.ok) {
            setFormValues(data.user);
            setPreviewImg(data.user.foto || null);
            form.setFieldsValue(data.user);
          } else {
            message.error(
              data.message || "Error al cargar la información del usuario."
            );
          }
        } catch (error) {
          message.error("Ocurrió un error al cargar la información del usuario.");
        } finally {
          setLoading(false);
        }
      };

      fetchUserData();
    }
  }, [form]);

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!isImage) {
      message.error('Solo puedes subir archivos de imagen');
      return Upload.LIST_IGNORE;
    }
    if (!isLt2M) {
      message.error('La imagen debe ser menor a 2MB');
      return Upload.LIST_IGNORE;
    }

    setFileImage(file);
    setPreviewImg(URL.createObjectURL(file));
    return false;
  };

  const showModal = () => setIsModalVisible(true);
  
  const handleCancel = () => {
    setIsModalVisible(false);
    form.setFieldsValue(formValues);
    setPreviewImg(formValues.foto || null);
    setFileImage(null);
  };

  const onFinish = async (values) => {
    const user = localStorage.getItem("usuario");
    const token = localStorage.getItem("token");

    if (!(user && token)) {
      message.error("Token no encontrado, por favor inicia sesión.");
      return;
    }

    const userParse = JSON.parse(user);
    const userid = userParse.id;

    const formData = new FormData();
    
    // Agregar _method para Laravel
    formData.append("_method", "PUT");
    
    // Agregar todos los campos del formulario
    formData.append("nombre", values.nombre);
    formData.append("apellidos", values.apellidos);
    formData.append("genero", values.genero);
    formData.append("telefono", values.telefono);
    formData.append("curp", values.curp);
    formData.append("domicilio", values.domicilio);
    
    // Agregar la foto solo si fue seleccionada
    if (fileImage) {
      formData.append("foto", fileImage);
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/updateUser/${userid}`,
        {
          method: "POST", // Usar POST con _method=PUT
          headers: { 
            Authorization: `Bearer ${token}`,
            // NO incluir Content-Type, el navegador lo establece automáticamente con boundary
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        message.success("Información actualizada correctamente.");
        setFormValues(data.user);
        setPreviewImg(data.user.foto);
        setFileImage(null);
        setIsModalVisible(false);
      } else {
        message.error(data.message || "Error al actualizar la información.");
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("Ocurrió un error al actualizar la información.");
    }
  };

  return (
    <div>
      {/* Breadcrumb siempre visible */}
      <div className="mb-6">
        <Breadcrumb
          items={[
            { title: <p className="font-medium text-black">Alumnos</p> },
            { title: <a>Perfil</a> },
          ]}
        />
      </div>

      {/* Mostrar loader mientras carga */}
      {loading ? (
        <div className="flex justify-center mt-20">
          <Spin size="large" />
        </div>
      ) : (
        <>
          {/* Layout general */}
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Panel lateral */}
            <div className="bg-slate-100 rounded-xl shadow-md p-6 flex flex-col items-center">
              <img
                src={previewImg || fallbackImage}
                alt="Perfil"
                className="w-40 h-40 rounded-full object-cover shadow-md mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-800 text-center">
                {formValues.nombre} {formValues.apellidos}
              </h3>
              <p className="text-gray-500 text-sm mb-4">{formValues.correo}</p>

              <Button
                type="primary"
                className="w-full bg-[#1B396A] hover:opacity-90"
                onClick={showModal}
              >
                Editar Perfil
              </Button>
            </div>

            {/* Contenido principal */}
            <div className="lg:col-span-2 bg-slate-100 rounded-xl shadow-md p-8">
              <h3 className="text-2xl font-semibold text-[#1B396A] mb-6">
                Información del Usuario
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-500 text-sm">Teléfono</p>
                  <p className="text-gray-800 font-medium flex items-center gap-2 mt-1">
                    <PhoneOutlined /> {formValues.telefono}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">CURP</p>
                  <p className="text-gray-800 font-medium flex items-center gap-2 mt-1">
                    <IdcardOutlined /> {formValues.curp}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">Domicilio</p>
                  <p className="text-gray-800 font-medium flex items-center gap-2 mt-1">
                    <HomeOutlined /> {formValues.domicilio}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">Género</p>
                  <p className="text-gray-800 font-medium">
                    {formValues.genero}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Modal: editar perfil */}
          <Modal
            title={
              <p className="text-xl font-semibold text-[#1B396A]">
                Editar Perfil
              </p>
            }
            open={isModalVisible}
            onCancel={handleCancel}
            footer={null}
            centered
          >
            <Form
              form={form}
              layout="vertical"
              initialValues={formValues}
              onFinish={onFinish}
            >
              <div className="flex flex-col items-center mb-4">
                <img
                  src={previewImg || fallbackImage}
                  alt="Preview"
                  className="w-28 h-28 rounded-full object-cover shadow-md mb-3"
                />
                <Upload
                  beforeUpload={beforeUpload}
                  showUploadList={false}
                  accept="image/*"
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />}>Cambiar imagen</Button>
                </Upload>
              </div>

              <Form.Item
                label="Nombre"
                name="nombre"
                rules={[{ required: true, message: 'Por favor ingresa tu nombre' }]}
              >
                <Input prefix={<UserOutlined />} />
              </Form.Item>

              <Form.Item
                label="Apellidos"
                name="apellidos"
                rules={[{ required: true, message: 'Por favor ingresa tus apellidos' }]}
              >
                <Input prefix={<UserOutlined />} />
              </Form.Item>

              <Form.Item
                label="Género"
                name="genero"
                rules={[{ required: true, message: 'Por favor selecciona tu género' }]}
              >
                <Select placeholder="Selecciona tu género">
                  <Select.Option value="Masculino">Masculino</Select.Option>
                  <Select.Option value="Femenino">Femenino</Select.Option>
                  <Select.Option value="Otro">Otro</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Teléfono"
                name="telefono"
                rules={[{ required: true, message: 'Por favor ingresa tu teléfono' }]}
              >
                <Input prefix={<PhoneOutlined />} />
              </Form.Item>

              <Form.Item
                label="CURP"
                name="curp"
                rules={[{ required: true, message: 'Por favor ingresa tu CURP' }]}
              >
                <Input prefix={<IdcardOutlined />} />
              </Form.Item>

              <Form.Item
                label="Domicilio"
                name="domicilio"
                rules={[{ required: true, message: 'Por favor ingresa tu domicilio' }]}
              >
                <Input prefix={<HomeOutlined />} />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                className="w-full bg-[#1B396A] hover:opacity-90 mt-3"
              >
                Guardar Cambios
              </Button>
            </Form>
          </Modal>
        </>
      )}
    </div>
  );
};

export default Perfil;