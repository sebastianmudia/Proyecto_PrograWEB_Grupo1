// ==============================================
// services/temaService.js
// Preferencia de modo oscuro/claro en localStorage
// ==============================================

const CLAVE = "ulima_tema";

export function obtenerTema() {
  return localStorage.getItem(CLAVE) || "light";
}

export function aplicarTema(tema) {
  document.documentElement.setAttribute("data-theme", tema === "dark" ? "dark" : "");
  localStorage.setItem(CLAVE, tema);
}

export function toggleTema() {
  const nuevo = obtenerTema() === "dark" ? "light" : "dark";
  aplicarTema(nuevo);
  return nuevo;
}

export function inicializarTema() {
  aplicarTema(obtenerTema());
}
