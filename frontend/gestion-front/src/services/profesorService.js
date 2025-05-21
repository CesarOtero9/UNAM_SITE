// src/services/profesorService.js

import instance, { setAuthToken } from './axiosInstance';

export const login = (username, password) =>
  instance.post('/token/', { username, password });

export const getProfesores = () =>
  instance.get('/profesores/');

export const updateProfesor = (id, data) =>
  instance.patch(`/profesores/${id}/`, data);

export const deleteProfesor = id =>
  instance.delete(`/profesores/${id}/`);


export { setAuthToken };
