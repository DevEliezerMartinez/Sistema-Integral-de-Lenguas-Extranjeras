// App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/public/Home";
import Login from "./pages/public/Login";
import SignUp from "./pages/public/Registro";
import RecuperarPassword from "./pages/public/RecuperarPassword";
import Documentacion from "./pages/public/Documentacion";
import Dashboard from "./pages/estudiantes/Dashboard";
import Cursos from "./pages/estudiantes/Cursos";
import DetalleCurso from "./pages/estudiantes/DetalleCurso";
import Progreso from "./pages/estudiantes/Progreso";
import Perfil from "./pages/estudiantes/Perfil";
import Notificaciones from "./pages/estudiantes/Notificaciones";
import LoginDocentes from "./pages/docentes/Login";
import DashboardDocentes from "./pages/docentes/Dashboard_docentes";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Registro" element={<SignUp />} />
        <Route path="/Recuperar" element={<RecuperarPassword />} />
        <Route path="/Documentacion" element={<Documentacion />} />

        <Route path="/Docentes" element={<DashboardDocentes />}>
          <Route path="/Docentes/Login" element={<LoginDocentes />} />
        </Route>

        <Route path="/Estudiantes" element={<Dashboard />}>
          <Route path="/Estudiantes/Cursos" element={<Cursos />} />
          <Route
            path="/Estudiantes/Cursos/:cursoId"
            element={<DetalleCurso />}
          />
          <Route path="/Estudiantes/Progreso" element={<Progreso />} />
          <Route path="/Estudiantes/Perfil" element={<Perfil />} />
          <Route
            path="/Estudiantes/Notificaciones"
            element={<Notificaciones />}
          />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
