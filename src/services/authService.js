// ==============================================
// services/authService.js
// Autenticación simulada — acepta correo o código
// ==============================================

import { ADMIN_CREDENCIALES } from "../data/mockData";

const CLAVE_SESION = "ulima_sesion";

// Retorna "admin" | "usuario" | null
export function login(identificador, password) {
  const id = identificador.trim();

  if (id === ADMIN_CREDENCIALES.usuario && password === ADMIN_CREDENCIALES.password) {
    localStorage.setItem(CLAVE_SESION, JSON.stringify({ usuario: "Administrador", rol: "admin" }));
    return "admin";
  }

  const raw = localStorage.getItem("ulima_usuarios");
  if (raw) {
    const usuarios = JSON.parse(raw);
    const encontrado = usuarios.find(
      (u) => (u.correo === id || u.codigo === id) && u.password === password
    );
    if (encontrado) {
      localStorage.setItem(CLAVE_SESION, JSON.stringify({
        id: encontrado.id,
        usuario: encontrado.nombre,
        rol: "usuario",
        carrera: encontrado.carrera,
      }));
      return "usuario";
    }
  }
  return null;
}

export function logout() {
  localStorage.removeItem(CLAVE_SESION);
}

export function obtenerSesion() {
  const raw = localStorage.getItem(CLAVE_SESION);
  return raw ? JSON.parse(raw) : null;
}

export function estaAutenticado() {
  return obtenerSesion() !== null;
}

export function esAdmin() {
  return obtenerSesion()?.rol === "admin";
}

// Actualiza datos de la sesión activa (nombre, carrera)
export function actualizarSesion(datos) {
  const sesion = obtenerSesion();
  if (!sesion) return;
  localStorage.setItem(CLAVE_SESION, JSON.stringify({ ...sesion, ...datos }));
}
