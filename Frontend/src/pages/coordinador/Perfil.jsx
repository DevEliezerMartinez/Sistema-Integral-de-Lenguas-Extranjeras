import React, { useState, useEffect } from "react";
import {
  Breadcrumb,
  Button,
  Divider,
  message,
  Modal,
  Form,
  Input,
  Select,
  Spin,
  Upload,
} from "antd";
import {
  PlusOutlined,
  UserOutlined,
  PhoneOutlined,
  HomeOutlined,
  IdcardOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import TablaDocentes from "../../components/coordinador/TablaDeDocentes";

const { Option } = Select;

// Imagen de fallback del primer componente
const fallbackImage =
  "https://images.pexels.com/photos/4009599/pexels-photo-4009599.jpeg?auto=compress&cs=tinysrgb&w=600";

function Perfil() {
  // --- ESTADOS DEL SEGUNDO COMPONENTE (Gestión de Docentes) ---
  const [docentes, setDocentes] = useState([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false); // Renombrado
  const [addForm] = Form.useForm(); // Renombrado

  // --- ESTADOS DEL PRIMER COMPONENTE (Perfil del Usuario/Coordinador) ---
  const [isEditModalVisible, setIsEditModalVisible] = useState(false); // Renombrado
  const [formValues, setFormValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [fileImage, setFileImage] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);
  const [editForm] = Form.useForm(); // Renombrado

  // --- EFECTO 1: Cargar datos del Coordinador (Perfil Propio) ---
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
            editForm.setFieldsValue(data.user);
          } else {
            message.error(
              data.message || "Error al cargar la información del usuario."
            );
          }
        } catch (error) {
          message.error("Ocurrió un error al cargar la información del usuario.");
        } finally {
          setLoading(false); // Dejar de cargar solo cuando el perfil esté listo
        }
      };
      fetchUserData();
    }
  }, [editForm]);

  // --- EFECTO 2: Cargar lista de Docentes ---
  const fetchDocentes = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/docentes`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      setDocentes(data.docentes);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchDocentes();
  }, []);

  // --- FUNCIONES: Gestión de Docentes (de C2) ---
  const showAddModal = () => setIsAddModalVisible(true);
  
  const handleAddModalCancel = () => {
    setIsAddModalVisible(false);
    addForm.resetFields();
  };

  const onFinishAdd = async (values) => {
    values.tipo_usuario = "docente";
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(values),
        }
      );

      if (response.ok) {
        const data = await response.json();
        message.success(data.message);
        fetchDocentes();
        handleAddModalCancel();
      } else {
        const errorData = await response.json();
        message.error("Error en el registro: " + (errorData.errors ? errorData.errors[0] : "Datos inválidos"));
      }
    } catch (error) {
      message.error("Hubo un problema con la solicitud");
      console.error("Error registrando docente:", error);
    }
  };

  const eliminarDocente = async (docente_id) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/docentes/${docente_id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.ok) {
        message.success("Docente eliminado con éxito");
        setDocentes(
          docentes.filter((docente) => docente.docente_id !== docente_id)
        );
      } else {
        message.error("Error al eliminar el docente");
      }
    } catch (error) {
      message.error("Hubo un problema con la solicitud de eliminación");
      console.error("Error eliminando docente:", error);
    }
  };

  // --- FUNCIONES: Edición de Perfil (de C1) ---
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

  const showEditModal = () => setIsEditModalVisible(true);

  const handleEditModalCancel = () => {
    setIsEditModalVisible(false);
    editForm.setFieldsValue(formValues);
    setPreviewImg(formValues.foto || null);
    setFileImage(null);
  };

  const onFinishEdit = async (values) => {
    const user = localStorage.getItem("usuario");
    const token = localStorage.getItem("token");

    if (!(user && token)) {
      message.error("Token no encontrado, por favor inicia sesión.");
      return;
    }

    const userParse = JSON.parse(user);
    const userid = userParse.id;

    const formData = new FormData();
    formData.append("_method", "PUT");
    formData.append("nombre", values.nombre);
    formData.append("apellidos", values.apellidos);
    formData.append("genero", values.genero);
    formData.append("telefono", values.telefono);
    formData.append("curp", values.curp);
    formData.append("domicilio", values.domicilio);
    
    if (fileImage) {
      formData.append("foto", fileImage);
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/updateUser/${userid}`,
        {
          method: "POST", // Usar POST con _method=PUT para FormData
          headers: {
            Authorization: `Bearer ${token}`,
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
        setIsEditModalVisible(false);
      } else {
        message.error(data.message || "Error al actualizar la información.");
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("Ocurrió un error al actualizar la información.");
    }
  };

  return (
    <div className="px-4">
      {/* Breadcrumb (Tomado de C2, adaptado) */}
      <div className="mb-6">
        <Breadcrumb
          items={[
            { title: <p className="font-medium text-black">Coordinador</p> },
            { title: <a>Perfil</a> },
          ]}
        />
      </div>

      {/* Mostrar loader mientras carga (de C1) */}
      {loading ? (
        <div className="flex justify-center mt-20">
          <Spin size="large" />
        </div>
      ) : (
        <>
          {/* Layout general (de C1) */}
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Panel lateral (de C1, datos dinámicos) */}
            <div className="bg-slate-100 rounded-xl shadow-md p-6 flex flex-col items-center self-start">
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
                onClick={showEditModal} // Llama al modal de edición
              >
                Editar Perfil
              </Button>
            </div>

            {/* Contenido principal (de C1, fusionado con C2) */}
            <div className="lg:col-span-2 bg-slate-100 rounded-xl shadow-md p-8">
              
              {/* Sección 1: Información del Coordinador (de C1) */}
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

              <Divider />

              {/* Sección 2: Gestión de Docentes (de C2) */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="Montserrat font-medium text-2xl text-[#1B396A]">
                  Docentes registrados
                </h2>
                <Button 
                  type="primary" 
                  onClick={showAddModal} // Llama al modal de agregar
                  icon={<PlusOutlined />}
                  className="bg-[#1B396A] hover:opacity-90"
                >
                  Agregar
                </Button>
              </div>

              <TablaDocentes
                docentes={docentes}
                onDocenteEliminado={eliminarDocente}
              />
            </div>
          </div>

          {/* Modal 1: Editar Perfil (de C1) */}
          <Modal
            title={
              <p className="text-xl font-semibold text-[#1B396A]">
                Editar Perfil
              </p>
            }
            open={isEditModalVisible}
            onCancel={handleEditModalCancel}
            footer={null}
            centered
          >
            <Form
              form={editForm}
              layout="vertical"
              initialValues={formValues}
              onFinish={onFinishEdit}
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

          {/* Modal 2: Registrar Docente (de C2) */}
          <Modal
            title="Registrar Docente"
            open={isAddModalVisible} // 'visible' está obsoleto, usar 'open'
            onCancel={handleAddModalCancel}
            footer={null}
          >
            <Form form={addForm} layout="vertical" onFinish={onFinishAdd}>
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
                  <Option value="Masculino">Masculino</Option>
                  <Option value="Femenino">Femenino</Option>
                  <Option value="Otro">Otro</Option>
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
                initialValue="docente"
                hidden
              >
                <Input />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" className="bg-[#1B396A] hover:opacity-90">
                  Registrar
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </>
      )}
    </div>
  );
}

export default Perfil;