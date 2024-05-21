// App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from './pages/public/Home'
import Login from './pages/public/Login'
import SignUp from './pages/public/Registro'
import RecuperarPassword from './pages/public/RecuperarPassword'
import Documentacion from './pages/public/Documentacion'
import Dashboard from "./pages/estudiantes/Dashboard";
function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Registro" element={<SignUp />} />
        <Route path="/Recuperar" element={<RecuperarPassword />} />
        <Route path="/Documentacion" element={<Documentacion />} />
        <Route path="/Dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
