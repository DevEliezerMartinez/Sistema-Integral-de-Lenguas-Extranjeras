import React, { useState, useEffect } from 'react';
import { Spin, Alert, List } from 'antd';
import axios from 'axios';

const Notificaciones = ({ userId }) => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotificaciones = async () => {
      try {
        // Hacer la petición para obtener las notificaciones
        const response = await axios.get(`http://127.0.0.1:8000/api/users/notificaciones/${userId}`);
        setNotificaciones(response.data.notificaciones);
        setLoading(false);
      } catch (err) {
        setError(err.response ? err.response.data.mensaje : 'Error al obtener notificaciones');
        setLoading(false);
      }
    };

    fetchNotificaciones();
  }, [userId]);

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
    <List
      itemLayout="horizontal"
      dataSource={notificaciones}
      renderItem={item => (
        <List.Item>
          <List.Item.Meta
            title={item.titulo}
            description={item.descripcion}
          />
        </List.Item>
      )}
    />
  );
};

export default Notificaciones;
