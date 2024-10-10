import { Breadcrumb, Timeline, Spin, Alert, message } from 'antd';
import React, { useState, useEffect } from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

function Notificaciones() {
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = 1;

  useEffect(() => {
    const fetchNotificaciones = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/users/notificaciones/${userId}`, {
          headers: {
            Authorization: "Bearer 1|AFPPXEHDEUyWz1mnsszBCzo3QrKWNc18dAPfae4L2d901636",
          },
        });
        setNotificaciones(response.data.notificaciones);
        setLoading(false);
      } catch (err) {
        setError(err.response ? err.response.data.mensaje : 'Error al obtener notificaciones');
        setLoading(false);
      }
    };

    fetchNotificaciones();
  }, []);

  const eliminarNotificacion = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/users/notificaciones/${id}`, {
        headers: {
          Authorization: "Bearer 1|AFPPXEHDEUyWz1mnsszBCzo3QrKWNc18dAPfae4L2d901636",
        },
      });
      // Actualizar la lista de notificaciones después de eliminar
      setNotificaciones(notificaciones.filter(notificacion => notificacion.id !== id));
      message.success('Notificación eliminada exitosamente.');
    } catch (err) {
      message.error('Error al eliminar la notificación.');
    }
  };

  if (loading) {
    return <Spin tip="Cargando notificaciones..." />;
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  if (notificaciones.length === 0) {
    return <Alert message="Sin Notificaciones" description="No se encontraron notificaciones para este usuario." type="info" showIcon />;
  }

  return (
    <div className='px-4'>
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

      <Timeline className='mt-8 px-8'>
        {notificaciones.map((item) => (
          <Timeline.Item key={item.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {item.mensaje} - {item.fecha_notificacion}
              <DeleteOutlined onClick={() => eliminarNotificacion(item.id)} />
            </div>w
          </Timeline.Item>
        ))}
      </Timeline>
    </div>
  );
}

export default Notificaciones;
