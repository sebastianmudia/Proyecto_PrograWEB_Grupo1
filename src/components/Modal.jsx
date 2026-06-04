// ==============================================
// components/Modal.jsx
// Modal genérico reutilizable con CSS variables
// ==============================================

const Modal = ({ children, onClose, maxWidth = "620px" }) => {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0,
        backgroundColor: "rgba(0,0,0,0.55)",
        zIndex: 400, display: "flex",
        alignItems: "center", justifyContent: "center", padding: "20px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "var(--bg-card)",
          borderRadius: "12px", maxWidth,
          width: "100%", maxHeight: "90vh",
          overflowY: "auto", position: "relative",
          boxShadow: "var(--sombra-modal)",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: "14px", right: "16px",
            background: "none", border: "none", fontSize: "1.1rem",
            cursor: "pointer", color: "var(--texto-3)",
            lineHeight: 1, zIndex: 1, fontFamily: "var(--fuente)",
          }}
          title="Cerrar"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
