import { Button, Divider, Spin, notification } from "antd";
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import TablaAlumnos from "../../components/coordinador/TablaAlumnos";
import jsPDF from "jspdf";
import "jspdf-autotable"; // Necesario para el plugin de tablas

function DetalleCurso() {
  const { cursoId } = useParams();
  const [curso, setCurso] = useState(null);
  const [solicitudes, setSolicitudes] = useState([]); // Inicializar como un array vacío
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [api, contextHolder] = notification.useNotification();

  function formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [cursoResponse, solicitudesResponse] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/cursos/${cursoId}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              Accept: "*/*",
              "Content-Type": "application/json",
            },
          }),
          fetch(`${import.meta.env.VITE_API_URL}/api/solicitudes/${cursoId}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              Accept: "*/*",
              "Content-Type": "application/json",
            },
          }),
        ]);

        // Manejo de respuestas
        const cursoData = await cursoResponse.json();
        const solicitudesData = await solicitudesResponse.json();

        if (!cursoResponse.ok) {
          throw new Error(
            `Error ${cursoResponse.status}: ${
              cursoData.message || "Error desconocido"
            }`
          );
        }

        // Asignar datos
        setCurso(cursoData.curso);
        setSolicitudes(Array.isArray(solicitudesData) ? solicitudesData : []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [cursoId]);

  const handleArchive = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/archivarCurso/${cursoId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Asegúrate de verificar que la respuesta es exitosa
      if (!response.ok) {
        throw new Error("Error en la respuesta de la API");
      }

      // Convierte la respuesta a JSON
      const data = await response.json();

      // Cambia aquí para verificar correctamente el valor de success
      if (data.success === "true") {
        notification.success({
          message: "Curso Archivado",
          description: data.mensaje, // Muestra el mensaje de éxito
        });
      } else {
        notification.error({
          message: "Error al Archivar",
          description: "No se pudo archivar el curso.",
        });
      }
    } catch (error) {
      notification.error({
        message: "Error al Archivar",
        description: `Ocurrió un error: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  // Función para generar y descargar el PDF
  const handleDownloadPDF = async () => {
    try {
      setLoading(true);
  
      const cursoResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/cursos/${cursoId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      const solicitudesResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/calificacionesFinales/${cursoId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      if (!cursoResponse.ok) throw new Error("Error al obtener los datos del curso.");
      if (!solicitudesResponse.ok) throw new Error("Error al obtener las calificaciones.");
  
      let cursoData = await cursoResponse.json();
      let solicitudesData = await solicitudesResponse.json();
  
      if (!cursoData || !solicitudesData || solicitudesData.length === 0) {
        throw new Error("No se encontraron datos para el curso o las calificaciones.");
      }
  
      cursoData = cursoData.curso;
  
      const doc = new jsPDF();
  
      // Cargar imagen 1 desde el directorio público
      const imgUrl = `${window.location.origin}/Opt/itsm.png`;
      const imgPlaceholder = await fetch(imgUrl)
        .then((response) => response.blob())
        .then((blob) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
          })
        );
  
      // Agregar la primera imagen
      doc.addImage(imgPlaceholder, "PNG", 14, 10, 30, 30); // Ajusta tamaño y posición
  
      doc.setFontSize(12);
      doc.text("Instituto Tecnológico de San Marcos", 50, 20);
      doc.text("Coordinación de lenguas extranjeras", 50, 30);
      doc.text("REPORTE DE CALIFICACIONES ", 50, 40);

       // Cargar imagen 2 desde el directorio público (segunda imagen)
       const imgUrl2 = `${window.location.origin}/LogoTransparente.png`; // Cambia la URL por la de la segunda imagen
       const imgPlaceholder2 = await fetch(imgUrl2)
         .then((response) => response.blob())
         .then((blob) =>
           new Promise((resolve) => {
             const reader = new FileReader();
             reader.onloadend = () => resolve(reader.result);
             reader.readAsDataURL(blob);
           })
         );
   
       // Agregar la segunda imagen
       doc.addImage(imgPlaceholder2, "PNG", 140, 10, 30, 30); // Ajusta la posición y el tamaño según sea necesario
  
      // Datos del curso
      doc.setFontSize(10);
      doc.text(`Materia: ${cursoData.descripcion || "No disponible"}`, 14, 50);
      doc.text(`Modalidad: ${cursoData.modalidad || "No disponible"}`, 14, 60);
      doc.text(`Nivel: ${cursoData.nivel || "No disponible"}`, 14, 70);
      doc.text(`Estado: ${cursoData.estado || "No disponible"}`, 14, 80);
      doc.text(`Fechas: ${cursoData.fecha_inicio || "No disponible"} - ${cursoData.fecha_fin || "No disponible"}`, 14, 90);
  
     
  
      // Encabezados de tabla (sólo con Promedio)
      const headers = [["No. Control", "Nombre del Alumno", "Promedio"]];
  
      // Datos de la tabla (sólo promedio)
      const data = solicitudesData.map((alumno) => [
        alumno.numero_control || "Nos disponible ",
        alumno.nombre_completo || "No disponible",
        alumno.calificacion || "N/A", // Aquí se toma directamente el promedio como "calificacion"
      ]);
  
      // Tabla de calificaciones
      doc.autoTable({
        head: headers,
        body: data,
        startY: 130, // Ajusta esta posición para que no se solapen las imágenes y el texto
        styles: {
          fontSize: 8,
          cellPadding: 2,
        },
        headStyles: { fillColor: [100, 100, 255] }, // Color de encabezado
      });
  
      doc.save("calificaciones_curso.pdf");
  
      notification.success({
        message: "PDF generado con éxito",
        description: "El archivo PDF con las calificaciones ha sido descargado.",
      });
    } catch (error) {
      notification.error({
        message: "Error al generar el PDF",
        description: `Ocurrió un error: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };
  
  
  
  
  

  if (loading) {
    return (
      <div className="flex gap-4 flex-col h-[40vh] justify-center items-center">
        <Spin size="large" />
        <p>Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex gap-4 flex-col h-[40vh] justify-center items-center">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!curso) {
    return (
      <div className="flex gap-4 flex-col h-[40vh] justify-center items-center">
        <p>No se encontró el curso.</p>
      </div>
    );
  }

  return (
    <div>
      {contextHolder} {/* Necesario para las notificaciones de antd */}
      <h2 className="Montserrat font-semibold text-2xl text-center my-6">
        Curso activo:
      </h2>
      <div id="Card" className="bg-slate-100 p-2 md:mx-16 md:p-16">
        <div id="cardContent" className="flex flex-col items-center">
          <div
            id="headerCard"
            className="w-full flex justify-between items-center"
          >
            <div id="Actions" className="self-start flex gap-2">
              <Link
                to="/Coordinador/CursosActivos"
                className="flex items-center"
              >
                <img alt="icon" className="w-4" src="/Opt//SVG/LighArrow.svg" />
                <span className="Popins font-semibold ml-2">Volver</span>
              </Link>
            </div>

            <h3 className="Montserrat font-extralight text-2xl">
              {curso.nombre}
            </h3>
            <img alt="icon" className="w-8" src="/Opt//SVG/info.svg" />
          </div>
          <Divider />

          <h2 className="Montserrat font-bold self-start text-2xl text-center">
            Módulo de nivel: {curso ? curso.nivel : "Desconocido"}
          </h2>
          <section id="Archivos" className="p-3"></section>

          <section id="Info" className="px-4 self-start w-full">
            {solicitudes.length === 0 ? (
              <p className="my-5 text-xl">
                No se encontraron solicitudes para este curso.
              </p>
            ) : (
              <TablaAlumnos solicitudes={solicitudes} />
            )}
          </section>

          <div className="flex flex-col md:flex-row md:items-center Montserrat w-full justify-between items-left gap-4">
            <p>
              <span className="font-semibold">Periodo:</span>{" "}
              {curso
                ? `${formatDate(curso.fecha_inicio)} - ${formatDate(
                    curso.fecha_fin
                  )}`
                : "Desconocido"}
            </p>
            <p>
              <span className="font-semibold">Docente:</span>{" "}
              {curso && curso.docente
                ? `${curso.docente.nombre}`
                : "Desconocido"}
            </p>
            <p>
              <span className="font-semibold">Requisitos:</span>{" "}
              {curso
                ? curso.nivel === "0"
                  ? "Ninguno"
                  : curso.nivel
                : "Desconocido"}
            </p>

            <Button
              danger
              id="img-Archivar"
              className="flex flex-col items-center h-auto"
              onClick={handleArchive}
            >
              <img className="w-8" alt="icon" src="/Opt//SVG/archivar.svg" />
              <span>Archivar</span>
            </Button>

            {/* Botón de descarga */}
            <Button
              className="flex flex-col items-center h-auto"
              onClick={handleDownloadPDF}
            >
              <span>Descargar PDF</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetalleCurso;
