//frontend\gestion-front\src\App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import ProfesoresDashboard from './pages/ProfesoresDashboard';
import UsuarioDashboard from './pages/UsuarioDashboard';
import Estadisticos from './pages/Estadisticos';
import HeaderUNAM from './components/HeaderUNAM';
import { setAuthToken } from './services/axiosInstance';

export default function App() {
  // Inyecta el token en Axios si existe
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setAuthToken(token);
  }, []);

  const isLogged = Boolean(localStorage.getItem('accessToken'));
  const userRole = localStorage.getItem('userRole');

  return (
    <Router>
      <HeaderUNAM />

      <Routes>
        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Dashboard Profesores */}
        <Route
          path="/profesores"
          element={
            isLogged && ['Administrador','Superusuario'].includes(userRole)
              ? <ProfesoresDashboard />
              : <Navigate to="/login" replace />
          }
        />

        {/* Estadísticas */}
        <Route
          path="/estadisticos"
          element={
            isLogged && ['Administrador','Superusuario'].includes(userRole)
              ? <Estadisticos />
              : <Navigate to="/login" replace />
          }
        />

        {/* Dashboard Usuario estándar */}
        <Route
          path="/usuario"
          element={
            isLogged && userRole === 'Usuario'
              ? <UsuarioDashboard />
              : <Navigate to="/login" replace />
          }
        />

        {/* Redirección por defecto */}
        <Route
          path="*"
          element={
            isLogged
              ? (userRole === 'Usuario'
                  ? <Navigate to="/usuario" replace />
                  : <Navigate to="/profesores" replace />)
              : <Navigate to="/login" replace />
          }
        />
      </Routes>
    </Router>
  );
}
