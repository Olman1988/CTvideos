import { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from "@mui/material";
import Swal from "sweetalert2";
import axiosInstance from "@/api/axiosInstance";
import { useNavigate } from "react-router-dom";

const SliderCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [estados, setEstados] = useState([]);

  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    orden: 1,
    estado_id: "",
    enlace_1_texto: "",
    enlace_1_url: "",
    enlace_2_texto: "",
    enlace_2_url: ""
  });

  const [imagen, setImagen] = useState(null);

  useEffect(() => {
    fetchEstados();
  }, []);

  const fetchEstados = async () => {
    const res = await axiosInstance.get("/catalogos/estados");
    setEstados(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.titulo || !form.estado_id || !imagen) {
      Swal.fire("Atención", "Título, estado e imagen son obligatorios", "warning");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      Object.entries(form).forEach(([key, value]) =>
        data.append(key, value)
      );
      data.append("imagen", imagen);

      await axiosInstance.post("/sliders/create", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      Swal.fire("Éxito", "Slider creado correctamente", "success");
      navigate("/admin/mantenimientos/sliders");

    } catch (error) {
      Swal.fire("Error", error.response?.data?.error || "Error al crear slider", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      <Typography variant="h4" mb={3}>Crear Slider</Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>

          <Box sx={{ width: { xs: "100%", md: "48%" } }}>
            <TextField label="Título" name="titulo" fullWidth value={form.titulo} onChange={handleChange} />
          </Box>
            <Box sx={{ width: { xs: "100%", md: "48%" } }}>
            <TextField label="Descripción" name="descripcion" fullWidth value={form.descripcion} onChange={handleChange} />
          </Box>
          <Box sx={{ width: { xs: "100%", md: "48%" } }}>
            <TextField label="Orden" name="orden" type="number" fullWidth value={form.orden} onChange={handleChange} />
          </Box>

          <Box sx={{ width: { xs: "100%", md: "48%" } }}>
            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select name="estado_id" value={form.estado_id} label="Estado" onChange={handleChange}>
                {estados.map(e => (
                  <MenuItem key={e.id} value={e.id}>{e.nombre}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Imagen */}
          <Box sx={{ width: { xs: "100%", md: "48%" } }}>
            <Button variant="outlined" component="label" fullWidth>
              Seleccionar imagen
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => setImagen(e.target.files[0])}
              />
            </Button>
            {imagen && (
              <Typography variant="caption">{imagen.name}</Typography>
            )}
          </Box>

          {/* Enlaces */}
          <Box sx={{ width: { xs: "100%", md: "48%" } }}>
            <TextField label="Texto botón 1" name="enlace_1_texto" fullWidth value={form.enlace_1_texto} onChange={handleChange} />
          </Box>
          <Box sx={{ width: { xs: "100%", md: "48%" } }}>
            <TextField label="URL botón 1" name="enlace_1_url" fullWidth value={form.enlace_1_url} onChange={handleChange} />
          </Box>

          <Box sx={{ width: { xs: "100%", md: "48%" } }}>
            <TextField label="Texto botón 2" name="enlace_2_texto" fullWidth value={form.enlace_2_texto} onChange={handleChange} />
          </Box>
          <Box sx={{ width: { xs: "100%", md: "48%" } }}>
            <TextField label="URL botón 2" name="enlace_2_url" fullWidth value={form.enlace_2_url} onChange={handleChange} />
          </Box>

          {/* Botones */}
          <Box sx={{ width: "100%", display: "flex", gap: 2, mt: 2 }}>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : "Guardar"}
            </Button>
            <Button variant="outlined" onClick={() => navigate("/admin/mantenimientos/sliders")}>
              Cancelar
            </Button>
          </Box>

        </Box>
      </Box>
    </Box>
  );
};

export default SliderCreate;
