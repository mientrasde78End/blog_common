import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Blog from "./pages/Blog";
import ProtectedRoute from "./routes/ProtectedRoute";
import { useAuth } from "./context/useAuth";

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/blog" /> : <Register />}
        />

        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/blog" /> : <Login />}
        />

        <Route
          path="/blog"
          element={
            <ProtectedRoute>
              <Blog />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
