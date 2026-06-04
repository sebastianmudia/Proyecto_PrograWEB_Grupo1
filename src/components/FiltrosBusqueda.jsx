// ==============================================
// components/FiltrosBusqueda.jsx
// Barra de búsqueda + filtro carrera + ordenamiento
// ==============================================

import { CARRERAS } from "../data/mockData";

const inputBase = {
  padding: "10px 14px",
  border: "1px solid var(--borde)",
  borderRadius: "8px",
  fontSize: "0.88rem",
  fontFamily: "'Montserrat', sans-serif",
  outline: "none",
  backgroundColor: "var(--bg-input)",
  color: "var(--texto)",
};

const FiltrosBusqueda = ({
  busqueda,
  carreraSeleccionada,
  ordenamiento,
  onBusquedaChange,
  onCarreraChange,
  onOrdenamientoChange,
  placeholder = "Buscar eventos...",
  mostrarOrden = false,
}) => (
  <div style={{
    display: "flex", gap: "10px", marginBottom: "28px",
    flexWrap: "wrap", alignItems: "center",
  }}>
    <input
      type="text"
      placeholder={placeholder}
      value={busqueda}
      onChange={(e) => onBusquedaChange(e.target.value)}
      style={{ ...inputBase, flex: 1, minWidth: "200px" }}
    />
    <select
      value={carreraSeleccionada}
      onChange={(e) => onCarreraChange(e.target.value)}
      style={{ ...inputBase, cursor: "pointer", minWidth: "180px" }}
    >
      {CARRERAS.map((c) => <option key={c} value={c}>{c}</option>)}
    </select>
    {mostrarOrden && onOrdenamientoChange && (
      <select
        value={ordenamiento}
        onChange={(e) => onOrdenamientoChange(e.target.value)}
        style={{ ...inputBase, cursor: "pointer", minWidth: "160px" }}
      >
        <option value="proximos">Más próximos</option>
        <option value="recientes">Más recientes</option>
        <option value="antiguos">Más antiguos</option>
      </select>
    )}
  </div>
);

export default FiltrosBusqueda;
