import React, { useState, useEffect } from "react";
import {
  Breadcrumb,
  Button,
  Form,
  Input,
  Select,
  Modal,
  message,
  Spin,
  Upload,
} from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  HomeOutlined,
  IdcardOutlined,
  UploadOutlined,
  MailOutlined,
} from "@ant-design/icons";

const fallbackImage =
  "https://images.pexels.com/photos/4009599/pexels-photo-4009599.jpeg?auto=compress&cs=tinysrgb&w=600";

const PerfilDocente = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [fileImage, setFileImage] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);

  // 🔹 Cargar datos del usuario
  useEffect(() => {
    const user = localStorage.getItem("usuario");
    const token = localStorage.getItem("token");

    if (!user || !token) return setLoading(false);

    const userParse = JSON.parse(user);
    const userid = userParse.id;

    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/infoUser/${userid}`,
          {
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
        } else {
          message.error(data.message || "Error al cargar la información.");
        }
      } catch {
        message.error("Ocurrió un error al cargar la información.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // 🔹 Antes de subir imagen
  const beforeUpload = (file) => {
    setFileImage(file);
    setPreviewImg(URL.createObjectURL(file));
    return false;
  };

  // 🔹 Actualizar perfil
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
    for (let key in values) formData.append(key, values[key]);
    if (fileImage) formData.append("foto", fileImage);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/updateUser/${userid}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        message.success("Información actualizada correctamente.");
        setFormValues(data.user);
        setPreviewImg(data.user.foto);
        localStorage.setItem("usuario", JSON.stringify(data.user));
      } else {
        message.error(data.message || "Error al actualizar la información.");
      }
    } catch {
      message.error("Ocurrió un error al actualizar la información.");
    }

    setIsModalVisible(false);
  };

  return (
    <div className="px-4 min-h-[60vh]">
      {/* 🔹 Breadcrumb SIEMPRE visible */}
      <Breadcrumb
        items={[
          { title: <p className="font-medium text-black">Docente</p> },
          { title: <span className="text-[#1B396A]">Perfil</span> },
        ]}
      />

      {/* 🔹 Si está cargando, muestra el loader sin quitar layout */}
      {loading ? (
        <div className="flex justify-center items-center h-[60vh]">
          <Spin size="large" />
        </div>
      ) : (
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
          {/* Panel lateral */}
          <div className="bg-slate-100 rounded-xl shadow-md p-6 flex flex-col items-center">
            <img
              src={previewImg || fallbackImage}
              alt="Foto de perfil"
              className="w-40 h-40 rounded-full object-cover shadow-md mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-800 text-center Montserrat">
              {formValues.nombre} {formValues.apellidos}
            </h3>
            <p className="text-gray-500 text-sm mb-4 flex items-center gap-2 justify-center">
              <MailOutlined /> {formValues.correo}
            </p>

            <Button
              type="primary"
              className="w-full bg-[#1B396A] hover:opacity-90"
              onClick={() => setIsModalVisible(true)}
            >
              Editar Perfil
            </Button>
          </div>

          {/* Contenido principal */}
          <div className="lg:col-span-2 bg-slate-100 rounded-xl shadow-md p-8">
            <h3 className="text-2xl font-semibold text-[#1B396A] mb-6 Montserrat">
              Información del Docente
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 Montserrat">
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
                <p className="text-gray-800 font-medium">{formValues.genero}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🔹 Modal: editar perfil */}
      <Modal
        title={<p className="text-xl font-semibold text-[#1B396A]">Editar Perfil</p>}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        centered
      >
        <Form
          layout="vertical"
          initialValues={formValues}
          onFinish={onFinish}
          className="Montserrat"
        >
          {/* Avatar editable */}
          <div className="flex flex-col items-center mb-4">
            <img
              src={previewImg || fallbackImage}
              alt="Preview"
              className="w-28 h-28 rounded-full object-cover shadow-md mb-3"
            />
            <Upload beforeUpload={beforeUpload} showUploadList={false} accept="image/*">
              <Button icon={<UploadOutlined />}>Cambiar imagen</Button>
            </Upload>
          </div>

          <Form.Item label="Nombre" name="nombre" rules={[{ required: true }]}>
            <Input prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item label="Apellidos" name="apellidos" rules={[{ required: true }]}>
            <Input prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item label="Género" name="genero" rules={[{ required: true }]}>
            <Select placeholder="Selecciona tu género">
              <Select.Option value="Masculino">Masculino</Select.Option>
              <Select.Option value="Femenino">Femenino</Select.Option>
              <Select.Option value="Otro">Otro</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Teléfono" name="telefono" rules={[{ required: true }]}>
            <Input prefix={<PhoneOutlined />} />
          </Form.Item>

          <Form.Item label="CURP" name="curp" rules={[{ required: true }]}>
            <Input prefix={<IdcardOutlined />} />
          </Form.Item>

          <Form.Item label="Domicilio" name="domicilio" rules={[{ required: true }]}>
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
    </div>
  );
};

export default PerfilDocente;
