import { Button, Divider, Popconfirm } from "antd";
import Dragger from "antd/es/upload/Dragger";
import React from "react";
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

  const [cursos, setCursos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/Cursos/${cursoId}`,

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(cursos);
        setCursos(response.data.cursos); // Guarda todos los cursos en el estado
      } catch (err) {
        setError(err);
      }
    };

    fetchCursos();
  }, [token]);

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
      <h2 className="Montserrat font-light text-2xl text-center my-8">
        Detalles del curso
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
              {cursos.nombre}
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
                Selecciona o arrastra tu archivo aqui!
              </p>
              <p className="ant-upload-hint">Soporta unicamente el pdf</p>
            </Dragger>
          </section>

          <section id="Info" className="px-4 self-start">
            <ul className="list-disc space-y-2">
              {" "}
              {/* Added list-disc and space-y-2 for styling */}
              <li>Nombre: {cursos.Nombre}</li>
              <li>Periodo: {cursos.Perido}</li>
              <li>Modalidad: {cursos.Modalidad}</li>
              <li>Horario: {cursos.Horario}</li>
              <li>Docente: {cursos.Docente}</li>
              <li>Nivel: {cursos.Requisitos}</li>
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
              Solicitar inscripcion
            </Button>
          </Popconfirm>
        </div>
      </div>
    </div>
  );
}

export default DetalleCurso;
