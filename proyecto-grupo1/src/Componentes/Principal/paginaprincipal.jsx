import { useNavigate } from "react-router-dom";

const PaginaPrincipal = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("isAuthenticated"); 
        navigate("/"); 
    };

    return (
        <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif", textAlign: "center" }}>
            <h1>Bienvenido a la Página Principal</h1>
            <p>Has ingresado correctamente usando tu usuario y contraseña.</p>
            <button 
                onClick={handleLogout} 
                style={{ padding: "0.6rem 1.2rem", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
            >
                Cerrar Sesión
            </button>
        </div>
    );
};

export default PaginaPrincipal;