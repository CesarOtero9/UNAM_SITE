// src/services/axiosInstance.js
import axios from "axios";

const instance = axios.create({
  baseURL:
    // producción
    process.env.REACT_APP_API_BASE_URL
      ? `${process.env.REACT_APP_API_BASE_URL}/api`
      // desarrollo local con proxy
      : "/api",
  headers: { "Content-Type": "application/json" },
});

export function setAuthToken(token) {
  if (token) {
    instance.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete instance.defaults.headers.common.Authorization;
  }
}

export default instance;
