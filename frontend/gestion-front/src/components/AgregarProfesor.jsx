// src/components/AgregarProfesor.jsx
import React, { useState, useEffect } from 'react';
import instance, { setAuthToken } from '../services/axiosInstance';
import { updateProfesor } from '../services/profesorService';

export default function AgregarProfesor({
  profesorInicial = {},
  onClose,
  onSuccess,
}) {
  const isEdit = Boolean(profesorInicial && profesorInicial.id);

  const [form, setForm] = useState({
    nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    correo: '',
    telefono: '',
    calle: '',
    numero_exterior: '',
    numero_interior: '',
    colonia: '',
    codigo_postal: '',
    municipio: '',
    entidad: '',
    especialidad: '',
    numero_trabajador: '',
    rfc: '',
    genero: '',
    genero_otro: '',
    categoria: '',
    categoria_otro: '',
    grado_academico: '',
    grado_academico_otro: '',
    fecha_ingreso: '',
  });
  const [error, setError] = useState('');

  // Al montar, si es edición, precargar datos
  useEffect(() => {
    if (isEdit) {
      const {
        nombre,
        apellido_paterno,
        apellido_materno,
        correo,
        telefono,
        calle,
        numero_exterior,
        numero_interior,
        colonia,
        codigo_postal,
        municipio,
        entidad,
        especialidad,
        numero_trabajador,
        rfc,
        genero,
        categoria,
        grado_academico,
        fecha_ingreso,
      } = profesorInicial;

      setForm({
        nombre,
        apellido_paterno,
        apellido_materno,
        correo,
        telefono,
        calle: calle || '',
        numero_exterior: numero_exterior || '',
        numero_interior: numero_interior || '',
        colonia: colonia || '',
        codigo_postal: codigo_postal || '',
        municipio: municipio || '',
        entidad: entidad || '',
        especialidad,
        numero_trabajador,
        rfc,
        genero,
        genero_otro: genero === 'Otro' ? profesorInicial.genero : '',
        categoria,
        categoria_otro: categoria === 'Otro' ? profesorInicial.categoria : '',
        grado_academico,
        grado_academico_otro:
          grado_academico === 'Otro' ? profesorInicial.grado_academico : '',
        // Ajusta formato ISO para input date
        fecha_ingreso: fecha_ingreso
          ? new Date(fecha_ingreso).toISOString().slice(0, 10)
          : '',
      });
    }
  }, [isEdit, profesorInicial]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    // inyectar token
    const token = localStorage.getItem('accessToken');
    setAuthToken(token);

    // preparar payload normalizando "Otro"
    const payload = {
      ...form,
      genero: form.genero === 'Otro' ? form.genero_otro : form.genero,
      categoria: form.categoria === 'Otro' ? form.categoria_otro : form.categoria,
      grado_academico:
        form.grado_academico === 'Otro'
          ? form.grado_academico_otro
          : form.grado_academico,
    };

    try {
      if (isEdit) {
        await updateProfesor(profesorInicial.id, payload);
      } else {
        await instance.post('/profesores/', payload);
      }
      onSuccess();
    } catch (err) {
      console.error(err);
      const detail =
        err.response?.data || err.response?.data?.detail || err.message;
      setError(`Error al ${isEdit ? 'editar' : 'agregar'} profesor: ${JSON.stringify(detail)}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-3xl overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-bold mb-4">
          {isEdit ? 'Editar' : 'Agregar'} Profesor
        </h2>

        {error && (
          <div className="bg-red-100 text-red-800 p-2 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="nombre"
            placeholder="Nombre"
            required
            value={form.nombre}
            onChange={handleChange}
            className="p-2 border rounded"
          />
          <input
            name="apellido_paterno"
            placeholder="Apellido paterno"
            required
            value={form.apellido_paterno}
            onChange={handleChange}
            className="p-2 border rounded"
          />
          <input
            name="apellido_materno"
            placeholder="Apellido materno"
            required
            value={form.apellido_materno}
            onChange={handleChange}
            className="p-2 border rounded"
          />
          <input
            name="correo"
            type="email"
            placeholder="Correo"
            required
            value={form.correo}
            onChange={handleChange}
            className="p-2 border rounded"
          />
          <input
            name="telefono"
            placeholder="Teléfono"
            required
            value={form.telefono}
            onChange={handleChange}
            className="p-2 border rounded"
          />

          <input
            name="calle"
            placeholder="Calle"
            required
            value={form.calle}
            onChange={handleChange}
            className="p-2 border rounded"
          />
          <input
            name="numero_exterior"
            placeholder="Número exterior"
            required
            value={form.numero_exterior}
            onChange={handleChange}
            className="p-2 border rounded"
          />
          <input
            name="numero_interior"
            placeholder="Número interior"
            required
            value={form.numero_interior}
            onChange={handleChange}
            className="p-2 border rounded"
          />
          <input
            name="colonia"
            placeholder="Colonia"
            required
            value={form.colonia}
            onChange={handleChange}
            className="p-2 border rounded"
          />
          <input
            name="codigo_postal"
            placeholder="Código postal"
            required
            value={form.codigo_postal}
            onChange={handleChange}
            className="p-2 border rounded"
          />
          <input
            name="municipio"
            placeholder="Municipio/Delegación"
            required
            value={form.municipio}
            onChange={handleChange}
            className="p-2 border rounded"
          />
          <input
            name="entidad"
            placeholder="Entidad federativa"
            required
            value={form.entidad}
            onChange={handleChange}
            className="p-2 border rounded"
          />

          <input
            name="especialidad"
            placeholder="Especialidad"
            required
            value={form.especialidad}
            onChange={handleChange}
            className="p-2 border rounded"
          />
          <input
            name="numero_trabajador"
            placeholder="Número de trabajador"
            required
            value={form.numero_trabajador}
            onChange={handleChange}
            className="p-2 border rounded"
          />
          <input
            name="rfc"
            placeholder="RFC"
            required
            value={form.rfc}
            onChange={handleChange}
            className="p-2 border rounded"
          />

          {/* Género */}
          <div className="flex flex-col">
            <label className="font-medium mb-1">Género</label>
            <select
              name="genero"
              required
              value={form.genero}
              onChange={handleChange}
              className="p-2 border rounded"
            >
              <option value="">Selecciona género</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Otro">Otro</option>
            </select>
            {form.genero === 'Otro' && (
              <input
                name="genero_otro"
                placeholder="Especifique género"
                required
                value={form.genero_otro}
                onChange={handleChange}
                className="mt-2 p-2 border rounded"
              />
            )}
          </div>

          {/* Categoría */}
          <div className="flex flex-col">
            <label className="font-medium mb-1">Categoría</label>
            <select
              name="categoria"
              required
              value={form.categoria}
              onChange={handleChange}
              className="p-2 border rounded"
            >
              <option value="">Selecciona categoría</option>
              <option value="Definitivo">Definitivo</option>
              <option value="Tiempo Completo">Tiempo Completo</option>
              <option value="Otro">Otro</option>
            </select>
            {form.categoria === 'Otro' && (
              <input
                name="categoria_otro"
                placeholder="Especifique categoría"
                required
                value={form.categoria_otro}
                onChange={handleChange}
                className="mt-2 p-2 border rounded"
              />
            )}
          </div>

          {/* Grado académico */}
          <div className="flex flex-col">
            <label className="font-medium mb-1">Grado académico</label>
            <select
              name="grado_academico"
              required
              value={form.grado_academico}
              onChange={handleChange}
              className="p-2 border rounded"
            >
              <option value="">Selecciona grado académico</option>
              <option value="Licenciatura">Licenciatura</option>
              <option value="Maestría">Maestría</option>
              <option value="Doctorado">Doctorado</option>
              <option value="Otro">Otro</option>
            </select>
            {form.grado_academico === 'Otro' && (
              <input
                name="grado_academico_otro"
                placeholder="Especifique grado académico"
                required
                value={form.grado_academico_otro}
                onChange={handleChange}
                className="mt-2 p-2 border rounded"
              />
            )}
          </div>

          {/* Fecha de ingreso */}
          <div className="flex flex-col">
            <label className="font-medium mb-1">Fecha de ingreso</label>
            <input
              name="fecha_ingreso"
              type="date"
              required
              value={form.fecha_ingreso}
              onChange={handleChange}
              className="p-2 border rounded"
            />
          </div>
        </form>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            {isEdit ? 'Guardar cambios' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
}
