// frontend/gestion-front/src/hooks/useLogout.js
import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

export default function useAutoLogout() {
  const navigate = useNavigate();

  // 1) doLogout estable con useCallback
  const doLogout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userRole');
    navigate('/login');
  }, [navigate]);

  // 2) Juicio de expiración + temporizador
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      doLogout();
      return;
    }
    let exp;
    try {
      ({ exp } = jwt_decode(token));
    } catch {
      doLogout();
      return;
    }
    const now = Date.now();
    if (now >= exp * 1000) {
      doLogout();
    } else {
      const msUntilExpiry = exp * 1000 - now;
      const timer = setTimeout(doLogout, msUntilExpiry);
      return () => clearTimeout(timer);
    }
  }, [doLogout]); // ✅ aquí incluimos doLogout

  return doLogout;
}
