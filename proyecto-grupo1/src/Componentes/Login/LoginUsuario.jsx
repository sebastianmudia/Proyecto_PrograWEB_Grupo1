import styles from './styles';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import logo from '../../assets/ulimaLogo.png'

const LoginUsuario = () => {
    const navigate = useNavigate();

    const usuarioBd = "UsuarioEjemplo";
    const passwordBd = "Contra";

    const handleSubmit = (e) => {
        e.preventDefault();
        const username = e.target.username.value;
        const password = e.target.password.value;

        if (username === usuarioBd && password === passwordBd) {
            localStorage.setItem("isAuthenticated", "true");
            navigate("/paginaprincipal");
        } else {
            alert("Usuario o contraseña incorrectos, intente otra vez");
        }
    }    

    const handleAdminLogin = () => {
            localStorage.setItem("isAdmin", "true");
            navigate("/LoginAdmin"); 
        }    

    useEffect(() => {
        const isAuthenticated = localStorage.getItem("isAuthenticated");
        if (isAuthenticated === "true") {
            navigate("/paginaprincipal");
        }

        localStorage.removeItem("isAdmin");
    }, [])

    return (
        <div style={styles.container}>
        <div style={styles.card}>
            <img src={logo} style={styles.logo} />
            <h1 style={styles.title}>Inicio de Sesión para Alumnos</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username" style={styles.label}>Usuario:</label>
                <input style={styles.input} type="text" id="username" name="username" required />                   
                <label htmlFor="password" style={styles.label}>Contraseña:</label>
                <input style={styles.input} type="password" id="password" name="password" required />
                <button type="submit" style={styles.button}>Iniciar Sesión</button>
                <button type="button" onClick={handleAdminLogin} style={styles.subButton}>Ingresar como Admin</button>
            </form>
        </div>
        </div>
    )
}

export default LoginUsuario;