// src/hooks/useLogout.js
import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';



export default function useAutoLogout() {
  const navigate = useNavigate();
  const doLogout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userRole');
    navigate('/login');
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    const { exp } = jwtDecode(token);
    const timeout = exp * 1000 - Date.now();
    if (timeout <= 0) {
      doLogout();
      return;
    }

    const timer = setTimeout(doLogout, timeout);
    return () => clearTimeout(timer);
  }, [doLogout]);
}
