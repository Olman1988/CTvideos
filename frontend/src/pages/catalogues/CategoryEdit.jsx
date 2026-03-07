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
import { useNavigate, useParams } from "react-router-dom";
import { API_URL_IMG } from "@/config/config"; 

const CategoryEdit = () => {
  const navigate = useNavigate();
  const { uuid } = useParams(); // Obtenemos el UUID de la URL
  const [loading, setLoading] = useState(false);
  const [estados, setEstados] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    estado_id: ""
  });
  const [imagen, setImagen] = useState(null);
  const [imagenActual, setImagenActual] = useState(null);

  useEffect(() => {
    fetchEstados();
    fetchCategory();
  }, []);

  const fetchEstados = async () => {
    try {
      const res = await axiosInstance.get("/catalogos/estados");
      setEstados(res.data);
    } catch (error) {
      Swal.fire("Error", "No se pudieron cargar los estados", "error");
    }
  };

  const fetchCategory = async () => {
    try {
      const res = await axiosInstance.get(`/categories/getCategory/${uuid}`);
      const data = res.data;
      setForm({
        nombre: data.nombre,
        descripcion: data.descripcion,
        estado_id: data.estado_id
      });
      setImagenActual(data.imagen || null);
    } catch (error) {
      Swal.fire("Error", "No se pudo cargar la categoría", "error");
    }
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

    try {
      setLoading(true);

      const data = new FormData();
      Object.entries(form).forEach(([key, value]) =>
        data.append(key, value)
      );

      // Solo enviar nueva imagen si se selecciona
      if (imagen) {
        data.append("imagen", imagen);
      }

      await axiosInstance.post(`/categories/update/${uuid}`, data, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      Swal.fire("Éxito", "Categoría actualizada correctamente", "success");
      navigate("/admin/mantenimientos/categorias");

    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.error || "Error al actualizar la categoría",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      <Typography variant="h4" mb={3}>Editar Categoría</Typography>

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
            <TextField
              label="Descripción"
              name="descripcion"
              fullWidth
              value={form.descripcion}
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

          {/* Imagen */}
          <Box sx={{ width: { xs: "100%", md: "48%" } }}>
            <Button variant="outlined" component="label" fullWidth>
              Seleccionar nueva imagen
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => setImagen(e.target.files[0])}
              />
            </Button>

            {/* Imagen actual */}
                      {imagenActual && (
                        <Box sx={{ width: "100%" }}>
                          <Typography variant="subtitle2">Imagen actual</Typography>
                          <Box
                            component="img"
                            src={`${API_URL_IMG}${imagenActual}`}
                            alt="Imagen actual"
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

            {/* Mostrar nueva imagen si se selecciona */}
            {imagen && (
              <Typography variant="caption" display="block">Nueva imagen: {imagen.name}</Typography>
            )}
          </Box>

          {/* Botones */}
          <Box sx={{ width: "100%", display: "flex", gap: 2, mt: 2 }}>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : "Guardar"}
            </Button>
            <Button variant="outlined" onClick={() => navigate("/mantenimientos/categorias")}>
              Cancelar
            </Button>
          </Box>

        </Box>
      </Box>
    </Box>
  );
};

export default CategoryEdit;
