import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Form, Input, Popconfirm, Table } from 'antd';

const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({
        ...record,
        ...values,
      });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

const App = () => {
  const [dataSource, setDataSource] = useState([
    {
      key: '0',
      name: 'Eliezer',
      lastName: 'Solano Martinez',
      studentId: '191230060',
      career: 'INF',
      grade: 85,
    },
    {
      key: '1',
      name: 'Mariam 1',
      lastName: 'Solano Martinez',
      studentId: '191230061',
      career: 'TUR',
      grade: 60,
    },
    {
      key: '2',
      name: 'Chely',
      lastName: 'Martinez ',
      studentId: '191230062',
      career: 'IGE',
      grade: 92,
    },
  ]);

  const handleDelete = (key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

  const handleGenerate = (key) => {
    console.log(`Generar constancia para el registro con key: ${key}`);
  };

  const defaultColumns = [
    {
      title: 'ID',
      dataIndex: 'key',
      width: '5%',
      editable: false,
    },
    {
      title: 'Nombre',
      dataIndex: 'name',
    },
    {
      title: 'Apellidos',
      dataIndex: 'lastName',
    },
    {
      title: 'Numero de control',
      dataIndex: 'studentId',
    },
    {
      title: 'Carrera',
      dataIndex: 'career',
    },
    {
      title: 'Calificacion',
      dataIndex: 'grade',
      editable: true,
      width: '3%',
    },
    {
      title: 'Acciones',
      dataIndex: 'operation',
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <div className="flex gap-5">
            <Popconfirm
              title="Seguro que deseas borrar?"
              onConfirm={() => handleDelete(record.key)}
            >
              <Button danger type="link">
                Eliminar
              </Button>
            </Popconfirm>
            <Popconfirm
              title="Seguro que deseas generar constancia?"
              onConfirm={() => handleGenerate(record.key)}
            >
              <Button type="default">
                Generar constancia
              </Button>
            </Popconfirm>
          </div>
        ) : null,
    },
  ];

  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  return (
    <div>
      <Table
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={dataSource}
        columns={columns}
      />
    </div>
  );
};

export default App;
