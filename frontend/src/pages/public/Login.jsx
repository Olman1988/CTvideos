import { useState } from "react";
import { Link } from "react-router-dom"; // Para la navegación interna de React
import { URL_IMG } from "@/config/config";
import Hero from "@/components/public/Hero"; // El componente que hicimos antes
import axiosInstance from "@/api/axiosInstance";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
export default function UserLogin() {
  // 1. Estado para los campos del formulario
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
const navigate = useNavigate();
  // 2. Manejador de cambios en los inputs
  const handleChange = (e) => {
    const { id, type, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      // Si es checkbox usa 'checked', si no usa 'value'
      [id.replace("login-", "")]: type === "checkbox" ? checked : value,
    }));
  };

  // 3. Manejador del envío
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
          Swal.fire("Error", "Todos los campos son obligatorios", "error");
          return;
        }
    try {
          const response = await axiosInstance.post("/auth/login-user", {
        email: formData.email,
        password: formData.password,
      });
    
          const { token, user } = response.data;
    
          // Guardar token y usuario completo
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));
    
          Swal.fire("Éxito", "Has iniciado sesión correctamente", "success");
          const isUser = user?.permisos?.includes("sistema.usuarios");
          console.log(isUser);
          if(isUser){
            navigate("/usuarios");
          }else{
            navigate("/403");
          }
          
    
        } catch (error) {
          const mensaje =
            error.response?.data?.error || "Email o contraseña incorrectos";
    
          Swal.fire("Error", mensaje, "error");
        }
  };

  return (
    <>
      {/* Reutilizamos el Hero dinámico */}
      <Hero title="Iniciar sesión" />

      <section className="register-section" aria-label="Formulario de inicio de sesion">
        <div className="register-card auth-card">
          <div className="register-badge" aria-hidden="true">
            <img src={`${URL_IMG}images/assets/farol.png`} alt="" />
          </div>

          <header className="register-header">
            <h2>Bienvenido de vuelta</h2>
            <p>Ingresa tus datos para continuar.</p>
          </header>

          <form className="register-form" onSubmit={handleSubmit}>
            <div className="register-field">
              <label htmlFor="login-email">Correo</label>
              <div className="register-input">
                <span className="register-icon">
                  <i className="fa-solid fa-envelope" aria-hidden="true"></i>
                </span>
                <input
                  id="login-email"
                  type="email"
                  placeholder="tunombre@email.com"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="register-field">
              <label htmlFor="login-password">Contraseña</label>
              <div className="register-input">
                <span className="register-icon">
                  <i className="fa-solid fa-lock" aria-hidden="true"></i>
                </span>
                <input
                  id="login-password"
                  type="password"
                  placeholder="Tu contraseña"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="auth-row">
              <label className="auth-checkbox" htmlFor="login-remember">
                <input
                  id="login-remember"
                  type="checkbox"
                  checked={formData.remember}
                  onChange={handleChange}
                />
                <span>Recordarme</span>
              </label>
              <Link className="auth-link" to="/recuperar">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <button className="register-submit" type="submit">
              Ingresar
            </button>
          </form>

          <div className="auth-footer">
            <span>¿Necesitas una cuenta?</span>
            <Link to="/registro">Crear cuenta</Link>
          </div>
        </div>
      </section>
    </>
  );
}