export const hasPermiso = (permiso) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || !user.permisos) return false;

  return user.permisos.includes(permiso);
};
