// src/components/SubirCSV.jsx
import React, { useState } from 'react';
import Papa from 'papaparse';
import instance, { setAuthToken } from '../services/axiosInstance';

// Componente para subir y procesar CSV de profesores
const SubirCSV = ({ onSuccess }) => {
  const [archivo, setArchivo] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  // Captura el archivo seleccionado
  const handleArchivoChange = e => {
    setArchivo(e.target.files[0]);
    setMensaje('');
    setError('');
  };

  // Procesa el CSV: lo lee, parsea y envía fila por fila
  const handleSubida = () => {
    if (!archivo) {
      setError('Selecciona un archivo CSV primero.');
      return;
    }

    const reader = new FileReader();
    reader.readAsText(archivo, 'windows-1252');

    reader.onload = async () => {
      const texto = reader.result;
      Papa.parse(texto, {
        header: true,
        skipEmptyLines: true,
        complete: async results => {
          const token = localStorage.getItem('accessToken');
          setAuthToken(token);

          const errores = [];
          for (const row of results.data) {
            try {
              await instance.post('/profesores/', row);
            } catch (err) {
              console.error('Error subiendo fila:', err.response?.data || err);
              errores.push(row);
            }
          }

          if (errores.length === 0) {
            setMensaje('CSV procesado correctamente.');
            onSuccess();             // Cierra modal y refresca dashboard
          } else {
            setError(`${errores.length} registros fallaron al subir.`);
          }
        },
        error: err => {
          console.error('Error al parsear CSV:', err);
          setError('Ocurrió un error al procesar el archivo.');
        }
      });
    };

    reader.onerror = () => {
      console.error('Error leyendo el archivo:', reader.error);
      setError('No se pudo leer el archivo con el encoding especificado.');
    };
  };

  return (
    <div className="my-4">
      <label className="block font-semibold mb-1">Cargar archivo CSV:</label>
      <input
        type="file"
        accept=".csv"
        onChange={handleArchivoChange}
        className="mb-2"
      />
      <button
        onClick={handleSubida}
        className="ml-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
      >
        Subir CSV
      </button>

      {mensaje && <p className="text-green-600 mt-2">{mensaje}</p>}
      {error   && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default SubirCSV;

