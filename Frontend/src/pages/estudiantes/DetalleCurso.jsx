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
  const { cursoId } = useParams(); // Extract course ID from URL parameter
  const { token } = useAuth(); // Assuming useAuth provides a token for API requests

  const [curso, setCurso] = useState({});
  const [solicitudes, setSolicitudes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch curso details
        const cursoResponse = await axios.get(
          `http://127.0.0.1:8000/api/Cursos/${cursoId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCurso(cursoResponse.data.cursos);

        // Fetch solicitudes for the curso
        const solicitudesResponse = await axios.get(
          `http://127.0.0.1:8000/api/solicitudes/${cursoId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Solicitud Response:", solicitudesResponse); // Verifica la respuesta del endpoint

        setSolicitudes(solicitudesResponse.data); // Ajusta esta línea si la respuesta tiene una estructura diferente
      } catch (err) {
        setError(err);
      }
    };

    fetchData();
  }, [cursoId, token]);

  const confirm = () => {
    console.log("Solicitud confirmada");
  };
  const cancel = () => {
    console.log("Solicitud cancelada");
  };

  const columns = [
    {
      title: "ID Inscripción",
      dataIndex: "ID_Inscripcion",
      key: "ID_Inscripcion",
    },
    {
      title: "Nombre Alumno",
      dataIndex: "Nombre_Alumno",
      key: "Nombre_Alumno",
    },
    {
      title: "Apellidos Alumno",
      dataIndex: "Apellidos_Alumno",
      key: "Apellidos_Alumno",
    },
    {
      title: "Nombre Curso",
      dataIndex: "Nombre_Curso",
      key: "Nombre_Curso",
    },
    {
      title: "Fecha Inscripción",
      dataIndex: "Fecha_Inscripcion",
      key: "Fecha_Inscripcion",
    },
    {
      title: "Estado Solicitud",
      dataIndex: "Estado_Solicitud",
      key: "Estado_Solicitud",
    },
    {
      title: "PDF Solicitud",
      dataIndex: "PDF_Solicitud",
      key: "PDF_Solicitud",
      render: (text) => <a href={text} target="_blank" rel="noopener noreferrer">Ver PDF</a> // Asume que text es una URL
    },
  ];

  return (
    <div className="">
      <h2 className="Montserrat font-light text-2xl text-center my-8">
        Detalles del cursooo
      </h2>

      <div id="Card" className="bg-slate-100 p-2 md:mx-16 md:p-16 mt-8 ">
        <div id="cardContent" className=" flex flex-col items-center">
          <div
            id="headerCard"
            className=" w-full flex justify-between  items-center"
          >
            <div id="Actions" className=" self-start  flex gap-2">
              <img alt="icon" className="w-4" src="/Opt/SVG/LighArrow.svg" />
              <Link
                to="/Docentes/CursosActivos"
                className="Popins  font-semibold "
              >
                Volver
              </Link>
            </div>
            <h3 className="Montserrat font-medium text-2xl  ">
              {curso.nombre}
            </h3>
            <img alt="icon" className="w-8" src="/Opt/SVG/info.svg" />
          </div>
          <Divider />

          <h2 className="Montserrat text-center">
            Adjunta tu comprobante de pago
          </h2>
          <section id="Archivos" className="p-3">
            <Dragger {...props}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Selecciona o arrastra tu archivo aquí!
              </p>
              <p className="ant-upload-hint">Soporta únicamente el pdf</p>
            </Dragger>
          </section>

          <section id="Info" className="px-4 self-start">
            <ul className="list-disc space-y-2">
              {" "}
              {/* Added list-disc and space-y-2 for styling */}
              <li>Nombre: {curso.nombre}</li>
              <li>Periodo: {curso.periodo}</li>
              <li>Modalidad: {curso.modalidad}</li>
              <li>Horario: {curso.horario}</li>
              <li>Docente: {curso.docente}</li>
              <li>Nivel: {curso.nivel}</li>
            </ul>
          </section>

          <Table
            dataSource={solicitudes}
            columns={columns}
            rowKey="ID_Inscripcion"
            className="w-full my-4"
          />

          <Popconfirm
            title="Confirmar"
            description="¿Estás seguro que deseas continuar?"
            onConfirm={confirm}
            onCancel={cancel}
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
