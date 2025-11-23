// AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import client from "./axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar si hay un usuario autenticado al cargar la app
  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        localStorage.removeItem("usuario");
      }
    }
    setLoading(false);
  }, []);

  // Función de login
  const login = async (userData) => {
    setUser(userData);
    localStorage.setItem("usuario", JSON.stringify(userData));
  };

  // Función de logout
  const logout = async () => {
    try {
      await client.post("/api/logout");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      setUser(null);
      localStorage.clear();
    }
  };

  // Verificar si está autenticado
  const isAuthenticated = () => {
    return user !== null;
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
