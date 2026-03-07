import { useEffect, useState, useRef } from "react";
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

const BackgroundCreate = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [estados, setEstados] = useState([]);
  const [badges, setBadges] = useState([]);

  const [form, setForm] = useState({
    nombre: "",
    estado_id: "",
    insignias: ""
  });

  const [imagenNueva, setImagenNueva] = useState(null);

  useEffect(() => {
    fetchEstados();
    fetchBadges();
  }, []);

  const fetchEstados = async () => {
    const res = await axiosInstance.get("/catalogos/estados");
    setEstados(res.data);
  };

  const fetchBadges = async () => {
    const res = await axiosInstance.get("/badges/active");
    setBadges(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nombre || !form.estado_id) {
      Swal.fire("Atención", "Nombre y estado son obligatorios", "warning");
      return;
    }

    if (!imagenNueva) {
      Swal.fire("Atención", "La imagen es obligatoria", "warning");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      data.append("nombre", form.nombre);
      data.append("estado_id", form.estado_id);

      if (form.insignias) {
        data.append("insignias", JSON.stringify([form.insignias]));
      } else {
        data.append("insignias", JSON.stringify([]));
      }

      data.append("imagen", imagenNueva);

      await axiosInstance.post("/backgrounds/create", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      Swal.fire("Éxito", "Background creado correctamente", "success");
      navigate("/admin/mantenimientos/backgrounds");

    } catch (error) {
      Swal.fire("Error", "No se pudo crear el background", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      <Typography variant="h4" mb={3}>Nuevo Background</Typography>

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
            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select
                name="estado_id"
                value={form.estado_id}
                label="Estado"
                onChange={handleChange}
              >
                {estados.map(e => (
                  <MenuItem key={e.id} value={e.id}>
                    {e.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ width: { xs: "100%", md: "48%" } }}>
            <FormControl fullWidth>
              <InputLabel>Insignia</InputLabel>
              <Select
                name="insignias"
                value={form.insignias || ""}
                label="Insignia"
                onChange={handleChange}
                displayEmpty
              >
                <MenuItem value="">
                  <em>Sin insignia</em>
                </MenuItem>

                {badges.map(b => (
                  <MenuItem key={b.id} value={b.id}>
                    {b.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ width: { xs: "100%", md: "48%" } }}>
            <Button variant="outlined" component="label" fullWidth>
              Subir imagen
              <input
                ref={fileInputRef}
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;

                  if (!file.type.startsWith("image/")) {
                    Swal.fire("Solo se permiten imágenes");
                    return;
                  }

                  if (file.size > 2 * 1024 * 1024) {
                    Swal.fire("La imagen no debe superar 2MB");
                    return;
                  }

                  setImagenNueva(file);
                }}
              />
            </Button>

            {imagenNueva && (
              <Box mt={2}>
                <img
                  src={URL.createObjectURL(imagenNueva)}
                  alt="Preview"
                  width="200"
                />
              </Box>
            )}
          </Box>

          <Box sx={{ width: "100%", display: "flex", gap: 2, mt: 2 }}>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : "Guardar"}
            </Button>

            <Button
              variant="outlined"
              onClick={() => navigate("/admin/mantenimientos/backgrounds")}
            >
              Cancelar
            </Button>
          </Box>

        </Box>
      </Box>
    </Box>
  );
};

export default BackgroundCreate;