// frontend/gestion-front/src/hooks/useLogout.js

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setAuthToken } from '../services/profesorService';
// Traemos jwt-decode con require para evitar problemas de default export
const jwtDecode = require('jwt-decode');

export default function useAutoLogout() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
      return;
    }

    // Decodificamos la fecha de expiración
    const { exp } = jwtDecode(token);
    const msToExpire = exp * 1000 - Date.now();

    if (msToExpire <= 0) {
      // Ya expiró
      localStorage.clear();
      setAuthToken(null);
      navigate('/login');
      return;
    }

    // Programamos el logout automático justo al expirar
    const id = setTimeout(() => {
      localStorage.clear();
      setAuthToken(null);
      navigate('/login');
    }, msToExpire);

    return () => clearTimeout(id);
  }, [navigate]);
}
