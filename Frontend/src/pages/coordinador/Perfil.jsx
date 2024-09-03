import React, { useState, useEffect } from "react";
import { Breadcrumb, Divider, message } from "antd";
import TablaDocentes from "../../components/coordinador/TablaDeDocentes";

function Perfil() {
  // Estado para almacenar los docentes
  const [docentes, setDocentes] = useState([]);

  // Efecto para hacer la petición a la API cuando se monte el componente
  useEffect(() => {
    const fetchDocentes = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/docentes", {
          headers: {
            Authorization: "Bearer 1|AFPPXEHDEUyWz1mnsszBCzo3QrKWNc18dAPfae4L2d901636",
          },
        });
        const data = await response.json();
        setDocentes(data.docentes);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDocentes();
  }, []);

  // Función para eliminar un docente
  const eliminarDocente = async (docente_id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/docentes/${docente_id}`, {
        method: 'DELETE',
        headers: {
          Authorization: "Bearer 1|AFPPXEHDEUyWz1mnsszBCzo3QrKWNc18dAPfae4L2d901636",
        },
      });
  
      if (response.ok) {
        message.success('Docente eliminado con éxito');
        // Actualiza la lista de docentes después de eliminar
        setDocentes(docentes.filter(docente => docente.docente_id !== docente_id));
      } else {
        message.error('Error al eliminar el docente');
      }
    } catch (error) {
      message.error('Hubo un problema con la solicitud de eliminación');
      console.error('Error eliminando docente:', error);
    }
  };

  return (
    <div className="px-4">
      <Breadcrumb
        items={[
          {
            title: <p className="font-medium text-black">Coordinador</p>,
          },
          {
            title: <a href="#">Perfil</a>,
          },
        ]}
      />

      <div className="w-full flex justify-around items-center p-10">
        <div className="col-span-4 sm:col-span-3">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex flex-col items-center">
              <img
                src="https://media.istockphoto.com/id/1448474701/es/foto/la-dise%C3%B1adora-gr%C3%A1fica-sonr%C3%ADe-mientras-trabaja-en-una-computadora-port%C3%A1til-en-una-oficina.webp?s=2048x2048&w=is&k=20&c=ralxlJILurgeMr9sWln8pCws1wayTUXcye7m2pLt2iA="
                className="w-32 h-32 bg-gray-300 rounded-full mb-4 shrink-0"
                alt="Foto de perfil"
              />
              <h1 className="text-xl font-bold">Maricela Gallegos</h1>
              <p className="text-gray-700">Administrador</p>
              <div className="mt-6 flex flex-wrap gap-4 justify-center">
                <a
                  href="#"
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded"
                >
                  Editar
                </a>
              </div>
            </div>
          </div>
        </div>

        <div id="right" className="w-full">
          <h2 className="Montserrat self-start font-medium text-2xl">
            Docentes registrados
          </h2>

          <Divider />

          {/* Pasar los datos de los docentes y la función de eliminación a la tabla */}
          <TablaDocentes docentes={docentes} onDocenteEliminado={eliminarDocente} />
        </div>
      </div>
    </div>
  );
}

export default Perfil;
