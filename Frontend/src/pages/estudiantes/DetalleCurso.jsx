import { Breadcrumb, Button, Divider, Popconfirm, message, Upload } from "antd";
import Dragger from "antd/es/upload/Dragger";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { InboxOutlined, DeleteOutlined, ReloadOutlined } from "@ant-design/icons";
import { useAuth } from "../../AuthContext";

function DetalleCurso() {
  const { cursoId } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [curso, setCurso] = useState(null);
  const [docente, setDocente] = useState(null);
  const [error, setError] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [alumnoId, setAlumnoId] = useState(null);
  const [detalles, setDetalles] = useState("");
  const [prioridad, setPrioridad] = useState("");
  const [status] = useState("pending");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // === Formateo de fecha legible ===
  const formatFecha = (fecha) => {
    if (!fecha) return "";
    const d = new Date(fecha);
    return d.toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // === Cargar datos ===
  useEffect(() => {
    const estudiante = JSON.parse(localStorage.getItem("estudiante"));
    const id_estudiante = estudiante ? estudiante.id : null;
    setAlumnoId(id_estudiante);

    const fetchData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/cursos/${cursoId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "*/*",
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();
        const { curso } = data;

        setCurso(curso);
        setDocente(curso.docente);
        setDetalles(curso.descripcion);
        setPrioridad(curso.nivel);
      } catch (err) {
        setError(err.message || "Error al cargar los datos.");
        message.error("Error al cargar los datos del curso");
      }
    };

    fetchData();
  }, [cursoId, token]);

  // === Gestión del archivo ===
  const beforeUpload = (file) => {
    const isPDF = file.type === "application/pdf";
    if (!isPDF) {
      message.error("Solo se permiten archivos PDF");
      return Upload.LIST_IGNORE; // Rechaza el archivo completamente
    }

    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error("El archivo debe ser menor a 5MB");
      return Upload.LIST_IGNORE; // Rechaza el archivo completamente
    }

    // Limpiar URL anterior si existe
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
    }

    setPdfFile(file);
    setPdfUrl(URL.createObjectURL(file));
    message.success("Archivo cargado correctamente");
    return false; // Previene subida automática pero acepta el archivo
  };

  const handleFileChange = (info) => {
    // Solo procesamos si el archivo pasó las validaciones
    const { file } = info;
    
    if (file.status === "error") {
      message.error("Error al cargar el archivo");
      handleRemoveFile();
    }
  };

  const handleRemoveFile = () => {
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
    }
    setPdfFile(null);
    setPdfUrl(null);
    message.info("Archivo eliminado");
  };

  const clearFileWithoutMessage = () => {
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
    }
    setPdfFile(null);
    setPdfUrl(null);
  };

  const handleReplaceFile = () => {
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
    }
    setPdfFile(null);
    setPdfUrl(null);
    // No mostrar mensaje aquí, el Dragger mostrará el nuevo archivo
  };

  const handleSubmit = async (event) => {
    if (event) event.preventDefault();

    if (!cursoId || !alumnoId || !pdfFile || !status) {
      message.error("Por favor completa todos los campos requeridos");
      return;
    }

    // Validar tamaño del archivo nuevamente antes de enviar
    const fileSizeMB = pdfFile.size / 1024 / 1024;
    if (fileSizeMB > 5) {
      message.error("El archivo excede el tamaño máximo de 5MB");
      return;
    }

    setIsSubmitting(true);
    const hideLoading = message.loading("Enviando solicitud...", 0);

    try {
      const userid = JSON.parse(localStorage.getItem("usuario"));

      const formData = new FormData();
      formData.append("curso_id", cursoId);
      formData.append("alumno_id", alumnoId);
      formData.append("user_id", userid.id);

      const fechaInscripcion = new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

      formData.append("fecha_inscripcion", fechaInscripcion);
      formData.append("detalles", detalles);
      formData.append("prioridad", prioridad);
      formData.append("status", status);
      formData.append("file", pdfFile);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/crear_solicitud`,
        {
          method: "POST",
          body: formData,
          headers: { 
            Authorization: `Bearer ${localStorage.getItem("token")}` 
          },
        }
      );

      const data = await response.json();

      hideLoading();

      if (!response.ok) {
        // Manejar diferentes códigos de error
        if (response.status === 409) {
          message.warning({
            content: data.message || "Ya existe una solicitud pendiente o aceptada para este curso",
            duration: 5,
          });
        } else if (response.status === 422) {
          // Errores de validación
          const errores = data.errors;
          if (errores) {
            const mensajesError = Object.values(errores).flat();
            mensajesError.forEach((error) => {
              message.error(error);
            });
          } else {
            message.error(data.message || "Error de validación. Verifica los datos");
          }
        } else if (response.status === 400) {
          message.error(data.message || "Datos incorrectos. Verifica el archivo");
        } else {
          message.error(data.message || "Error al procesar la solicitud");
        }
        return;
      }

      // Éxito
      if (data.success) {
        message.success({
          content: "¡Solicitud enviada correctamente! Espera la aprobación del administrador",
          duration: 5,
        });
        
        // Limpiar el formulario SIN mostrar mensaje de "eliminado"
        clearFileWithoutMessage();
        
        // Opcional: redirigir después de un momento
        setTimeout(() => {
          navigate("/estudiantes/cursos");
        }, 2000);
      }

    } catch (error) {
      hideLoading();
      console.error("Error en la solicitud:", error);
      message.error({
        content: "Error de conexión. Verifica tu internet e intenta nuevamente",
        duration: 5,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex flex-col justify-center">

      {/* Breadcrumb SIEMPRE visible */}
      <Breadcrumb
        items={[
          { title: <p className="font-medium text-black">Estudiantes</p> },
          { title: <span className="text-[#1B396A]">Cursos</span> },
          { title: <span className="text-[#1B396A]">Detalles del curso</span> },
        ]}
      />

      <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-6xl">

        {/* SI CURSO NO HA CARGADO → SKELETON */}
        {!curso ? (
          <div className="animate-pulse space-y-6">

            <div className="flex justify-between items-center">
              <div className="h-6 w-32 bg-gray-300 rounded"></div>
              <div className="h-6 w-48 bg-gray-300 rounded"></div>
              <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
            </div>

            <Divider />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="p-4 bg-slate-50 rounded-xl space-y-4">
                <div className="h-4 w-40 bg-gray-300 rounded"></div>
                <div className="h-4 w-full bg-gray-300 rounded"></div>
                <div className="h-4 w-2/3 bg-gray-300 rounded"></div>
                <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl h-96 bg-gray-200"></div>
            </div>
          </div>
        ) : (
          <>
            {/* === ENCABEZADO === */}
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={() => navigate(-1)}
                className="text-blue-500 font-medium flex items-center gap-2 hover:text-blue-700 transition-colors"
              >
                <img alt="icon" className="w-4" src="/Opt/SVG/LighArrow.svg" />
                Volver
              </button>

              <h2 className="text-2xl font-semibold">{curso.nombre}</h2>

              <img alt="info" className="w-7" src="/Opt/SVG/info.svg" />
            </div>

            <Divider />

            {/* === LAYOUT HORIZONTAL === */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-8">

              {/* Información del curso */}
              <section className="p-4 rounded-xl bg-slate-50 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Información del curso</h3>

                <ul className="space-y-2 text-gray-700">
                  <li><strong>Descripción:</strong> {curso.descripcion}</li>
                  <li><strong>Modalidad:</strong> {curso.modalidad}</li>
                  <li><strong>Nivel:</strong> {curso.nivel}</li>
                  <li><strong>Estado:</strong> {curso.estado}</li>
                  <li><strong>Horario:</strong> {curso.horario}</li>
                  <li><strong>Fecha Inicio:</strong> {formatFecha(curso.fecha_inicio)}</li>
                  <li><strong>Fecha Fin:</strong> {formatFecha(curso.fecha_fin)}</li>
                  <li>
                    <strong>Docente:</strong>
                    {docente ? " " + docente.nombre : " No asignado"}
                  </li>
                </ul>
              </section>

              {/* PDF */}
              <section className="p-4 rounded-xl bg-slate-50 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 text-center">
                  Comprobante de pago
                </h3>

                {!pdfFile ? (
                  <Dragger
                    name="pdf"
                    multiple={false}
                    onChange={handleFileChange}
                    beforeUpload={beforeUpload}
                    accept=".pdf"
                    showUploadList={false}
                    className="hover:border-blue-400 transition-colors"
                  >
                    <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                    <p className="ant-upload-text">Selecciona o arrastra tu archivo aquí</p>
                    <p className="ant-upload-hint">Solo formato PDF (máx. 5MB)</p>
                  </Dragger>
                ) : (
                  <div className="space-y-4">
                    <div className="border-2 border-gray-300 rounded-lg overflow-hidden shadow-sm">
                      <iframe
                        src={pdfUrl}
                        className="w-full h-96"
                        title="Vista previa PDF"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-gray-700">{pdfFile.name}</p>
                          <p className="text-xs text-gray-500">
                            {(pdfFile.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        icon={<ReloadOutlined />}
                        onClick={handleReplaceFile}
                        className="flex-1"
                        type="default"
                        disabled={isSubmitting}
                      >
                        Reemplazar archivo
                      </Button>

                      <Popconfirm
                        title="¿Eliminar archivo?"
                        description="¿Estás seguro de eliminar este comprobante?"
                        onConfirm={handleRemoveFile}
                        okText="Sí"
                        cancelText="No"
                        okButtonProps={{ danger: true }}
                        disabled={isSubmitting}
                      >
                        <Button icon={<DeleteOutlined />} danger disabled={isSubmitting}>
                          Eliminar
                        </Button>
                      </Popconfirm>
                    </div>
                  </div>
                )}
              </section>
            </div>

            {/* Botón final */}
            <div className="text-center mt-10">
              <Popconfirm
                title="Confirmar solicitud"
                description="¿Deseas enviar esta solicitud de inscripción?"
                onConfirm={handleSubmit}
                okText="Sí, enviar"
                cancelText="Cancelar"
                disabled={!pdfFile || isSubmitting}
              >
                <Button
                  type="primary"
                  size="large"
                  disabled={!pdfFile || isSubmitting}
                  loading={isSubmitting}
                  style={{
                    backgroundColor: !pdfFile || isSubmitting ? undefined : "#16a34a",
                    borderColor: !pdfFile || isSubmitting ? undefined : "#16a34a",
                    height: "48px",
                    fontSize: "16px",
                    paddingLeft: "32px",
                    paddingRight: "32px",
                  }}
                >
                  {isSubmitting ? "Enviando..." : "Solicitar inscripción"}
                </Button>
              </Popconfirm>

              {!pdfFile && (
                <p className="text-sm text-gray-500 mt-2">
                  * Debes cargar un comprobante de pago para continuar
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default DetalleCurso;