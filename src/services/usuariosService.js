// ==============================================
// services/usuariosService.js
// Gestión de usuarios en localStorage
// ==============================================

import { USUARIOS_INICIALES } from "../data/mockData";

const CLAVE = "ulima_usuarios";

export function obtenerUsuarios() {
  const raw = localStorage.getItem(CLAVE);
  if (raw) {
    const lista = JSON.parse(raw);
    // Migración: si no tienen password, recarga con iniciales
    if (lista.length > 0 && !lista[0].password) {
      localStorage.setItem(CLAVE, JSON.stringify(USUARIOS_INICIALES));
      return USUARIOS_INICIALES;
    }
    return lista;
  }
  localStorage.setItem(CLAVE, JSON.stringify(USUARIOS_INICIALES));
  return USUARIOS_INICIALES;
}

function guardar(usuarios) {
  localStorage.setItem(CLAVE, JSON.stringify(usuarios));
}

export function registrarUsuario(datos) {
  const usuarios = obtenerUsuarios();
  if (usuarios.some((u) => u.correo === datos.correo)) {
    return { exito: false, mensaje: "Este correo ya está registrado." };
  }
  const maxId = usuarios.reduce((max, u) => (u.id > max ? u.id : max), 0);
  const nuevo = { ...datos, id: maxId + 1 };
  guardar([...usuarios, nuevo]);
  return { exito: true, usuario: nuevo };
}

// Editar nombre, carrera y/o contraseña del perfil
export function editarPerfil(userId, datos) {
  const usuarios = obtenerUsuarios();
  const actualizados = usuarios.map((u) =>
    u.id === userId ? { ...u, ...datos } : u
  );
  guardar(actualizados);
  return actualizados.find((u) => u.id === userId);
}
