// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { Spin } from "antd";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin>
          <div style={{ padding: 50 }} />
        </Spin>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si se especifican roles permitidos, verificar
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.tipo_usuario)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
