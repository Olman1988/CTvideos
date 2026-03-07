import { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from "@mui/material";
import Swal from "sweetalert2";
import axiosInstance from "@/api/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";

const RoleEdit = () => {
  const navigate = useNavigate();
  const { uuid } = useParams();

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    estado: ""
  });

  // 🔹 Cargar datos del rol
  useEffect(() => {
    const fetchRole = async () => {
      try {
        const { data } = await axiosInstance.get(`/roles/getRole/${uuid}`);

        setForm({
          nombre: data.nombre,
          descripcion: data.descripcion,
          estado: data.estado
        });
      } catch (error) {
        Swal.fire(
          "Error",
          error.response?.data?.error || "No se pudo cargar el rol",
          "error"
        );
        navigate("/admin/seguridad/roles");
      } finally {
        setLoadingData(false);
      }
    };

    fetchRole();
  }, [uuid, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nombre || !form.descripcion ) {
      Swal.fire("Atención", "Complete los campos obligatorios", "warning");
      return;
    }

    try {
      setLoading(true);

      await axiosInstance.post(`/roles/update/${uuid}`, form);

      Swal.fire("Éxito", "Rol actualizado correctamente", "success");
      navigate("/admin/seguridad/roles");
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.error || "Error al actualizar rol",
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
        Editar Rol
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2
          }}
        >
          {/* Nombre */}
          <Box sx={{ width: { xs: "100%", md: "48%" } }}>
            <TextField
              label="Nombre"
              name="nombre"
              fullWidth
              required
              value={form.nombre}
              onChange={handleChange}
            />
          </Box>

          {/* Descripción */}
          <Box sx={{ width: { xs: "100%", md: "48%" } }}>
            <TextField
              label="Descripción"
              name="descripcion"
              fullWidth
              required
              value={form.descripcion}
              onChange={handleChange}
            />
          </Box>

          {/* Estado */}
          <Box sx={{ width: { xs: "100%", md: "48%" } }}>
            <FormControl fullWidth required>
              <InputLabel id="estado-label">Estado</InputLabel>
              <Select
                labelId="estado-label"
                label="Estado"
                name="estado"
                value={form.estado}
                onChange={handleChange}
              >
                <MenuItem value={1}>Activo</MenuItem>
                <MenuItem value={0}>Inactivo</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Botones */}
          <Box sx={{ width: "100%", mt: 2, display: "flex", gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Actualizar"}
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
    </Box>
  );
};

export default RoleEdit;
