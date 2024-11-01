import { Button, Divider, Popconfirm, message } from "antd";
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
            <h3 className="Montserrat font-medium text-2xl">{curso.nombre}</h3>
            <img alt="icon" className="w-8" src="/Opt//SVG/info.svg" />
          </div>
          <Divider />

          <section id="Info" className="px-4 self-start">
            <ul className="list-disc space-y-2">
              <li>Nombre: {curso.nombre}</li>
              <li>Descripción: {curso.descripcion}</li>
              <li>Modalidad: {curso.modalidad}</li>
              <li>Nivel: {curso.nivel}</li>
              <li>Estado: {curso.estado}</li>
              <li>Horario: {curso.horario}</li>
              <li>Fecha Inicio: {curso.fecha_inicio}</li>
              <li>Fecha Fin: {curso.fecha_fin}</li>
              <li>Docente: {docente ? docente.nombre : "No asignado"}</li>
            </ul>
          </section>

          <section id="Archivos" className="p-3">
            <h2 className="Montserrat text-center">
              Adjunta tu comprobante de pago
            </h2>
            <Dragger
              name="pdf"
              multiple={false}
              onChange={handleFileChange}
              beforeUpload={beforeUpload}
              accept=".pdf"
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Selecciona o arrastra tu archivo aquí!
              </p>
              <p className="ant-upload-hint">Soporta únicamente el pdf</p>
            </Dragger>
          </section>

          <Popconfirm
            title="Confirmar"
            description="¿Estás seguro que deseas continuar?"
            onConfirm={handleSubmit} // Llama a handleSubmit
            onCancel={() => console.log("Cancelado")}
            okText="Sí"
            cancelText="No"
          >
            <Button type="primary" className="bg-green-500">
              Solicitar inscripción
            </Button>
          </Popconfirm>
        </div>
      </div>
    </div>
  );
}

export default DetalleCurso;
