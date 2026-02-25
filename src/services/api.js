import axios from "axios";

const api = axios.create({
  baseURL: "https://mega-data.onrender.com/api/blog/",
});

// 👉 INTERCEPTOR: añade el token a TODAS las requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
