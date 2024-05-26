import { Button, Divider, Popconfirm } from "antd";
import Dragger from "antd/es/upload/Dragger";
import React from "react";
import { Link, useParams } from "react-router-dom";
import { InboxOutlined } from "@ant-design/icons";

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

  const DetalleCursoActual = {
    Nombre: "Curso basico",
    Perido: "Enero Junio",
    Modalidad: "Fines de semana",
    Horario: "8:00 AM - 1:00PM",
    Docente: "Laura Garza",
    Requisitos: 2,
  };

  const confirm = (e) => {
    console.log("yees");
  };
  const cancel = (e) => {
    console.log(e);
  };

  return (
    <div className="">
      <h2 className="Montserrat font-medium text-2xl text-center">
        Curso disponible {cursoId}
      </h2>

      <div id="Card" className="bg-slate-100 p-2 md:mx-16 md:p-16">
        <div id="Actions" className="flex items-center hover:text-blue-700 ">
          <img alt="icon" className="w-4" src="/Opt/SVG/LighArrow.svg" />
          <Link to="/Estudiantes/Cursos" className="Popins  font-semibold ">
            Volver
          </Link>
        </div>

        <div id="cardContent" className=" flex flex-col items-center">
          <h3 className="Montserrat font-semibold mt-4 text-center">
            Detalles del curso
          </h3>
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
                Selecciona o arrastra tu archivo aqui!
              </p>
              <p className="ant-upload-hint">Soporta unicamente el pdf</p>
            </Dragger>
          </section>

          <section id="Info" className="px-4 self-start">
            <ul className="list-disc space-y-2">
              {" "}
              {/* Added list-disc and space-y-2 for styling */}
              <li>Nombre: {DetalleCursoActual.Nombre}</li>
              <li>Periodo: {DetalleCursoActual.Perido}</li>
              <li>Modalidad: {DetalleCursoActual.Modalidad}</li>
              <li>Horario: {DetalleCursoActual.Horario}</li>
              <li>Docente: {DetalleCursoActual.Docente}</li>
              <li>Nivel: {DetalleCursoActual.Requisitos}</li>
            </ul>
          </section>

          <Popconfirm
            title="Confirmar"
            description="Estas seguro que deseas continuar?"
            onConfirm={confirm}
            onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" className="bg-green-500">
              Enviar
            </Button>
          </Popconfirm>
        </div>
      </div>
    </div>
  );
}

export default DetalleCurso;
