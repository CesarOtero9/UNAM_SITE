// frontend/gestion-front/src/hooks/useLogout.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
- import jwtDecode from 'jwt-decode';
+ import * as jwtDecode from 'jwt-decode';

export default function useAutoLogout() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    const { exp } = jwtDecode(token);
    const timeout = exp * 1000 - Date.now();
    const handle = setTimeout(() => {
      // limpia todo
      localStorage.clear();
      navigate('/login');
    }, timeout);

    return () => clearTimeout(handle);
  }, [navigate]);
}
