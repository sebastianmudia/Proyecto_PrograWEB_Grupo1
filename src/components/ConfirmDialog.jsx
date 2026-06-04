// ==============================================
// components/ConfirmDialog.jsx
// Diálogo de confirmación antes de eliminar (HU-13)
// ==============================================

const ConfirmDialog = ({ mensaje, onConfirmar, onCancelar }) => (
  <div style={{
    position: "fixed", inset: 0,
    backgroundColor: "rgba(0,0,0,0.55)", zIndex: 500,
    display: "flex", alignItems: "center", justifyContent: "center", padding: "24px",
  }}>
    <div style={{
      backgroundColor: "var(--bg-card)", borderRadius: "10px",
      padding: "32px 28px", maxWidth: "380px", width: "100%",
      fontFamily: "'Montserrat', sans-serif",
      boxShadow: "var(--sombra-modal)", textAlign: "center",
    }}>
      <div style={{ fontSize: "1.8rem", marginBottom: "12px" }}>⚠️</div>
      <div style={{ fontSize: "1.1rem", fontWeight: "700", color: "var(--texto)", marginBottom: "10px" }}>
        ¿Estás seguro?
      </div>
      <p style={{ fontSize: "0.88rem", color: "var(--texto-2)", marginBottom: "28px", lineHeight: "1.6" }}>
        {mensaje}
      </p>
      <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
        <button
          onClick={onCancelar}
          style={{
            padding: "10px 24px", background: "var(--bg-badge)",
            color: "var(--texto)", border: "1px solid var(--borde)",
            borderRadius: "6px", fontSize: "0.88rem", fontWeight: "600",
            cursor: "pointer", fontFamily: "'Montserrat', sans-serif",
          }}
        >
          Cancelar
        </button>
        <button
          onClick={onConfirmar}
          style={{
            padding: "10px 24px", background: "#cc2200", color: "#ffffff",
            border: "none", borderRadius: "6px", fontSize: "0.88rem",
            fontWeight: "700", cursor: "pointer", fontFamily: "'Montserrat', sans-serif",
          }}
        >
          Sí, eliminar
        </button>
      </div>
    </div>
  </div>
);

export default ConfirmDialog;
