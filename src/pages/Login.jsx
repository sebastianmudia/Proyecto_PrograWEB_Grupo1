import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/ulimaLogo.png';
import styles from './loginStyles';
import IconoOjo from '../components/IconoOjo/IconoOjo';
import { login } from '../services/authService';

const LoginUsuario = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [verPassword, setVerPassword] = useState(false);

  useEffect(() => {
    const rol = localStorage.getItem('rol');
    if (rol === 'admin') navigate('/admin');
    else if (rol === 'usuario') navigate('/paginaprincipal');
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const identificador = e.target.usuario.value.trim();
    const password      = e.target.password.value;
    const rol = login(identificador, password);
    if (rol === 'admin')        navigate('/admin');
    else if (rol === 'usuario') navigate('/paginaprincipal');
    else setError('Usuario o contraseña incorrectos. Intenta de nuevo.');
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <img src={logo} alt="Logo Universidad de Lima" style={styles.logo} />
        <h1 style={styles.titulo}>Bienvenido a ULIMA Eventos</h1>

        <form onSubmit={handleSubmit}>

          <div style={styles.grupo}>
            <label htmlFor="usuario" style={styles.label}>Usuario</label>
            <input
              id="usuario"
              name="usuario"
              type="text"
              placeholder="Código universitario o correo"
              style={styles.input}
              required
              onChange={() => setError('')}
            />
          </div>

          <div style={styles.grupo}>
            <label htmlFor="password" style={styles.label}>Contraseña</label>
            <div style={styles.passwordWrapper}>
              <input
                id="password"
                name="password"
                type={verPassword ? 'text' : 'password'}
                placeholder="Ingresa tu contraseña"
                style={styles.inputPassword}
                required
                onChange={() => setError('')}
              />
              <button
                type="button"
                style={styles.btnOjo}
                onClick={() => setVerPassword((v) => !v)}
                title={verPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                <IconoOjo visible={verPassword} size={20} />
              </button>
            </div>
          </div>

          {error && <div style={styles.mensajeError}>{error}</div>}

          <button type="submit" style={styles.boton}>Iniciar Sesión</button>

        </form>

        <hr style={styles.separador} />

        <p style={styles.textoRegistro}>
          ¿No tienes cuenta?{' '}
          <Link to="/registro" style={styles.linkRegistro}>Regístrate aquí</Link>
        </p>

      </div>
    </div>
  );
};

export default LoginUsuario;
