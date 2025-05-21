// src/pages/ProfesoresDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";                     // ojo: instala jwt-decode y ajusta la import si tu bundler lo requiere
import useLogout from "../hooks/useLogout";            // hook que limpia tokens y redirige
import AgregarProfesor from "../components/AgregarProfesor";
import SubirCSV from "../components/SubirCSV";
import {
  getProfesores,
  setAuthToken,
  deleteProfesor,
} from "../services/profesorService";
import macroImage from "../assets/macro.png";
import macroHelp from "../assets/Macro_de_ayuda.xlsm";  // plantilla para CSV

export default function ProfesoresDashboard() {
  const [profesores, setProfesores] = useState([]);
  const [filteredProfesores, setFilteredProfesores] = useState([]);
  const [error, setError] = useState("");
  const [modalData, setModalData] = useState(null);
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [filters, setFilters] = useState({});

  const navigate = useNavigate();
  const logout = useLogout();                           // hook para logout manual/automático
  const role = localStorage.getItem("userRole");

  // Al montar: verifica token, lo inyecta y programa el logout automático
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setError("Sin token, inicia sesión de nuevo.");
      return navigate("/login");
    }

    setAuthToken(token);
    refreshProfesores();

    // decodifica fecha de expiración y programa logout
    try {
      const { exp } = jwtDecode(token);
      const delay = exp * 1000 - Date.now();
      if (delay <= 0) {
        logout();
      } else {
        setTimeout(() => logout(), delay);
      }
    } catch {
      // si hay fallo decodificando, forzar logout
      logout();
    }
  }, []);

  const refreshProfesores = () => {
    getProfesores()
      .then((res) => {
        setProfesores(res.data);
        setFilteredProfesores(res.data);
      })
      .catch(() => setError("Error al obtener profesores."));
  };

  // Filtrado por columnas
  useEffect(() => {
    let result = profesores;
    Object.entries(filters).forEach(([field, value]) => {
      if (value) {
        result = result.filter((prof) =>
          (prof[field]?.toString().toLowerCase() || "").includes(value.toLowerCase())
        );
      }
    });
    setFilteredProfesores(result);
  }, [filters, profesores]);

  const handleEliminar = async (prof) => {
    if (!window.confirm(`¿Eliminar a ${prof.nombre} ${prof.apellido_paterno}?`)) return;
    try {
      await deleteProfesor(prof.id);
      refreshProfesores();
    } catch {
      alert("No se pudo eliminar");
    }
  };

  const btnClass = "text-sm px-4 py-2 rounded";
  const actionBtnClass = "text-xs font-semibold py-1 px-2 rounded";

  const columns = [
    { key: "id", label: "ID" },
    { key: "nombre", label: "Nombre" },
    { key: "apellido_paterno", label: "Paterno" },
    { key: "apellido_materno", label: "Materno" },
    { key: "correo", label: "Correo" },
    { key: "telefono", label: "Teléfono" },
    { key: "calle", label: "Calle" },
    { key: "numero_exterior", label: "N.º Ext" },
    { key: "numero_interior", label: "N.º Int" },
    { key: "colonia", label: "Colonia" },
    { key: "codigo_postal", label: "CP" },
    { key: "municipio", label: "Municipio" },
    { key: "entidad", label: "Entidad" },
    { key: "especialidad", label: "Especialidad" },
    { key: "numero_trabajador", label: "N.º Trabajador" },
    { key: "rfc", label: "RFC" },
    { key: "genero", label: "Género" },
    { key: "categoria", label: "Categoría" },
    { key: "grado_academico", label: "Grado Acad." },
    { key: "fecha_ingreso", label: "Fecha Ingreso" },
    { key: "actions", label: "Acciones" },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Dashboard de Profesores</h1>
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded"
        >
          Cerrar sesión
        </button>
      </div>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      {(role === "Administrador" || role === "Superusuario") && (
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setModalData({})}
            className={`bg-green-600 hover:bg-green-700 text-white ${btnClass}`}
          >
            Agregar profesor
          </button>
          <button
            onClick={() => setShowCsvModal(true)}
            className={`bg-purple-600 hover:bg-purple-700 text-white ${btnClass}`}
          >
            Subir CSV
          </button>
          <button
            onClick={() => navigate("/estadisticos")}
            className={`bg-yellow-600 hover:bg-yellow-700 text-white ${btnClass}`}
          >
            Estadísticas
          </button>
        </div>
      )}

      {showCsvModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Instrucciones para Subir CSV</h2>
            <p className="mb-4 text-gray-700">
              Descarga la plantilla, rellena y guárdala como CSV.
            </p>
            <div className="text-center mb-4">
              <a href={macroHelp} download="Macro_de_ayuda.xlsm">
                <img
                  src={macroImage}
                  alt="Macro de ayuda"
                  className="mx-auto mb-2"
                  style={{ width: 120 }}
                />
              </a>
              <p className="text-xs text-gray-500">
                Haz clic en la imagen para descargar la macro.
              </p>
            </div>
            <SubirCSV onSuccess={() => { setShowCsvModal(false); refreshProfesores(); }} />
            <button
              onClick={() => setShowCsvModal(false)}
              className="mt-4 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Tabla con filtros */}
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100">
              {columns.map((col) => (
                <th key={col.key} className="border px-2 py-1 text-left text-sm">
                  <div className="flex flex-col">
                    <span>{col.label}</span>
                    {col.key !== "actions" && (
                      <input
                        type="text"
                        placeholder={`Filtrar ${col.label}`}
                        value={filters[col.key] || ""}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            [col.key]: e.target.value,
                          }))
                        }
                        className="text-xs p-1 border rounded mt-1"
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredProfesores.map((prof) => (
              <tr key={prof.id} className="hover:bg-gray-50">
                {columns.map((col) =>
                  col.key === "actions" ? (
                    <td key="actions" className="border px-2 py-1 text-sm">
                      {(role === "Administrador" || role === "Superusuario") && (
                        <div className="flex gap-1">
                          <button
                            onClick={() => setModalData(prof)}
                            className={`bg-blue-500 hover:bg-blue-600 text-white ${actionBtnClass}`}
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleEliminar(prof)}
                            className={`bg-red-500 hover:bg-red-600 text-white ${actionBtnClass}`}
                          >
                            Eliminar
                          </button>
                        </div>
                      )}
                    </td>
                  ) : (
                    <td key={col.key} className="border px-2 py-1 text-sm">
                      {prof[col.key]}
                    </td>
                  )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Agregar/Editar */}
      {modalData !== null && (
        <AgregarProfesor
          profesorInicial={modalData}
          onClose={() => {
            setModalData(null);
            refreshProfesores();
          }}
          onSuccess={() => {
            setModalData(null);
            refreshProfesores();
          }}
        />
      )}
    </div>
);
}
