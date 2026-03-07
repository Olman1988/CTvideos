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
import { useNavigate, useParams } from "react-router-dom";

const UserEdit = () => {
  const navigate = useNavigate();
  const { uuid } = useParams();

  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);

  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    password: "",
    confirmpassword: "",
    roles: []
  });

  useEffect(() => {
    fetchRoles();
    fetchUser();
  }, []);

  const fetchRoles = async () => {
    const res = await axiosInstance.get("/roles/all");
    setRoles(res.data);
  };

  const fetchUser = async () => {
    try {
      const res = await axiosInstance.get(`/users/${uuid}`);
      setForm({
        nombre: res.data.nombre,
        correo: res.data.correo,
        password: "",
        confirmpassword: "",
        roles: res.data.roles.map(r => r.id) // ✅ IDs
      });
    } catch {
      Swal.fire("Error", "No se pudo cargar el usuario", "error");
      navigate("/seguridad/usuarios");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nombre || !form.correo) {
      Swal.fire("Atención", "Nombre y correo son obligatorios", "warning");
      return;
    }

    if (form.password && form.password !== form.confirmpassword) {
      Swal.fire("Atención", "Las contraseñas no coinciden", "warning");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        nombre: form.nombre,
        correo: form.correo,
        roles: form.roles // IDs
      };

      if (form.password) {
        payload.password = form.password;
      }

      await axiosInstance.post(`/users/update/${uuid}`, payload);

      Swal.fire("Éxito", "Usuario actualizado correctamente", "success");
      navigate("/admin/seguridad/usuarios");
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.error || "Error al actualizar usuario",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto" }}>
      <Typography variant="h4" mb={3}>
        Editar usuario
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          <Box sx={{ width: { xs: "100%", md: "48%" } }}>
            <TextField
              label="Nombre"
              name="nombre"
              fullWidth
              value={form.nombre}
              onChange={handleChange}
            />
          </Box>

          <Box sx={{ width: { xs: "100%", md: "48%" } }}>
            <TextField
              label="Correo"
              name="correo"
              type="email"
              fullWidth
              value={form.correo}
              onChange={handleChange}
            />
          </Box>

          <Box sx={{ width: { xs: "100%", md: "48%" } }}>
            <TextField
              label="Nueva contraseña (opcional)"
              name="password"
              type="password"
              fullWidth
              value={form.password}
              onChange={handleChange}
            />
          </Box>

          <Box sx={{ width: { xs: "100%", md: "48%" } }}>
            <TextField
              label="Confirmar contraseña"
              name="confirmpassword"
              type="password"
              fullWidth
              value={form.confirmpassword}
              onChange={handleChange}
            />
          </Box>

          {/* ROLES */}
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

          <Box sx={{ width: "100%", mt: 2, display: "flex", gap: 2 }}>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : "Actualizar"}
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate("/seguridad/usuarios")}
            >
              Cancelar
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default UserEdit;
