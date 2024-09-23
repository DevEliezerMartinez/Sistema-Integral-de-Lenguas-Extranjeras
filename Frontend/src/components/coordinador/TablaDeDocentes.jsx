import React from 'react';
import { Space, Table, message, Button } from 'antd';

const TablaDocentes = ({ docentes, onDocenteEliminado }) => {
  console.log("Render tabla docentes:", docentes); // Ver los docentes en consola

  const columns = [
    {
      title: 'Nombre Completo',
      key: 'nombreCompleto',
      render: (text, record) => `${record.nombre} ${record.apellidos}`, // Combinar nombre y apellidos
    },
    {
      title: 'Correo Electrónico',
      dataIndex: 'correo_electronico', // Asegúrate de que el campo se llama así en tus datos
      key: 'correo_electronico',
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (text, record) => (
        <Space size="middle">
          <Button type="primary" danger onClick={() => onDocenteEliminado(record.docente_id)}>
            Eliminar
          </Button>
        </Space>
      ),
    },
  ];

  const dataWithKeys = docentes.map((docente) => ({
    ...docente,
    key: docente.docente_id,
  }));

  return <Table columns={columns} dataSource={dataWithKeys} />;
};

export default TablaDocentes;
