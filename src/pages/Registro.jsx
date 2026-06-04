// ==============================================
// pages/Registro.jsx
// Página de registro de nuevos estudiantes
// HU-01: Registro de usuario con validación
// ==============================================

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/ulimaLogo.png";
import fondoUlima from "../assets/sede_ulima.jpg";
import { registrarUsuario } from "../services/usuariosService";
import { CARRERAS } from "../data/mockData";

// Icono de ojo para ver/ocultar contraseña
const IconoOjo = ({ visible }) =>
  visible ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );

const Registro = () => {
  const navigate = useNavigate();
  const [errores, setErrores] = useState({});
  const [exitoso, setExitoso] = useState(false);
  const [mostrarPass, setMostrarPass] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);

  // Validación simple de campos
  const validar = (datos) => {
    const nuevosErrores = {};
    if (!datos.nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio.";
    if (!datos.correo.trim()) nuevosErrores.correo = "El correo es obligatorio.";
    if (!datos.correo.includes("@")) nuevosErrores.correo = "Ingresa un correo válido.";
    if (!datos.codigo.trim()) nuevosErrores.codigo = "El código universitario es obligatorio.";
    if (!datos.carrera || datos.carrera === "Selecciona tu carrera")
      nuevosErrores.carrera = "Selecciona una carrera.";
    if (datos.password.length < 6)
      nuevosErrores.password = "La contraseña debe tener al menos 6 caracteres.";
    if (datos.password !== datos.confirmar)
      nuevosErrores.confirmar = "Las contraseñas no coinciden.";
    return nuevosErrores;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const datos = {
      nombre: e.target.nombre.value,
      correo: e.target.correo.value,
      codigo: e.target.codigo.value,
      carrera: e.target.carrera.value,
      password: e.target.password.value,
      confirmar: e.target.confirmar.value,
    };

    const nuevosErrores = validar(datos);
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    const resultado = registrarUsuario({
      nombre: datos.nombre,
      correo: datos.correo,
      codigo: datos.codigo,
      carrera: datos.carrera,
      password: datos.password,
    });

    if (resultado.exito) {
      setExitoso(true);
      setTimeout(() => navigate("/"), 2500);
    } else {
      setErrores({ correo: resultado.mensaje });
    }
  };

  const estilos = {
    pagina: {
      width: "100vw",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundImage: `url(${fondoUlima})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      padding: "24px",
    },
    card: {
      width: "100%",
      maxWidth: "480px",
      backgroundColor: "#ffffff",
      borderRadius: "10px",
      padding: "40px 36px",
      fontFamily: "'Montserrat', sans-serif",
      boxShadow: "0 10px 40px rgba(0,0,0,0.22)",
    },
    logo: {
      width: "52px",
      display: "block",
      margin: "0 auto 20px auto",
    },
    titulo: {
      fontSize: "1.35rem",
      fontWeight: "700",
      color: "#111111",
      textAlign: "center",
      marginBottom: "26px",
    },
    grupo: {
      marginBottom: "16px",
    },
    label: {
      display: "block",
      fontWeight: "600",
      color: "#444444",
      fontSize: "0.85rem",
      marginBottom: "5px",
    },
    input: {
      width: "100%",
      padding: "11px 14px",
      borderRadius: "6px",
      border: "1px solid #dcdcdc",
      fontSize: "0.9rem",
      fontFamily: "'Montserrat', sans-serif",
      outline: "none",
    },
    inputError: {
      border: "1px solid #cc2200",
    },
    select: {
      width: "100%",
      padding: "11px 14px",
      borderRadius: "6px",
      border: "1px solid #dcdcdc",
      fontSize: "0.9rem",
      fontFamily: "'Montserrat', sans-serif",
      outline: "none",
      backgroundColor: "#ffffff",
      cursor: "pointer",
    },
    mensajeError: {
      color: "#cc2200",
      fontSize: "0.78rem",
      marginTop: "4px",
      fontWeight: "500",
    },
    dosColumnas: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "12px",
    },
    btn: {
      width: "100%",
      padding: "13px",
      backgroundColor: "#ff5117",
      color: "#ffffff",
      border: "none",
      borderRadius: "6px",
      fontSize: "0.95rem",
      fontWeight: "700",
      cursor: "pointer",
      fontFamily: "'Montserrat', sans-serif",
      marginTop: "8px",
    },
    exitoBanner: {
      backgroundColor: "#e8f5e9",
      color: "#2e7d32",
      border: "1px solid #a5d6a7",
      borderRadius: "8px",
      padding: "14px 18px",
      textAlign: "center",
      fontSize: "0.9rem",
      fontWeight: "600",
      marginBottom: "16px",
    },
    linkVolver: {
      display: "block",
      textAlign: "center",
      marginTop: "18px",
      color: "#666666",
      fontSize: "0.88rem",
      textDecoration: "none",
    },
    linkNaranja: {
      color: "#ff5117",
      fontWeight: "700",
    },
    inputPasswordWrapper: {
      position: "relative",
      display: "flex",
      alignItems: "center",
    },
    inputConOjo: {
      width: "100%",
      padding: "11px 40px 11px 14px",
      borderRadius: "6px",
      border: "1px solid #dcdcdc",
      fontSize: "0.9rem",
      fontFamily: "'Montserrat', sans-serif",
      outline: "none",
      boxSizing: "border-box",
    },
    btnOjo: {
      position: "absolute",
      right: "10px",
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: "4px",
      color: "#999999",
      display: "flex",
      alignItems: "center",
    },
  };

  // Función para aplicar borde de error si corresponde
  const estiloInput = (campo) => ({
    ...estilos.input,
    ...(errores[campo] ? estilos.inputError : {}),
  });
  const estiloInputOjo = (campo) => ({
    ...estilos.inputConOjo,
    ...(errores[campo] ? { border: "1px solid #cc2200" } : {}),
  });

  if (exitoso) {
    return (
      <div style={estilos.pagina}>
        <div style={estilos.card}>
          <img src={logo} style={estilos.logo} alt="Logo Ulima" />
          <div style={estilos.exitoBanner}>
            ✅ ¡Registro exitoso! Redirigiendo al inicio de sesión...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={estilos.pagina}>
      <div style={estilos.card}>
        <img src={logo} style={estilos.logo} alt="Logo Universidad de Lima" />
        <h1 style={estilos.titulo}>Crear cuenta de estudiante</h1>

        <form onSubmit={handleSubmit}>
          {/* Nombre completo */}
          <div style={estilos.grupo}>
            <label style={estilos.label} htmlFor="nombre">Nombre completo</label>
            <input id="nombre" name="nombre" type="text"
              placeholder="Tu nombre completo"
              style={estiloInput("nombre")} onChange={() => setErrores((p) => ({ ...p, nombre: "" }))} />
            {errores.nombre && <span style={estilos.mensajeError}>{errores.nombre}</span>}
          </div>

          {/* Correo */}
          <div style={estilos.grupo}>
            <label style={estilos.label} htmlFor="correo">Correo universitario</label>
            <input id="correo" name="correo" type="email"
              placeholder="tu.nombre@aloe.ulima.edu.pe"
              style={estiloInput("correo")} onChange={() => setErrores((p) => ({ ...p, correo: "" }))} />
            {errores.correo && <span style={estilos.mensajeError}>{errores.correo}</span>}
          </div>

          {/* Código + Carrera en dos columnas */}
          <div style={estilos.dosColumnas}>
            <div style={estilos.grupo}>
              <label style={estilos.label} htmlFor="codigo">Código universitario</label>
              <input id="codigo" name="codigo" type="text"
                placeholder="20XXXXXX"
                style={estiloInput("codigo")} onChange={() => setErrores((p) => ({ ...p, codigo: "" }))} />
              {errores.codigo && <span style={estilos.mensajeError}>{errores.codigo}</span>}
            </div>
            <div style={estilos.grupo}>
              <label style={estilos.label} htmlFor="carrera">Carrera</label>
              <select id="carrera" name="carrera" style={{ ...estilos.select, ...(errores.carrera ? estilos.inputError : {}) }}
                onChange={() => setErrores((p) => ({ ...p, carrera: "" }))}>
                <option value="">Selecciona tu carrera</option>
                {CARRERAS.filter((c) => c !== "Todas las carreras").map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errores.carrera && <span style={estilos.mensajeError}>{errores.carrera}</span>}
            </div>
          </div>

          {/* Contraseña */}
          <div style={estilos.grupo}>
            <label style={estilos.label} htmlFor="password">Contraseña</label>
            <div style={estilos.inputPasswordWrapper}>
              <input id="password" name="password"
                type={mostrarPass ? "text" : "password"}
                placeholder="Mínimo 6 caracteres"
                style={estiloInputOjo("password")}
                onChange={() => setErrores((p) => ({ ...p, password: "" }))} />
              <button type="button" style={estilos.btnOjo}
                onClick={() => setMostrarPass((v) => !v)} title="Ver contraseña">
                <IconoOjo visible={mostrarPass} />
              </button>
            </div>
            {errores.password && <span style={estilos.mensajeError}>{errores.password}</span>}
          </div>

          {/* Confirmar contraseña */}
          <div style={estilos.grupo}>
            <label style={estilos.label} htmlFor="confirmar">Confirmar contraseña</label>
            <div style={estilos.inputPasswordWrapper}>
              <input id="confirmar" name="confirmar"
                type={mostrarConfirmar ? "text" : "password"}
                placeholder="Repite tu contraseña"
                style={estiloInputOjo("confirmar")}
                onChange={() => setErrores((p) => ({ ...p, confirmar: "" }))} />
              <button type="button" style={estilos.btnOjo}
                onClick={() => setMostrarConfirmar((v) => !v)} title="Ver contraseña">
                <IconoOjo visible={mostrarConfirmar} />
              </button>
            </div>
            {errores.confirmar && <span style={estilos.mensajeError}>{errores.confirmar}</span>}
          </div>

          <button type="submit" style={estilos.btn}>
            Crear mi cuenta
          </button>
        </form>

        <Link to="/" style={estilos.linkVolver}>
          ¿Ya tienes cuenta?{" "}
          <span style={estilos.linkNaranja}>Inicia sesión aquí</span>
        </Link>
      </div>
    </div>
  );
};

export default Registro;
