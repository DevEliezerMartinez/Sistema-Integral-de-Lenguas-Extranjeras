import React, { useState, useEffect } from "react";
import {
  Breadcrumb,
  Button,
  Spin,
  Input,
  Badge,
  Collapse,
  Table,
  Space,
  Tag,
  Modal,
  message,
  Tooltip,
} from "antd";
import {
  SearchOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FileTextOutlined,
  CalendarOutlined,
  UserOutlined,
  BookOutlined,
  DownloadOutlined,
} from "@ant-design/icons";

const { Panel } = Collapse;

function Solicitudes() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [filteredSolicitudes, setFilteredSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  const fetchSolicitudes = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/solicitudes`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            Accept: "*/*",
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al obtener solicitudes");
      }

      const data = await response.json();
      if (data.success && data.solicitudes) {
        setSolicitudes(data.solicitudes);
        setFilteredSolicitudes(data.solicitudes);
      }
    } catch (error) {
      console.error("Error fetching solicitudes:", error);
      message.error("Error al cargar las solicitudes");
    } finally {
      setLoading(false);
    }
  };

  // --- CORRECCIÓN 1: Función formatDate definida ---
  // El código de formato de fecha estaba fuera de una función.
  const formatDate = (dateString) => {
    if (!dateString) return "Fecha no especificada";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // --- CORRECCIÓN 2: Función groupByCourse definida ---
  // Esta función era necesaria para agrupar las solicitudes por curso
  // para el componente Collapse.
  const groupByCourse = (solicitudes) => {
    if (!solicitudes) return [];

    const groups = solicitudes.reduce((acc, solicitud) => {
      // Usamos Nombre_Curso como la clave para agrupar
      const courseName = solicitud.Nombre_Curso || "Curso Desconocido";

      if (!acc[courseName]) {
        // Si es la primera vez que vemos este curso, creamos el grupo
        acc[courseName] = {
          curso: courseName,
          // Asumimos que estos datos vienen en cada objeto de solicitud
          docente:
            `${solicitud.Nombre_Docente || ""} ${
              solicitud.Apellidos_Docente || ""
            }`.trim() || "Docente no asignado",
          nivel: solicitud.Nivel_Curso || "N/A",
          modalidad: solicitud.Modalidad_Curso || "N/A",
          fechaInicio: solicitud.Fecha_Inicio_Curso,
          fechaFin: solicitud.Fecha_Fin_Curso,
          estudiantes: [], // Array para guardar los estudiantes de este curso
        };
      }

      // Añadimos la solicitud (estudiante) al grupo correspondiente
      acc[courseName].estudiantes.push(solicitud);
      return acc;
    }, {}); // El acumulador inicial es un objeto vacío

    // Convertimos el objeto de grupos (clave: valor) en un array de valores
    return Object.values(groups);
  };

  const handleAprobar = (idInscripcion) => {
    Modal.confirm({
      title: "¿Aprobar solicitud?",
      content: "El estudiante será notificado de su aprobación.",
      okText: "Aprobar",
      okType: "primary",
      cancelText: "Cancelar",
      onOk: async () => {
        setProcessingId(idInscripcion);

        fetch(
          `${
            import.meta.env.VITE_API_URL
          }/api/solicitudes/${idInscripcion}/aceptar`,
          {
            method: "POST",
            body: JSON.stringify({}),
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              Accept: "*/*",
              "Content-Type": "application/json",
            },
          }
        )
          .then(() => {
            message.success(
              "Solicitud aprobada correctamente. El estudiante será notificado."
            );
            fetchSolicitudes();
          })
          .catch((err) => {
            console.error("Error al aprobar solicitud:", err);
            const errorMsg =
              err.response?.data?.message ||
              "No se pudo procesar la aprobación. Inténtalo de nuevo más tarde.";
            message.error(errorMsg);
          })
          .finally(() => {
            setProcessingId(null);
          });
      },
    });
  };

  const handleRechazar = (idInscripcion) => {
    let motivoRechazo = "";

    Modal.confirm({
      title: "¿Rechazar solicitud?",
      content: (
        <div className="mt-4">
          <p className="mb-2">El estudiante será notificado del rechazo.</p>
          <p className="mb-2 font-medium">
            Por favor, indica el motivo del rechazo:
          </p>
          <Input.TextArea
            rows={4}
            placeholder="Escribe aquí el motivo del rechazo..."
            onChange={(e) => {
              motivoRechazo = e.target.value;
            }}
            className="mt-2"
          />
        </div>
      ),
      okText: "Rechazar",
      okType: "danger",
      cancelText: "Cancelar",
      onOk: async () => {
        if (!motivoRechazo.trim()) {
          message.warning("Por favor, ingresa un motivo de rechazo");
          return Promise.reject();
        }

        setProcessingId(idInscripcion);
        try {
          const response = await fetch(
            `${
              import.meta.env.VITE_API_URL
            }/api/solicitudes/${idInscripcion}/rechazar`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ motivo: motivoRechazo }),
            }
          );

          if (!response.ok) {
            throw new Error("Error al rechazar solicitud");
          }

          message.success("Solicitud rechazada correctamente");
          fetchSolicitudes(); // Recargar datos
        } catch (error) {
          console.error("Error al rechazar solicitud:", error);
          message.error("Error al rechazar la solicitud");
        } finally {
          setProcessingId(null);
        }
      },
    });
  };

  const handleVerPDF = (pdfUrl) => {
    if (!pdfUrl) {
        message.error("No se encontró el archivo PDF.");
        return;
    }
    // Extraer solo el nombre del archivo (alumno_2_curso_1_20251109.pdf)
    const fileName = pdfUrl.split("/").pop();
    const fullUrl = `${import.meta.env.VITE_API_URL}/storage/pdfs/${fileName}`;
    window.open(fullUrl, "_blank");
  };

  const handleDescargarPDF = (pdfUrl, nombreAlumno, nombreCurso) => {
    if (!pdfUrl) {
        message.error("No se encontró el archivo PDF.");
        return;
    }
    // Extraer solo el nombre del archivo
    const fileName = pdfUrl.split("/").pop();
    const fullUrl = `${import.meta.env.VITE_API_URL}/storage/pdfs/${fileName}`;

    // Crear un nombre descriptivo para la descarga
    const downloadName =
      `solicitud_${nombreAlumno}_${nombreCurso}.pdf`.replace(/\s+/g, "_");

    // Crear link temporal para descargar
    const link = document.createElement("a");
    link.href = fullUrl;
    link.download = downloadName;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.success("Descargando PDF...");
  };

  const columns = [
    {
      title: "Estudiante",
      key: "estudiante",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <UserOutlined className="text-gray-400" />
          <span className="font-medium">
            {record.Nombre_Alumno} {record.Apellidos_Alumno}
          </span>
        </div>
      ),
    },
    {
      title: "Fecha de solicitud",
      dataIndex: "Fecha_Inscripcion",
      key: "fecha",
      render: (fecha) => (
        <span className="text-gray-600">{formatDate(fecha)}</span>
      ),
    },
    {
      title: "Estado",
      dataIndex: "Estado_Solicitud",
      key: "estado",
      render: (estado) => {
        const colors = {
          Pendiente: "orange",
          Aprobada: "green",
          Rechazada: "red",
        };
        return <Tag color={colors[estado] || "default"}>{estado}</Tag>;
      },
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Ver PDF">
            <Button
              type="text"
              icon={<FileTextOutlined />}
              onClick={() => handleVerPDF(record.PDF_Solicitud)}
              className="text-blue-600 hover:text-blue-800"
            />
          </Tooltip>
          <Tooltip title="Descargar PDF">
            <Button
              type="text"
              icon={<DownloadOutlined />}
              onClick={() =>
                handleDescargarPDF(
                  record.PDF_Solicitud,
                  `${record.Nombre_Alumno}_${record.Apellidos_Alumno}`,
                  record.Nombre_Curso
                )
              }
              className="text-indigo-600 hover:text-indigo-800"
            />
          </Tooltip>
          {record.Estado_Solicitud === "Pendiente" && (
            <>
              <Tooltip title="Aprobar">
                <Button
                  type="text"
                  icon={<CheckCircleOutlined />}
                  onClick={() => handleAprobar(record.ID_Inscripcion)}
                  loading={processingId === record.ID_Inscripcion}
                  className="text-green-600 hover:text-green-800"
                />
              </Tooltip>
              <Tooltip title="Rechazar">
                <Button
                  type="text"
                  icon={<CloseCircleOutlined />}
                  onClick={() => handleRechazar(record.ID_Inscripcion)}
                  loading={processingId === record.ID_Inscripcion}
                  className="text-red-600 hover:text-red-800"
                />
              </Tooltip>
            </>
          )}
        </Space>
      ),
    },
  ];

  // Ahora estas funciones existen y esta línea funcionará
  const cursosAgrupados = groupByCourse(filteredSolicitudes);
  const totalPendientes = solicitudes.filter(
    (s) => s.Estado_Solicitud === "Pendiente"
  ).length;

  return (
    <div className="min-h-[50vh] mb-52">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { title: <p className="font-medium text-black">Coordinador</p> },
          {
            title: (
              <span className="text-[#1B396A]">Solicitudes de inscripción</span>
            ),
          },
        ]}
      />

      <div className="flex items-center justify-center gap-3 mt-6">
        <h2 className="font-semibold text-3xl text-center text-[#1B396A]">
          Solicitudes de inscripción
        </h2>
        {totalPendientes > 0 && (
          <Badge count={totalPendientes} className="mt-1" />
        )}
      </div>

      <p className="text-gray-600 text-center">
        Gestiona las solicitudes de inscripción de los estudiantes.
      </p>

      {/* Contenido */}
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <Spin tip="Cargando solicitudes..." size="large" />
        </div>
      ) : cursosAgrupados.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-12">
          <img
            src="/Opt/SVG/sad.svg"
            className="w-24 opacity-80"
            alt="Sin solicitudes"
          />
          <p className="font-medium mt-4 text-gray-600">
            No hay solicitudes disponibles
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Las solicitudes aparecerán aquí cuando los estudiantes se inscriban
          </p>
        </div>
      ) : (
        <div className="mt-8 pb-20">
          <Collapse
            accordion
            className="bg-white shadow-sm"
            expandIconPosition="end"
          >
            {cursosAgrupados.map((grupo, index) => {
              const pendientes = grupo.estudiantes.filter(
                (e) => e.Estado_Solicitud === "Pendiente"
              ).length;

              return (
                <Panel
                  key={index}
                  header={
                    <div className="flex items-start justify-between w-full pr-4">
                      <div className="flex items-start gap-3">
                        <BookOutlined className="text-[#1B396A] text-xl mt-1" />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg text-gray-800">
                              {grupo.curso}
                            </h3>
                            {pendientes > 0 && (
                              <Badge count={pendientes} className="mt-1" />
                            )}
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-gray-600">
                            <span>
                              <UserOutlined className="mr-1" />
                              {grupo.docente}
                            </span>
                            <span>Nivel {grupo.nivel}</span>
                            <Tag color="blue">{grupo.modalidad}</Tag>
                            <span>
                              <CalendarOutlined className="mr-1" />
                              {formatDate(grupo.fechaInicio)} -{" "}
                              {formatDate(grupo.fechaFin)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="text-gray-500 text-sm whitespace-nowrap ml-4">
                        {grupo.estudiantes.length}{" "}
                        {grupo.estudiantes.length === 1
                          ? "solicitud"
                          : "solicitudes"}
                      </span>
                    </div>
                  }
                  className="border-b"
                >
                  <Table
                    columns={columns}
                    dataSource={grupo.estudiantes}
                    rowKey="ID_Inscripcion"
                    pagination={false}
                    size="middle"
                    className="mt-4"
                  />
                </Panel>
              );
            })}
          </Collapse>
        </div>
      )}
    </div>
  );
}

export default Solicitudes;