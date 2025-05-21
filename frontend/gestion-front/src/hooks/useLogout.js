// frontend/gestion-front/src/hooks/useLogout.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setAuthToken } from '../services/profesorService';
const jwtDecode = require('jwt-decode');

export default function useAutoLogout() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
      return;
    }

    // Decodifica expiración y limpia token al vencer
    const { exp } = jwtDecode(token);
    const msToExpire = exp * 1000 - Date.now();

    if (msToExpire <= 0) {
      localStorage.clear();
      setAuthToken(null);
      navigate('/login');
      return;
    }

    const timeoutId = setTimeout(() => {
      localStorage.clear();
      setAuthToken(null);
      navigate('/login');
    }, msToExpire);

    return () => clearTimeout(timeoutId);
  }, [navigate]);
}
