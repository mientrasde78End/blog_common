import { useState } from "react";
import { loginUser } from "../services/auth";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await loginUser(form);
    login(res.data.access, form.username);
    navigate("/blog");
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Iniciar sesión</h2>

      <input
        placeholder="Usuario"
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
      />

      <input
        type="password"
        placeholder="Contraseña"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <button>Entrar</button>
    </form>
  );
}
