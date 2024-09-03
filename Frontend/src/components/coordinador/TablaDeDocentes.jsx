import React from 'react';
import { Space, Table, message, Button } from 'antd';

const TablaDocentes = ({ docentes, onDocenteEliminado }) => {
  console.log("Render tabla docentes,", docentes);

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
    },
    {
      title: 'Apellidos',
      dataIndex: 'apellidos',
      key: 'apellidos',
    },
    {
      title: 'Correo Electrónico',
      dataIndex: 'correo',
      key: 'correo',
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
