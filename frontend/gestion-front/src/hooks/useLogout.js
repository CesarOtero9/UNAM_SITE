// frontend/gestion-front/src/hooks/useLogout.js

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setAuthToken } from '../services/profesorService';

export default function useAutoLogout() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
      return;
    }

    // Parseamos payload sin jwt-decode
    let exp;
    try {
      const base64Payload = token.split('.')[1];
      const jsonPayload = atob(base64Payload.replace(/-/g, '+').replace(/_/g, '/'));
      exp = JSON.parse(jsonPayload).exp;
    } catch {
      // Si falla el parseo, forzamos logout
      doLogout();
      return;
    }

    const msToExpire = exp * 1000 - Date.now();

    if (msToExpire <= 0) {
      doLogout();
      return;
    }

    const id = setTimeout(doLogout, msToExpire);
    return () => clearTimeout(id);
  }, [navigate]);

  function doLogout() {
    localStorage.clear();
    setAuthToken(null);
    navigate('/login');
  }
}
