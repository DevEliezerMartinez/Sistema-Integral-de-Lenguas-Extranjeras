import {
  Breadcrumb,
  Button,
  Form,
  Input,
  Modal,
  Select,
  notification,
  DatePicker,
  Spin,
} from "antd";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function CursoActivo() {
  const [hasModules, setHasModules] = useState(false);
  const [courses, setCourses] = useState([]); // Estado para almacenar los cursos activos
  const [teachers, setTeachers] = useState([]); // Estado para almacenar los docentes
  const { RangePicker } = DatePicker;
  const [loading, setLoading] = useState(true);

  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type) => {
    api[type]({
      message: "Módulo publicado",
      description: "Se avisará a los alumnos de un nuevo módulo.",
    });
  };

  const [open, setOpen] = useState(false);
  const showModal = () => {
    setOpen(true);
  };
  const handleCancel = () => {
    setOpen(false);
  };

  const [form] = Form.useForm();
  const [selectedCarrera, setSelectedCarrera] = useState("");

  const handleChange = (value) => {
    setSelectedCarrera(value);
  };

  useEffect(() => {
    // Obtener cursos activos
    axios
      .get("http://127.0.0.1:8000/api/cursos_activos", {
        headers: {
          Authorization:
            "Bearer 1|AFPPXEHDEUyWz1mnsszBCzo3QrKWNc18dAPfae4L2d901636",
          Accept: "*/*",
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const cursos = response.data.cursos;
        if (cursos.length > 0) {
          setCourses(cursos); // Guardar los cursos activos
          setHasModules(true); // Indicar que hay cursos activos
        } else {
          setHasModules(false); // No hay cursos activos
        }
        setLoading(false); // Datos cargados
      })
      .catch((error) => {
        console.error("Error fetching cursos activos:", error);
        setHasModules(false);
        setLoading(false); // Datos cargados (con error)
      });

    // Obtener docentes
    axios
      .get("http://127.0.0.1:8000/api/docentes", {
        headers: {
          Authorization:
            "Bearer 1|AFPPXEHDEUyWz1mnsszBCzo3QrKWNc18dAPfae4L2d901636",
          Accept: "*/*",
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response.data.docentes);
        setTeachers(response.data.docentes); // Guardar los docentes
        setLoading(false); // Datos cargados
      })
      .catch((error) => {
        console.error("Error fetching docentes:", error);
        setLoading(false); // Datos cargados (con error)
      });
  }, []);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        console.log("Form values:", values); // Imprime los valores del formulario

        // Preparar los datos para enviar
        const requestData = {
          nombre_modulo: values.nombre,
          descripcion: values.descripcion || "", // Valor por defecto
          modalidad: values.modalidad || "", // Valor por defecto
          nivel: values.nivel || 0, // Valor por defecto
          estado: values.estado || 1, // Valor por defecto
          horarios: values.horarios || "", // Valor por defecto
          periodo: {
            inicio: values.periodo[0].format("YYYY-MM-DD"), // Formato de fecha
            fin: values.periodo[1].format("YYYY-MM-DD"), // Formato de fecha
          },
          docente: values.docente,
          coordinador: 1, // Valor por defecto (coordinador debe ser un ID válido)
        };

        // Enviar los datos del formulario al servidor
        axios
          .post("http://127.0.0.1:8000/api/crear_curso", requestData, {
            headers: {
              Authorization:
                "Bearer 1|AFPPXEHDEUyWz1mnsszBCzo3QrKWNc18dAPfae4L2d901636",
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          })
          .then((response) => {
            console.log("Curso creado:", response.data);
            setOpen(false);
            form.resetFields();
            openNotificationWithIcon("success");

            // Recargar la lista de cursos activos
            axios
              .get("http://127.0.0.1:8000/api/cursos_activos", {
                headers: {
                  Authorization:
                    "Bearer 1|AFPPXEHDEUyWz1mnsszBCzo3QrKWNc18dAPfae4L2d901636",
                  Accept: "*/*",
                  "Content-Type": "application/json",
                },
              })
              .then((response) => {
                const cursos = response.data.cursos;
                if (cursos.length > 0) {
                  setCourses(cursos); // Guardar los cursos activos
                  setHasModules(true); // Indicar que hay cursos activos
                } else {
                  setHasModules(false); // No hay cursos activos
                }
              })
              .catch((error) => {
                console.error("Error fetching cursos activos:", error);
                setHasModules(false);
              });
          })
          .catch((error) => {
            console.error("Error creando curso:", error);
          });
      })
      .catch((info) => {
        console.log("Validation Failed:", info);
      });
  };

  return (
    <div className="flex flex-col px-4">
      <Breadcrumb
        items={[
          {
            title: <p className="font-medium text-black">Coordinador</p>,
          },
          {
            title: <a href="">Mis cursos activos</a>,
          },
        ]}
      />
      {contextHolder}

      <Button
        className="md:self-end md:mr-10 my-4 max-w-7xl"
        type="primary"
        onClick={showModal}
      >
        Registrar un nuevo curso
      </Button>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Spin size="large" />
        </div>
      ) : (
        <div
          id="Contenedor de CARDS"
          className="flex gap-3 justify-center mt-5 flex-wrap"
        >
          {hasModules ? (
            courses.map((course) => (
              <div
                key={course.id}
                id="Card"
                className="border rounded bg-slate-100 w-3/5 flex flex-col px-8 py-4 items-center text-center md:w-1/5 md:gap-5"
              >
                <img alt="libro" src="/Opt/SVG/book.svg" className="w-24" />
                <h4 className="Montserrat  my-2 font-medium">
                  {course.nombre}
                </h4>
                <p>{course.descripción}</p>
                <Button type="primary" className="bg-green-500 my-4">
                  <Link to={`/Coordinador/Cursos/${course.id}`}>Detalles</Link>
                </Button>
              </div>
            ))
          ) : (
            <div
              id="Card"
              className="border rounded bg-slate-100 w-3/5 flex flex-col px-8 py-4 items-center text-center"
            >
              <img alt="libro" src="/Opt/SVG/sad.svg" className="w-24" />
              <p className="Montserrat font-normal">Sin cursos Activos</p>
            </div>
          )}
        </div>
      )}

      <Modal
        open={open}
        title="Registro de información del módulo"
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
            label="Nombre del módulo"
            name="nombre"
            rules={[
              {
                required: true,
                message: "Por favor ingresa el nombre del módulo.",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Descripción" name="descripcion">
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            label="Periodo"
            name="periodo"
            rules={[
              {
                required: true,
                message: "Por favor selecciona el periodo.",
              },
            ]}
          >
            <RangePicker />
          </Form.Item>

          <Form.Item
            label="Modalidad"
            name="modalidad"
            rules={[
              {
                required: true,
                message: "Por favor selecciona la modalidad.",
              },
            ]}
          >
            <Select>
              <Select.Option value="Escolar">Escolar</Select.Option>
              <Select.Option value="Fines">Fines de semana</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Horarios"
            name="horarios"
            rules={[
              {
                required: true,
                message: "Por favor selecciona los horarios.",
              },
            ]}
          >
            <Select>
              <Select.Option value="1">7:00 - 12:00</Select.Option>
              <Select.Option value="2">3:00 - 6:00</Select.Option>
              <Select.Option value="3">12:00 - 2:00</Select.Option>
            </Select>
          </Form.Item>


          <Form.Item
            label="Nivel"
            name="nivel"
            rules={[
              {
                required: true,
                message: "Por favor selecciona el nivel del curso.",
              },
            ]}
          >
            <Select>
              <Select.Option value="1">Nivel 1</Select.Option>
              <Select.Option value="2">Nivel 2</Select.Option>
              <Select.Option value="3">Nivel 3</Select.Option>
              <Select.Option value="4">Nivel 4</Select.Option>
              <Select.Option value="5">Nivel 5</Select.Option>
            </Select>
          </Form.Item>


          <Form.Item
            label="Docente"
            name="docente"
            rules={[
              {
                required: true,
                message: "Por favor selecciona el docente.",
              },
            ]}
          >
            <Select
              placeholder="Selecciona un docente"
              onChange={(value) => {
                form.setFieldsValue({ docente: value });
              }}
            >
              {teachers.map((teacher) => (
                <Select.Option
                  key={teacher.docente_id}
                  value={teacher.docente_id}
                >
                  {teacher.nombre} {teacher.apellidos}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default CursoActivo;
