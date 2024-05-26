import { Breadcrumb, Timeline } from 'antd';
import React, { useState, useContext } from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import { useAuth } from "../../AuthContext";

function Notificaciones() {

  const { token } = useAuth();

  console.log("🚀 ~ Notificaciones ~ token->", token)

  const [notifications, setNotifications] = useState([
    {
      content: 'Create a services site',
      date: '2015-09-01',
    },
    {
      content: 'Solve initial network problems',
      date: '2015-09-01',
    },
    {
      content: 'Technical testing',
      date: '2015-09-01',
    },
  ]);



  const handleNotificationDelete = (index) => {
    // Update notifications state to remove the deleted item
    setNotifications((prevNotifications) =>
      prevNotifications.filter((_, notificationIndex) => notificationIndex !== index)
    );
  };

  return (
    <div className='px-12'>
    <Breadcrumb
        items={[
          {
            title: <p className="font-medium text-black">Estudiantes</p>,
          },
          {
            title: <a href="">Mis notificaciones</a>,
          },
        ]}
      />
      <h2 className="Montserrat font-medium text-2xl text-center">
        Mis Notificaciones
      </h2>

      <Timeline className="mt-8 px-8">
        {notifications.map((notification, index) => (
          <Timeline.Item key={notification.content}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {notification.content}
              <DeleteOutlined onClick={() => handleNotificationDelete(index)} />
            </div>
          </Timeline.Item>
        ))}
      </Timeline>
    </div>
  );
}

export default Notificaciones;