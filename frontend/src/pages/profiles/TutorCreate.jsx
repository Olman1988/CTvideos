import { useEffect, useState } from "react";
import { API_URL_IMG } from "@/config/config";
import Select from "react-select";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress, 
  FormControl,
  InputLabel,
  MenuItem,
    Select as MUISelect,
  TableContainer 
} from "@mui/material";
import Swal from "sweetalert2";
import axiosInstance from "@/api/axiosInstance";
import { useNavigate } from "react-router-dom";

const TutorCreate = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [centros, setCentros] = useState([]);

  const [form, setForm] = useState({
    nombre: "",
    primer_apellido: "",
    segundo_apellido: "",
    estado_id: 1,
    centros_educativos: []
  });

  useEffect(() => {
    fetchCentros();
  }, []);

  const fetchCentros = async () => {
    try {
      const res = await axiosInstance.get("/centers/active");
      setCentros(res.data);
    } catch {
      Swal.fire("Error", "No se pudieron cargar los centros educativos", "error");
    }
  };
const centroOptions = centros.map((c) => ({
  value: Number(c.id),
  label: c.nombre,
}));
 

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

  // ✅ Toggle de centros educativos como números
  const handleToggleCentro = (id) => {
    const numericId = Number(id);
    setForm(prev => ({
      ...prev,
      centros_educativos: prev.centros_educativos.includes(numericId)
        ? prev.centros_educativos.filter(c => c !== numericId)
        : [...prev.centros_educativos, numericId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nombre || !form.primer_apellido ) {
      Swal.fire("Atención", "Complete los campos obligatorios", "warning");
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.post("/tutors/create", form);
      Swal.fire("Éxito", "tutor creado correctamente", "success");
      navigate("/admin/perfiles/tutores");
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.error || "Error al crear tutor",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };



  return (
    <Box sx={{ maxWidth: 1200, mx: "auto" }}>
      <Typography variant="h4" mb={3}>
        Crear tutor
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
              onClick={() => navigate("/admin/perfiles/tutores")}
            >
              Cancelar
            </Button>
          </Box>

        </Box>
      </Box>
    </Box>
  );
};

export default TutorCreate;
