import { Breadcrumb, Timeline, Spin, Alert, message } from "antd";
import React, { useState, useEffect } from "react";
import { DeleteOutlined } from "@ant-design/icons";

function Notificaciones() {
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = 1;

  useEffect(() => {
    const fetchNotificaciones = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/users/notificaciones/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        // Asegúrate de que la respuesta sea procesada como JSON
        const data = await response.json();

        // Manejo de la respuesta cuando no hay notificaciones
        if (data.success) {
          if (data.notificaciones && data.notificaciones.length > 0) {
            setNotificaciones(data.notificaciones); // Si hay notificaciones, actualiza el estado
          } else {
            setNotificaciones([]); // Si no hay notificaciones, establece un arreglo vacío
          }
        } else {
          setError("Error: " + data.mensaje); // En caso de error lógico
        }
      } catch (err) {
        setError(
          err.response
            ? err.response.data.mensaje
            : "Error al obtener notificaciones"
        );
      } finally {
        setLoading(false); // Siempre desactivar el estado de carga
      }
    };

    fetchNotificaciones();
  }, []);

  const eliminarNotificacion = async (id) => {
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/notificaciones/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Actualizar la lista de notificaciones después de eliminar
      setNotificaciones(
        notificaciones.filter((notificacion) => notificacion.id !== id)
      );
      message.success("Notificación eliminada exitosamente.");
    } catch (err) {
      message.error("Error al eliminar la notificación.");
    }
  };

  if (loading) {
    return <Spin tip="Cargando notificaciones..." />;
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  if (notificaciones.length === 0) {
    return (
      <Alert
        message="Sin Notificaciones"
        description="No se encontraron notificaciones para este usuario."
        type="info"
        showIcon
      />
    );
  }

  return (
    <div className="px-4">
      <Breadcrumb
        items={[
          {
            title: <p className="font-medium text-black">Coordinador</p>,
          },
          {
            title: <a href="">Notificaciones</a>,
          },
        ]}
      />
      <h2 className="Montserrat font-medium text-2xl text-center">
        Mis Notificaciones
      </h2>

      <Timeline className="mt-8 px-8">
        {notificaciones.map((item) => (
          <Timeline.Item key={item.id}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {item.mensaje} - {item.fecha_notificacion}
              <DeleteOutlined onClick={() => eliminarNotificacion(item.id)} />
            </div>
            w
          </Timeline.Item>
        ))}
      </Timeline>
    </div>
  );
}

export default Notificaciones;
