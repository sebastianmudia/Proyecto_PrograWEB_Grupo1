// ==============================================
// pages/admin/AdminDashboard.jsx
// Panel de administración con diseño limpio
// HU-10 al HU-15 + Destacado + Inscritos + Vista previa
// ==============================================

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Navbar        from "../../components/Navbar";
import ConfirmDialog from "../../components/ConfirmDialog";
import Toast         from "../../components/Toast";
import FiltrosBusqueda from "../../components/FiltrosBusqueda";
import Modal         from "../../components/Modal";
import FormularioEvento from "./FormularioEvento";
import VistaPrevia   from "./VistaPrevia";

import {
  obtenerEventos, crearEvento, editarEvento,
  eliminarEvento, toggleDestacado,
} from "../../services/eventosService";
import { obtenerUsuarios } from "../../services/usuariosService";
import { logout, estaAutenticado, esAdmin } from "../../services/authService";
import { inicializarTema } from "../../services/temaService";
import { CARRERAS } from "../../data/mockData";

const SECCIONES = { EVENTOS: "eventos", USUARIOS: "usuarios" };

// ─── Ícono estrella ────────────────────────────────────────────────────────
const StarIcon = ({ filled }) => (
  <svg width="13" height="13" viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    style={{ verticalAlign: "middle" }}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [seccion,         setSeccion]         = useState(SECCIONES.EVENTOS);
  const [mostrarVistaPrev,setMostrarVistaPrev]= useState(false);
  const [eventos,         setEventos]         = useState([]);
  const [usuarios,        setUsuarios]        = useState([]);

  const [busqueda,        setBusqueda]        = useState("");
  const [filtroCarreraEv, setFiltroCarreraEv] = useState("Todas las carreras");
  const [filtroCarreraUs, setFiltroCarreraUs] = useState("Todas las carreras");

  const [mostrarForm,     setMostrarForm]     = useState(false);
  const [eventoEditar,    setEventoEditar]    = useState(null);
  const [eventoEliminar,  setEventoEliminar]  = useState(null);
  const [eventoInscritos, setEventoInscritos] = useState(null);

  const [toast,           setToast]           = useState({ msg: "", tipo: "info" });

  useEffect(() => {
    inicializarTema();
    if (!estaAutenticado() || !esAdmin()) { navigate("/"); return; }
    setEventos(obtenerEventos());
    setUsuarios(obtenerUsuarios());
  }, []);

  const mostrarToast = (msg, tipo = "info") => {
    setToast({ msg, tipo });
    setTimeout(() => setToast({ msg: "", tipo: "info" }), 3000);
  };

  // ── CRUD ──
  const handleCrear = (datos) => {
    const nuevo = crearEvento(datos);
    setEventos((p) => [...p, nuevo]);
    setMostrarForm(false);
    mostrarToast("Evento creado exitosamente.", "exito");
  };

  const handleEditar = (datos) => {
    const lista = editarEvento(datos);
    setEventos(lista);
    setEventoEditar(null);
    setMostrarForm(false);
    mostrarToast("Evento actualizado.", "exito");
  };

  const handleEliminar = () => {
    const lista = eliminarEvento(eventoEliminar.id);
    setEventos(lista);
    setEventoEliminar(null);
    mostrarToast("Evento eliminado.");
  };

  const handleToggleDestacado = (eventoId) => {
    const lista = toggleDestacado(eventoId);
    setEventos(lista);
    const ev = lista.find((e) => e.id === eventoId);
    mostrarToast(ev?.destacado ? "Evento marcado como destacado." : "Destacado quitado.");
  };

  const handleLogout = () => { logout(); navigate("/"); };

  // ── Filtros ──
  const eventosFiltrados = eventos.filter((e) => {
    const porCarrera = filtroCarreraEv === "Todas las carreras" || e.carrera === filtroCarreraEv;
    const t = busqueda.toLowerCase();
    return porCarrera && (e.titulo.toLowerCase().includes(t) || e.descripcion.toLowerCase().includes(t));
  });

  const usuariosFiltrados = usuarios.filter(
    (u) => filtroCarreraUs === "Todas las carreras" || u.carrera === filtroCarreraUs
  );

  // ── Estadísticas ──
  const totalInscritos = eventos.reduce((s, e) => s + (e.inscritos?.length || 0), 0);
  const carreraMasEventos = (() => {
    const c = {};
    eventos.forEach((e) => { c[e.carrera] = (c[e.carrera] || 0) + 1; });
    return Object.entries(c).sort((a, b) => b[1] - a[1])[0]?.[0]?.split(" ")[0] || "—";
  })();

  const accionesNav = [
    { label: "Eventos",     activo: seccion === SECCIONES.EVENTOS,   onClick: () => setSeccion(SECCIONES.EVENTOS) },
    { label: "Usuarios",    activo: seccion === SECCIONES.USUARIOS,  onClick: () => setSeccion(SECCIONES.USUARIOS) },
    { label: "Vista previa",activo: false,                           onClick: () => setMostrarVistaPrev(true) },
  ];

  const iniciales = (nombre) => {
    const p = nombre.split(" ");
    return p.length >= 2 ? p[0][0] + p[1][0] : nombre.slice(0, 2).toUpperCase();
  };

  // ── Estilos reutilizables ──
  const th = {
    padding: "11px 14px",
    backgroundColor: "var(--bg-hover)",
    color: "var(--texto-3)", fontWeight: "700",
    fontSize: "0.72rem", letterSpacing: "0.07em",
    textTransform: "uppercase", textAlign: "left",
    borderBottom: "1px solid var(--borde)",
  };
  const td = {
    padding: "13px 14px", fontSize: "0.85rem",
    color: "var(--texto)", borderBottom: "1px solid var(--borde)",
    verticalAlign: "middle",
  };
  const tabla = {
    width: "100%", backgroundColor: "var(--bg-card)",
    borderRadius: "10px", overflow: "hidden",
    boxShadow: "var(--sombra)", borderCollapse: "collapse",
  };
  const badge = (color, bg) => ({
    display: "inline-block", padding: "3px 9px",
    backgroundColor: bg, color,
    borderRadius: "4px", fontSize: "0.7rem", fontWeight: "700",
  });

  // Botón editar — negro sobre blanco
  const btnEditar = {
    padding: "6px 12px",
    backgroundColor: "var(--texto)",
    color: "var(--bg-card)",
    border: "none", borderRadius: "5px",
    fontSize: "0.76rem", fontWeight: "700",
    cursor: "pointer", fontFamily: "'Montserrat', sans-serif",
  };
  // Botón eliminar — rojo suave
  const btnEliminar = {
    padding: "6px 12px",
    backgroundColor: "#fff0ed",
    color: "#cc2200",
    border: "1px solid #ffccc4",
    borderRadius: "5px", fontSize: "0.76rem",
    fontWeight: "700", cursor: "pointer",
    fontFamily: "'Montserrat', sans-serif",
  };

  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh", fontFamily: "'Montserrat', sans-serif" }}>
      <Navbar titulo="ULIMA ADMIN" badge="PANEL" acciones={accionesNav} onLogout={handleLogout} />

      <main style={{ maxWidth: "1240px", margin: "0 auto", padding: "32px 24px" }}>

        {/* ══════ SECCIÓN EVENTOS ══════ */}
        {seccion === SECCIONES.EVENTOS && (
          <>
            {/* Estadísticas */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "14px", marginBottom: "28px",
            }}>
              {[
                { num: eventos.length,                          label: "Total eventos" },
                { num: eventos.filter((e) => !e.pasado).length,label: "Próximos" },
                { num: eventos.filter((e) => e.pasado).length, label: "Finalizados" },
                { num: usuarios.length,                         label: "Usuarios" },
                { num: totalInscritos,                          label: "Inscripciones" },
                { num: carreraMasEventos,                       label: "Carrera top" },
              ].map((st) => (
                <div key={st.label} style={{
                  backgroundColor: "var(--bg-card)",
                  borderRadius: "8px", padding: "16px 18px",
                  boxShadow: "var(--sombra)",
                }}>
                  <div style={{ fontSize: "1.85rem", fontWeight: "700", color: "var(--naranja)", lineHeight: 1 }}>
                    {st.num}
                  </div>
                  <div style={{ fontSize: "0.74rem", color: "var(--texto-3)", marginTop: "4px", fontWeight: "600" }}>
                    {st.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Encabezado */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "22px", flexWrap: "wrap", gap: "12px" }}>
              <h2 style={{ fontSize: "1.1rem", fontWeight: "700", color: "var(--texto)", borderLeft: "4px solid var(--naranja)", paddingLeft: "12px" }}>
                Gestión de Eventos
              </h2>
              <button
                onClick={() => { setEventoEditar(null); setMostrarForm(true); }}
                style={{ padding: "10px 20px", backgroundColor: "var(--naranja)", color: "#fff", border: "none", borderRadius: "6px", fontSize: "0.87rem", fontWeight: "700", cursor: "pointer", fontFamily: "'Montserrat', sans-serif" }}
              >
                + Nuevo Evento
              </button>
            </div>

            {/* Filtros */}
            <FiltrosBusqueda
              busqueda={busqueda}
              carreraSeleccionada={filtroCarreraEv}
              onBusquedaChange={setBusqueda}
              onCarreraChange={setFiltroCarreraEv}
              placeholder="Buscar por título o descripción..."
            />

            {/* Tabla de eventos */}
            <table style={tabla}>
              <thead>
                <tr>
                  <th style={th}>Imagen</th>
                  <th style={th}>Título</th>
                  <th style={th}>Carrera</th>
                  <th style={th}>Fecha</th>
                  <th style={th}>Estado</th>
                  <th style={th}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {eventosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: "32px", textAlign: "center", color: "var(--texto-3)", fontStyle: "italic" }}>
                      No se encontraron eventos.
                    </td>
                  </tr>
                ) : eventosFiltrados.map((ev) => (
                  <tr key={ev.id}>
                    {/* Imagen */}
                    <td style={td}>
                      <img src={ev.imagen} alt={ev.titulo}
                        style={{ width: "54px", height: "38px", objectFit: "cover", borderRadius: "5px" }} />
                    </td>

                    {/* Título + tipo + destacado */}
                    <td style={td}>
                      <div style={{ fontWeight: "700", fontSize: "0.87rem", color: "var(--texto)" }}>
                        {ev.titulo}
                      </div>
                      <div style={{ fontSize: "0.73rem", color: "var(--texto-3)", marginTop: "2px" }}>
                        {ev.tipo}
                      </div>
                      {ev.destacado && (
                        <div style={{ fontSize: "0.68rem", color: "var(--naranja)", fontWeight: "700", marginTop: "2px" }}>
                          Destacado
                        </div>
                      )}
                    </td>

                    {/* Carrera */}
                    <td style={td}>
                      <span style={badge("var(--naranja)", "#fff4f0")}>{ev.carrera}</span>
                    </td>

                    {/* Fecha */}
                    <td style={{ ...td, fontSize: "0.82rem", whiteSpace: "nowrap" }}>
                      {ev.fecha}
                      {ev.hora ? <div style={{ color: "var(--texto-3)", fontSize: "0.75rem" }}>{ev.hora}h</div> : null}
                    </td>

                    {/* Estado */}
                    <td style={td}>
                      {ev.pasado
                        ? <span style={badge("var(--texto-3)", "var(--bg-badge)")}>Historial</span>
                        : <span style={badge("#2e7d32", "#e8f5e9")}>Próximo</span>}
                    </td>

                    {/* Acciones */}
                    <td style={td}>
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                        {/* Destacar */}
                        <button
                          onClick={() => handleToggleDestacado(ev.id)}
                          style={{
                            padding: "6px 11px",
                            backgroundColor: ev.destacado ? "var(--naranja)" : "var(--bg-badge)",
                            color: ev.destacado ? "#fff" : "var(--texto-3)",
                            border: ev.destacado ? "none" : "1px solid var(--borde)",
                            borderRadius: "5px", fontSize: "0.74rem", fontWeight: "700",
                            cursor: "pointer", fontFamily: "'Montserrat', sans-serif",
                            display: "flex", alignItems: "center", gap: "4px",
                          }}
                          title={ev.destacado ? "Quitar destacado" : "Marcar como destacado"}
                        >
                          <StarIcon filled={ev.destacado} />
                          {ev.destacado ? "Destacado" : "Destacar"}
                        </button>

                        {/* Editar */}
                        <button
                          style={btnEditar}
                          onClick={() => { setEventoEditar(ev); setMostrarForm(true); }}
                        >
                          Editar
                        </button>

                        {/* Eliminar */}
                        <button style={btnEliminar} onClick={() => setEventoEliminar(ev)}>
                          Eliminar
                        </button>

                        {/* Inscritos */}
                        <button
                          onClick={() => setEventoInscritos(ev)}
                          style={{
                            padding: "6px 11px",
                            backgroundColor: "var(--bg-badge)",
                            color: "var(--texto-2)",
                            border: "1px solid var(--borde)",
                            borderRadius: "5px", fontSize: "0.74rem", fontWeight: "600",
                            cursor: "pointer", fontFamily: "'Montserrat', sans-serif",
                          }}
                        >
                          Inscritos ({ev.inscritos?.length || 0})
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* ══════ SECCIÓN USUARIOS ══════ */}
        {seccion === SECCIONES.USUARIOS && (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
              <h2 style={{ fontSize: "1.1rem", fontWeight: "700", color: "var(--texto)", borderLeft: "4px solid var(--naranja)", paddingLeft: "12px" }}>
                Usuarios Registrados
              </h2>
              <span style={{ fontSize: "0.85rem", color: "var(--texto-3)", fontWeight: "600" }}>
                {usuariosFiltrados.length} usuario{usuariosFiltrados.length !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Filtro por carrera */}
            <select
              value={filtroCarreraUs}
              onChange={(e) => setFiltroCarreraUs(e.target.value)}
              style={{
                padding: "10px 14px", border: "1px solid var(--borde)",
                borderRadius: "8px", fontSize: "0.88rem",
                fontFamily: "'Montserrat', sans-serif", outline: "none",
                backgroundColor: "var(--bg-input)", color: "var(--texto)",
                cursor: "pointer", minWidth: "200px", marginBottom: "22px",
              }}
            >
              {CARRERAS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>

            {/* Tabla de usuarios */}
            <table style={tabla}>
              <thead>
                <tr>
                  <th style={th}>Usuario</th>
                  <th style={th}>Correo</th>
                  <th style={th}>Código</th>
                  <th style={th}>Carrera</th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ padding: "32px", textAlign: "center", color: "var(--texto-3)", fontStyle: "italic" }}>
                      No hay usuarios en esta carrera.
                    </td>
                  </tr>
                ) : usuariosFiltrados.map((u) => (
                  <tr key={u.id}>
                    <td style={td}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{
                          width: "34px", height: "34px", borderRadius: "50%",
                          backgroundColor: "var(--naranja)", color: "#fff",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontWeight: "700", fontSize: "0.82rem", flexShrink: 0,
                        }}>
                          {iniciales(u.nombre)}
                        </div>
                        <span style={{ fontWeight: "600", fontSize: "0.87rem" }}>{u.nombre}</span>
                      </div>
                    </td>
                    <td style={{ ...td, fontSize: "0.8rem", color: "var(--texto-3)" }}>{u.correo}</td>
                    <td style={td}>{u.codigo}</td>
                    <td style={td}>
                      <span style={badge("var(--naranja)", "#fff4f0")}>{u.carrera}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </main>

      {/* Formulario crear/editar */}
      {mostrarForm && (
        <FormularioEvento
          eventoInicial={eventoEditar}
          onGuardar={eventoEditar ? handleEditar : handleCrear}
          onCancelar={() => { setMostrarForm(false); setEventoEditar(null); }}
        />
      )}

      {/* Confirmación eliminar */}
      {eventoEliminar && (
        <ConfirmDialog
          mensaje={`¿Eliminar el evento "${eventoEliminar.titulo}"? Esta acción no se puede deshacer.`}
          onConfirmar={handleEliminar}
          onCancelar={() => setEventoEliminar(null)}
        />
      )}

      {/* Modal: Lista de inscritos */}
      {eventoInscritos && (
        <Modal onClose={() => setEventoInscritos(null)} maxWidth="460px">
          <div style={{ padding: "20px 24px 14px", borderBottom: "2px solid var(--naranja)" }}>
            <h2 style={{ fontSize: "1rem", fontWeight: "700", color: "var(--texto)", fontFamily: "'Montserrat', sans-serif" }}>
              Inscritos — {eventoInscritos.titulo}
            </h2>
          </div>
          <div style={{ padding: "20px 24px", fontFamily: "'Montserrat', sans-serif" }}>
            {!eventoInscritos.inscritos || eventoInscritos.inscritos.length === 0 ? (
              <p style={{ color: "var(--texto-3)", textAlign: "center", padding: "20px 0", fontSize: "0.9rem" }}>
                Ningún usuario se ha inscrito aún.
              </p>
            ) : (
              <>
                <p style={{ fontSize: "0.82rem", color: "var(--texto-3)", marginBottom: "14px" }}>
                  {eventoInscritos.inscritos.length} persona{eventoInscritos.inscritos.length !== 1 ? "s" : ""} inscrita{eventoInscritos.inscritos.length !== 1 ? "s" : ""}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {eventoInscritos.inscritos.map((u, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", gap: "10px",
                      padding: "10px 14px",
                      backgroundColor: "var(--bg-hover)", borderRadius: "8px",
                    }}>
                      <div style={{
                        width: "34px", height: "34px", borderRadius: "50%",
                        backgroundColor: "var(--naranja)", color: "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontWeight: "700", fontSize: "0.82rem", flexShrink: 0,
                      }}>
                        {u.nombre ? u.nombre.split(" ").slice(0, 2).map((p) => p[0]).join("").toUpperCase() : "?"}
                      </div>
                      <span style={{ fontSize: "0.88rem", fontWeight: "600", color: "var(--texto)" }}>
                        {u.nombre}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </Modal>
      )}

      <Toast mensaje={toast.msg} tipo={toast.tipo} />

      {mostrarVistaPrev && (
        <VistaPrevia eventos={eventos} onCerrar={() => setMostrarVistaPrev(false)} />
      )}
    </div>
  );
};

export default AdminDashboard;
