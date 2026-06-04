// ==============================================
// components/EventCard.jsx
// Tarjeta reutilizable:
//  - Contador regresivo (próximos)
//  - Badge "Finalizado" (pasados)
//  - Badge "Destacado"
//  - Botón favorito (corazón)
//  - Contador de inscritos
//  - Badge "Próximo" en esquina
//  - Hover animado
// ==============================================

import { useState, useEffect } from "react";

// Calcula tiempo restante hasta fecha + hora
function calcularContador(fechaISO, horaStr = "00:00") {
  const [h, m] = (horaStr || "00:00").split(":").map(Number);
  const fecha = new Date(fechaISO + "T00:00:00");
  fecha.setHours(h, m, 0, 0);
  const diff = fecha - new Date();
  if (diff <= 0) return null;
  const dias = Math.floor(diff / (86400 * 1000));
  const horas = Math.floor((diff % (86400 * 1000)) / (3600 * 1000));
  if (dias > 0) return `Faltan ${dias} día${dias !== 1 ? "s" : ""}`;
  if (horas > 0) return `En ${horas} hora${horas !== 1 ? "s" : ""}`;
  const mins = Math.floor((diff % (3600 * 1000)) / 60000);
  return `En ${mins} min`;
}

// Props:
//   evento       → objeto evento
//   onClick      → al hacer clic en la tarjeta
//   esFav        → boolean favorito
//   onToggleFav  → función para marcar/desmarcar favorito

