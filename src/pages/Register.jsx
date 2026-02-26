import { useState } from "react";
import { registerUser } from "../services/auth";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    await registerUser({ username, password });
    navigate("/login");
  }

  return (
    <div className="auth-wrapper">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Crear cuenta</h2>

        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Usuario"
          required
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          required
        />

        <button>Registrarse</button>

        <p className="auth-link">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </form>
    </div>
  );
}
