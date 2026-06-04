// ==============================================
// pages/Login.jsx
// Página de inicio de sesión unificada
// HU-02: Login de usuario
// HU-10: Login de administrador (mismo formulario, diferencia por credenciales)
// Acepta: correo, código universitario (20XXXXXX) o usuario "admin"
// ==============================================

import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/ulimaLogo.png";
import fondoUlima from "../assets/sede_ulima.jpg";
import { login, estaAutenticado, esAdmin } from "../services/authService";

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);

  // Si ya está autenticado redirige según su rol
  useEffect(() => {
    if (estaAutenticado()) {
      navigate(esAdmin() ? "/admin/dashboard" : "/home");
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const identificador = e.target.usuario.value.trim();
    const password = e.target.password.value;

    const rol = login(identificador, password);

    if (rol === "admin") {
      navigate("/admin/dashboard");
    } else if (rol === "usuario") {
      navigate("/home");
    } else {
      setError("Credenciales incorrectas. Verifica tu código, correo y contraseña.");
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
      maxWidth: "420px",
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
      fontSize: "1.45rem",
      fontWeight: "700",
      color: "#111111",
      textAlign: "center",
      marginBottom: "28px",
      lineHeight: "1.3",
    },
    grupo: {
      marginBottom: "18px",
    },
    label: {
      display: "block",
      fontWeight: "600",
      color: "#444444",
      fontSize: "0.88rem",
      marginBottom: "6px",
    },
    input: {
      width: "100%",
      padding: "12px 14px",
      borderRadius: "6px",
      border: "1px solid #dcdcdc",
      fontSize: "0.95rem",
      fontFamily: "'Montserrat', sans-serif",
      outline: "none",
      boxSizing: "border-box",
    },
    // Contenedor del input de contraseña con botón de ojo
    inputPasswordWrapper: {
      position: "relative",
      display: "flex",
      alignItems: "center",
    },
    inputPassword: {
      width: "100%",
      padding: "12px 44px 12px 14px",
      borderRadius: "6px",
      border: "1px solid #dcdcdc",
      fontSize: "0.95rem",
      fontFamily: "'Montserrat', sans-serif",
      outline: "none",
      boxSizing: "border-box",
    },
    btnOjo: {
      position: "absolute",
      right: "12px",
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: "4px",
      color: "#999999",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    error: {
      backgroundColor: "#fff0ed",
      color: "#cc2200",
      border: "1px solid #ffccc4",
      borderRadius: "6px",
      padding: "10px 14px",
      fontSize: "0.83rem",
      marginBottom: "14px",
      fontWeight: "500",
    },
    btnPrimario: {
      width: "100%",
      padding: "13px",
      backgroundColor: "#ff5117",
      color: "#ffffff",
      border: "none",
      borderRadius: "6px",
      fontSize: "1rem",
      fontWeight: "700",
      cursor: "pointer",
      fontFamily: "'Montserrat', sans-serif",
      marginTop: "6px",
      letterSpacing: "0.02em",
    },
    lineaSeparador: {
      border: "none",
      borderTop: "1px solid #eeeeee",
      margin: "22px 0 16px 0",
    },
    textoRegistro: {
      textAlign: "center",
      fontSize: "0.88rem",
      color: "#666666",
    },
    linkRegistro: {
      color: "#ff5117",
      fontWeight: "700",
      textDecoration: "none",
    },
  };

  // Icono de ojo abierto / cerrado (SVG inline, sin librerías)
  const IconoOjoAbierto = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );

  const IconoOjoCerrado = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );

  return (
    <div style={estilos.pagina}>
      <div style={estilos.card}>
        <img src={logo} style={estilos.logo} alt="Logo Universidad de Lima" />
        <h1 style={estilos.titulo}>Bienvenido a ULIMA Eventos</h1>

        <form onSubmit={handleSubmit}>
          <div style={estilos.grupo}>
            <label htmlFor="usuario" style={estilos.label}>
              Código universitario o correo
            </label>
            <input
              id="usuario"
              name="usuario"
              type="text"
              placeholder="20XXXXXX o tu@correo.com"
              style={estilos.input}
              required
              onChange={() => setError("")}
            />
          </div>

          <div style={estilos.grupo}>
            <label htmlFor="password" style={estilos.label}>
              Contraseña
            </label>
            <div style={estilos.inputPasswordWrapper}>
              <input
                id="password"
                name="password"
                type={mostrarPassword ? "text" : "password"}
                placeholder="Ingresa tu contraseña"
                style={estilos.inputPassword}
                required
                onChange={() => setError("")}
              />
              <button
                type="button"
                style={estilos.btnOjo}
                onClick={() => setMostrarPassword((prev) => !prev)}
                title={mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {mostrarPassword ? <IconoOjoCerrado /> : <IconoOjoAbierto />}
              </button>
            </div>
          </div>

          {error && <div style={estilos.error}>{error}</div>}

          <button type="submit" style={estilos.btnPrimario}>
            Iniciar Sesión
          </button>
        </form>

        <hr style={estilos.lineaSeparador} />

        <p style={estilos.textoRegistro}>
          ¿No tienes cuenta?{" "}
          <Link to="/registro" style={estilos.linkRegistro}>
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
