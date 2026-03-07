// src/api/axiosInstance.js
import axios from "axios";
import { API_URL } from "@/config/config"; 

const axiosInstance = axios.create({
  baseURL: API_URL, // tu backend
  withCredentials: false, // como usas JWT, no necesitas cookies
});

// Interceptor de requests -> añade token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de responses -> maneja expiración del token
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // El token es inválido o expiró
      localStorage.removeItem("token");
      window.location.href = "/login"; // redirige al login
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
 