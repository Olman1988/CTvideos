import { useEffect, useState } from "react";
import { API_URL_IMG } from "@/config/config";
import Select from "react-select";

import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Avatar,
  FormControl,
  InputLabel,
  Select as MUISelect,
  MenuItem
} from "@mui/material";
import Swal from "sweetalert2";
import axiosInstance from "@/api/axiosInstance";
import { useNavigate } from "react-router-dom";

const StudentCreate = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [centros, setCentros] = useState([]);
  const [avatares, setAvatares] = useState([]);

  const [form, setForm] = useState({
    nombre: "",
    primer_apellido: "",
    segundo_apellido: "",
    alias: "",
    fecha_nacimiento: "",
    estado_id: 1,
    avatar_id: "",
    centros_educativos: [],
    usuarioRequerido: false,
    user: {
    correo: "",
    password: "",
    confirmpassword: ""
  }
  });

  useEffect(() => {
    fetchCentros();
    fetchAvatares();
  }, []);

  const fetchCentros = async () => {
    try {
      const res = await axiosInstance.get("/centers/active");
      setCentros(res.data);
    } catch {
      Swal.fire("Error", "No se pudieron cargar los centros educativos", "error");
    }
  };

  const fetchAvatares = async () => {
    try {
      const res = await axiosInstance.get("/avatars/active");
      setAvatares(res.data);
    } catch {
      Swal.fire("Error", "No se pudieron cargar los avatares", "error");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
const centroOptions = centros.map((c) => ({
  value: Number(c.id),
  label: c.nombre,
}));
const handleAddCentro = (centroId) => {
  if (!centroId) return;

  setForm((prev) => ({
    ...prev,
    centros_educativos: [
      ...prev.centros_educativos,
      Number(centroId),
    ],
  }));
};

const handleRemoveCentro = (centroId) => {
  setForm((prev) => ({
    ...prev,
    centros_educativos: prev.centros_educativos.filter(
      id => Number(id) !== Number(centroId)
    ),
  }));
};



  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nombre || !form.primer_apellido || !form.fecha_nacimiento) {
      Swal.fire("Atención", "Complete los campos obligatorios", "warning");
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.post("/students/create", form);
      Swal.fire("Éxito", "Estudiante creado correctamente", "success");
      navigate("/admin/perfiles/estudiantes");
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.error || "Error al crear estudiante",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const getAvatarImage = (avatar) =>
    avatar?.imagen ? `${API_URL_IMG}${avatar.imagen}` : "/no-avatar.png";

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto" }}>
      <Typography variant="h4" mb={3}>
        Crear estudiante
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
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

          {/* Primer apellido */}
          <Box sx={{ width: { xs: "100%", md: "48%" } }}>
            <TextField
              label="Primer apellido"
              name="primer_apellido"
              fullWidth
              required
              value={form.primer_apellido}
              onChange={handleChange}
            />
          </Box>

          {/* Segundo apellido */}
          <Box sx={{ width: { xs: "100%", md: "48%" } }}>
            <TextField
              label="Segundo apellido"
              name="segundo_apellido"
              fullWidth
              value={form.segundo_apellido}
              onChange={handleChange}
            />
          </Box>

          {/* Alias */}
          <Box sx={{ width: { xs: "100%", md: "48%" } }}>
            <TextField
              label="Alias"
              name="alias"
              fullWidth
              value={form.alias}
              onChange={handleChange}
            />
          </Box>

          {/* Fecha nacimiento */}
          <Box sx={{ width: { xs: "100%", md: "48%" } }}>
            <TextField
              label="Fecha de nacimiento"
              name="fecha_nacimiento"
              type="date"
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
              value={form.fecha_nacimiento}
              onChange={handleChange}
            />
          </Box>

          {/* Requiere usuario */}
           <Box sx={{ width: { xs: "100%", md: "48%" } }}>
              <label style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <input
                  type="checkbox"
                  name="usuarioRequerido"
                  checked={form.usuarioRequerido}
                  onChange={(e) =>
                    setForm({ ...form, usuarioRequerido: e.target.checked })
                  }
                />
                ¿Requiere usuario?
              </label>
            </Box>
          {/* Dentro del mismo StudentCreate, debajo del checkbox "¿Requiere usuario?" */}

          {form.usuarioRequerido && (
          <Box style={{
      width: "100%",
      display: "flex",
      flexWrap: "wrap",
      gap: "16px",
      marginTop: "24px",
      padding: "16px",
      border: "1px solid #ccc",
      borderRadius: "8px",
      backgroundColor: "#f9f9f9"
    }} >
            {/* Título de la sección */}
            <Typography variant="h6" sx={{ width: "100%", mb: 2 }}>
              Datos del usuario
            </Typography>

            {/* Correo */}
            <Box sx={{ width: { xs: "100%", md: "48%" } }}>
              <TextField
                label="Correo"
                name="correo"
                type="email"
                fullWidth
                required
                value={form.user?.correo || ""}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    user: { ...prev.user, correo: e.target.value }
                  }))
                }
              />
            </Box>

            {/* Contraseña */}
            <Box sx={{ width: { xs: "100%", md: "48%" } }}>
              <TextField
                label="Contraseña"
                name="password"
                type="password"
                fullWidth
                required
                value={form.user?.password || ""}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    user: { ...prev.user, password: e.target.value }
                  }))
                }
              />
            </Box>

            {/* Confirmar Contraseña */}
            <Box sx={{ width: { xs: "100%", md: "48%" } }}>
              <TextField
                label="Confirmar contraseña"
                name="confirmpassword"
                type="password"
                fullWidth
                required
                value={form.user?.confirmpassword || ""}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    user: { ...prev.user, confirmpassword: e.target.value }
                  }))
                }
              />
            </Box>
          </Box>
        )}

          {/* Avatar selector visual */}
            <Box sx={{ width: { xs: "100%", md: "100%" } }}>
              <Typography variant="subtitle1" mb={1}>
                Seleccione un avatar
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
                  gap: 2,
                  border: "1px solid #ccc",
                  borderRadius: 1,
                  p: 2,
                }}
              >
                {avatares.map((avatar) => {
                  const selected = Number(form.avatar_id) === Number(avatar.id);

                  return (
                    <Box
                      key={avatar.id}
                      onClick={() =>
                        setForm({ ...form, avatar_id: Number(avatar.id) })
                      }
                      sx={{
                        cursor: "pointer",
                        textAlign: "center",
                        borderRadius: 2,
                        p: 1,
                        border: selected ? "2px solid #1976d2" : "2px solid transparent",
                        boxShadow: selected ? 3 : 0,
                        transform: selected ? "scale(1.05)" : "scale(1)",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          boxShadow: 2,
                          transform: "scale(1.05)",
                        },
                      }}
                    >
                      <Avatar
                        src={`${API_URL_IMG}${avatar.imagen}`}
                        sx={{
                          width: 56,
                          height: 56,
                          mx: "auto",
                          mb: 1,
                        }}
                      />
                      <Typography variant="caption">
                        {avatar.nombre}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>

              {!form.avatar_id && (
                <Typography color="text.secondary" variant="caption" mt={1}>
                  Debe seleccionar un avatar
                </Typography>
              )}
            </Box>


            {/* Selector de centros educativos */}
              <Box sx={{ width: "100%", mt: 2 }}>
                <Typography variant="subtitle1" mb={1}>
                  Centros educativos
                </Typography>

                <Select
                  options={centroOptions.filter(
                    (o) => !form.centros_educativos.includes(o.value)
                  )}
                  placeholder="Buscar y seleccionar centro educativo"
                  isClearable
                  onChange={(option) => {
                    if (!option) return;

                    setForm((prev) => ({
                      ...prev,
                      centros_educativos: [...prev.centros_educativos, option.value],
                    }));
                  }}
                />
              </Box>

            <Box sx={{ border: "1px solid #ccc", borderRadius: 1, p: 2, mt: 2,width: "100%" }}>
              {form.centros_educativos.length === 0 && (
                <Typography color="gray" sx={{ minWidth: 300 }}>
                  No hay centros educativos asignados
                </Typography>
              )}

              {form.centros_educativos.map((centroId) => {
                const centro = centros.find(
                  c => Number(c.id) === Number(centroId)
                );

                return (
                  <Box
                    key={centroId}
                    sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}
                  >
                    <Typography sx={{ minWidth: "90%" }}>
                      {centro?.nombre || "Centro educativo"}
                    </Typography>

                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleRemoveCentro(centroId)}
                    >
                      Quitar
                    </Button>
                  </Box>
                );
              })}
            </Box>

             


          {/* Botones */}
          <Box sx={{ width: "100%", mt: 2, display: "flex", gap: 2 }}>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : "Guardar"}
            </Button>

            <Button
              variant="outlined"
              onClick={() => navigate("/admin/perfiles/estudiantes")}
            >
              Cancelar
            </Button>
          </Box>

        </Box>
      </Box>
    </Box>
  );
};

export default StudentCreate;
