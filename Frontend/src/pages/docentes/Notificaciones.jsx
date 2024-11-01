import React, { useEffect, useState } from "react";
import { Breadcrumb, Timeline, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

function Notificaciones() {
  const [notificaciones, setNotificaciones] = useState([]);

  useEffect(() => {
    fetchNotificaciones();
  }, []);

  const fetchNotificaciones = async () => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const token = localStorage.getItem("token");

    if (!usuario || !token) {
      message.error("No se encontró el usuario o el token.");
      return;
    }

    const usuarioId = usuario.id;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/notificaciones/${usuarioId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setNotificaciones(data.notificaciones);
      } else {
        message.error(data.message || "Error al cargar las notificaciones");
      }
    } catch (error) {
      message.error("Ocurrió un error al cargar las notificaciones");
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    if (!token) {
      message.error("Token no encontrado, por favor inicia sesión.");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/notificaciones/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        message.success("Notificación eliminada correctamente");
        fetchNotificaciones(); // Volver a cargar la lista de notificaciones
      } else {
        const errorData = await response.json();
        message.error(errorData.message || "Error al eliminar la notificación");
      }
    } catch (error) {
      message.error("Ocurrió un error al eliminar la notificación");
    }
  };

  return (
    <div className="px-4">
      <Breadcrumb
        items={[
          {
            title: <p className="font-medium text-black">Docente</p>,
          },
          {
            title: <a href="">Notificaciones Docente</a>,
          },
        ]}
      />
      <h2 className="Montserrat font-medium text-2xl text-center">
        Mis Notificaciones
      </h2>

      <Timeline className="mt-8 px-8">
        {notificaciones.length > 0 ? (
          notificaciones.map((notificacion) => (
            <Timeline.Item key={notificacion.id}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>
                  {notificacion.mensaje} - {notificacion.fecha_notificacion}
                </span>
                <DeleteOutlined onClick={() => handleDelete(notificacion.id)} />
              </div>
            </Timeline.Item>
          ))
        ) : (
          <Timeline.Item>
            <div>No hay notificaciones.</div>
          </Timeline.Item>
        )}
      </Timeline>
    </div>
  );
}

export default Notificaciones;
