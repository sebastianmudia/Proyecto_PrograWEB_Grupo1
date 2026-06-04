// ==============================================
// pages/admin/FormularioEvento.jsx
// HU-11: Crear evento | HU-12: Editar evento
// Incluye campo hora, subida de imagen PNG/JPG, sin checkbox pasado
// ==============================================

import { useState } from "react";
import { CARRERAS, TIPOS_EVENTO } from "../../data/mockData";
import Modal from "../../components/Modal";

const VACIO = {
  titulo: "", descripcion: "", fecha: "", hora: "",
  fechaTexto: "", carrera: "Ingeniería de Sistemas",
  imagen: "", tipo: "Charla", lugar: "",
};

const FormularioEvento = ({ eventoInicial, onGuardar, onCancelar }) => {
  const [form, setForm] = useState(eventoInicial || VACIO);
  const [errores, setErrores] = useState({});
  const [modoImg, setModoImg] = useState("url");
  const [previewLocal, setPreviewLocal] = useState(null);

  const esEdicion = !!eventoInicial;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errores[name]) setErrores((p) => ({ ...p, [name]: "" }));
  };

  const handleArchivo = (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const data = ev.target.result;
      setPreviewLocal(data);
      setForm((p) => ({ ...p, imagen: data }));
    };
    reader.readAsDataURL(archivo);
  };

  const validar = () => {
    const e = {};
    if (!form.titulo.trim()) e.titulo = "El título es obligatorio.";
    if (!form.descripcion.trim()) e.descripcion = "La descripción es obligatoria.";
    if (!form.fecha) e.fecha = "La fecha es obligatoria.";
    if (!form.lugar.trim()) e.lugar = "El lugar es obligatorio.";
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validar()) return;
    const imagenFinal = form.imagen || `https://picsum.photos/seed/ev${Date.now()}/600/340`;
    const fechaLegible = form.hora
      ? `${formatFecha(form.fecha)} | Desde las ${form.hora} horas`
      : formatFecha(form.fecha);
    onGuardar({
      ...form,
      imagen: imagenFinal,
      fechaTexto: form.fechaTexto || fechaLegible,
    });
  };

  const formatFecha = (iso) => {
    if (!iso) return "";
    const [a, m, d] = iso.split("-");
    return `${d}/${m}/${a}`;
  };

  const imagenPreview = previewLocal || form.imagen;

  const s = {
    cab: { padding: "20px 24px 14px", borderBottom: "2px solid var(--naranja)" },
    tit: { fontSize: "1.1rem", fontWeight: "700", color: "var(--texto)", fontFamily: "'Montserrat', sans-serif" },
    body: { padding: "22px 24px", fontFamily: "'Montserrat', sans-serif" },
    grupo: { marginBottom: "15px" },
    label: { display: "block", fontWeight: "600", fontSize: "0.84rem", color: "var(--texto-2)", marginBottom: "5px" },
    input: {
      width: "100%", padding: "10px 12px", borderRadius: "6px",
      border: "1px solid var(--borde)", fontSize: "0.9rem",
      fontFamily: "'Montserrat', sans-serif", boxSizing: "border-box",
      outline: "none", backgroundColor: "var(--bg-input)", color: "var(--texto)",
    },
    err: (campo) => errores[campo] ? { border: "1px solid #cc2200" } : {},
    textarea: {
      width: "100%", padding: "10px 12px", borderRadius: "6px",
      border: "1px solid var(--borde)", fontSize: "0.9rem",
      fontFamily: "'Montserrat', sans-serif", boxSizing: "border-box",
      outline: "none", resize: "vertical", minHeight: "88px",
      backgroundColor: "var(--bg-input)", color: "var(--texto)",
    },
    select: {
      width: "100%", padding: "10px 12px", borderRadius: "6px",
      border: "1px solid var(--borde)", fontSize: "0.9rem",
      fontFamily: "'Montserrat', sans-serif", boxSizing: "border-box",
      outline: "none", backgroundColor: "var(--bg-input)", color: "var(--texto)", cursor: "pointer",
    },
    errMsg: { color: "#cc2200", fontSize: "0.77rem", marginTop: "3px", fontWeight: "500" },
    dosCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" },
    infoPasado: {
      backgroundColor: "var(--bg-badge)", border: "1px solid var(--borde)",
      borderRadius: "6px", padding: "9px 13px", fontSize: "0.8rem",
      color: "var(--texto-3)", marginBottom: "14px",
    },
    tabsImg: { display: "flex", gap: "8px", marginBottom: "10px" },
    tabBtn: (activo) => ({
      padding: "6px 13px", borderRadius: "5px",
      border: activo ? "1px solid var(--naranja)" : "1px solid var(--borde)",
      backgroundColor: activo ? "var(--naranja)" : "var(--bg-input)",
      color: activo ? "#fff" : "var(--texto-2)",
      fontSize: "0.78rem", fontWeight: "600", cursor: "pointer",
      fontFamily: "'Montserrat', sans-serif",
    }),
    previewImg: { marginTop: "8px", width: "100%", height: "110px", objectFit: "cover", borderRadius: "6px", border: "1px solid var(--borde)", display: "block" },
    inputFile: { width: "100%", padding: "8px", borderRadius: "6px", border: "1px dashed var(--borde)", fontSize: "0.85rem", fontFamily: "'Montserrat', sans-serif", cursor: "pointer", backgroundColor: "var(--bg-hover)", color: "var(--texto)" },
    footer: { padding: "14px 24px", borderTop: "1px solid var(--borde)", display: "flex", gap: "12px", justifyContent: "flex-end" },
    btnC: { padding: "10px 20px", background: "var(--bg-badge)", color: "var(--texto)", border: "1px solid var(--borde)", borderRadius: "6px", fontSize: "0.87rem", fontWeight: "600", cursor: "pointer", fontFamily: "'Montserrat', sans-serif" },
    btnG: { padding: "10px 20px", background: "var(--naranja)", color: "#fff", border: "none", borderRadius: "6px", fontSize: "0.87rem", fontWeight: "700", cursor: "pointer", fontFamily: "'Montserrat', sans-serif" },
  };

  return (
    <Modal onClose={onCancelar} maxWidth="580px">
      <div style={s.cab}><h2 style={s.tit}>{esEdicion ? "Editar Evento" : "Nuevo Evento"}</h2></div>
      <form onSubmit={handleSubmit}>
        <div style={s.body}>

          {/* Título */}
          <div style={s.grupo}>
            <label style={s.label}>Título del evento *</label>
            <input name="titulo" type="text" value={form.titulo} onChange={handleChange}
              placeholder="Ej: Hackathon Ulima 2026"
              style={{ ...s.input, ...s.err("titulo") }} />
            {errores.titulo && <span style={s.errMsg}>{errores.titulo}</span>}
          </div>

          {/* Descripción */}
          <div style={s.grupo}>
            <label style={s.label}>Descripción *</label>
            <textarea name="descripcion" value={form.descripcion} onChange={handleChange}
              placeholder="Describe el evento..."
              style={{ ...s.textarea, ...s.err("descripcion") }} />
            {errores.descripcion && <span style={s.errMsg}>{errores.descripcion}</span>}
          </div>

          {/* Fecha + Hora */}
          <div style={s.dosCol}>
            <div style={s.grupo}>
              <label style={s.label}>Fecha *</label>
              <input name="fecha" type="date" value={form.fecha} onChange={handleChange}
                style={{ ...s.input, ...s.err("fecha") }} />
              {errores.fecha && <span style={s.errMsg}>{errores.fecha}</span>}
            </div>
            <div style={s.grupo}>
              <label style={s.label}>Hora de inicio</label>
              <input name="hora" type="time" value={form.hora} onChange={handleChange} style={s.input} />
            </div>
          </div>

          {/* Aviso automático */}
          <div style={s.infoPasado}>
            El estado (próximo / finalizado) se calcula automáticamente según la fecha.
          </div>

          {/* Tipo + Carrera */}
          <div style={s.dosCol}>
            <div style={s.grupo}>
              <label style={s.label}>Tipo de evento</label>
              <select name="tipo" value={form.tipo} onChange={handleChange} style={s.select}>
                {TIPOS_EVENTO.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div style={s.grupo}>
              <label style={s.label}>Carrera relacionada</label>
              <select name="carrera" value={form.carrera} onChange={handleChange} style={s.select}>
                {CARRERAS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Lugar */}
          <div style={s.grupo}>
            <label style={s.label}>Lugar *</label>
            <input name="lugar" type="text" value={form.lugar} onChange={handleChange}
              placeholder="Ej: Auditorio C1, Universidad de Lima"
              style={{ ...s.input, ...s.err("lugar") }} />
            {errores.lugar && <span style={s.errMsg}>{errores.lugar}</span>}
          </div>

          {/* Imagen */}
          <div style={s.grupo}>
            <label style={s.label}>
              Imagen{" "}
              <span style={{ fontWeight: 400, color: "var(--texto-3)", fontSize: "0.77rem" }}>
                (opcional — se genera automáticamente)
              </span>
            </label>
            <div style={s.tabsImg}>
              <button type="button" style={s.tabBtn(modoImg === "url")}
                onClick={() => { setModoImg("url"); setPreviewLocal(null); }}>
                URL
              </button>
              <button type="button" style={s.tabBtn(modoImg === "archivo")}
                onClick={() => setModoImg("archivo")}>
                Subir archivo
              </button>
            </div>
            {modoImg === "url" && (
              <input name="imagen" type="text" value={previewLocal ? "" : form.imagen}
                onChange={handleChange} placeholder="https://..." style={s.input} />
            )}
            {modoImg === "archivo" && (
              <input type="file" accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleArchivo} style={s.inputFile} />
            )}
            {imagenPreview && (
              <img src={imagenPreview} alt="Vista previa" style={s.previewImg}
                onError={(e) => { e.target.style.display = "none"; }} />
            )}
          </div>
        </div>

        <div style={s.footer}>
          <button type="button" style={s.btnC} onClick={onCancelar}>Cancelar</button>
          <button type="submit" style={s.btnG}>{esEdicion ? "Guardar cambios" : "Crear evento"}</button>
        </div>
      </form>
    </Modal>
  );
};

export default FormularioEvento;
