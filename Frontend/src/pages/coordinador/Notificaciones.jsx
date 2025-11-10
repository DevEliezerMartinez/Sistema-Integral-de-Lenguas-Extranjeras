import { Breadcrumb, Timeline, Spin, Alert, message, Button } from "antd";
import React, { useState, useEffect } from "react";
import { DeleteOutlined, BellOutlined } from "@ant-design/icons";

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

        const data = await response.json();

        if (data.success) {
          if (data.notificaciones && data.notificaciones.length > 0) {
            setNotificaciones(data.notificaciones);
          } else {
            setNotificaciones([]);
          }
        } else {
          setError("Error: " + data.mensaje);
        }
      } catch (err) {
        setError(
          err.response
            ? err.response.data.mensaje
            : "Error al obtener notificaciones"
        );
      } finally {
        setLoading(false);
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

      setNotificaciones(
        notificaciones.filter((notificacion) => notificacion.id !== id)
      );
      message.success("Notificación eliminada exitosamente.");
    } catch (err) {
      message.error("Error al eliminar la notificación.");
    }
  };

  const formatearFecha = (fecha) => {
    const fechaObj = new Date(fecha);
    const ahora = new Date();
    const diferenciaDias = Math.floor((ahora - fechaObj) / (1000 * 60 * 60 * 24));

    // Si es hoy
    if (diferenciaDias === 0) {
      return `Hoy a las ${fechaObj.toLocaleTimeString('es-MX', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })}`;
    }
    
    // Si fue ayer
    if (diferenciaDias === 1) {
      return `Ayer a las ${fechaObj.toLocaleTimeString('es-MX', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })}`;
    }
    
    // Si es esta semana (menos de 7 días)
    if (diferenciaDias < 7) {
      return `Hace ${diferenciaDias} días`;
    }
    
    // Fecha completa
    return fechaObj.toLocaleDateString('es-MX', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" tip="Cargando notificaciones..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-8">
        <Alert message="Error" description={error} type="error" showIcon />
      </div>
    );
  }

  if (notificaciones.length === 0) {
    return (
      <div className="px-4 py-8">
        <Breadcrumb
          className="mb-6"
          items={[
            {
              title: <p className="font-medium text-gray-700">Coordinador</p>,
            },
            {
              title: <span className="text-gray-600">Notificaciones</span>,
            },
          ]}
        />
        <div className="max-w-2xl mx-auto mt-12">
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <BellOutlined className="text-6xl text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No tienes notificaciones
            </h3>
            <p className="text-gray-500">
              Cuando recibas notificaciones, aparecerán aquí.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 max-w-4xl mx-auto">
      <Breadcrumb
        className="mb-6"
        items={[
          {
            title: <p className="font-medium text-gray-700">Coordinador</p>,
          },
          {
            title: <span className="text-gray-600">Notificaciones</span>,
          },
        ]}
      />
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="Montserrat font-semibold text-2xl text-gray-800 flex items-center gap-2">
            <BellOutlined className="text-blue-500" />
            Mis Notificaciones
          </h2>
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {notificaciones.length} {notificaciones.length === 1 ? 'notificación' : 'notificaciones'}
          </span>
        </div>

        <Timeline className="mt-4">
          {notificaciones.map((item) => (
            <Timeline.Item 
              key={item.id}
              color="blue"
            >
              <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200 border border-gray-200">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium mb-2">
                      {item.mensaje}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatearFecha(item.fecha_notificacion)}
                    </p>
                  </div>
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => eliminarNotificacion(item.id)}
                    className="hover:bg-red-50"
                    title="Eliminar notificación"
                  />
                </div>
              </div>
            </Timeline.Item>
          ))}
        </Timeline>
      </div>
    </div>
  );
}

export default Notificaciones;