// frontend/src/pages/Estadisticos.jsx
// frontend/src/pages/Estadisticos.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfesores, setAuthToken } from '../services/profesorService';
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer,
  LineChart, Line
} from 'recharts';

export default function Estadisticos() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [especialidadFilter, setEspecialidadFilter] = useState('Todas');
  const [darkMode, setDarkMode] = useState(false);
  const [activeGender, setActiveGender] = useState(null);

  const navigate = useNavigate();

  // Fetch data
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setError('Inicia sesión para ver las estadísticas');
      setLoading(false);
      return;
    }
    setAuthToken(token);
    getProfesores()
      .then(res => setData(res.data))
      .catch(() => setError('Error al cargar datos'))
      .finally(() => setLoading(false));
  }, []);

  // Filtering pipeline
  useEffect(() => {
    let result = [...data];
    if (startDate) result = result.filter(p => p.fecha_ingreso >= startDate);
    if (endDate) result = result.filter(p => p.fecha_ingreso <= endDate);
    if (especialidadFilter !== 'Todas') result = result.filter(p => p.especialidad === especialidadFilter);
    if (activeGender) result = result.filter(p => p.genero === activeGender);
    setFilteredData(result);
  }, [data, startDate, endDate, especialidadFilter, activeGender]);

  // Derive unique especialidades
  const especialidades = ['Todas', ...Array.from(new Set(data.map(p => p.especialidad)))];

  // KPI metrics
  const total = filteredData.length;
  const avgAntiguedad = total
    ? (filteredData.reduce((sum, p) => {
        const diff = (new Date() - new Date(p.fecha_ingreso)) / (1000 * 60 * 60 * 24 * 365);
        return sum + diff;
      }, 0) / total).toFixed(1)
    : 0;

  // Gender distribution
  const genderCounts = filteredData.reduce((acc, p) => {
    acc[p.genero] = (acc[p.genero] || 0) + 1;
    return acc;
  }, {});
  const genderData = Object.entries(genderCounts).map(([name, value]) => ({ name, value }));

  // Especialidad distribution
  const espCounts = filteredData.reduce((acc, p) => {
    acc[p.especialidad] = (acc[p.especialidad] || 0) + 1;
    return acc;
  }, {});
  const espData = Object.entries(espCounts).map(([especialidad, count]) => ({ especialidad, count }));

  // Entidad distribution
  const entityCounts = filteredData.reduce((acc, p) => {
    acc[p.entidad] = (acc[p.entidad] || 0) + 1;
    return acc;
  }, {});
  const entityData = Object.entries(entityCounts).map(([name, value]) => ({ name, value }));

  // Hires per year trend
  const yearCounts = filteredData.reduce((acc, p) => {
    const year = new Date(p.fecha_ingreso).getFullYear();
    acc[year] = (acc[year] || 0) + 1;
    return acc;
  }, {});
  const yearData = Object.entries(yearCounts)
    .sort(([a], [b]) => a - b)
    .map(([year, count]) => ({ year, count }));

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#d0ed57', '#a4de6c', '#8dd1e1'];

  // Export CSV
  const handleExportCsv = () => {
    const header = ['ID','Nombre','Paterno','Materno','Correo','Teléfono','Especialidad','Fecha Ingreso','Entidad'];
    const rows = filteredData.map(p => [
      p.id, p.nombre, p.apellido_paterno, p.apellido_materno,
      p.correo, p.telefono, p.especialidad, p.fecha_ingreso, p.entidad
    ]);
    const csv = [header, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'profesores_estadisticas.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <p className="p-6">Cargando estadísticas...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'} p-6 min-h-screen`}>
      {/* Barra superior */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm px-3 py-1 rounded"
        >
          ← Regresar
        </button>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(d => !d)}
            />
            Dark Mode
          </label>
          <button
            onClick={handleExportCsv}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded"
          >
            Exportar CSV
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div>
          <label className="text-sm">Desde:</label>
          <input
            type="date"
            className="block border rounded px-2 py-1 w-full"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm">Hasta:</label>
          <input
            type="date"
            className="block border rounded px-2 py-1 w-full"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm">Especialidad:</label>
          <select
            className="block border rounded px-2 py-1 w-full"
            value={especialidadFilter}
            onChange={e => setEspecialidadFilter(e.target.value)}
          >
            {especialidades.map(es => (
              <option key={es} value={es}>{es}</option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-4 border rounded shadow">
          <h2 className="text-lg font-semibold">Total Profesores</h2>
          <p className="text-2xl">{total}</p>
        </div>
        <div className="p-4 border rounded shadow">
          <h2 className="text-lg font-semibold">Antigüedad Promedio (años)</h2>
          <p className="text-2xl">{avgAntiguedad}</p>
        </div>
        <div className="p-4 border rounded shadow">
          <h2 className="text-lg font-semibold">Especialidades Distintas</h2>
          <p className="text-2xl">{especialidades.length - 1}</p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Pie de género */}
        <div className="p-4 border rounded bg-white shadow">
          <h3 className="text-md font-medium mb-2">Distribución por Género</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={genderData}
                dataKey="value"
                nameKey="name"
                cx="50%" cy="50%"
                outerRadius={80}
                onClick={entry => setActiveGender(entry.name)}
              >
                {genderData.map((entry, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar de especialidades */}
        <div className="p-4 border rounded bg-white shadow">
          <h3 className="text-md font-medium mb-2">Profes por Especialidad</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={espData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="especialidad" angle={-45} textAnchor="end" height={60} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Bar de entidades */}
        <div className="p-4 border rounded bg-white shadow">
          <h3 className="text-md font-medium mb-2">Profes por Entidad</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={entityData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line de tendencias anuales */}
        <div className="p-4 border rounded bg-white shadow">
          <h3 className="text-md font-medium mb-2">Altas por Año</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={yearData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#ffc658" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

