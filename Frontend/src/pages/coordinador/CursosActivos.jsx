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
  Divider,
} from "antd";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  AppstoreOutlined,
  BarsOutlined,
  SearchOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import locale from "antd/locale/es_ES";
import dayjs from "dayjs";
import "dayjs/locale/es";
import updateLocale from "dayjs/plugin/updateLocale";
import client from "../../axios.js";

dayjs.extend(updateLocale);
dayjs.locale("es");

// Card para CUADRÍCULA
const CardGrid = ({ course }) => (
  <div className="border rounded-xl bg-white w-full md:w-full p-5 flex flex-col items-center shadow-sm hover:shadow-md transition">
    <img alt="libro" src="/Opt/SVG/book.svg" className="w-20 opacity-90" />
    <Divider />
    <p className="font-semibold text-gray-800">{course.nombre}</p>

    {course.descripción && (
      <p className="text-sm text-gray-600 text-center mt-1">
        {course.descripción}
      </p>
    )}

    <Link to={`/Coordinador/Cursos/${course.id}`}>
      <Button type="primary" className="bg-[#1B396A] mt-4 hover:bg-[#244b8a]">
        Detalles
      </Button>
    </Link>
  </div>
);

// Card para LISTA
const CardList = ({ course }) => (
  <div className="w-full bg-white border rounded-xl shadow-sm hover:shadow-md transition p-4 flex items-center justify-between">
    <div className="flex gap-4 items-center">
      <img alt="libro" src="/Opt/SVG/book.svg" className="w-14 opacity-80" />
      <div>
        <p className="font-semibold text-gray-800 text-lg">{course.nombre}</p>
        {course.descripción && (
          <p className="text-sm text-gray-600">{course.descripción}</p>
        )}
      </div>
    </div>

    <Link to={`/Coordinador/Cursos/${course.id}`}>
      <Button type="primary" className="bg-[#1B396A] hover:bg-[#244b8a]">
        Ver más
      </Button>
    </Link>
  </div>
);

