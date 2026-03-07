import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  FormGroup,
  FormControlLabel,
  Switch,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Swal from "sweetalert2";
import axiosInstance from "@/api/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";

const Permissions = () => {
  const navigate = useNavigate();
  const { uuid } = useParams();

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [modules, setModules] = useState([]); // Módulos con permisos agrupados

  // 🔹 Cargar módulos y permisos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [modulesRes, permissionsRes] = await Promise.all([
          axiosInstance.get("/permission/modules"),
          axiosInstance.get(`/permission/all/${uuid}`),
        ]);

        const permissions = permissionsRes.data.map((p) => ({
          ...p,
          active: !!p.active,
        }));

        // Agrupar permisos por modulo
        const grouped = modulesRes.data.map((mod) => ({
          ...mod,
          permisos: permissions.filter((p) => p.modulo_id === mod.id),
        }));

        setModules(grouped);
      } catch (error) {
        Swal.fire(
          "Error",
          error.response?.data?.error || "No se pudieron cargar los permisos",
          "error"
        );
        navigate("/admin/seguridad/roles");
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [uuid, navigate]);

  // 🔹 Cambiar estado de un permiso
  const handleToggle = (permId, moduloId) => {
    setModules((prev) =>
      prev.map((mod) =>
        mod.id === moduloId
          ? {
              ...mod,
              permisos: mod.permisos.map((p) =>
                p.id === permId ? { ...p, active: !p.active } : p
              ),
            }
          : mod
      )
    );
  };

  // 🔹 Guardar permisos al backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Extraer todos los permisos con id y active
      const permissionsToSend = modules.flatMap((mod) =>
        mod.permisos.map(({ id, active }) => ({ id, active }))
      );

      await axiosInstance.post(`/permission/update/${uuid}`, {
        permissions: permissionsToSend,
      });

      Swal.fire("Éxito", "Permisos actualizados correctamente", "success");
      navigate("/admin/seguridad/roles");
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.error || "Error al actualizar permisos",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto" }}>
      <Typography variant="h4" mb={3}>
        Editar Permisos
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        {modules.map((mod) => (
          <Accordion key={mod.id}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">{mod.nombre}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: 2,
                }}
              >
                {mod.permisos.map((perm) => (
                  <FormControlLabel
                    key={perm.id}
                    control={
                      <Switch
                        checked={perm.active}
                        onChange={() => handleToggle(perm.id, mod.id)}
                      />
                    }
                    label={perm.descripcion}
                  />
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}

        <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Guardar Cambios"}
          </Button>

          <Button
            variant="outlined"
            onClick={() => navigate("/admin/seguridad/roles")}
          >
            Cancelar
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Permissions;
