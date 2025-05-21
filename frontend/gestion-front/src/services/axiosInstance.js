// src/services/axiosInstance.js
import axios from 'axios';

const instance = axios.create({
  baseURL: '/api',                // proxy lo redirige a http://127.0.0.1:8000/api
  headers: {
    'Content-Type': 'application/json',
  },
});

// Inyecta o quita el header Authorization en este instance
export function setAuthToken(token) {
  if (token) {
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete instance.defaults.headers.common['Authorization'];
  }
}

export default instance;
