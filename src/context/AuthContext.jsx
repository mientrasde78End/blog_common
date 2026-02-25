import { createContext, useState } from "react";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [username, setUsername] = useState(localStorage.getItem("username"));

  const isAuthenticated = !!token;

  function login(accessToken, user) {
    localStorage.setItem("token", accessToken);
    localStorage.setItem("username", user);
    setToken(accessToken);
    setUsername(user);
  }

  function logout() {
    localStorage.clear();
    setToken(null);
    setUsername(null);
  }

  return (
    <AuthContext.Provider
      value={{ token, username, isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
