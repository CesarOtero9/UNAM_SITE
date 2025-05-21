import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { setAuthToken } from "../services/profesorService"; // o tu axiosInstance

export default function useLogout() {
  const navigate = useNavigate();

  return useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userRole");
    setAuthToken(null);           // quita el header Authorization
    navigate("/login", { replace: true });
  }, [navigate]);
}
