import { Button, Form, Input, Modal, Select, notification } from "antd";
import React, { useState } from "react";
import { Link } from "react-router-dom";

function CursoActivo() {
  const [hasModules, setHasModules] = useState(true);

  //notificaciones
  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type) => {
    api[type]({
      message: "Modulo publicado",
      description: "Se avisara a los alumnos de un nuevo modulo:)",
    });
  };

  //modal
  const [open, setOpen] = useState(false);
  const showModal = () => {
    setOpen(true);
  };
  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        console.log("Form values:", values); // Imprime los valores del formulario
        setOpen(false);
        form.resetFields(); // Resetea los campos del formulario
        openNotificationWithIcon("success");
        setHasModules(true);
      })
      .catch((info) => {
        console.log("Validation Failed:", info);
      });
  };
  const handleCancel = () => {
    setOpen(false);
  };

  //form
  const [form] = Form.useForm();

  //select
  const [selectedCarrera, setSelectedCarrera] = useState("");

  const handleChange = (value) => {
    setSelectedCarrera(value);
  };
  return (
    <div className="mt-9 flex flex-col p-5">
      {contextHolder}

      <h2 className="Montserrat font-semibold text-2xl text-center">
        Cursos activos coordinador
      </h2>

      <Button
        className="md:self-end md:mr-10 my-4 max-w-7xl"
        type="primary"
        onClick={showModal}
      >
        Registrar un nuevo curso
      </Button>

      <div
        id="Contenedor de CARDS"
        className="flex gap-3 justify-center mt-5 flex-wrap"
      >
        {hasModules ? (
          <div
            id="Card"
            className="border rounded bg-slate-100 w-3/5 flex flex-col px-8 py-4 items-center text-center md:w-1/5 md:gap-5"
          >
            <img alt="libro" src="/Opt/SVG/book.svg" className="w-24" />
            <p className="Montserrat font-normal">Modulo Ingles remedial</p>
            <Button type="primary" className="bg-green-500">
              <Link to="/Coordinador/Cursos/55">Detalles</Link>
            </Button>
          </div>
        ) : (
          <div
            id="Card"
            className="border rounded bg-slate-100 w-3/5 flex flex-col px-8 py-4 items-center text-center "
          >
            <img alt="libro" src="/Opt/SVG/sad.svg" className="w-24" />
            <p className="Montserrat font-normal">Sin cursos Activos</p>
          </div>
        )}
      </div>

      <Modal
        open={open}
        title="Registro de informacion del modulo"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancelar
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Guardar
          </Button>,
        ]}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label="Nombre del modulo"
            name="fieldA"
            rules={[
              { required: true, message: "Por favor ingresa el Campo A." },
            ]}
          >
            <Input placeholder="Texto de entrada" />
          </Form.Item>
          <Form.Item
            label="Período"
            name="fieldB"
            rules={[
              { required: true, message: "Por favor ingresa el Campo B." },
            ]}
          >
            <Input placeholder="Texto de entrada" />
          </Form.Item>

          <div className=" flex justify-between">
            <Form.Item label="Requiere" style={{ width: 200 }}>
              <Select onChange={handleChange}>
                <Select.Option value="0">Sin Nivel</Select.Option>
                <Select.Option value="1">Nivel II</Select.Option>
                <Select.Option value="2">Nivel III</Select.Option>
                <Select.Option value="3">Nivel IV</Select.Option>
                <Select.Option value="4">Nivel V</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="Modalidad" style={{ width: 200 }}>
              <Select  onChange={handleChange}>
                <Select.Option value="Escolar">Escolar</Select.Option>
                <Select.Option value="Fines">Fines de semana</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            label="Docente"
            name="docente"
            rules={[
              {
                required: true,
                message: "Por favor ingresa el nombre del docente.",
              },
            ]}
          >
            <Input placeholder="Hermenegildo" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default CursoActivo;
