import React from 'react';
import { Space, Table, Tag } from 'antd';

const columns = [
  {
    title: 'Nombre',
    dataIndex: 'nombre',
    key: 'nombre',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Apellido',
    dataIndex: 'apellido',
    key: 'apellido',
  },
  {
    title: 'Género',
    dataIndex: 'genero',
    key: 'genero',
  },
  {
    title: 'Teléfono',
    dataIndex: 'telefono',
    key: 'telefono',
  },
  {
    title: 'CURP',
    dataIndex: 'curp',
    key: 'curp',
  },
  {
    title: 'Domicilio',
    dataIndex: 'domicilio',
    key: 'domicilio',
  },
  {
    title: 'Correo',
    dataIndex: 'correo',
    key: 'correo',
  },
  {
    title: 'Contraseña',
    dataIndex: 'contrasena',
    key: 'contrasena',
    render: () => <Tag color="volcano">Confidencial</Tag>, // Por motivos de seguridad se muestra como confidencial
  },
  {
    title: 'Acción',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <a href="#">Editar</a>
        <a href="#">Eliminar</a>
      </Space>
    ),
  },
];

const data = [
  {
    key: '1',
    nombre: 'John',
    apellido: 'Brown',
    genero: 'Masculino',
    telefono: '1234567890',
    curp: 'ABCDE123456FHCXYZ',
    domicilio: 'New York No. 1 Lake Park',
    correo: 'john@example.com',
    contrasena: '*****', // Aquí iría la contraseña real, pero se muestra como asteriscos por seguridad
  },
  {
    key: '2',
    nombre: 'Jane',
    apellido: 'Doe',
    genero: 'Femenino',
    telefono: '0987654321',
    curp: 'FGHIJ987654KLMPQR',
    domicilio: 'London No. 1 Lake Park',
    correo: 'jane@example.com',
    contrasena: '*****',
  },
  {
    key: '3',
    nombre: 'Juan',
    apellido: 'Pérez',
    genero: 'Masculino',
    telefono: '9876543210',
    curp: 'MNOPQ54321RSTUVWX',
    domicilio: 'Sydney No. 1 Lake Park',
    correo: 'juan@example.com',
    contrasena: '*****',
  },
];

const App = () => <Table columns={columns} dataSource={data} />;

export default App;
