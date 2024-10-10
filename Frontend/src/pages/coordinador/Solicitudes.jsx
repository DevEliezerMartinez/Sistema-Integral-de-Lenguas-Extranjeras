import React, { useState, useEffect } from "react";
import {
  Breadcrumb,
  Button,
  Collapse,
  Spin,
  Alert,
  Input,
  notification,
} from "antd";
import axios from "axios";

const { TextArea } = Input;

function Solicitudes() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleTextarea, setVisibleTextarea] = useState(null);
  const [rejectionText, setRejectionText] = useState("");
  const [actionError, setActionError] = useState(null);

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  const fetchSolicitudes = () => {
    setLoading(true);
    axios
      .get("http://127.0.0.1:8000/api/solicitudes", {
        headers: {
          Authorization:
            "Bearer 1|AFPPXEHDEUyWz1mnsszBCzo3QrKWNc18dAPfae4L2d901636",
          Accept: "*/*",
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response.status === 404 || response.data.solicitudes.length === 0) {
          setError("No se encontraron solicitudes pendientes");
          setSolicitudes([]);
        } else {
          setSolicitudes(response.data.solicitudes);
          setError(null);
        }
        setLoading(false);
      })
      .catch((err) => {
        const errorMsg =
          err.response?.data?.message || "Error al cargar las solicitudes";
        setError(errorMsg);
        setLoading(false);
      });
  };

  const handleRechazarClick = (id) => {
    setVisibleTextarea(id);
    setActionError(null);
  };

  const handleEnviarClick = (id) => {
    axios
      .post(
        `http://127.0.0.1:8000/api/solicitudes/${id}/rechazar`,
        { motivo: rejectionText },
        {
          headers: {
            Authorization:
              "Bearer 1|AFPPXEHDEUyWz1mnsszBCzo3QrKWNc18dAPfae4L2d901636",
            Accept: "*/*",
            "Content-Type": "application/json",
          },
        }
      )
      .then(() => {
        notification.success({
          message: "Solicitud Rechazada",
          description: "El rechazo será notificado al estudiante.",
        });
        setRejectionText("");
        setVisibleTextarea(null);
        fetchSolicitudes();
      })
      .catch((err) => {
        const errorMsg =
          err.response?.data?.message ||
          "No se pudo procesar el rechazo. Inténtalo de nuevo más tarde.";
        setActionError(errorMsg);
        notification.error({
          message: "Error",
          description: errorMsg,
        });
      });
  };

  const handleAprobarClick = (id) => {
    axios
      .post(
        `http://127.0.0.1:8000/api/solicitudes/${id}/aceptar`,
        {},
        {
          headers: {
            Authorization:
              "Bearer 1|AFPPXEHDEUyWz1mnsszBCzo3QrKWNc18dAPfae4L2d901636",
            Accept: "*/*",
            "Content-Type": "application/json",
          },
        }
      )
      .then(() => {
        notification.success({
          message: "Solicitud Aprobada",
          description:
            "La solicitud ha sido aprobada y el estudiante será notificado.",
        });
        fetchSolicitudes();
      })
      .catch((err) => {
        const errorMsg =
          err.response?.data?.message ||
          "No se pudo procesar la aprobación. Inténtalo de nuevo más tarde.";
        setActionError(errorMsg);
        notification.error({
          message: "Error",
          description: errorMsg,
        });
      });
  };

  const items = solicitudes.map((solicitud, index) => ({
    key: String(index + 1),
    label: (
      <div className="flex w-full justify-between pr-6">
        <p className="font-semibold">
          Alumno:{" "}
          <span className="font-normal">
            {solicitud.Nombre_Alumno} {solicitud.Apellidos_Alumno}
          </span>
        </p>
        <div className="flex gap-4 font-medium">
          <p>{solicitud.Nombre_Curso}</p>
          <img alt="icon" className="w-6" src="/Opt/SVG/info.svg" />
        </div>
      </div>
    ),
    children: (
      <div className="flex px-8">
        <ul className="list-none w-1/3">
          <li className="mb-4">
            <span className="font-bold">Periodo:</span>{" "}
            {solicitud.Fecha_Inicio_Curso} - {solicitud.Fecha_Fin_Curso}
          </li>
          <li className="mb-4">
            <span className="font-bold">Docente:</span>{" "}
            {solicitud.Docente_Curso}
          </li>
          <li className="mb-4">
            <span className="font-bold">Requisitos:</span>{" "}
            {solicitud.Requisitos || "Ninguno"}
          </li>
          <li className="mb-4">
            <span className="font-bold">Modalidad:</span>{" "}
            {solicitud.Modalidad_Curso}
          </li>
        </ul>
        <div
          id="Visualizer"
          className="w-2/3 flex flex-col justify-center items-center"
        >
          {/* Vista previa del PDF */}
          <iframe
            src={`http://127.0.0.1:8000/storage/${solicitud.PDF_Solicitud}`} // Ajustar según sea necesario            width="100%"
            height="400px"
            title="Vista previa del PDF"
            style={{ border: "none", marginBottom: "16px" }}
          />
          <Button
            type="link"
            href={`http://127.0.0.1:8000/storage/${solicitud.PDF_Solicitud}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Descargar archivo
          </Button>
          <div id="Actions" className="m-8 gap-5 flex self-end">
            <Button
              type="primary"
              onClick={() => handleAprobarClick(solicitud.ID_Inscripcion)}
            >
              Aprobar
            </Button>
            <Button
              danger
              onClick={() => handleRechazarClick(solicitud.ID_Inscripcion)}
            >
              Rechazar
            </Button>
          </div>
          {visibleTextarea === solicitud.ID_Inscripcion && (
            <div className="mt-4">
              <TextArea
                rows={4}
                value={rejectionText}
                onChange={(e) => setRejectionText(e.target.value)}
                placeholder="Escribe el motivo del rechazo aquí"
              />
              <Button
                type="primary"
                className="mt-2"
                onClick={() => handleEnviarClick(solicitud.ID_Inscripcion)}
              >
                Enviar
              </Button>
              {actionError && (
                <Alert
                  message="Error"
                  description={actionError}
                  type="error"
                  showIcon
                  className="mt-2"
                />
              )}
            </div>
          )}
        </div>
      </div>
    ),
  }));

  return (
    <div className="px-4">
      <Breadcrumb
        items={[
          {
            title: <p className="font-medium text-black">Coordinador</p>,
          },
          {
            title: <a href="">Cursos Solicitudes</a>,
          },
        ]}
      />
      <h2 className="Montserrat text-center text-2xl font-medium my-9">
        Solicitudes de inscripción
      </h2>

      {loading ? (
        <div className="flex justify-center items-center">
          <Spin size="large" />
        </div>
      ) : error ? (
        <div className="text-center py-4">
          <Alert
            message={error}
            description={
              error === "No se encontraron solicitudes pendientes"
                ? "Actualmente no hay solicitudes de inscripción para procesar."
                : undefined
            }
            type={
              error === "No se encontraron solicitudes pendientes"
                ? "info"
                : "error"
            }
            showIcon
          />
        </div>
      ) : (
        <Collapse accordion items={items} />
      )}
    </div>
  );
}

export default Solicitudes;