const EventCard = ({ evento, onClick, esFav = false, onToggleFav }) => {
  const [hovered, setHovered] = useState(false);
  const [contador, setContador] = useState(() => calcularContador(evento.fecha, evento.hora));

  useEffect(() => {
    if (evento.pasado) return;
    const iv = setInterval(() => setContador(calcularContador(evento.fecha, evento.hora)), 60000);
    return () => clearInterval(iv);
  }, [evento.fecha, evento.hora, evento.pasado]);

  const cantInscritos = evento.inscritos?.length || 0;

  const handleFavClick = (e) => {
    e.stopPropagation();
    if (onToggleFav) onToggleFav(evento.id);
  };

  return (
    <div
      onClick={() => onClick(evento)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: "var(--bg-card)",
        borderRadius: "10px",
        overflow: "hidden",
        boxShadow: hovered ? "var(--sombra-hover)" : "var(--sombra)",
        cursor: "pointer",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        transition: "transform 0.18s ease, box-shadow 0.18s ease",
        display: "flex",
        flexDirection: "column",
        border: evento.destacado && !evento.pasado
          ? "2px solid var(--naranja)"
          : "2px solid transparent",
        opacity: evento.pasado ? 0.82 : 1,
      }}
    >
      {/* ----- Imagen + badges superpuestos ----- */}
      <div style={{ position: "relative" }}>
        <img
          src={evento.imagen}
          alt={evento.titulo}
          style={{ width: "100%", height: "180px", objectFit: "cover", display: "block" }}
        />

        {/* Badge Destacado — naranja, esquina superior izquierda */}
        {evento.destacado && !evento.pasado && (
          <span style={{
            position: "absolute", top: "10px", left: "10px",
            backgroundColor: "var(--naranja)", color: "#fff",
            fontSize: "0.62rem", fontWeight: "800",
            padding: "4px 10px", borderRadius: "4px",
            letterSpacing: "0.07em", textTransform: "uppercase",
            boxShadow: "0 2px 6px rgba(255,81,23,0.4)",
          }}>
            Destacado
          </span>
        )}

        {/* Badge Finalizado — gris oscuro, esquina superior izquierda */}
        {evento.pasado && (
          <span style={{
            position: "absolute", top: "10px", left: "10px",
            backgroundColor: "rgba(0,0,0,0.6)", color: "#cccccc",
            fontSize: "0.62rem", fontWeight: "700",
            padding: "4px 10px", borderRadius: "4px",
            letterSpacing: "0.07em", textTransform: "uppercase",
          }}>
            Finalizado
          </span>
        )}

        {/* Badge Próximo — verde, esquina superior derecha si no hay favorito */}
        {!evento.pasado && !onToggleFav && (
          <span style={{
            position: "absolute", top: "10px", right: "10px",
            backgroundColor: "#2e7d32", color: "#fff",
            fontSize: "0.6rem", fontWeight: "700",
            padding: "3px 9px", borderRadius: "4px",
            letterSpacing: "0.06em", textTransform: "uppercase",
          }}>
            Próximo
          </span>
        )}

        {/* Contador regresivo — sobre imagen, parte inferior izquierda */}
        {!evento.pasado && contador && (
          <span style={{
            position: "absolute", bottom: "10px", left: "10px",
            backgroundColor: "rgba(17,17,17,0.82)",
            color: "#ffffff",
            fontSize: "0.7rem", fontWeight: "700",
            padding: "3px 9px", borderRadius: "4px",
          }}>
            {contador}
          </span>
        )}

        {/* Botón favorito — corazón, esquina superior derecha */}
        {onToggleFav && (
          <button
            onClick={handleFavClick}
            title={esFav ? "Quitar de favoritos" : "Agregar a favoritos"}
            style={{
              position: "absolute", top: "10px", right: "10px",
              backgroundColor: esFav ? "var(--naranja)" : "rgba(255,255,255,0.9)",
              border: "none", borderRadius: "50%",
              width: "34px", height: "34px",
              cursor: "pointer", fontSize: "1.05rem",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: esFav ? "#fff" : "var(--naranja)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              transition: "background 0.2s, transform 0.15s",
              transform: hovered ? "scale(1.1)" : "scale(1)",
            }}
          >
            {esFav ? "♥" : "♡"}
          </button>
        )}
      </div>

      {/* ----- Contenido textual ----- */}
      <div style={{
        padding: "16px 18px",
        display: "flex", flexDirection: "column", flex: 1,
      }}>
        {/* Carrera + badge Próximo (cuando hay favorito) */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
          <span style={{
            fontSize: "0.67rem", fontWeight: "700",
            letterSpacing: "0.07em", textTransform: "uppercase",
            color: "var(--naranja)",
          }}>
            {evento.carrera}
          </span>
          {!evento.pasado && onToggleFav && (
            <span style={{
              fontSize: "0.62rem", fontWeight: "700",
              color: "#2e7d32", letterSpacing: "0.05em",
            }}>
              Próximo
            </span>
          )}
        </div>

        {/* Título */}
        <div style={{
          fontSize: "0.95rem", fontWeight: "700",
          color: "var(--texto)", marginBottom: "5px", lineHeight: "1.4",
        }}>
          {evento.titulo}
        </div>

        {/* Fecha + hora */}
        <div style={{
          fontSize: "0.75rem", color: "var(--texto-3)",
          marginBottom: "10px", fontWeight: "500",
        }}>
          {evento.fechaTexto || evento.fecha}
          {evento.hora ? ` — ${evento.hora}h` : ""}
        </div>

        {/* Descripción (3 líneas) */}
        <div style={{
          fontSize: "0.82rem", color: "var(--texto-2)",
          lineHeight: "1.6", flex: 1,
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}>
          {evento.descripcion}
        </div>

        {/* Footer: tipo + inscritos */}
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between", marginTop: "12px",
        }}>
          <span style={{
            display: "inline-block", padding: "3px 9px",
            backgroundColor: "var(--bg-badge)",
            borderRadius: "4px", fontSize: "0.67rem",
            fontWeight: "600", color: "var(--texto-3)",
          }}>
            {evento.tipo}
          </span>
          {cantInscritos > 0 && (
            <span style={{ fontSize: "0.72rem", color: "var(--texto-3)", fontWeight: "600" }}>
              {cantInscritos} inscrito{cantInscritos !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
