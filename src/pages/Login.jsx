import { useState } from "react";
import { loginUser } from "../services/auth";
import { useAuth } from "../context/useAuth";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await loginUser({ username, password });
    login(res.data.access, username);
    navigate("/blog");
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Iniciar sesión</h2>

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

      <button>Entrar</button>

      <p>
        ¿No tienes cuenta? <Link to="/">Crear cuenta</Link>
      </p>
    </form>
  );
}
