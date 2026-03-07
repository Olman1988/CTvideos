import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL_IMG } from "@/config/config";
import Select from "react-select";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Avatar,
  FormControl,
  InputLabel,
  Select as MUISelect,
  MenuItem
} from "@mui/material";
import Swal from "sweetalert2";
import axiosInstance from "@/api/axiosInstance";

const TutorEdit = () => {
  const navigate = useNavigate();
  const { uuid } = useParams();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [centros, setCentros] = useState([]);

  const [form, setForm] = useState({
    nombre: "",
    primer_apellido: "",
    segundo_apellido: "",
    estado_id: 1,
    centros_educativos: []
  });

  /* ===================== LOAD DATA ===================== */
  useEffect(() => {
    fetchCentros();
    fetchTutor();
  }, []);

  const fetchCentros = async () => {
    const res = await axiosInstance.get("/centers/active");
    setCentros(res.data);
  };
  const centroOptions = centros.map((c) => ({
  value: Number(c.id),
  label: c.nombre,
}));

  const fetchTutor = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/tutors/get/${uuid}`);
        console.log(res);
      const educationalCenters = Array.isArray(res.data.educational_center_ids)
    ? res.data.educational_center_ids
    : [];


      setForm({
        nombre: res.data.nombre ?? "",
        primer_apellido: res.data.primer_apellido ?? "",
        segundo_apellido: res.data.segundo_apellido ?? "",
        estado_id: Number(res.data.estado_id ?? 1),
        centros_educativos: educationalCenters.map((c) => Number(c)) // ✅ valores numéricos
      });
    } catch (error) {
      Swal.fire("Error", "No se pudo cargar el tutor", "error");
      navigate("/admin/perfiles/tutores");
    } finally {
      setLoading(false);
    }
  };

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
      await axiosInstance.post(`/tutors/update/${uuid}`, form);
      Swal.fire("Éxito", "Tutor actualizado correctamente", "success");
      navigate("/admin/perfiles/tutores");
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
    <Box sx={{ maxWidth: 1500, mx: "auto", p: 3 }}> 
      <Typography variant="h4" mb={3}>
        Editar tutor
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
             <Box sx={{ width: { xs: "100%", md: "48%" } }}>
          {/* Nombre */}
          <TextField
            label="Nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            fullWidth
          />
            </Box>
          {/* Primer apellido */}
          <Box sx={{ width: { xs: "100%", md: "48%" } }}>
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
            onClick={() => navigate("/admin/perfiles/tutores")}
          >
            Cancelar
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default TutorEdit;
