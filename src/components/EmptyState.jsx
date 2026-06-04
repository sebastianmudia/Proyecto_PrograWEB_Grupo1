// ==============================================
// components/EmptyState.jsx
// Mensaje visual cuando no hay contenido
// ==============================================

const EmptyState = ({ icono = "—", titulo = "Sin resultados", subtitulo = "" }) => (
  <div style={{
    textAlign: "center", padding: "48px 24px",
    display: "flex", flexDirection: "column", alignItems: "center", gap: "12px",
  }}>
    <div style={{
      width: "68px", height: "68px", borderRadius: "50%",
      backgroundColor: "var(--bg-badge)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: "1.6rem", color: "var(--texto-3)",
      border: "2px dashed var(--borde)", marginBottom: "4px",
    }}>
      {icono}
    </div>
    <div style={{ fontSize: "1rem", fontWeight: "700", color: "var(--texto)" }}>{titulo}</div>
    {subtitulo && (
      <p style={{
        fontSize: "0.85rem", color: "var(--texto-3)",
        maxWidth: "320px", lineHeight: "1.6",
      }}>
        {subtitulo}
      </p>
    )}
  </div>
);

export default EmptyState;
