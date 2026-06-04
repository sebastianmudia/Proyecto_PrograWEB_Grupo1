// ==============================================
// components/Toast.jsx
// Notificación temporal tipo toast
// tipo: "exito" | "error" | "info"
// ==============================================

const COLORES = {
  exito: { bg: "#1e6b3c", acento: "#2e7d32" },
  error: { bg: "#8b1a1a", acento: "#cc2200" },
  info:  { bg: "#1c2533", acento: "#ff5117" },
};

const Toast = ({ mensaje, tipo = "info" }) => {
  if (!mensaje) return null;
  const { bg, acento } = COLORES[tipo] || COLORES.info;

  return (
    <div style={{
      position: "fixed", bottom: "24px", right: "24px",
      backgroundColor: bg, color: "#ffffff",
      padding: "12px 20px", borderRadius: "8px",
      fontSize: "0.88rem", fontWeight: "600",
      fontFamily: "'Montserrat', sans-serif",
      boxShadow: "0 4px 18px rgba(0,0,0,0.25)",
      zIndex: 9999, borderLeft: `4px solid ${acento}`,
      maxWidth: "310px", animation: "fadeInUp 0.25s ease",
    }}>
      {mensaje}
    </div>
  );
};

export default Toast;
