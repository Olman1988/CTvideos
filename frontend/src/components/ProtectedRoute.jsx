import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ permiso, children }) => {
  const token = localStorage.getItem("token");
  const userRaw = localStorage.getItem("user");

  // ❌ NO autenticado
  if (!token || !userRaw) {
    return <Navigate to="/login" replace />;
  }

  let user;
  try {
    user = JSON.parse(userRaw);
  } catch (e) {
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }

  // 🚫 Autenticado pero SIN permiso
  if (permiso && !user.permisos?.includes(permiso)) {
    return <Navigate to="/403" replace />;
  }

  // ✅ Todo OK
  return children;
};

export default ProtectedRoute;
