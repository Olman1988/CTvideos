import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Switch,
  FormControlLabel
} from "@mui/material";
import Swal from "sweetalert2";
import axiosInstance from "@/api/axiosInstance";
import { useNavigate } from "react-router-dom";

const TestimonyCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    nombre: "",
    mensaje: "",
    activo: true
  });

  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSwitch = (e) => {
    setForm({ ...form, activo: e.target.checked });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImagen(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nombre || !form.mensaje) {
      Swal.fire(
        "Atención",
        "Nombre y mensaje son obligatorios",
        "warning"
      );
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      data.append("nombre", form.nombre);
      data.append("mensaje", form.mensaje);
      data.append("activo", form.activo ? 1 : 0);

      if (imagen) {
        data.append("imagen", imagen);
      }

      await axiosInstance.post("/testimonies/create", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      Swal.fire(
        "Éxito",
        "Testimonio creado correctamente",
        "success"
      );

      navigate("/admin/mantenimientos/testimonios");

    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.error || "Error al crear el testimonio",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", p: 3 }}>
      <Typography variant="h4" mb={3}>
        Crear Testimonio
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>

          {/* Nombre */}
          <TextField
            label="Nombre"
            name="nombre"
            fullWidth
            value={form.nombre}
            onChange={handleChange}
          />

          {/* Mensaje */}
          <TextField
            label="Mensaje"
            name="mensaje"
            multiline
            rows={4}
            fullWidth
            value={form.mensaje}
            onChange={handleChange}
          />

          {/* Estado */}
          <FormControlLabel
            control={
              <Switch
                checked={form.activo}
                onChange={handleSwitch}
              />
            }
            label={form.activo ? "Activo" : "Inactivo"}
          />

          {/* Imagen */}
          <Box>
            <Button variant="outlined" component="label" fullWidth>
              Seleccionar imagen
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>

            {imagen && (
              <Typography variant="caption" display="block" mt={1}>
                {imagen.name}
              </Typography>
            )}

            {/* Vista previa */}
            {preview && (
              <Box sx={{ mt: 2, textAlign: "center" }}>
                <Typography variant="subtitle2" mb={1}>
                  Vista previa
                </Typography>
                <Box
                  component="img"
                  src={preview}
                  alt="Vista previa"
                  sx={{
                    maxWidth: "100%",
                    maxHeight: 250,
                    borderRadius: 2,
                    border: "1px solid #ddd",
                    objectFit: "contain"
                  }}
                />
              </Box>
            )}
          </Box>

          {/* Botones */}
          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Guardar"}
            </Button>

            <Button
              variant="outlined"
              onClick={() =>
                navigate("/admin/mantenimientos/testimonios")
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

export default TestimonyCreate;
