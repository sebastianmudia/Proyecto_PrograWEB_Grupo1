// ==============================================
// pages/Home.jsx  —  Página principal del estudiante
// HU-05 Visualización | HU-06 Filtros | HU-07 Búsqueda
// HU-08 Historial     | HU-09 Detalle
// + Evento destacado | Favoritos | Inscripción | Perfil | Dark mode
// ==============================================

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Navbar       from "../components/Navbar";
import EventCard    from "../components/EventCard";
import Modal        from "../components/Modal";
import FiltrosBusqueda from "../components/FiltrosBusqueda";
import Toast        from "../components/Toast";
import Loader       from "../components/Loader";
import EmptyState   from "../components/EmptyState";

import { obtenerEventos, inscribirUsuario, cancelarInscripcion } from "../services/eventosService";
import { logout, estaAutenticado, obtenerSesion, actualizarSesion } from "../services/authService";
import { editarPerfil } from "../services/usuariosService";
import { obtenerFavoritos, toggleFavorito } from "../services/favoritosService";
import { inicializarTema } from "../services/temaService";
import { CARRERAS } from "../data/mockData";

// ─── Ícono ojo ─────────────────────────────────────────────────────────────
const OjoIcon = ({ visible }) => visible ? (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
) : (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

// ─── Banner de evento destacado (diseño de las imágenes) ──────────────────
const BannerDestacado = ({ evento, sesion, onVerDetalles, onInscribir, yaInscrito }) => {
  // Determina si el evento ya comenzó (misma fecha que hoy)
  const haComenzado = (() => {
    if (!evento) return false;
    const hoy = new Date();
    const ev = new Date(evento.fecha + "T00:00:00");
    const mismo = ev.toDateString() === hoy.toDateString();
    return mismo || ev < hoy;
  })();

  if (!evento) return null;

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      borderRadius: "12px",
      overflow: "hidden",
      marginBottom: "36px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
      border: "1px solid var(--borde)",
      backgroundColor: "var(--bg-card)",
    }}>
      {/* Imagen lado izquierdo */}
      <div style={{ position: "relative" }}>
        <img
          src={evento.imagen}
          alt={evento.titulo}
          style={{ width: "100%", height: "220px", objectFit: "cover", display: "block" }}
        />
      </div>

      {/* Info lado derecho */}
      <div style={{
        padding: "28px 32px",
        display: "flex", flexDirection: "column",
        justifyContent: "center", gap: "10px",
      }}>
        {/* Badge Destacado */}
        <span style={{
          backgroundColor: "#fff4f0",
          color: "var(--naranja)",
          fontSize: "0.68rem", fontWeight: "800",
          padding: "4px 12px", borderRadius: "4px",
          letterSpacing: "0.08em", textTransform: "uppercase",
          width: "fit-content",
          border: "1px solid #ffd8cc",
        }}>
          Destacado
        </span>

        {/* Título */}
        <h2 style={{
          fontSize: "1.35rem", fontWeight: "800",
          color: "var(--texto)", lineHeight: "1.3", margin: 0,
        }}>
          {evento.titulo}
        </h2>

        {/* Estado "El evento ha comenzado" o contador */}
        {haComenzado ? (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{
              width: "10px", height: "10px", borderRadius: "50%",
              backgroundColor: "var(--naranja)", display: "inline-block",
              animation: "pulse 1.5s infinite",
            }} />
            <span style={{
              fontSize: "0.88rem", fontWeight: "700",
              color: "var(--naranja)",
            }}>
              El evento ha comenzado
            </span>
          </div>
        ) : (
          <div style={{ fontSize: "0.85rem", color: "var(--texto-3)", fontWeight: "500" }}>
            {evento.fechaTexto || evento.fecha}
          </div>
        )}

        {/* Lugar */}
        <div style={{ fontSize: "0.82rem", color: "var(--texto-3)" }}>
          {evento.fecha} · {evento.lugar}
        </div>

        {/* Botones */}
        <div style={{ display: "flex", gap: "10px", marginTop: "8px", flexWrap: "wrap" }}>
          <button
            onClick={() => onVerDetalles(evento)}
            style={{
              padding: "11px 24px",
              backgroundColor: "var(--naranja)", color: "#fff",
              border: "none", borderRadius: "6px",
              fontSize: "0.88rem", fontWeight: "700",
              cursor: "pointer", fontFamily: "'Montserrat', sans-serif",
              flex: 1,
            }}
          >
            Ver Detalles
          </button>
          {sesion && !evento.pasado && (
            <button
              onClick={() => onInscribir(evento.id)}
              style={{
                padding: "11px 24px",
                backgroundColor: yaInscrito ? "var(--bg-badge)" : "transparent",
                color: yaInscrito ? "var(--texto-3)" : "var(--texto-2)",
                border: "1px solid var(--borde)",
                borderRadius: "6px",
                fontSize: "0.88rem", fontWeight: "600",
                cursor: "pointer", fontFamily: "'Montserrat', sans-serif",
                flex: 1,
              }}
            >
              {yaInscrito ? "Inscrito" : "Inscribirse"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Modal detalle de evento ──────────────────────────────────────────────
const DetalleEvento = ({ evento, sesion, esFav, onToggleFav, onInscribir, onCancelar, yaInscrito }) => {
  const cantInscritos = evento.inscritos?.length || 0;

  return (
    <>
      <img
        src={evento.imagen} alt={evento.titulo}
        style={{ width: "100%", height: "230px", objectFit: "cover", borderRadius: "12px 12px 0 0", display: "block" }}
      />
      <div style={{ padding: "24px 28px", fontFamily: "'Montserrat', sans-serif" }}>
        {/* Carrera */}
        <span style={{
          fontSize: "0.68rem", fontWeight: "700", letterSpacing: "0.08em",
          textTransform: "uppercase", color: "var(--naranja)",
          marginBottom: "8px", display: "block",
        }}>
          {evento.carrera}
        </span>

        {/* Badge finalizado */}
        {evento.pasado && (
          <span style={{
            display: "inline-block", padding: "3px 10px",
            backgroundColor: "var(--bg-badge)", color: "var(--texto-3)",
            borderRadius: "4px", fontSize: "0.7rem", fontWeight: "700",
            letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "10px",
          }}>
            Finalizado
          </span>
        )}

        {/* Título */}
        <h2 style={{
          fontSize: "1.25rem", fontWeight: "700",
          color: "var(--texto)", marginBottom: "14px", lineHeight: "1.35",
        }}>
          {evento.titulo}
        </h2>

        {/* Fecha */}
        <div style={{
          backgroundColor: "var(--naranja)", color: "#fff",
          padding: "10px 16px", borderRadius: "6px",
          fontSize: "0.85rem", fontWeight: "600", marginBottom: "10px",
        }}>
          {evento.fechaTexto || evento.fecha}
          {evento.hora ? ` — ${evento.hora}h` : ""}
        </div>

        {/* Lugar */}
        <div style={{
          backgroundColor: "var(--bg-badge)", color: "var(--texto-2)",
          padding: "10px 16px", borderRadius: "6px",
          fontSize: "0.83rem", marginBottom: "18px",
        }}>
          {evento.lugar}
        </div>

        {/* Descripción */}
        <p style={{
          fontSize: "0.87rem", color: "var(--texto-2)",
          lineHeight: "1.75", marginBottom: "20px",
        }}>
          {evento.descripcion}
        </p>

        {/* Acciones (solo si hay sesión de usuario) */}
        {sesion && (
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "12px" }}>
            {/* Favorito */}
            <button
              onClick={() => onToggleFav(evento.id)}
              style={{
                padding: "9px 16px", borderRadius: "6px", fontSize: "0.84rem",
                fontWeight: "700", cursor: "pointer", fontFamily: "'Montserrat', sans-serif",
                backgroundColor: esFav ? "#fff4f0" : "var(--bg-badge)",
                color: esFav ? "var(--naranja)" : "var(--texto-2)",
                border: `1px solid ${esFav ? "var(--naranja)" : "var(--borde)"}`,
              }}
            >
              {esFav ? "♥ Guardado" : "♡ Guardar"}
            </button>

            {/* Inscripción — solo eventos próximos */}
            {!evento.pasado && (
              <button
                onClick={() => yaInscrito ? onCancelar(evento.id) : onInscribir(evento.id)}
                style={{
                  padding: "9px 20px", borderRadius: "6px", fontSize: "0.84rem",
                  fontWeight: "700", cursor: "pointer", fontFamily: "'Montserrat', sans-serif",
                  backgroundColor: yaInscrito ? "var(--bg-badge)" : "var(--naranja)",
                  color: yaInscrito ? "var(--texto-3)" : "#ffffff",
                  border: "none",
                }}
              >
                {yaInscrito ? "Cancelar inscripción" : "Inscribirse al evento"}
              </button>
            )}
          </div>
        )}

        {/* Contador inscritos */}
        {cantInscritos > 0 && (
          <p style={{ fontSize: "0.8rem", color: "var(--texto-3)", marginTop: "6px" }}>
            {cantInscritos} persona{cantInscritos !== 1 ? "s" : ""} inscrita{cantInscritos !== 1 ? "s" : ""}
          </p>
        )}
      </div>
    </>
  );
};

// ─── Modal perfil editable ────────────────────────────────────────────────
const ModalPerfil = ({ sesion, onGuardar, onCerrar }) => {
  const [form, setForm] = useState({
    nombre: sesion?.usuario || "",
    carrera: sesion?.carrera || "",
    password: "", confirmar: "",
  });
  const [errores, setErrores] = useState({});
  const [exito, setExito] = useState(false);
  const [verPass, setVerPass] = useState(false);

  const validar = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = "El nombre es obligatorio.";
    if (form.password && form.password.length < 6) e.password = "Mínimo 6 caracteres.";
    if (form.password !== form.confirmar) e.confirmar = "Las contraseñas no coinciden.";
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const handleGuardar = () => {
    if (!validar()) return;
    const datos = { nombre: form.nombre, carrera: form.carrera };
    if (form.password) datos.password = form.password;
    onGuardar(datos);
    setExito(true);
    setTimeout(() => { setExito(false); onCerrar(); }, 1800);
  };

  const estInput = (campo) => ({
    width: "100%", padding: "10px 13px", borderRadius: "6px",
    border: `1px solid ${errores[campo] ? "#cc2200" : "var(--borde)"}`,
    fontSize: "0.9rem", fontFamily: "'Montserrat', sans-serif",
    outline: "none", backgroundColor: "var(--bg-input)",
    color: "var(--texto)", boxSizing: "border-box",
  });

  const estInputOjo = (campo) => ({
    ...estInput(campo),
    paddingRight: "38px",
  });

  return (
    <Modal onClose={onCerrar} maxWidth="460px">
      <div style={{ padding: "20px 24px 14px", borderBottom: "2px solid var(--naranja)" }}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: "700", color: "var(--texto)", fontFamily: "'Montserrat', sans-serif" }}>
          Mi Perfil
        </h2>
      </div>
      <div style={{ padding: "22px 24px", fontFamily: "'Montserrat', sans-serif" }}>
        {exito && (
          <div style={{
            backgroundColor: "#e8f5e9", color: "#2e7d32",
            border: "1px solid #a5d6a7", borderRadius: "6px",
            padding: "10px 14px", textAlign: "center",
            fontSize: "0.88rem", fontWeight: "600", marginBottom: "14px",
          }}>
            Perfil actualizado correctamente.
          </div>
        )}

        {/* Nombre */}
        <div style={{ marginBottom: "14px" }}>
          <label style={{ display: "block", fontWeight: "600", fontSize: "0.84rem", color: "var(--texto-2)", marginBottom: "5px" }}>
            Nombre completo
          </label>
          <input style={estInput("nombre")} value={form.nombre}
            onChange={(e) => { setForm((p) => ({ ...p, nombre: e.target.value })); setErrores((p) => ({ ...p, nombre: "" })); }} />
          {errores.nombre && <span style={{ color: "#cc2200", fontSize: "0.77rem", marginTop: "3px" }}>{errores.nombre}</span>}
        </div>

        {/* Carrera */}
        <div style={{ marginBottom: "14px" }}>
          <label style={{ display: "block", fontWeight: "600", fontSize: "0.84rem", color: "var(--texto-2)", marginBottom: "5px" }}>
            Carrera
          </label>
          <select style={{ ...estInput("carrera"), cursor: "pointer" }}
            value={form.carrera}
            onChange={(e) => setForm((p) => ({ ...p, carrera: e.target.value }))}>
            {CARRERAS.filter((c) => c !== "Todas las carreras").map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Contraseña */}
        <div style={{ marginBottom: "14px" }}>
          <label style={{ display: "block", fontWeight: "600", fontSize: "0.84rem", color: "var(--texto-2)", marginBottom: "5px" }}>
            Nueva contraseña{" "}
            <span style={{ fontWeight: 400, color: "var(--texto-3)", fontSize: "0.78rem" }}>(dejar vacío para no cambiar)</span>
          </label>
          <div style={{ position: "relative" }}>
            <input
              type={verPass ? "text" : "password"}
              placeholder="Nueva contraseña"
              style={estInputOjo("password")}
              value={form.password}
              onChange={(e) => { setForm((p) => ({ ...p, password: e.target.value })); setErrores((p) => ({ ...p, password: "" })); }}
            />
            <button type="button"
              onClick={() => setVerPass((v) => !v)}
              style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--texto-3)", display: "flex", alignItems: "center" }}>
              <OjoIcon visible={verPass} />
            </button>
          </div>
          {errores.password && <span style={{ color: "#cc2200", fontSize: "0.77rem" }}>{errores.password}</span>}
        </div>

        {/* Confirmar */}
        <div style={{ marginBottom: "8px" }}>
          <label style={{ display: "block", fontWeight: "600", fontSize: "0.84rem", color: "var(--texto-2)", marginBottom: "5px" }}>
            Confirmar contraseña
          </label>
          <input
            type="password"
            placeholder="Repite la contraseña"
            style={estInputOjo("confirmar")}
            value={form.confirmar}
            onChange={(e) => { setForm((p) => ({ ...p, confirmar: e.target.value })); setErrores((p) => ({ ...p, confirmar: "" })); }}
          />
          {errores.confirmar && <span style={{ color: "#cc2200", fontSize: "0.77rem" }}>{errores.confirmar}</span>}
        </div>
      </div>
      <div style={{ padding: "14px 24px", borderTop: "1px solid var(--borde)", display: "flex", gap: "10px", justifyContent: "flex-end" }}>
        <button
          onClick={onCerrar}
          style={{ padding: "10px 20px", background: "var(--bg-badge)", color: "var(--texto)", border: "1px solid var(--borde)", borderRadius: "6px", fontSize: "0.87rem", fontWeight: "600", cursor: "pointer", fontFamily: "'Montserrat', sans-serif" }}
        >
          Cancelar
        </button>
        <button
          onClick={handleGuardar}
          style={{ padding: "10px 20px", background: "var(--naranja)", color: "#fff", border: "none", borderRadius: "6px", fontSize: "0.87rem", fontWeight: "700", cursor: "pointer", fontFamily: "'Montserrat', sans-serif" }}
        >
          Guardar cambios
        </button>
      </div>
    </Modal>
  );
};

