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
  Switch,
} from "antd";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

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

  const handleSwitchChange = (courseId, checked) => {
    // Actualizamos el estado de `editable` localmente
    setCourses((prevCourses) =>
      prevCourses.map((course) =>
        course.id === courseId ? { ...course, editable: !checked } : course
      )
    );

    // Realizamos la petición al endpoint
    fetch(`${import.meta.env.VITE_API_URL}/api/desactivar`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        curso_id: courseId, // Asegúrate de usar 'curso_id' para que coincida con la ruta del API
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          // Mostrar notificación de éxito
          notification.success({
            message: "Operación exitosa",
            description: data.message,
          });
        } else if (data.error) {
          // Mostrar notificación de error
          notification.error({
            message: "Error al desactivar",
            description: data.error,
          });
        }
      })
      .catch((error) => {
        console.error("Error en la solicitud:", error);
        notification.error({
          message: "Error en la solicitud",
          description:
            "Hubo un problema al realizar la solicitud. Intenta de nuevo.",
        });
      });
  };

  useEffect(() => {
    // Obtener cursos activos
    fetch(`${import.meta.env.VITE_API_URL}/api/cursos_activos`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
        Accept: "*/*",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error en la respuesta de la API");
        }
        return response.json(); // Convierte la respuesta a JSON
      })
      .then((data) => {
        const cursos = data.cursos; // Asegúrate de acceder a los datos correctamente

        if (cursos && cursos.length > 0) {
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
    fetch(`${import.meta.env.VITE_API_URL}/api/docentes`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        Accept: "*/*",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error en la respuesta de la API");
        }
        return response.json(); // Convierte la respuesta a JSON
      })
      .then((data) => {
        console.log("Datos de docentes:", data.docentes); // Ahora accedes a data.docentes
        setTeachers(data.docentes); // Guardar los docentes
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

        // Preparar el string de horarios en el formato "hora_inicio - hora_final"
        const horarios = `${values.hora_inicio} - ${values.hora_fin}`;

        // Preparar los datos para enviar
        const requestData = {
          nombre_modulo: values.nombre,
          descripcion: values.descripcion || "", // Valor por defecto
          modalidad: values.modalidad || "", // Valor por defecto
          nivel: values.nivel || 0, // Valor por defecto
          estado: values.estado || 1, // Valor por defecto
          horarios: horarios, // Horarios en formato "hora_inicio - hora_final"
          periodo: {
            inicio: values.periodo[0].format("YYYY-MM-DD"), // Formato de fecha
            fin: values.periodo[1].format("YYYY-MM-DD"), // Formato de fecha
          },
          docente: values.docente,
          coordinador: 1, // Valor por defecto (coordinador debe ser un ID válido)
        };

        // Enviar los datos del formulario al servidor
        fetch(`${import.meta.env.VITE_API_URL}/api/crear_curso`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        })
          .then((response) => response.json()) // Asegúrate de convertir la respuesta en JSON
          .then((data) => {
            console.log("Curso creado:", data);
            setOpen(false);
            form.resetFields();
            openNotificationWithIcon("success");

            // Recargar la lista de cursos activos
            fetch(`${import.meta.env.VITE_API_URL}/api/cursos_activos`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                Accept: "*/*",
                "Content-Type": "application/json",
              },
            })
              .then((response) => response.json())
              .then((data) => {
                const cursos = data.cursos;
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
                <img alt="libro" src="/Opt//SVG/book.svg" className="w-24" />
                <h4 className="Montserrat  my-2 font-medium">
                  {course.nombre}
                </h4>
                <p>{course.descripción}</p>

                <div className="flex justify-between items-center w-full my-2">
                  <span>Deshabilitar calif.</span>
                  <Switch
                    checked={course.editable === false} // Si editable es false, el switch estará activado
                    onChange={(checked) =>
                      handleSwitchChange(course.id, checked)
                    }
                  />
                </div>

                <Link to={`/Coordinador/Cursos/${course.id}`}>
                  <Button type="primary" className="bg-green-500 my-4">
                    Detalles
                  </Button>
                </Link>
              </div>
            ))
          ) : (
            <div
              id="Card"
              className="border rounded bg-slate-100 w-3/5 flex flex-col px-8 py-4 items-center text-center"
            >
              <img alt="libro" src="/Opt//SVG/sad.svg" className="w-24" />
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
              <Select.Option value="Presencial">Presencial</Select.Option>
              <Select.Option value="Virtual">Virtual</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Hora de inicio"
            name="hora_inicio"
            rules={[
              {
                required: true,
                message: "Por favor selecciona la hora de inicio.",
              },
            ]}
          >
            <Select>
              <Select.Option value="7:00">7:00</Select.Option>
              <Select.Option value="8:00">8:00</Select.Option>
              <Select.Option value="9:00">9:00</Select.Option>
              <Select.Option value="10:00">10:00</Select.Option>
              <Select.Option value="11:00">11:00</Select.Option>
              <Select.Option value="12:00">12:00</Select.Option>
              <Select.Option value="13:00">13:00</Select.Option>
              <Select.Option value="14:00">14:00</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Hora de fin"
            name="hora_fin"
            rules={[
              {
                required: true,
                message: "Por favor selecciona la hora de fin.",
              },
            ]}
          >
            <Select>
              <Select.Option value="8:00">8:00</Select.Option>
              <Select.Option value="9:00">9:00</Select.Option>
              <Select.Option value="10:00">10:00</Select.Option>
              <Select.Option value="11:00">11:00</Select.Option>
              <Select.Option value="12:00">12:00</Select.Option>
              <Select.Option value="13:00">13:00</Select.Option>
              <Select.Option value="14:00">14:00</Select.Option>
              <Select.Option value="15:00">15:00</Select.Option>
              <Select.Option value="16:00">16:00</Select.Option>
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
