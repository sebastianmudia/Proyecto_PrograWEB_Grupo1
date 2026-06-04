import { USUARIOS_INICIALES } from '../data/mockData';

const CLAVE = 'ulima_usuarios';

export function obtenerUsuarios() {
  const guardados = localStorage.getItem(CLAVE);
  if (guardados) {
    const lista = JSON.parse(guardados);
    if (lista.length > 0 && !lista[0].password) {
      localStorage.setItem(CLAVE, JSON.stringify(USUARIOS_INICIALES));
      return USUARIOS_INICIALES;
    }
    return lista;
  }
  localStorage.setItem(CLAVE, JSON.stringify(USUARIOS_INICIALES));
  return USUARIOS_INICIALES;
}

function guardar(lista) {
  localStorage.setItem(CLAVE, JSON.stringify(lista));
}

export function registrarUsuario(datos) {
  const usuarios = obtenerUsuarios();
  if (usuarios.some((u) => u.correo === datos.correo)) {
    return { exito: false, mensaje: 'Este correo ya está registrado.' };
  }
  const maxId = usuarios.reduce((max, u) => (u.id > max ? u.id : max), 0);
  const nuevo = { ...datos, id: maxId + 1 };
  guardar([...usuarios, nuevo]);
  return { exito: true };
}

export function editarUsuario(id, datos) {
  const lista = obtenerUsuarios().map((u) => (u.id === id ? { ...u, ...datos } : u));
  guardar(lista);
  return lista.find((u) => u.id === id);
}

export function obtenerUsuarioPorId(id) {
  return obtenerUsuarios().find((u) => u.id === id) || null;
}