// ─── Componente principal ─────────────────────────────────────────────────
const Home = () => {
  const navigate  = useNavigate();
  const sesion    = obtenerSesion();

  const [eventos,          setEventos]          = useState([]);
  const [cargando,         setCargando]         = useState(true);
  const [busqueda,         setBusqueda]         = useState("");
  const [carrera,          setCarrera]          = useState("Todas las carreras");
  const [ordenamiento,     setOrdenamiento]     = useState("proximos");
  const [seccion,          setSeccion]          = useState("proximos");
  const [eventoSel,        setEventoSel]        = useState(null);
  const [favoritos,        setFavoritos]        = useState([]);
  const [mostrarPerfil,    setMostrarPerfil]    = useState(false);
  const [toast,            setToast]            = useState({ msg: "", tipo: "info" });

  useEffect(() => {
    inicializarTema();
    if (!estaAutenticado()) { navigate("/"); return; }
    setTimeout(() => {
      setEventos(obtenerEventos());
      if (sesion?.id) setFavoritos(obtenerFavoritos(sesion.id));
      setCargando(false);
    }, 400);
  }, []);

  const mostrarToast = (msg, tipo = "info") => {
    setToast({ msg, tipo });
    setTimeout(() => setToast({ msg: "", tipo: "info" }), 3000);
  };

  const handleLogout = () => { logout(); navigate("/"); };

  // ── Filtrar y ordenar ──
  const filtrarYOrdenar = (lista) => {
    const f = lista.filter((ev) => {
      const porCarrera = carrera === "Todas las carreras" || ev.carrera === carrera;
      const t = busqueda.toLowerCase();
      const porBusqueda = ev.titulo.toLowerCase().includes(t) || ev.descripcion.toLowerCase().includes(t);
      return porCarrera && porBusqueda;
    });
    return f.sort((a, b) => {
      if (ordenamiento === "recientes") return new Date(b.fecha) - new Date(a.fecha);
      if (ordenamiento === "antiguos")  return new Date(a.fecha) - new Date(b.fecha);
      return new Date(a.fecha) - new Date(b.fecha); // proximos
    });
  };

  const eventosProximos  = filtrarYOrdenar(eventos.filter((e) => !e.pasado));
  // Historial: solo eventos PASADOS (ya finalizaron)
  const eventosHistorial = filtrarYOrdenar(eventos.filter((e) => e.pasado));
  const eventosFavoritos = filtrarYOrdenar(eventos.filter((e) => favoritos.includes(e.id)));
  const eventosInscritos = filtrarYOrdenar(
    eventos.filter((e) => e.inscritos?.some((u) => u.id === sesion?.id))
  );

  const eventoDestacado  = eventos.find((e) => e.destacado && !e.pasado);

  // ── Handlers ──
  const handleToggleFav = (eventoId) => {
    if (!sesion?.id) return;
    const ahora = toggleFavorito(sesion.id, eventoId);
    setFavoritos(obtenerFavoritos(sesion.id));
    mostrarToast(ahora ? "Guardado en favoritos" : "Eliminado de favoritos", ahora ? "exito" : "info");
    if (eventoSel?.id === eventoId) setEventoSel((p) => ({ ...p }));
  };

  const handleInscribir = (eventoId) => {
    if (!sesion?.id) return;
    const lista = inscribirUsuario(eventoId, { id: sesion.id, nombre: sesion.usuario });
    setEventos(lista);
    mostrarToast("Inscripción confirmada", "exito");
    setEventoSel(lista.find((e) => e.id === eventoId) || null);
  };

  const handleCancelarInscripcion = (eventoId) => {
    if (!sesion?.id) return;
    const lista = cancelarInscripcion(eventoId, sesion.id);
    setEventos(lista);
    mostrarToast("Inscripción cancelada");
    setEventoSel(lista.find((e) => e.id === eventoId) || null);
  };

  const handleGuardarPerfil = (datos) => {
    if (!sesion?.id) return;
    editarPerfil(sesion.id, datos);
    actualizarSesion({ usuario: datos.nombre, carrera: datos.carrera });
    mostrarToast("Perfil actualizado", "exito");
  };

  // ── Navegación del Navbar ──
  const accionesNav = [
    { label: "Eventos",          activo: seccion === "proximos",  onClick: () => setSeccion("proximos") },
    { label: "Historial",        activo: seccion === "historial", onClick: () => setSeccion("historial") },
    { label: "Mis Favoritos",    activo: seccion === "favoritos", onClick: () => setSeccion("favoritos") },
    { label: "Mis Inscripciones",activo: seccion === "inscritos", onClick: () => setSeccion("inscritos") },
    { label: "Mi Perfil",        activo: false,                   onClick: () => setMostrarPerfil(true) },
  ];

  // ── Datos de la sección activa ──
  const CONFIG_SECCIONES = {
    proximos:  { lista: eventosProximos,  titulo: "Próximos Eventos",       emptyIco: "—", emptyTit: "No hay eventos próximos",          emptySub: "Prueba cambiando el filtro o la búsqueda." },
    historial: { lista: eventosHistorial, titulo: "Historial de Eventos",   emptyIco: "—", emptyTit: "No hay eventos finalizados",        emptySub: "Los eventos pasados aparecerán aquí." },
    favoritos: { lista: eventosFavoritos, titulo: "Mis Favoritos",          emptyIco: "♡", emptyTit: "Aún no tienes favoritos",           emptySub: "Toca el corazón en cualquier tarjeta para guardar un evento." },
    inscritos: { lista: eventosInscritos, titulo: "Mis Inscripciones",      emptyIco: "—", emptyTit: "No tienes inscripciones activas",   emptySub: "Abre un evento próximo y pulsa Inscribirse." },
  };
  const seccionData = CONFIG_SECCIONES[seccion];

  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh", fontFamily: "'Montserrat', sans-serif" }}>
      <Navbar titulo="ULIMA EVENTOS" acciones={accionesNav} onLogout={handleLogout} />

      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {cargando ? (
          <Loader />
        ) : (
          <>
            {/* Evento Destacado (solo en sección Próximos) */}
            {seccion === "proximos" && eventoDestacado && (
              <BannerDestacado
                evento={eventoDestacado}
                sesion={sesion}
                onVerDetalles={setEventoSel}
                onInscribir={handleInscribir}
                yaInscrito={eventoDestacado.inscritos?.some((u) => u.id === sesion?.id)}
              />
            )}

            {/* Filtros */}
            <FiltrosBusqueda
              busqueda={busqueda}
              carreraSeleccionada={carrera}
              ordenamiento={ordenamiento}
              onBusquedaChange={setBusqueda}
              onCarreraChange={setCarrera}
              onOrdenamientoChange={setOrdenamiento}
              mostrarOrden={seccion === "proximos" || seccion === "historial"}
            />

            {/* Sección activa */}
            <section>
              {/* Título de sección */}
              <div style={{
                fontSize: "0.9rem", fontWeight: "700",
                letterSpacing: "0.1em", textTransform: "uppercase",
                color: "var(--texto)", marginBottom: "20px",
                paddingBottom: "10px",
                borderBottom: "2px solid var(--naranja)",
                display: "inline-block",
              }}>
                {seccionData.titulo}
              </div>

              {seccionData.lista.length === 0 ? (
                <EmptyState
                  icono={seccionData.emptyIco}
                  titulo={seccionData.emptyTit}
                  subtitulo={seccionData.emptySub}
                />
              ) : (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                  gap: "24px",
                }}>
                  {seccionData.lista.map((ev) => (
                    <EventCard
                      key={ev.id}
                      evento={ev}
                      onClick={setEventoSel}
                      esFav={favoritos.includes(ev.id)}
                      onToggleFav={sesion?.id ? handleToggleFav : null}
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>

      {/* Modal: Detalle de evento */}
      {eventoSel && (
        <Modal onClose={() => setEventoSel(null)}>
          <DetalleEvento
            evento={eventoSel}
            sesion={sesion}
            esFav={favoritos.includes(eventoSel.id)}
            onToggleFav={handleToggleFav}
            onInscribir={handleInscribir}
            onCancelar={handleCancelarInscripcion}
            yaInscrito={eventoSel.inscritos?.some((u) => u.id === sesion?.id)}
          />
        </Modal>
      )}

      {/* Modal: Perfil */}
      {mostrarPerfil && (
        <ModalPerfil
          sesion={sesion}
          onGuardar={handleGuardarPerfil}
          onCerrar={() => setMostrarPerfil(false)}
        />
      )}

      <Toast mensaje={toast.msg} tipo={toast.tipo} />
    </div>
  );
};

export default Home;
