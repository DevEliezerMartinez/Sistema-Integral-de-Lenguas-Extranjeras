import React, { useContext, useEffect, useRef, useState } from "react";
import { Form, Input, Table } from "antd";

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
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
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
        style={{ paddingRight: 24 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

const App = ({ solicitudes }) => {
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    if (solicitudes) {
      const formattedData = solicitudes.map((item, index) => ({
        key: item.ID_Inscripcion || index.toString(),
        ...item,
      }));
      setDataSource(formattedData);
    }
  }, [solicitudes]);

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

  const defaultColumns = [
    {
      title: "ID de Inscripción",
      dataIndex: "ID_Inscripcion",
      key: "ID_Inscripcion",
    },
    {
      title: "Nombre Completo",
      dataIndex: "NombreCompleto",
      key: "NombreCompleto",
      render: (_, record) =>
        `${record.Nombre_Alumno} ${record.Apellidos_Alumno}`,
    },
    {
      title: "Fecha de Inscripción",
      dataIndex: "Fecha_Inscripcion",
      key: "Fecha_Inscripcion",
    },
  
    
  ];

  const columns = defaultColumns.map((col) => ({
    ...col,
    onCell: (record) => ({
      record,
      editable: col.editable,
      dataIndex: col.dataIndex,
      title: col.title,
      handleSave,
    }),
  }));

  return (
    <div>
      <Table
        components={components}
        rowClassName={() => "editable-row"}
        bordered
        dataSource={dataSource}
        columns={columns}
        locale={{ emptyText: 'No se encontraron solicitudes para este curso' }}
      />
    </div>
  );
};

export default App;
