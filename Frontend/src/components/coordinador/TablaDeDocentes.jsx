import React from 'react';
import { Space, Table, Tag, message } from 'antd';

const TablaDocentes = ({ docentes, onDocenteEliminado }) => {

  const eliminarDocente = async (docente_id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/docentes/${docente_id}`, {
        method: 'DELETE',
        headers: {
          Authorization: "Bearer 1|AFPPXEHDEUyWz1mnsszBCzo3QrKWNc18dAPfae4L2d901636",
        },
      });

      if (response.ok) {
        message.success('Docente eliminado con éxito');
        onDocenteEliminado(docente_id);
      } else {
        message.error('Error al eliminar el docente');
      }
    } catch (error) {
      message.error('Hubo un problema con la solicitud de eliminación');
      console.error('Error eliminando docente:', error);
    }
  };

  const columns = [
    // Column definitions
    // ... (rest of your column definitions)
  ];

  const dataWithKeys = docentes.map((docente) => ({
    ...docente,
    key: docente.docente_id,
  }));

  return <Table columns={columns} dataSource={dataWithKeys} />;
};

export default TablaDocentes;
