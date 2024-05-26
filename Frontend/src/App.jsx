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
import CursosActivos from "./pages/docentes/CursoActivo";
import DetalleCursoDocente from "./pages/docentes/DetalleCurso";
import CursosArchivados from "./pages/docentes/CursosArchivados";
import PerfilDocentes from "./pages/docentes/Perfil";
import NotificacionesDocente from "./pages/docentes/Notificaciones";
import LoginCoordinador from "./pages/coordinador/login";
import DashboardCoordinador from './pages/coordinador/Dashboard_coordinador'
import CursosCoordinador from './pages/coordinador/CursoActivo'
import CursosArchivadosCoordinador from './pages/coordinador/CursosArchivados'
import PerfilCoordinador from './pages/coordinador/Perfil'
import NotificacionCoordinador from './pages/coordinador/Notificaciones'
import DetalleCursoCoordinador from './pages/coordinador/DetalleCurso'
import Solicitudes from "./pages/coordinador/Solicitudes";
import NotFound from './pages/public/Notfound'
import ListaAlumnos from "./components/coordinador/ListaAlumnos";
import DetalleAlumno from "./components/coordinador/DetalleAlumno";


function App() {
  return (
    <div>
      <Routes>
        {/*   Rutas publicas */}
        <Route path="*" element={<NotFound />} /> {/* Ruta 404 */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Registro" element={<SignUp />} />
        <Route path="/Recuperar" element={<RecuperarPassword />} />
        <Route path="/Documentacion" element={<Documentacion />} />

        {/*   Rutas Docentes */}
        <Route path="/LoginDocentes" element={<LoginDocentes />} />
        <Route path="/Docentes" element={<DashboardDocentes />}>
          <Route path="/Docentes/CursosActivos" element={<CursosActivos />} />
          <Route path="/Docentes/CursosArchivados" element={<CursosArchivados />} />
          <Route path="/Docentes/Perfil" element={<PerfilDocentes />} />
          <Route path="/Docentes/Notificaciones" element={<NotificacionesDocente />} />
          <Route
            path="/Docentes/Cursos/:cursoId"
            element={< DetalleCursoDocente />}
          />
        </Route>

        {/*   Rutas Alumnos */}
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


        {/*   Rutas Coordinador */}
        <Route path="/LoginCoordinador" element={<LoginCoordinador />} />
        <Route path="/Coordinador" element={<DashboardCoordinador />}>
          <Route path="/Coordinador/CursosActivos" element={<CursosCoordinador />} />
          <Route path="/Coordinador/CursosArchivados" element={<CursosArchivadosCoordinador />} />
          <Route path="/Coordinador/Perfil" element={<PerfilCoordinador />} />
          <Route path="/Coordinador/Notificaciones" element={<NotificacionCoordinador />} />
          <Route path="/Coordinador/Solicitudes" element={<Solicitudes />} />
          <Route path="/Coordinador/Alumnos" element={<ListaAlumnos />} />
          <Route
            path="/Coordinador/Cursos/:cursoId"
            element={< DetalleCursoCoordinador />}
          />
          <Route
            path="/Coordinador/Alumnos/:AlumnoId"
            element={< DetalleAlumno />}
          />
        </Route>
      </Routes>
    </div>
  );
}

export default App;