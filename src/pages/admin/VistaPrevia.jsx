// ==============================================
// pages/admin/VistaPrevia.jsx
// Vista previa: el admin ve cómo vería la plataforma un estudiante
// ==============================================

import { useState } from "react";
import EventCard from "../../components/EventCard";
import Modal from "../../components/Modal";
import FiltrosBusqueda from "../../components/FiltrosBusqueda";

const VistaPrevia = ({ eventos, onCerrar }) => {
  const [busqueda, setBusqueda] = useState("");
  const [carrera, setCarrera] = useState("Todas las carreras");
  const [eventoSel, setEventoSel] = useState(null);

  const filtrar = (lista) =>
    lista.filter((e) => {
      const porCarrera = carrera === "Todas las carreras" || e.carrera === carrera;
      const t = busqueda.toLowerCase();
      const porBusqueda = e.titulo.toLowerCase().includes(t) || e.descripcion.toLowerCase().includes(t);
      return porCarrera && porBusqueda;
    });

  const proximos = filtrar(eventos.filter((e) => !e.pasado)).sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
  const historial = filtrar(eventos.filter((e) => e.pasado)).sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  const s = {
    overlay: { position: "fixed", inset: 0, zIndex: 600, backgroundColor: "var(--bg)", overflowY: "auto", fontFamily: "'Montserrat', sans-serif" },
    banner: { backgroundColor: "#111", color: "#fff", padding: "10px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" },
    badgeVP: { backgroundColor: "var(--naranja)", color: "#fff", fontSize: "0.62rem", fontWeight: "700", padding: "3px 8px", borderRadius: "3px", letterSpacing: "0.08em" },
    bannerTexto: { fontSize: "0.8rem", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" },
    btnVolver: { padding: "7px 16px", backgroundColor: "var(--naranja)", color: "#fff", border: "none", borderRadius: "5px", fontSize: "0.78rem", fontWeight: "700", cursor: "pointer", fontFamily: "'Montserrat', sans-serif" },
    navSim: { backgroundColor: "var(--bg-navbar)", borderBottom: "2px solid var(--naranja)", padding: "0 28px", height: "54px", display: "flex", alignItems: "center", justifyContent: "space-between" },
    navTit: { fontSize: "1rem", fontWeight: "700", color: "#fff" },
    naranja: { color: "var(--naranja)" },
    btnSim: { padding: "7px 13px", backgroundColor: "transparent", color: "#777", border: "1px solid #333", borderRadius: "5px", fontSize: "0.78rem", cursor: "default", fontFamily: "'Montserrat', sans-serif", opacity: 0.5 },
    contenido: { maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" },
    sec: { marginBottom: "44px" },
    titSec: { fontSize: "0.95rem", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--texto)", marginBottom: "20px", paddingBottom: "10px", borderBottom: "2px solid var(--naranja)", display: "inline-block" },
    grilla: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" },
    vacio: { color: "var(--texto-3)", fontSize: "0.9rem", fontStyle: "italic" },
    imgDet: { width: "100%", height: "230px", objectFit: "cover", borderRadius: "12px 12px 0 0" },
    cuerpoD: { padding: "24px 28px", fontFamily: "'Montserrat', sans-serif" },
    carreraBadge: { fontSize: "0.7rem", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--naranja)", display: "block", marginBottom: "7px" },
    titD: { fontSize: "1.2rem", fontWeight: "700", color: "var(--texto)", marginBottom: "12px" },
    bannerF: { backgroundColor: "var(--naranja)", color: "#fff", padding: "9px 15px", borderRadius: "6px", fontSize: "0.85rem", fontWeight: "600", marginBottom: "9px" },
    bannerL: { backgroundColor: "var(--bg-badge)", color: "var(--texto-2)", padding: "9px 15px", borderRadius: "6px", fontSize: "0.83rem", marginBottom: "16px" },
    descD: { fontSize: "0.86rem", color: "var(--texto-2)", lineHeight: "1.75" },
  };

  return (
    <div style={s.overlay}>
      <div style={s.banner}>
        <div style={s.bannerTexto}>
          <span style={s.badgeVP}>VISTA PREVIA</span>
          <span>Así ve la plataforma un estudiante</span>
        </div>
        <button style={s.btnVolver} onClick={onCerrar}>Volver al panel de administración</button>
      </div>

      <div style={s.navSim}>
        <span style={s.navTit}>ULIMA <span style={s.naranja}>EVENTOS</span></span>
        <span style={s.btnSim}>Cerrar Sesión</span>
      </div>

      <div style={s.contenido}>
        <FiltrosBusqueda
          busqueda={busqueda} carreraSeleccionada={carrera}
          onBusquedaChange={setBusqueda} onCarreraChange={setCarrera}
        />

        <section style={s.sec}>
          <div style={s.titSec}>Próximos Eventos</div>
          {proximos.length === 0 ? <p style={s.vacio}>No hay eventos próximos.</p> : (
            <div style={s.grilla}>
              {proximos.map((ev) => <EventCard key={ev.id} evento={ev} onClick={setEventoSel} />)}
            </div>
          )}
        </section>

        <section style={s.sec}>
          <div style={s.titSec}>Historial de Eventos</div>
          {historial.length === 0 ? <p style={s.vacio}>No hay eventos en el historial.</p> : (
            <div style={s.grilla}>
              {historial.map((ev) => <EventCard key={ev.id} evento={ev} onClick={setEventoSel} />)}
            </div>
          )}
        </section>
      </div>

      {eventoSel && (
        <Modal onClose={() => setEventoSel(null)}>
          <img src={eventoSel.imagen} alt={eventoSel.titulo} style={s.imgDet} />
          <div style={s.cuerpoD}>
            <span style={s.carreraBadge}>{eventoSel.carrera}</span>
            <div style={s.titD}>{eventoSel.titulo}</div>
            <div style={s.bannerF}>{eventoSel.fechaTexto || eventoSel.fecha}</div>
            <div style={s.bannerL}>{eventoSel.lugar}</div>
            <p style={s.descD}>{eventoSel.descripcion}</p>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default VistaPrevia;
