import { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Chip,
  IconButton,
} from "@mui/material";
import Swal from "sweetalert2";
import axiosInstance from "@/api/axiosInstance";
import { useNavigate } from "react-router-dom";

// Iconos MUI
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import MoodIcon from "@mui/icons-material/Mood";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";

const ICONS_MUI = {
  EmojiEmotions: EmojiEmotionsIcon,
  Mood: MoodIcon,
  SentimentVerySatisfied: SentimentVerySatisfiedIcon,
  SentimentDissatisfied: SentimentDissatisfiedIcon,
  SentimentVeryDissatisfied: SentimentVeryDissatisfiedIcon,
};

const EmotionCreate = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [estados, setEstados] = useState([]);

  const [form, setForm] = useState({
    nombre: "",
    icono: "",
    estado_id: "",
    color: "#000000",
    sinonimos: [],
    sinonimoActual: "",
  });

  useEffect(() => {
    fetchEstados();
  }, []);

  const fetchEstados = async () => {
    try {
      const res = await axiosInstance.get("/catalogos/estados");
      setEstados(res.data);
    } catch {
      Swal.fire("Error", "No se pudieron cargar los estados", "error");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddSinonimo = () => {
    if (form.sinonimoActual.trim() === "") return;
    setForm({
      ...form,
      sinonimos: [...form.sinonimos, form.sinonimoActual.trim()],
      sinonimoActual: "",
    });
  };

  const handleDeleteSinonimo = (index) => {
    const newSinonimos = [...form.sinonimos];
    newSinonimos.splice(index, 1);
    setForm({ ...form, sinonimos: newSinonimos });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nombre || !form.estado_id || !form.icono) {
      Swal.fire(
        "Atención",
        "Nombre, estado e ícono son obligatorios",
        "warning"
      );
      return;
    }

    try {
      setLoading(true);

      const data = {
        nombre: form.nombre,
        estado_id: form.estado_id,
        color: form.color,
        sinonimos: form.sinonimos,
        icono: form.icono,
      };

      await axiosInstance.post("/emotions/create", data, {
    headers: { 'Content-Type': 'application/json' }
});

      Swal.fire("Éxito", "Emoción creada correctamente", "success");
      navigate("/admin/mantenimientos/emociones");
    } catch {
      Swal.fire("Error", "No se pudo crear la emoción", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      <Typography variant="h4" mb={3}>
        Nueva Emoción
      </Typography>
    
      <Box component="form" onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {/* Nombre */}
        <Box sx={{ width: { xs: "100%", md: "48%" }, mb: 2 }}>
          <TextField
            label="Nombre"
            name="nombre"
            fullWidth
            value={form.nombre}
            onChange={handleChange}
          />
        </Box>
            {/* Color */}
        <Box sx={{ width: { xs: "100%", md: "48%" }, mb: 2 }}>
          <TextField
            label="Color"
            type="color"
            name="color"
            value={form.color}
            onChange={handleChange}
            fullWidth
          />
        </Box>

        {/* Iconos */}
        <Box sx={{ width: { xs: "100%", md: "48%" }, mb: 2 }}>
          <Typography variant="subtitle1" mb={1}>
            Seleccionar Icono
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {Object.entries(ICONS_MUI).map(([key, Icon]) => (
              <IconButton
                key={key}
                color={form.icono === key ? "primary" : "default"}
                onClick={() => setForm({ ...form, icono: key })}
                sx={{
                  border:
                    form.icono === key ? "2px solid #1976d2" : "1px solid #ccc",
                  borderRadius: 1,
                }}
              >
                <Icon fontSize="large" />
              </IconButton>
            ))}
          </Box>
        </Box>

    

        {/* Sinónimos */}
        <Box sx={{ width: { xs: "100%", md: "48%" }, mb: 2 }}>
          <Typography variant="subtitle1">Sinónimos</Typography>
          <Box sx={{ display: "flex" }}>
            <TextField
              label="Agregar sinónimo"
              value={form.sinonimoActual}
              onChange={(e) =>
                setForm({ ...form, sinonimoActual: e.target.value })
              }
              fullWidth
            />
            <Button onClick={handleAddSinonimo}>Agregar</Button>
          </Box>
          <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
            {form.sinonimos.map((s, index) => (
              <Chip
                key={index}
                label={s}
                onDelete={() => handleDeleteSinonimo(index)}
              />
            ))}
          </Box>
        </Box>

        {/* Estado */}
        <Box sx={{ width: { xs: "100%", md: "48%" }, mb: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Estado</InputLabel>
            <Select
              name="estado_id"
              value={form.estado_id}
              label="Estado"
              onChange={handleChange}
            >
              {estados.map((estado) => (
                <MenuItem key={estado.id} value={estado.id}>
                  {estado.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Botones */}
        <Box sx={{ width: "100%", mt: 3, display: "flex", gap: 2 }}>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Guardar"}
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate("/admin/mantenimientos/emotions")}
          >
            Cancelar
          </Button>
        </Box>
      </Box>
      </Box>
    </Box>
  );
};

export default EmotionCreate;
