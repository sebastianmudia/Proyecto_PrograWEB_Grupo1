import { ADMIN_CREDENCIALES } from '../data/mockData';
import { obtenerUsuarios } from './usuariosService';

export function login(identificador, password) {
  const id = identificador.trim();

  if (id === ADMIN_CREDENCIALES.usuario && password === ADMIN_CREDENCIALES.password) {
    localStorage.setItem('rol', 'admin');
    return 'admin';
  }

  const usuarios   = obtenerUsuarios();
  const encontrado = usuarios.find(
    (u) => (u.correo === id || u.codigo === id) && u.password === password
  );

  if (encontrado) {
    localStorage.setItem('rol', 'usuario');
    localStorage.setItem('usuarioId', encontrado.id);
    return 'usuario';
  }

  return null;
}

export function logout() {
  localStorage.removeItem('rol');
  localStorage.removeItem('usuarioId');
}

export function getRol() {
  return localStorage.getItem('rol');
}

export function getUsuarioId() {
  return parseInt(localStorage.getItem('usuarioId'));
}
