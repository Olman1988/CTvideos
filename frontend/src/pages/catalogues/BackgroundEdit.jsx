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

const BackgroundEdit = () => {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [estados, setEstados] = useState([]);
  const [badges, setBadges] = useState([]);

  const [form, setForm] = useState({
    nombre: "",
    estado_id: "",
    insignias: ""
  });

  const [imagenActual, setImagenActual] = useState(null);
  const [imagenNueva, setImagenNueva] = useState(null);

  useEffect(() => {
    fetchEstados();
    fetchBadges();
    fetchBackground();
  }, []);

  const fetchEstados = async () => {
    const res = await axiosInstance.get("/catalogos/estados");
    setEstados(res.data);
  };

  const fetchBadges = async () => {
    const res = await axiosInstance.get("/badges/active");
    setBadges(res.data);
  };

  const fetchBackground = async () => {
    try {
      const res = await axiosInstance.get(`/backgrounds/getByUuid/${uuid}`);
      const data = res.data;

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
        estado_id: data.estado,
        insignias: parsedInsignias.length > 0 ? parsedInsignias[0].id : ""
      });

      setImagenActual(data.imagen);

    } catch {
      Swal.fire("Error", "No se pudo cargar el marco", "error");
      navigate("/admin/mantenimientos/marcos");
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

      if (imagenNueva) {
        data.append("imagen", imagenNueva);
      }

      await axiosInstance.post(`/backgrounds/update/${uuid}`, data, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      Swal.fire("Éxito", "Marco actualizado correctamente", "success");
      navigate("/admin/mantenimientos/marcos");

    } catch {
      Swal.fire("Error", "No se pudo actualizar el marco", "error");
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
      <Typography variant="h4" mb={3}>Editar Background</Typography>

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

  {/* 🔥 Imagen nueva */}
  {imagenNueva && (
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
        src={URL.createObjectURL(imagenNueva)}
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
            setImagenNueva(null);

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

  {/* 🔥 Imagen actual (solo si no hay nueva) */}
  {!imagenNueva && imagenActual && (
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
        src={`${API_URL_IMG}${imagenActual}`}
        alt="Actual"
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
            setImagenActual(null);
          }}
        >
          Quitar
        </Button>
      </Box>
    </Box>
  )}
</Box>

          <Box sx={{ width: "100%", display: "flex", gap: 2, mt: 2 }}>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : "Actualizar"}
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

export default BackgroundEdit;