// ==============================================
// components/Loader.jsx
// Spinner simple de carga
// ==============================================

const Loader = () => (
  <div style={{
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    padding: "60px 0", gap: "16px",
  }}>
    <div style={{
      width: "38px", height: "38px",
      border: "4px solid var(--borde)",
      borderTop: "4px solid var(--naranja)",
      borderRadius: "50%",
      animation: "spin 0.75s linear infinite",
    }} />
    <span style={{
      fontSize: "0.88rem", color: "var(--texto-3)",
      fontFamily: "'Montserrat', sans-serif", fontWeight: "500",
    }}>
      Cargando...
    </span>
  </div>
);

export default Loader;
