// src/services/axiosInstance.js
import axios from "axios";

const instance = axios.create({
  baseURL:
    // lee la variable si existe (Netlify, Vercel, etc.)
    process.env.REACT_APP_API_BASE_URL ||
    // si NO existe (dev local), usa el proxy '/api'
    "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export function setAuthToken(token) {
  if (token) {
    instance.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete instance.defaults.headers.common.Authorization;
  }
}

export default instance;
