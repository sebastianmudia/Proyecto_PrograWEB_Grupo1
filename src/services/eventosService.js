import { EVENTOS_INICIALES } from '../data/mockData';

const CLAVE = 'ulima_eventos';

function calcularPasado(fechaISO) {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  return new Date(fechaISO + 'T00:00:00') < hoy;
}

export function obtenerEventos() {
  const guardados = localStorage.getItem(CLAVE);
  if (guardados) return JSON.parse(guardados);
  localStorage.setItem(CLAVE, JSON.stringify(EVENTOS_INICIALES));
  return EVENTOS_INICIALES;
}

function guardar(lista) {
  localStorage.setItem(CLAVE, JSON.stringify(lista));
}

export function crearEvento(datos) {
  const lista = obtenerEventos();
  const maxId = lista.reduce((max, e) => (e.id > max ? e.id : max), 0);
  const [a, m, d] = datos.fecha.split('-');
  const nuevo = {
    ...datos,
    id:         maxId + 1,
    pasado:     calcularPasado(datos.fecha),
    imagen:     datos.imagen || `https://picsum.photos/seed/ev${Date.now()}/600/340`,
    fechaTexto: datos.fechaTexto || `${d}/${m}/${a}`,
  };
  guardar([...lista, nuevo]);
  return nuevo;
}

export function editarEvento(id, datos) {
  const [a, m, d] = datos.fecha.split('-');
  const actualizado = {
    ...datos,
    id,
    pasado:     calcularPasado(datos.fecha),
    imagen:     datos.imagen || `https://picsum.photos/seed/ev${Date.now()}/600/340`,
    fechaTexto: datos.fechaTexto || `${d}/${m}/${a}`,
  };
  const lista = obtenerEventos().map((e) => (e.id === id ? actualizado : e));
  guardar(lista);
  return lista;
}

export function eliminarEvento(id) {
  const lista = obtenerEventos().filter((e) => e.id !== id);
  guardar(lista);
  return lista;
}
