import { Breadcrumbs as MUIBreadcrumbs, Link, Typography } from "@mui/material";
import { useLocation, Link as RouterLink } from "react-router-dom";

const nameMap = {
  "dashboard": "Dashboard",
  "perfil": "Mi Perfil",
  "mi-contenido": "Mi Contenido",
  "biblioteca": "Biblioteca de Medios",
  "videos": "Videos",
  "imagenes": "Imágenes",
  "archivos": "Archivos",
  "notificaciones": "Notificaciones",
  "admin": "Administración",
  "revision": "Revisión de Contenidos",
  "seguridad": "Módulo Seguridad",
  "usuarios": "Usuarios",
  "roles": "Roles",
  "permisos": "Permisos",
  "mantenimientos": "Mantenimientos",
  "actividades": "Actividades",
  "retos": "Retos",
  "campanas":"Campañas"
};

export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  const capitalize = (text) =>
  text
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return (  
    <MUIBreadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
      <Link component={RouterLink} to="/" underline="hover" color="inherit">
        Inicio
      </Link>

      {pathnames.map((value, index) => {
        const to = "/" + pathnames.slice(0, index + 1).join("/");
        const label = nameMap[value] || capitalize(value);

        const isLast = index === pathnames.length - 1;

        return isLast ? (
          <Typography color="text.primary" key={to}>
            {label}
          </Typography>
        ) : (
          <Link
            component={RouterLink}
            to={to}
            underline="hover"
            color="inherit"
            key={to}
          >
            {label}
          </Link>
        );
      })}
    </MUIBreadcrumbs>

  );
}
