import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

const StudentEdit = () => {
  const navigate = useNavigate();
  const { uuid } = useParams();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
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
    centros_educativos: []
  });

  /* ===================== LOAD DATA ===================== */
  useEffect(() => {
    fetchCentros();
    fetchAvatares();
    fetchStudent();
  }, []);

  const fetchCentros = async () => {
    const res = await axiosInstance.get("/centers/active");
    setCentros(res.data);
  };

  const fetchAvatares = async () => {
    const res = await axiosInstance.get("/avatars/active");
    setAvatares(res.data);
  };

  const fetchStudent = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/students/get/${uuid}`);

      const educationalCenters = res.data.educational_centers
        ? JSON.parse(res.data.educational_centers)
        : [];

      console.log(educationalCenters, "educationalCenters");
      console.log(
        "form.centros_educativos:",
        educationalCenters.map((c) => c.id)
      );

      setForm({
        nombre: res.data.first_name ?? "",
        primer_apellido: res.data.last_name ?? "",
        segundo_apellido: res.data.second_last_name ?? "",
        alias: res.data.alias ?? "",
        fecha_nacimiento: res.data.birth_date ?? "",
        estado_id: Number(res.data.estado_id ?? 1),
        avatar_id: res.data.avatar_id ? Number(res.data.avatar_id) : "",
        centros_educativos: educationalCenters.map((c) => Number(c.id)) // ✅ valores numéricos
      });
    } catch (error) {
      Swal.fire("Error", "No se pudo cargar el estudiante", "error");
      navigate("/admin/perfiles/estudiantes");
    } finally {
      setLoading(false);
    }
  };
const centroOptions = centros.map((c) => ({
  value: Number(c.id),
  label: c.nombre,
}));
  /* ===================== HANDLERS ===================== */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleRemoveCentro = (centroId) => {
  setForm((prev) => ({
    ...prev,
    centros_educativos: prev.centros_educativos.filter(
      id => Number(id) !== Number(centroId)
    ),
  }));
};

  const handleToggleCentro = (id) => {
    const numericId = Number(id);
    setForm((prev) => ({
      ...prev,
      centros_educativos: prev.centros_educativos.includes(numericId)
        ? prev.centros_educativos.filter((c) => c !== numericId)
        : [...prev.centros_educativos, numericId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nombre || !form.primer_apellido) {
      Swal.fire(
        "Atención",
        "Nombre y primer apellido son obligatorios",
        "warning"
      );
      return;
    }

    try {
      setSaving(true);
      await axiosInstance.post(`/students/update/${uuid}`, form);
      Swal.fire("Éxito", "Estudiante actualizado correctamente", "success");
      navigate("/admin/perfiles/estudiantes");
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.error || "Error al actualizar",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  /* ===================== RENDER ===================== */
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      <Typography variant="h4" mb={3}>
        Editar estudiante
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>

          {/* Nombre */}
          <Box sx={{ width: { xs: "100%", md: "48%" } }}>
          <TextField
            label="Nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            fullWidth
          />
        </Box>
        <Box sx={{ width: { xs: "100%", md: "48%" } }}>
          {/* Primer apellido */}
          <TextField
            label="Primer apellido"
            name="primer_apellido"
            value={form.primer_apellido}
            onChange={handleChange}
            fullWidth
          />
        </Box>
          {/* Segundo apellido */}
          <Box sx={{ width: { xs: "100%", md: "48%" } }}>
          <TextField
            label="Segundo apellido"
            name="segundo_apellido"
            value={form.segundo_apellido}
            onChange={handleChange}
            fullWidth
          />
            </Box>
          {/* Alias */}
          <Box sx={{ width: { xs: "100%", md: "48%" } }}>
          <TextField
            label="Alias"
            name="alias"
            value={form.alias}
            onChange={handleChange}
            fullWidth
          />
            </Box>
          {/* Fecha nacimiento */}
          <Box sx={{ width: { xs: "100%", md: "48%" } }}>
          <TextField
            type="date"
            label="Fecha de nacimiento"
            name="fecha_nacimiento"
            value={form.fecha_nacimiento}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Box>
          {/* Estado */}
          <Box sx={{ width: { xs: "100%", md: "48%" } }}>
          <FormControl fullWidth>
            <InputLabel>Estado</InputLabel>
            <MUISelect
              name="estado_id"
              value={form.estado_id}
              onChange={handleChange}
            >
              <MenuItem value={1}>Activo</MenuItem>
              <MenuItem value={2}>Inactivo</MenuItem>
              <MenuItem value={3}>Suspendido</MenuItem>
            </MUISelect>
          </FormControl>
            </Box>
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
        </Box>

        {/* Botones */}
        <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
          <Button type="submit" variant="contained" disabled={saving}>
            {saving ? <CircularProgress size={24} /> : "Guardar cambios"}
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
  );
};

export default StudentEdit;
