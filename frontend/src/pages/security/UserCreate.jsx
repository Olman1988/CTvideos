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

const UserCreate = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);

  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    password: "",
    confirmpassword:"",
    roles: []
  });

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await axiosInstance.get("/roles/all");
      setRoles(res.data);
    } catch {
      Swal.fire("Error", "No se pudieron cargar los roles", "error");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nombre || !form.correo || !form.password || !form.confirmpassword) {
      Swal.fire("Atención", "Complete los campos obligatorios", "warning");
      return;
    }

    try {
      setLoading(true);

      await axiosInstance.post("/users/create", form);

      Swal.fire("Éxito", "Usuario creado correctamente", "success");
      navigate("/admin/seguridad/usuarios");
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.error || "Error al crear usuario",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto" }}>
      <Typography variant="h4" mb={3}>
        Crear usuario
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
              label="Correo"
              name="correo"
              type="email"
              fullWidth
              required
              value={form.correo}
              onChange={handleChange}
            />
          </Box>

          {/* Password */}
          <Box sx={{ width: { xs: "100%", md: "48%" } }}>
            <TextField
              label="Contraseña"
              name="password"
              type="password"
              fullWidth
              required
              value={form.password}
              onChange={handleChange}
            />
          </Box>
          {/* Password Confirmar */}
          <Box sx={{ width: { xs: "100%", md: "48%" } }}>
            <TextField
              label="Confirmar Contraseña"
              name="confirmpassword"
              type="password"
              fullWidth
              required
              value={form.confirmpassword}
              onChange={handleChange}
            />
          </Box>

          {/* Roles */}
          <Box sx={{ width: { xs: "100%", md: "48%" } }}>
            <FormControl fullWidth>
              <InputLabel>Roles</InputLabel>
              <Select
                multiple
                value={form.roles}
                onChange={(e) =>
                  setForm({ ...form, roles: e.target.value })
                }
                input={<OutlinedInput label="Roles" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {selected.map((id) => {
                      const rol = roles.find(r => r.id === id);
                      return (
                        <Chip
                          key={id}
                          label={rol?.nombre}
                          size="small"
                          color="primary"
                        />
                      );
                    })}
                  </Box>
                )}
              >
                {roles.map((rol) => (
                  <MenuItem key={rol.id} value={rol.id}>
                    {rol.nombre}
                  </MenuItem>
                ))}
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
              {loading ? <CircularProgress size={24} /> : "Guardar"}
            </Button>

            <Button
              variant="outlined"
              onClick={() => navigate("/admin/seguridad/usuarios")}
            >
              Cancelar
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default UserCreate;
