// ==============================================
// services/eventosService.js
// CRUD de eventos en localStorage
// pasado se calcula automáticamente por fecha
// Incluye inscripciones y destacado
// ==============================================

import { EVENTOS_INICIALES } from "../data/mockData";

const CLAVE = "ulima_eventos";

// Un evento es "pasado" si su fecha ya ocurrió
function calcularPasado(fechaISO) {
  if (!fechaISO) return false;
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  return new Date(fechaISO + "T00:00:00") < hoy;
}

// Normaliza un evento garantizando todos los campos necesarios
function normalizar(e) {
  return {
    hora: "",
    destacado: false,
    inscritos: [],
    ...e,
    pasado: calcularPasado(e.fecha),
  };
}

export function obtenerEventos() {
  const raw = localStorage.getItem(CLAVE);
  if (raw) {
    return JSON.parse(raw).map(normalizar);
  }
  const iniciales = EVENTOS_INICIALES.map(normalizar);
  localStorage.setItem(CLAVE, JSON.stringify(iniciales));
  return iniciales;
}

function guardar(eventos) {
  localStorage.setItem(CLAVE, JSON.stringify(eventos));
}

export function crearEvento(datos) {
  const lista = obtenerEventos();
  const maxId = lista.reduce((max, e) => (e.id > max ? e.id : max), 0);
  const nuevo = normalizar({ ...datos, id: maxId + 1 });
  guardar([...lista, nuevo]);
  return nuevo;
}

export function editarEvento(actualizado) {
  const lista = obtenerEventos().map((e) =>
    e.id === actualizado.id ? normalizar(actualizado) : e
  );
  guardar(lista);
  return lista;
}

export function eliminarEvento(id) {
  const lista = obtenerEventos().filter((e) => e.id !== id);
  guardar(lista);
  return lista;
}

// Marca o desmarca un evento como destacado
// Solo un evento puede estar destacado a la vez
export function toggleDestacado(eventoId) {
  const lista = obtenerEventos().map((e) => ({
    ...e,
    destacado: e.id === eventoId ? !e.destacado : false,
  }));
  guardar(lista);
  return lista;
}

// Inscribe a un usuario en un evento
export function inscribirUsuario(eventoId, usuario) {
  const lista = obtenerEventos().map((e) => {
    if (e.id !== eventoId) return e;
    const yaInscrito = e.inscritos.some((u) => u.id === usuario.id);
    if (yaInscrito) return e;
    return { ...e, inscritos: [...e.inscritos, usuario] };
  });
  guardar(lista);
  return lista;
}

// Cancela la inscripción de un usuario en un evento
export function cancelarInscripcion(eventoId, usuarioId) {
  const lista = obtenerEventos().map((e) => {
    if (e.id !== eventoId) return e;
    return { ...e, inscritos: e.inscritos.filter((u) => u.id !== usuarioId) };
  });
  guardar(lista);
  return lista;
}
