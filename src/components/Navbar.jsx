// ==============================================
// components/Navbar.jsx
// Navbar con logo clickeable (regresa a /home o /admin/dashboard)
// Toggle modo oscuro incluido
// ==============================================

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/ulimaLogo.png";
import { toggleTema, obtenerTema } from "../services/temaService";
import { esAdmin } from "../services/authService";

// Props:
//   titulo    → "ULIMA EVENTOS" o "ULIMA ADMIN"
//   badge     → badge naranja (ej: "PANEL")
//   acciones  → [{ label, onClick, activo }]
//   onLogout  → función cerrar sesión

const Navbar = ({ titulo = "ULIMA EVENTOS", badge, acciones = [], onLogout }) => {
  const navigate = useNavigate();
  const [tema, setTema] = useState(obtenerTema());

  const handleToggleTema = () => setTema(toggleTema());

  // El logo lleva a la pantalla principal según el rol
  const irAInicio = () => navigate(esAdmin() ? "/admin/dashboard" : "/home");

  const partes = titulo.split(" ");
  const primera = partes[0];
  const resto = partes.slice(1).join(" ");

  const s = {
    nav: {
      backgroundColor: "var(--bg-navbar)",
      padding: "0 28px",
      display: "flex", alignItems: "center",
      justifyContent: "space-between",
      position: "sticky", top: 0, zIndex: 200,
      boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
      height: "62px", gap: "8px",
    },
    izq: {
      display: "flex", alignItems: "center", gap: "10px",
      cursor: "pointer",
    },
    logoImg: { width: "30px", opacity: 0.95 },
    tituloTexto: {
      color: "#ffffff", fontWeight: "700",
      fontSize: "1rem", letterSpacing: "0.04em",
      userSelect: "none",
    },
    naranja: { color: "var(--naranja)" },
    badgeStyle: {
      backgroundColor: "var(--naranja)", color: "#ffffff",
      fontSize: "0.58rem", fontWeight: "700", padding: "3px 8px",
      borderRadius: "3px", letterSpacing: "0.1em", textTransform: "uppercase",
    },
    der: { display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" },
    btnAccion: {
      padding: "7px 14px", background: "none",
      color: "#cccccc", border: "1px solid #3a3a3a",
      borderRadius: "6px", fontSize: "0.78rem",
      fontWeight: "600", cursor: "pointer",
      fontFamily: "'Montserrat', sans-serif",
      transition: "all 0.15s",
    },
    btnActivo: {
      backgroundColor: "var(--naranja)",
      color: "#ffffff", border: "1px solid var(--naranja)",
    },
    btnTema: {
      width: "34px", height: "34px",
      background: "rgba(255,255,255,0.06)",
      border: "1px solid #3a3a3a", borderRadius: "8px",
      cursor: "pointer", fontSize: "1.05rem",
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#dddddd",
    },
    btnLogout: {
      padding: "7px 14px", background: "transparent",
      color: "#888888", border: "1px solid #2a2a2a",
      borderRadius: "6px", fontSize: "0.78rem",
      fontWeight: "600", cursor: "pointer",
      fontFamily: "'Montserrat', sans-serif",
    },
  };

  return (
    <nav style={s.nav}>
      {/* Logo + título — clic para ir al inicio */}
      <div style={s.izq} onClick={irAInicio} title="Ir al inicio">
        <img src={logo} style={s.logoImg} alt="Logo Universidad de Lima" />
        <span style={s.tituloTexto}>
          {primera} <span style={s.naranja}>{resto}</span>
        </span>
        {badge && <span style={s.badgeStyle}>{badge}</span>}
      </div>

      {/* Botones de sección + dark mode + logout */}
      <div style={s.der}>
        {acciones.map((a) => (
          <button
            key={a.label}
            style={{ ...s.btnAccion, ...(a.activo ? s.btnActivo : {}) }}
            onClick={a.onClick}
          >
            {a.label}
          </button>
        ))}
        <button
          style={s.btnTema}
          onClick={handleToggleTema}
          title={tema === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
        >
          {tema === "dark" ? "☀" : "◑"}
        </button>
        <button style={s.btnLogout} onClick={onLogout}>
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
