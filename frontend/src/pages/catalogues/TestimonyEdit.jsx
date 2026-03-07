import { useEffect, useState } from "react";
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
import { useNavigate, useParams } from "react-router-dom";
import { API_URL_IMG } from "@/config/config";

const TestimonyEdit = () => {
  const navigate = useNavigate();
  const { uuid } = useParams();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    nombre: "",
    mensaje: "",
    activo: true
  });

  const [imagen, setImagen] = useState(null);
  const [imagenActual, setImagenActual] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    fetchTestimony();
  }, []);

  const fetchTestimony = async () => {
    try {
      const res = await axiosInstance.get(`/testimonies/getTestimony/${uuid}`);
      const data = res.data;

      setForm({
        nombre: data.nombre,
        mensaje: data.mensaje,
        activo: data.activo === "1" || data.activo === 1
      });

      setImagenActual(data.imagen || null);

    } catch (error) {
      Swal.fire("Error", "No se pudo cargar el testimonio", "error");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSwitch = (e) => {
    setForm({ ...form, activo: e.target.checked });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImagen(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nombre || !form.mensaje) {
      Swal.fire("Atención", "Nombre y mensaje son obligatorios", "warning");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      data.append("nombre", form.nombre);
      data.append("mensaje", form.mensaje);
      data.append("activo", form.activo ? 1 : 0); // 👈 enviamos como 1 o 0

      if (imagen) {
        data.append("imagen", imagen);
      }

      await axiosInstance.post(`/testimonies/update/${uuid}`, data, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      Swal.fire("Éxito", "Testimonio actualizado correctamente", "success");
      navigate("/admin/mantenimientos/testimonios");

    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.error || "Error al actualizar el testimonio",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      <Typography variant="h4" mb={3}>
        Editar Testimonio
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>

          <Box sx={{ width: { xs: "100%", md: "100%" } }}>
            <TextField
              label="Nombre"
              name="nombre"
              fullWidth
              value={form.nombre}
              onChange={handleChange}
            />
          </Box>

          <Box sx={{ width: "100%" }}>
            <TextField
              label="Mensaje"
              name="mensaje"
              multiline
              rows={4}
              fullWidth
              value={form.mensaje}
              onChange={handleChange}
            />
          </Box>

          {/* Switch Activo/Inactivo */}
          <Box sx={{ width: { xs: "100%", md: "48%" } }}>
            <FormControlLabel
              control={
                <Switch
                  checked={form.activo}
                  onChange={handleSwitch}
                />
              }
              label={form.activo ? "Activo" : "Inactivo"}
            />
          </Box>

          {/* Imagen */}
          <Box sx={{ width: { xs: "100%", md: "48%" } }}>
            <Button variant="outlined" component="label" fullWidth>
              Seleccionar nueva imagen
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>

            {(preview || imagenActual) && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2">
                  {preview ? "Nueva imagen" : "Imagen actual"}
                </Typography>
                <Box
                  component="img"
                  src={
                    preview
                      ? preview
                      : `${API_URL_IMG}${imagenActual}`
                  }
                  alt="Imagen testimonio"
                  sx={{
                    width: "100%",
                    maxHeight: 250,
                    objectFit: "contain",
                    border: "1px solid #ddd",
                    borderRadius: 1,
                    mt: 1
                  }}
                />
              </Box>
            )}
          </Box>

          {/* Botones */}
          <Box sx={{ width: "100%", display: "flex", gap: 2, mt: 2 }}>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : "Guardar"}
            </Button>

            <Button
              variant="outlined"
              onClick={() => navigate("/admin/mantenimientos/testimonios")}
            >
              Cancelar
            </Button>
          </Box>

        </Box>
      </Box>
    </Box>
  );
};

export default TestimonyEdit;
