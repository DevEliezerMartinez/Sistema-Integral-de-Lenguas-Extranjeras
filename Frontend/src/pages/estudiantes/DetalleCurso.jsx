import { Button, Divider, Popconfirm, message, Tooltip } from "antd";
import Dragger from "antd/es/upload/Dragger";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { InboxOutlined } from "@ant-design/icons";
import { useAuth } from "../../AuthContext"; // Asegúrate de que esta importación sea correcta

function DetalleCurso() {
  const { cursoId } = useParams();
  const { token } = useAuth(); // Obtener el token del contexto de autenticación
  const navigate = useNavigate();

  const [curso, setCurso] = useState(null);
  const [docente, setDocente] = useState(null);
  const [error, setError] = useState(null);
  const [pdfFile, setPdfFile] = useState(null); // Estado para el archivo PDF
  const [alumnoId, setAlumnoId] = useState(null); // ID del alumno
  const [detalles, setDetalles] = useState(""); // Detalles, si se requieren
  const [prioridad, setPrioridad] = useState(""); // Prioridad, si se requiere
  const [status, setStatus] = useState("pending"); // Estado para status (o lo que sea necesario)
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado para manejar la carga del envío

  // Efecto para cargar datos del curso
  useEffect(() => {
    // Obtener el ID del estudiante desde localStorage
    const estudiante = JSON.parse(localStorage.getItem("estudiante"));
    const id_estudiante = estudiante ? estudiante.id : null; // Extraer el id del estudiante

    setAlumnoId(id_estudiante); // Asignar ID del estudiante a alumnoId

    const fetchData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/cursos/${cursoId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Usar el token del contexto
              Accept: "*/*",
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json(); // Convierte la respuesta a JSON
        console.log("Respuesta de la API:", data); // Verifica la respuesta

        const { curso } = data; // Asegúrate de acceder a los datos correctamente

        setCurso(curso);
        setDocente(curso.docente);
        setDetalles(curso.descripcion); // O cualquier otro campo que quieras usar
        setPrioridad(curso.nivel); // O cualquier otro campo que quieras usar
      } catch (err) {
        setError(err.message || "Error al cargar los datos."); // Manejo de errores
      }
    };

    fetchData();
  }, [cursoId, token]);

  // Manejar cambios en el archivo
  const handleFileChange = (info) => {
    const { status } = info.file;

    if (status === "done") {
      message.success(`${info.file.name} file uploaded successfully.`);
      setPdfFile(info.file.originFileObj);
    } else if (status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  // Manejar archivo antes de subir
  const beforeUpload = (file) => {
    console.log("Archivo seleccionado:", file);
    setPdfFile(file);
    return false; // Prevenir la carga automática
  };

  // Manejar el envío del formulario
  const handleSubmit = (event) => {
    event.preventDefault(); // Evitar el comportamiento por defecto del formulario

    if (!cursoId || !alumnoId || !pdfFile || !status) {
      message.error("Por favor completa todos los campos requeridos.");
      return; // Detener el envío si faltan campos
    }

    setIsSubmitting(true); // Marcar el inicio del envío

    let userid = localStorage.getItem("usuario");
    userid = JSON.parse(userid);
    console.log("datosuser: ", userid.id);

    const formData = new FormData();
    formData.append("curso_id", cursoId);
    formData.append("alumno_id", alumnoId);
    formData.append("user_id", userid.id);

    // Convertir la fecha a un formato que MySQL entienda
    const fechaInscripcion = new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    formData.append("fecha_inscripcion", fechaInscripcion);

    formData.append("detalles", detalles);
    formData.append("prioridad", prioridad);
    formData.append("status", status);
    formData.append("file", pdfFile);

    console.log("Datos a enviar:", Array.from(formData.entries())); // Muestra los datos en un formato más legible

    // Realiza la solicitud POST para crear la nueva solicitud
    fetch(`${import.meta.env.VITE_API_URL}/api/crear_solicitud`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          // Maneja la respuesta en caso de que ya exista una solicitud
          return response.json().then((data) => {
            // Si hay un mensaje de conflicto, lo manejamos aquí
            if (response.status === 409) {
              message.error(
                data.message || "Ya existe una solicitud para este curso."
              );
              throw new Error(data.message || "Conflicto en la solicitud.");
            }
            throw new Error("Error en la solicitud.");
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log("Respuesta del servidor:", data);
        if (data.success) {
          message.success(
            "Solicitud enviada con éxito, se notificará al coordinador de tu solicitud."
          );
          // navigate(-1); // Descomentar si se desea navegar después del éxito
        } else {
          if (data.errors) {
            const errorMessages = Object.values(data.errors).flat();
            message.error(errorMessages.join(", "));
          } else {
            message.error("Error al enviar la solicitud.");
          }
        }
      })
      .catch((error) => {
        console.error("Error en la solicitud:", error);
        message.error("Error en la solicitud.");
      })
      .finally(() => {
        setIsSubmitting(false); // Marcar el fin del envío
      });
  };

  // Mostrar error si existe
  if (error) {
    return <div>{error}</div>;
  }

  // Mostrar cargando si no se ha cargado el curso
  if (!curso) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="">
      <h2 className="Montserrat font-light text-2xl text-center my-8">
        Detalles del curso
      </h2>

      <div id="Card" className="bg-slate-100 p-2 md:mx-16 md:p-16 mt-8">
        <div id="cardContent" className="flex flex-col items-center">
          <div
            id="headerCard"
            className="w-full flex justify-between items-center"
          >
            <div id="Actions" className="self-start flex gap-2">
              <button
                onClick={() => navigate(-1)}
                className="Popins font-semibold text-blue-500 flex gap-2"
              >
                <img alt="icon" className="w-4" src="/Opt//SVG/LighArrow.svg" />
                Volver
              </button>
            </div>
            <h3 className="Montserrat font-medium text-2xl capitalize">
              {curso.nombre}
            </h3>

            <Tooltip title="Información sobre el curso seleccionado">
              {" "}
              <img alt="icon" className="w-8" src="/Opt//SVG/info.svg" />
            </Tooltip>
          </div>
          <Divider />

          <section id="Info" className="px-4 self-start">
            <ul className="list-disc space-y-2">
              <li>
                <strong className="text-black">Nombre:</strong>{" "}
                <span>{curso.nombre}</span>
              </li>
              <li>
                <strong className="text-black">Descripción:</strong>{" "}
                <span>{curso.descripcion}</span>
              </li>
              <li>
                <strong className="text-black">Modalidad:</strong>{" "}
                <span>{curso.modalidad}</span>
              </li>
              <li>
                <strong className="text-black">Nivel:</strong>{" "}
                <span>{curso.nivel}</span>
              </li>
              <li>
                <strong className="text-black">Estado:</strong>{" "}
                <span>{curso.estado}</span>
              </li>
              <li>
                <strong className="text-black">Horario:</strong>{" "}
                <span>{curso.horario}</span>
              </li>
              <li>
                <strong className="text-black">Fecha Inicio:</strong>{" "}
                <span>{curso.fecha_inicio}</span>
              </li>
              <li>
                <strong className="text-black">Fecha Fin:</strong>{" "}
                <span>{curso.fecha_fin}</span>
              </li>
            </ul>
          </section>
          <Divider />

          <form id="formData" className="w-full flex flex-col gap-6">
            <Dragger
              name="file"
              accept=".pdf"
              beforeUpload={beforeUpload}
              onChange={handleFileChange}
              maxCount={1}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Haz clic o arrastra el archivo PDF a esta área para cargarlo.
              </p>
            </Dragger>
            <Popconfirm
              title="¿Estás seguro de que deseas inscribirte en este curso?"
              onConfirm={handleSubmit}
              okText="Sí"
              cancelText="No"
            >
              <Button
                type="primary"
                disabled={isSubmitting} // Deshabilitar el botón si está en proceso de envío
                loading={isSubmitting} // Mostrar el indicador de carga
              >
                Solicitar inscripción
              </Button>
            </Popconfirm>
          </form>
        </div>
      </div>
    </div>
  );
}

export default DetalleCurso;