function CursoActivo() {
  const [hasModules, setHasModules] = useState(false);
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [horarios, setHorarios] = useState([
    { value: "1", label: "7:00 - 12:00" },
    { value: "2", label: "3:00 - 6:00" },
    { value: "3", label: "12:00 - 2:00" },
  ]);
  const [nuevoHorario, setNuevoHorario] = useState("");
  const [modalidades, setModalidades] = useState([
    { value: "Escolar", label: "Escolar" },
    { value: "Fines", label: "Fines de semana" },
  ]);
  const [nuevaModalidad, setNuevaModalidad] = useState("");
  const { RangePicker } = DatePicker;
  const [loading, setLoading] = useState(true);
  const [isGridView, setIsGridView] = useState(true);
  const [searchValue, setSearchValue] = useState("");

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

  useEffect(() => {
    // Obtener cursos activos
    client
      .get("/api/cursos_activos")
      .then((response) => {
        const cursos = response.data.cursos;

        if (cursos && cursos.length > 0) {
          setCourses(cursos);
          setFilteredCourses(cursos);
          setHasModules(true);
        } else {
          setHasModules(false);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching cursos activos:", error);
        setHasModules(false);
        setLoading(false);
      });

    // Obtener docentes
    client
      .get("/api/docentes")
      .then((response) => {
        setTeachers(response.data.docentes);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching docentes:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const filtered = courses.filter((course) =>
      course.nombre.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredCourses(filtered);
  }, [searchValue, courses]);

  const agregarHorario = (e) => {
    e.preventDefault();
    if (nuevoHorario && nuevoHorario.trim() !== "") {
      const nuevoValor = `custom_${Date.now()}`;
      setHorarios([...horarios, { value: nuevoValor, label: nuevoHorario }]);
      setNuevoHorario("");
    }
  };

  const agregarModalidad = (e) => {
    e.preventDefault();
    if (nuevaModalidad && nuevaModalidad.trim() !== "") {
      const nuevoValor = nuevaModalidad;
      setModalidades([
        ...modalidades,
        { value: nuevoValor, label: nuevaModalidad },
      ]);
      setNuevaModalidad("");
    }
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const requestData = {
          nombre_modulo: values.nombre,
          descripcion: values.descripcion || "",
          modalidad: values.modalidad || "",
          nivel: values.nivel || 0,
          estado: values.estado || 1,
          horarios: values.horarios || "",
          periodo: {
            inicio: values.periodo[0].format("YYYY-MM-DD"),
            fin: values.periodo[1].format("YYYY-MM-DD"),
          },
          docente: values.docente,
          coordinador: 1,
        };

        client
          .post("/api/crear_curso", requestData)
          .then((response) => {
            console.log("Curso creado:", response.data);
            setOpen(false);
            form.resetFields();
            openNotificationWithIcon("success");

            // Recargar la lista de cursos activos
            client
              .get("/api/cursos_activos")
              .then((response) => {
                const cursos = response.data.cursos;
                if (cursos.length > 0) {
                  setCourses(cursos);
                  setFilteredCourses(cursos);
                  setHasModules(true);
                } else {
                  setHasModules(false);
                }
              })
              .catch((error) => {
                console.error("Error fetching cursos activos:", error);
                setHasModules(false);
                setLoading(false);
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
    <div className="min-h-[50vh] mb-52">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { title: <p className="font-medium text-black">Coordinador</p> },
          { title: <span className="text-[#1B396A]">Mis cursos activos</span> },
        ]}
      />

      {contextHolder}

      <h2 className="font-semibold text-3xl text-center mt-6 text-[#1B396A]">
        Cursos activos
      </h2>

      <p className="text-gray-600 text-center">
        Gestiona los cursos habilitados actualmente.
      </p>

      {/* Botón de registro */}
      <div className="flex justify-center md:justify-end mt-6">
        <Button
          type="primary"
          onClick={showModal}
          className="bg-[#1B396A] hover:bg-[#244b8a]"
        >
          Registrar un nuevo curso
        </Button>
      </div>

      {/* Controles superiores */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6">
        {/* Buscador */}
        <Input
          prefix={<SearchOutlined />}
          placeholder="Buscar curso..."
          className="w-full md:w-80"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          allowClear
        />

        {/* Switch de vista */}
        <div className="flex items-center gap-3">
          <span>Lista</span>

          <Switch
            checked={isGridView}
            onChange={(checked) => setIsGridView(checked)}
            checkedChildren={<AppstoreOutlined />}
            unCheckedChildren={<BarsOutlined />}
            style={{
              backgroundColor: isGridView ? "#1B396A" : "#d9d9d9",
            }}
          />

          <span>Cuadrícula</span>
        </div>
      </div>

      {/* Contenidos */}
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <Spin size="large" />
        </div>
      ) : (
        <div className="mt-8 pb-20">
          {/* Vista cuadrícula */}
          {isGridView ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {hasModules ? (
                filteredCourses.length > 0 ? (
                  filteredCourses.map((course) => (
                    <CardGrid course={course} key={course.id} />
                  ))
                ) : (
                  <p className="text-center col-span-full text-gray-500">
                    No se encontraron cursos.
                  </p>
                )
              ) : (
                <div className="border rounded-xl bg-white p-6 flex flex-col items-center shadow-sm">
                  <img src="/Opt/SVG/sad.svg" className="w-20 opacity-80" />
                  <p className="font-medium mt-3">Sin cursos activos</p>
                </div>
              )}
            </div>
          ) : (
            /* Vista lista */
            <div className="flex flex-col gap-4">
              {hasModules ? (
                filteredCourses.length > 0 ? (
                  filteredCourses.map((course) => (
                    <CardList course={course} key={course.id} />
                  ))
                ) : (
                  <p className="text-center text-gray-500">
                    No se encontraron cursos.
                  </p>
                )
              ) : (
                <div className="border rounded-xl bg-white p-6 flex flex-col items-center shadow-sm">
                  <img src="/Opt/SVG/sad.svg" className="w-20 opacity-80" />
                  <p className="font-medium mt-3">Sin cursos activos</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Modal */}
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
            <RangePicker
              locale={locale}
              format="DD/MM/YYYY"
              placeholder={["Fecha de inicio", "Fecha de fin"]}
              style={{ width: "100%" }}
            />
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
            <Select
              placeholder="Selecciona una modalidad"
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <Divider style={{ margin: "8px 0" }} />
                  <div style={{ padding: "8px", display: "flex", gap: "8px" }}>
                    <Input
                      placeholder="Ej: Sabatino"
                      value={nuevaModalidad}
                      onChange={(e) => setNuevaModalidad(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          agregarModalidad(e);
                        }
                      }}
                    />
                    <Button
                      type="text"
                      icon={<PlusOutlined />}
                      onClick={agregarModalidad}
                    >
                      Agregar
                    </Button>
                  </div>
                </>
              )}
            >
              {modalidades.map((modalidad) => (
                <Select.Option key={modalidad.value} value={modalidad.value}>
                  {modalidad.label}
                </Select.Option>
              ))}
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
            <Select
              placeholder="Selecciona un horario"
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <Divider style={{ margin: "8px 0" }} />
                  <div style={{ padding: "8px", display: "flex", gap: "8px" }}>
                    <Input
                      placeholder="Ej: 9:00 - 11:00"
                      value={nuevoHorario}
                      onChange={(e) => setNuevoHorario(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          agregarHorario(e);
                        }
                      }}
                    />
                    <Button
                      type="text"
                      icon={<PlusOutlined />}
                      onClick={agregarHorario}
                    >
                      Agregar
                    </Button>
                  </div>
                </>
              )}
            >
              {horarios.map((horario) => (
                <Select.Option key={horario.value} value={horario.value}>
                  {horario.label}
                </Select.Option>
              ))}
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
