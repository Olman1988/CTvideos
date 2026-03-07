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
import { useNavigate, useParams } from "react-router-dom";

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

const EmotionEdit = () => {
  const { uuid } = useParams(); // recibimos el uuid del route
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [estados, setEstados] = useState([]);

  const [form, setForm] = useState({
    nombre: "",
    icono: "",
    estado_id: "",
    color: "#000000",
    sinonimos: [],
    sinonimoActual: "",
  });

  // Traer estados
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

  // Traer datos de la emoción
  useEffect(() => {
    if (!uuid) return;
    fetchEmotion();
  }, [uuid]);

  const fetchEmotion = async () => {
  try {
    setLoadingData(true);
    const res = await axiosInstance.get(`/emotions/getEmotion/${uuid}`);
    const data = res.data;

    setForm({
      nombre: data.nombre || "",
      icono: data.icono || "",
      estado_id: data.estado_id || "",
      color: data.color || "#000000",
      // Convertimos a array si viene como string separado por comas
      sinonimos: Array.isArray(data.sinonimos)
        ? data.sinonimos
        : data.sinonimos?.split(",") || [],
      sinonimoActual: "",
    });
  } catch {
    Swal.fire(
      "Error",
      "No se pudieron cargar los datos de la emoción",
      "error"
    );
  } finally {
    setLoadingData(false);
  }
};


  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleAddSinonimo = () => {
    const nuevo = form.sinonimoActual.trim();
    if (!nuevo) return;
    setForm({
      ...form,
      sinonimos: [...form.sinonimos, nuevo],
      sinonimoActual: "",
    });
  };

  const handleDeleteSinonimo = (index) => {
    const newSinonimos = form.sinonimos.filter((_, i) => i !== index);
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
      await axiosInstance.post(
        `/emotions/update/${uuid}`,
        {
          nombre: form.nombre,
          estado_id: form.estado_id,
          color: form.color,
          sinonimos: form.sinonimos,
          icono: form.icono,
        },
        { headers: { "Content-Type": "application/json" } }
      );
      Swal.fire("Éxito", "Emoción actualizada correctamente", "success");
      navigate("/admin/mantenimientos/emociones");
    } catch {
      Swal.fire("Error", "No se pudo actualizar la emoción", "error");
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) return <CircularProgress />;

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      <Typography variant="h4" mb={3}>
        Editar Emoción
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {/* Nombre */}
        <TextField
          label="Nombre"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          sx={{ width: { xs: "100%", md: "48%" } }}
        />

        {/* Color */}
        <TextField
          label="Color"
          type="color"
          name="color"
          value={form.color}
          onChange={handleChange}
          sx={{ width: { xs: "100%", md: "48%" } }}
        />

        {/* Iconos */}
        <Box sx={{ width: { xs: "100%", md: "48%" } }}>
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
                  border: form.icono === key ? "2px solid #1976d2" : "1px solid #ccc",
                  borderRadius: 1,
                }}
              >
                <Icon fontSize="large" />
              </IconButton>
            ))}
          </Box>
        </Box>

        {/* Sinónimos */}
        <Box sx={{ width: { xs: "100%", md: "48%" } }}>
          <Typography variant="subtitle1">Sinónimos</Typography>
          <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
            <TextField
              label="Agregar sinónimo"
              value={form.sinonimoActual}
              onChange={(e) =>
                setForm({ ...form, sinonimoActual: e.target.value })
              }
              fullWidth
            />
            <Button variant="contained" onClick={handleAddSinonimo}>
              Agregar
            </Button>
          </Box>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
            {form.sinonimos.map((s, i) => (
              <Chip key={i} label={s} onDelete={() => handleDeleteSinonimo(i)} />
            ))}
          </Box>
        </Box>

        {/* Estado */}
        <FormControl sx={{ width: { xs: "100%", md: "48%" } }}>
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

        {/* Botones */}
        <Box sx={{ width: "100%", display: "flex", gap: 2, mt: 3 }}>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Guardar"}
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate("/admin/mantenimientos/emociones")}
          >
            Cancelar
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default EmotionEdit;
