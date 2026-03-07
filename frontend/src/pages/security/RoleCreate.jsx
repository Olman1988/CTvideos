import { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Chip,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  OutlinedInput
} from "@mui/material";
import Swal from "sweetalert2";
import axiosInstance from "@/api/axiosInstance";
import { useNavigate } from "react-router-dom";

const RoleCreate = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nombre || !form.descripcion) {
      Swal.fire("Atención", "Complete los campos obligatorios", "warning");
      return;
    }

    try {
      setLoading(true);

      await axiosInstance.post("/roles/create", form);

      Swal.fire("Éxito", "Rol creado correctamente", "success");
      navigate("/admin/seguridad/roles");
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.error || "Error al crear rol",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto" }}>
      <Typography variant="h4" mb={3}>
        Crear Rol
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        {/* CONTENEDOR FLEX */}
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

          {/* Correo */}
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

          {/* Botones */}
          <Box sx={{ width: "100%", mt: 2, display: "flex", gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Guardar"}
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

export default RoleCreate;
