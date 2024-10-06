import React, { useEffect, useState } from 'react';
import { Breadcrumb, Timeline, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

function Notificaciones() {
  const [notificaciones, setNotificaciones] = useState([]);
  const [success, setSuccess] = useState(true); // Estado para manejar el éxito de la respuesta

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
      const response = await fetch(`http://127.0.0.1:8000/api/users/notificaciones/${usuarioId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.success); // Asignar el valor de 'success'
        setNotificaciones(data.notificaciones);
        
        // Si no hay notificaciones pero el success es true
        if (data.success && data.notificaciones.length === 0) {
          message.info('No hay notificaciones disponibles.');
        }
      } else {
        setSuccess(false);
        message.error(data.message || 'Error al cargar las notificaciones');
      }
    } catch (error) {
      setSuccess(false);
      message.error('Ocurrió un error al cargar las notificaciones');
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    if (!token) {
      message.error("Token no encontrado, por favor inicia sesión.");
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/users/notificaciones/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

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
    <div className='px-4'>
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

      <Timeline className='mt-8 px-8'>
        {/* Mostrar mensaje si success es false */}
        {!success ? (
          <Timeline.Item>
            <div>Hubo un problema al cargar las notificaciones.</div>
          </Timeline.Item>
        ) : (
          notificaciones.length > 0 ? (
            notificaciones.map((notificacion) => (
              <Timeline.Item key={notificacion.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{notificacion.mensaje} - {notificacion.fecha_notificacion}</span>
                  <DeleteOutlined onClick={() => handleDelete(notificacion.id)} />
                </div>
              </Timeline.Item>
            ))
          ) : (
            <Timeline.Item>
              <div>No hay notificaciones.</div>
            </Timeline.Item>
          )
        )}
      </Timeline>
    </div>
  );
}

export default Notificaciones;
