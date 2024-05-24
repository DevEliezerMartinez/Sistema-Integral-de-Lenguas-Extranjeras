import { Timeline } from 'antd';
import React from 'react';
import { DeleteOutlined } from '@ant-design/icons';

// Import the close icon (replace with your preferred icon library/component)

function Notificaciones() {
  return (
    <div>
      <h2 className="Montserrat font-medium text-2xl text-center">
        Mis Notificaciones
      </h2>

      <Timeline className='mt-8 px-8'>
        { /* Render timeline items with close icons */ }
        {[
          {
            children: (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                Create a services site 2015-09-01
                <DeleteOutlined onClick={() => { /* Handle notification removal logic here */ }} />
              </div>
            ),
          },
          {
            children: (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                Solve initial network problems 2015-09-01
                <DeleteOutlined onClick={() => { /* Handle notification removal logic here */ }} />
              </div>
            ),
          },
          {
            children: (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                Technical testing 2015-09-01
                <DeleteOutlined onClick={() => { /* Handle notification removal logic here */ }} />
              </div>
            ),
          },
          
        ].map((item) => (
          <Timeline.Item key={item.children}>
            {item.children}
          </Timeline.Item>
        ))}
      </Timeline>
    </div>
  );
}

export default Notificaciones;
