import { Button, Divider, Popconfirm, Table, message } from "antd";
import Dragger from "antd/es/upload/Dragger";
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { InboxOutlined } from "@ant-design/icons";
import { useAuth } from "../../AuthContext";
import axios from "axios";

const props = {
  name: "file",
  multiple: true,
  action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
  onChange(info) {
    const { status } = info.file;
    if (status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (status === "done") {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log("Dropped files", e.dataTransfer.files);
  },
};

function DetalleCurso() {
  const { cursoId } = useParams(); // Extrae cursoId de los parámetros de la URL
  const { token } = useAuth(); // Usando el token de autenticación

  const [curso, setCurso] = useState(null); // Ahora inicializamos con null para manejar errores
  const [docente, setDocente] = useState(null); // Estado separado para el docente
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Petición para obtener los detalles del curso
        const response = await axios.get(
          `http://127.0.0.1:8000/api/cursos/${cursoId}`, {
            headers: {
              Authorization: "Bearer 1|AFPPXEHDEUyWz1mnsszBCzo3QrKWNc18dAPfae4L2d901636",
              Accept: "*/*",
              "Content-Type": "application/json",
            },
          })/* ,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ); */

        // Actualiza los estados con los datos del curso y docente
        const { curso, docente } = response.data;
        setCurso(curso);
        setDocente(docente); // Se maneja por separado
      } catch (err) {
        setError(err.response?.data?.error || "Error al cargar los datos.");
      }
    };

    fetchData();
  }, [cursoId, token]);

  if (error) {
    return <div>{error}</div>; // Muestra un mensaje de error si hay algún problema
  }

  if (!curso) {
    return <div>Cargando...</div>; // Muestra un mensaje de carga mientras se obtienen los datos
  }

  return (
    <div className="">
      <h2 className="Montserrat font-light text-2xl text-center my-8">
        Detalles del curso
      </h2>

      <div id="Card" className="bg-slate-100 p-2 md:mx-16 md:p-16 mt-8 ">
        <div id="cardContent" className="flex flex-col items-center">
          <div
            id="headerCard"
            className="w-full flex justify-between items-center"
          >
            <div id="Actions" className="self-start flex gap-2">
              <img alt="icon" className="w-4" src="/Opt/SVG/LighArrow.svg" />
              <Link to="/Docentes/CursosActivos" className="Popins font-semibold">
                Volver
              </Link>
            </div>
            <h3 className="Montserrat font-medium text-2xl">
              {curso.nombre}
            </h3>
            <img alt="icon" className="w-8" src="/Opt/SVG/info.svg" />
          </div>
          <Divider />

          <section id="Info" className="px-4 self-start">
            <ul className="list-disc space-y-2">
              <li>Nombre: {curso.nombre}</li>
              <li>Descripción: {curso.descripción}</li>
              <li>Modalidad: {curso.modalidad}</li>
              <li>Nivel: {curso.nivel}</li>
              <li>Estado: {curso.estado}</li>
              <li>Horario: {curso.horario}</li>
              <li>Fecha Inicio: {curso.fecha_inicio}</li>
              <li>Fecha Fin: {curso.fecha_fin}</li>
              <li>Docente: {docente ? docente.nombre : "No asignado"}</li> {/* Mostrar docente si está disponible */}
            </ul>
          </section>

          <section id="Archivos" className="p-3">
            <h2 className="Montserrat text-center">Adjunta tu comprobante de pago</h2>
            <Dragger {...props}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Selecciona o arrastra tu archivo aquí!</p>
              <p className="ant-upload-hint">Soporta únicamente el pdf</p>
            </Dragger>
          </section>

          <Popconfirm
            title="Confirmar"
            description="¿Estás seguro que deseas continuar?"
            onConfirm={() => console.log("Confirmado")}
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
