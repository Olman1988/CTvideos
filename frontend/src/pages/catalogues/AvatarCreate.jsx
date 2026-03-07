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
import { useRef } from "react";



const AvatarCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [estados, setEstados] = useState([]);
  const [badges, setBadges] = useState([]);

  const [form, setForm] = useState({
    nombre: "",
    estado_id: "",
    insignias: ""
  });
const fileInputRef = useRef(null);
  
  const [imagen, setImagen] = useState(null);

  useEffect(() => {
    fetchEstados();
    fetchBadges();
  }, []);

  const fetchEstados = async () => {
    try {
      const res = await axiosInstance.get("/catalogos/estados");
      setEstados(res.data);
    } catch (error) {
      Swal.fire("Error", "No se pudieron cargar los estados", "error");
    }
  };

  const fetchBadges = async () => {
    try {
      const res = await axiosInstance.get("/badges/active");
      setBadges(res.data);
    } catch (error) {
      Swal.fire("Error", "No se pudieron cargar las insignias", "error");
    }
  };
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nombre || !form.estado_id || !imagen) {
      Swal.fire("Atención", "Nombre, estado e imagen son obligatorios", "warning");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      Object.entries(form).forEach(([key, value]) =>
        data.append(key, value)
      );
      data.append("imagen", imagen);

      await axiosInstance.post("/avatars/create", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      Swal.fire("Éxito", "Avatar creado correctamente", "success");
      navigate("/admin/mantenimientos/avatares");

    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.error || "Error al crear la Avatar",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      <Typography variant="h4" mb={3}>Crear Avatar</Typography>

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
                  <MenuItem key={e.id} value={e.id}>{e.nombre}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ width: { xs: "100%", md: "48%" } }}>
            <FormControl fullWidth>
              <InputLabel>Insignias</InputLabel>
              <Select
                name="insignias"
                value={form.insignias}
                label="Insignia"
                onChange={handleChange}
              >
                {badges.map(e => (
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

    setImagen(file);
  }}
/>
                </Button>
                {imagen && (
  <Box
    sx={{
      mt: 2,
      position: "relative",
      width: 200,
      height: 200,
      borderRadius: 3,
      overflow: "hidden",
      boxShadow: 3
    }}
  >
    <img
      src={URL.createObjectURL(imagen)}
      alt="Preview"
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover"
      }}
    />

    <Box
      sx={{
        position: "absolute",
        bottom: 0,
        width: "100%",
        background: "rgba(0,0,0,0.5)",
        textAlign: "center",
        p: 1
      }}
    >
      <Button
  size="small"
  variant="contained"
  color="error"
  onClick={() => {
    setImagen(null);

    // 🔥 limpiar el input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }}
>
  Eliminar
</Button>
    </Box>
  </Box>
)}
          </Box>

          {/* Botones */}
          <Box sx={{ width: "100%", display: "flex", gap: 2, mt: 2 }}>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : "Guardar"}
            </Button>
            <Button variant="outlined" onClick={() => navigate("/admin/mantenimientos/avatares")}>
              Cancelar
            </Button>
          </Box>

        </Box>
      </Box>
    </Box>
  );
};

export default AvatarCreate;
