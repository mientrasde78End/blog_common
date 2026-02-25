import { useState, useEffect } from "react";
import { registerUser } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function Register() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/blog");
    }
  }, [isAuthenticated, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    await registerUser(form);
    navigate("/login");
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Crear cuenta</h2>

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

      <button>Registrarse</button>
    </form>
  );
}
