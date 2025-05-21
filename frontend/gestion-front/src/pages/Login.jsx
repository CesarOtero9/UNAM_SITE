// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, setAuthToken } from "../services/profesorService";


/**
 * Componente de inicio de sesión
 * ‣ Limpia cualquier Authorization antes de solicitar un nuevo token
 * ‣ Guarda access / refresh / role en localStorage
 * ‣ Inyecta el token en axios para el resto de peticiones
 */
export default function Login() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      /* 1️⃣  Asegúrate de NO mandar Authorization en esta llamada */
      setAuthToken(null);

      /* 2️⃣  Pide los tokens */
      const { data } = await login(user, pass); // { access, refresh, role }

      /* 3️⃣  Guarda en localStorage */
      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);
      localStorage.setItem("userRole", data.role);

      /* 4️⃣  Inyecta el token para llamadas subsecuentes */
      setAuthToken(data.access);

      /* 5️⃣  Redirige al dashboard */
      navigate("/");
    } catch (err) {
      setError("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="mx-auto mt-20 max-w-sm rounded border p-6 shadow">
      <h2 className="mb-4 text-center text-2xl font-bold">Iniciar Sesión</h2>

      {error && <p className="mb-2 text-red-500">{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          className="mb-2 w-full rounded border p-2"
          placeholder="Usuario"
          value={user}
          onChange={(e) => setUser(e.target.value)}
        />
        <input
          className="mb-4 w-full rounded border p-2"
          type="password"
          placeholder="Contraseña"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
        />
        <button
          type="submit"
          className="w-full rounded bg-green-600 p-2 text-white hover:bg-green-700"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
