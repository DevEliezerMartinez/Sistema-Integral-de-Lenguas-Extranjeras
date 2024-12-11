import React from "react";
import { Button, Result, Alert, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { WarningOutlined } from "@ant-design/icons";

const { Paragraph } = Typography;

function NoAutorizado() {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate("/login"); // Redirige al login o cualquier ruta adecuada
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div style={{ maxWidth: 600, textAlign: "center" }}>
        <Result
          status="warning"
          title="Acceso Denegado"
          subTitle="No tienes los permisos necesarios para acceder a esta página."
          icon={<WarningOutlined style={{ color: "#faad14" }} />}
        />
        
        <Alert
          message="Advertencia"
          description="Intentar acceder repetidamente a áreas restringidas puede resultar en sanciones."
          type="warning"
          showIcon
          className="mb-4"
        />

        <Paragraph>
          Si crees que esto es un error, por favor contacta con el administrador del sistema.
        </Paragraph>

        <Button type="primary" onClick={handleRedirect} size="large">
          Ir al Login
        </Button>
      </div>
    </div>
  );
}

export default NoAutorizado;