
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const userRaw = localStorage.getItem("user");

  // 1. Si no hay token, al login directamente
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    // 2. Intentamos obtener los datos del usuario
    const user = JSON.parse(userRaw);
    
    // 3. Validamos si tiene el permiso 'sistema.admin'
    // Usamos ?. para evitar errores si 'permisos' no existe
    const esAdmin = user?.permisos?.includes("sistema.admin");

    if (!esAdmin) {
      // Si está logueado pero no es admin, lo mandamos a una ruta de "No Autorizado"
      // o de vuelta al inicio si no tienes esa página aún.
      return <Navigate to="/403" replace />; 
    }

  } catch (error) {
    // Si el JSON está mal formado, limpiamos y fuera
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }

  // 4. Si pasó todas las pruebas, renderiza los hijos
  return children;
};

export default PrivateRoute;