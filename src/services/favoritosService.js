// ==============================================
// services/favoritosService.js
// Favoritos por usuario en localStorage
// ==============================================

function clave(userId) {
  return `ulima_favoritos_${userId}`;
}

export function obtenerFavoritos(userId) {
  const raw = localStorage.getItem(clave(userId));
  return raw ? JSON.parse(raw) : [];
}

export function esFavorito(userId, eventoId) {
  return obtenerFavoritos(userId).includes(eventoId);
}

// Alterna favorito. Retorna true si quedó como favorito, false si se quitó.
export function toggleFavorito(userId, eventoId) {
  const lista = obtenerFavoritos(userId);
  let nueva;
  let resultado;
  if (lista.includes(eventoId)) {
    nueva = lista.filter((id) => id !== eventoId);
    resultado = false;
  } else {
    nueva = [...lista, eventoId];
    resultado = true;
  }
  localStorage.setItem(clave(userId), JSON.stringify(nueva));
  return resultado;
}
