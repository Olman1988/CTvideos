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
import { useNavigate, useParams } from "react-router-dom";
import { API_URL_IMG } from "@/config/config"; 

const AvatarEdit = () => {
  const { uuid } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [estados, setEstados] = useState([]);
  const [badges, setBadges] = useState([]);

  const [form, setForm] = useState({
    nombre: "",
    estado_id: "",
    insignias: "" // ahora es un solo ID
  });

  const [imagenActual, setImagenActual] = useState(null);
  const [imagenNueva, setImagenNueva] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchEstados();
    fetchBadges();
    fetchAvatar();
  }, []);

  const fetchEstados = async () => {
    try {
      const res = await axiosInstance.get("/catalogos/estados");
      setEstados(res.data);
    } catch {
      Swal.fire("Error", "No se pudieron cargar los estados", "error");
    }
  };

  const fetchBadges = async () => {
    try {
      const res = await axiosInstance.get("/badges/active");
      setBadges(res.data);
    } catch {
      Swal.fire("Error", "No se pudieron cargar las insignias", "error");
    }
  };

  const fetchAvatar = async () => {
    try {
      const res = await axiosInstance.get(`/avatars/getByUuid/${uuid}`);
      const data = res.data;

      // 🔥 Convertir insignias string JSON a objeto real
      let parsedInsignias = [];

      if (data.insignias) {
        if (typeof data.insignias === "string") {
          parsedInsignias = JSON.parse(data.insignias);
        } else {
          parsedInsignias = data.insignias;
        }
      }

      setForm({
        nombre: data.nombre,
        estado_id: data.estado || data.estado_id,
        insignias: parsedInsignias.length > 0 ? parsedInsignias[0].id : ""
      });

      setImagenActual(data.imagen);

    } catch (error) {
      Swal.fire("Error", "No se pudo cargar el avatar", "error");
      navigate("/admin/mantenimientos/avatares");
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nombre || !form.estado_id) {
      Swal.fire("Atención", "Nombre y estado son obligatorios", "warning");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      data.append("nombre", form.nombre);
      data.append("estado_id", form.estado_id);

      // 🔥 Backend aún espera array JSON
      if (form.insignias) {
        data.append("insignias", JSON.stringify([form.insignias]));
      } else {
        data.append("insignias", JSON.stringify([]));
      }

      if (imagenNueva) {
        data.append("imagen", imagenNueva);
      }

      await axiosInstance.post(`/avatars/update/${uuid}`, data, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      Swal.fire("Éxito", "Avatar actualizado correctamente", "success");
      navigate("/admin/mantenimientos/avatares");

    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.error || "Error al actualizar el avatar",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      <Typography variant="h4" mb={3}>
        Editar Avatar
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>

          {/* Nombre */}
          <Box sx={{ width: { xs: "100%", md: "48%" } }}>
            <TextField
              label="Nombre"
              name="nombre"
              fullWidth
              value={form.nombre}
              onChange={handleChange}
            />
          </Box>

          {/* Estado */}
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

          {/* UNA sola insignia */}
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

          {/* Imagen */}
          <Box sx={{ width: { xs: "100%", md: "48%" } }}>
            <Button variant="outlined" component="label" fullWidth>
              Cambiar imagen
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

            {!imagenNueva && imagenActual && (
              <Box mt={2}>
                <img
                  src={`${API_URL_IMG}${imagenActual}`}
                  alt="Actual"
                  width="200"
                />
              </Box>
            )}
          </Box>

          {/* Botones */}
          <Box sx={{ width: "100%", display: "flex", gap: 2, mt: 2 }}>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : "Actualizar"}
            </Button>

            <Button
              variant="outlined"
              onClick={() =>
                navigate("/admin/mantenimientos/avatares")
              }
            >
              Cancelar
            </Button>
          </Box>

        </Box>
      </Box>
    </Box>
  );
};

export default AvatarEdit;