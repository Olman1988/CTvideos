import { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
  Switch,
  FormControlLabel
} from "@mui/material";
import Swal from "sweetalert2";
import axiosInstance from "@/api/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL_IMG } from "@/config/config";

const BadgeEdit = () => {
  const navigate = useNavigate();
  const { uuid } = useParams();

  const [loading, setLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [actions, setActions] = useState([]);
  const [hasCampaign, setHasCampaign] = useState(false);

  // 🔹 IMÁGENES
  const [imagenActual, setImagenActual] = useState(null); // string (backend)
  const [imagenNueva, setImagenNueva] = useState(null);   // File

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    activo: 1,
    multiplicador: "",
    rango_inicio: "",
    rango_fin: "",
    campana_id: "",
    accion_id: ""
  });

  /* ===================== LOAD DATA ===================== */
  useEffect(() => {
    fetchBadge();
    fetchCampaigns();
    fetchActions();
  }, []);

  const fetchBadge = async () => {
    try {
      const res = await axiosInstance.get(`/badges/getByUuid/${uuid}`);
      const b = res.data;

      setForm({
        nombre: b.nombre,
        descripcion: b.descripcion ?? "",
        activo: b.activo,
        multiplicador: b.multiplicador ?? "",
        rango_inicio: b.rango_inicio ?? "",
        rango_fin: b.rango_fin ?? "",
        campana_id: b.campana_id ?? "",
        accion_id: b.accion_id ?? ""
      });

      setHasCampaign(!!b.campana_id);
      setImagenActual(b.imagen); // 👈 ruta de imagen existente
    } catch {
      Swal.fire("Error", "No se pudo cargar la insignia", "error");
      navigate("/admin/insignias");
    }
  };

  const fetchCampaigns = async () => {
    const res = await axiosInstance.get("/campaigns/active");
    setCampaigns(res.data);
  };

  const fetchActions = async () => {
    const res = await axiosInstance.get("/actions/active");
    setActions(res.data);
  };

  /* ===================== HANDLERS ===================== */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCampaignToggle = (checked) => {
    setHasCampaign(checked);

    if (checked) {
      setForm(prev => ({
        ...prev,
        multiplicador: "",
        rango_inicio: "",
        rango_fin: "",
        accion_id: ""
      }));
    } else {
      setForm(prev => ({
        ...prev,
        campana_id: ""
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nombre) {
      Swal.fire("Atención", "El nombre es obligatorio", "warning");
      return;
    }

    if (!hasCampaign) {
      if (!form.multiplicador || !form.rango_inicio || !form.rango_fin) {
        Swal.fire("Atención", "Multiplicador y rangos son obligatorios", "warning");
        return;
      }

      if (Number(form.rango_fin) < Number(form.rango_inicio)) {
        Swal.fire("Atención", "El rango fin no puede ser menor", "warning");
        return;
      }
    }

    if (hasCampaign && !form.campana_id) {
      Swal.fire("Atención", "Seleccione una campaña", "warning");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("nombre", form.nombre);
      formData.append("descripcion", form.descripcion);
      formData.append("activo", form.activo);
      formData.append("campana_id", hasCampaign ? form.campana_id : null);
      formData.append("multiplicador", hasCampaign ? null : form.multiplicador);
      formData.append("rango_inicio", hasCampaign ? null : form.rango_inicio);
      formData.append("rango_fin", hasCampaign ? null : form.rango_fin);
      formData.append("accion_id", hasCampaign ? null : form.accion_id);

      // 👇 solo si cambió la imagen
      if (imagenNueva) {
        formData.append("imagen", imagenNueva);
      }

      await axiosInstance.post(`/badges/update/${uuid}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      Swal.fire("Éxito", "Insignia actualizada correctamente", "success");
      navigate("/admin/insignias");
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.error || "Error al actualizar insignia",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ===================== RENDER ===================== */
  return (
    <Box sx={{ maxWidth: 1200, mx: "auto" }}>
      <Typography variant="h4" mb={3}>
        Editar insignia
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
              <MuiSelect
                name="activo"
                value={form.activo}
                onChange={handleChange}
              >
                <MenuItem value={1}>Activa</MenuItem>
                <MenuItem value={0}>Inactiva</MenuItem>
              </MuiSelect>
            </FormControl>
          </Box>

          {/* Campaña */}
          <Box sx={{ width: "100%" }}>
            <FormControlLabel
              control={
                <Switch
                  checked={hasCampaign}
                  onChange={(e) => handleCampaignToggle(e.target.checked)}
                />
              }
              label="Asociar a campaña"
            />
          </Box>

          {hasCampaign && (
            <Box sx={{ width: { xs: "100%", md: "48%" } }}>
              <FormControl fullWidth>
                <InputLabel>Campaña</InputLabel>
                <MuiSelect
                  name="campana_id"
                  value={form.campana_id}
                  onChange={handleChange}
                >
                  {campaigns.map(c => (
                    <MenuItem key={c.id} value={c.id}>{c.nombre}</MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
            </Box>
          )}

          {!hasCampaign && (
            <>
              <Box sx={{ width: { xs: "100%", md: "48%" } }}>
                <TextField
                  label="Multiplicador"
                  name="multiplicador"
                  type="number"
                  fullWidth
                  value={form.multiplicador}
                  onChange={handleChange}
                />
              </Box>

              <Box sx={{ width: { xs: "100%", md: "48%" } }}>
                <TextField
                  label="Rango inicio"
                  name="rango_inicio"
                  type="number"
                  fullWidth
                  value={form.rango_inicio}
                  onChange={handleChange}
                />
              </Box>

              <Box sx={{ width: { xs: "100%", md: "48%" } }}>
                <TextField
                  label="Rango fin"
                  name="rango_fin"
                  type="number"
                  fullWidth
                  value={form.rango_fin}
                  onChange={handleChange}
                />
              </Box>

              <Box sx={{ width: { xs: "100%", md: "48%" } }}>
                <FormControl fullWidth>
                  <InputLabel>Tipo de acción</InputLabel>
                  <MuiSelect
                    name="accion_id"
                    value={form.accion_id}
                    onChange={handleChange}
                  >
                    {actions.map(a => (
                      <MenuItem key={a.id} value={a.id}>{a.nombre}</MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>
              </Box>
            </>
          )}

          {/* Imagen actual */}
          {imagenActual && (
            <Box sx={{ width: { xs: "100%", md: "48%" } }}>
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

          {/* Cambiar imagen */}
          <Box sx={{ width: { xs: "100%", md: "48%" } }}>
            <Button variant="outlined" component="label" fullWidth>
              Cambiar imagen
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setImagenNueva(e.target.files[0]);
                  }
                }}
              />
            </Button>

            {imagenNueva && (
              <Typography variant="body2" mt={1}>
                Nueva imagen: <strong>{imagenNueva.name}</strong>
              </Typography>
            )}
          </Box>

          {/* Botones */}
          <Box sx={{ width: "100%", mt: 2, display: "flex", gap: 2 }}>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : "Guardar cambios"}
            </Button>

            <Button
              variant="outlined"
              onClick={() => navigate("/admin/insignias")}
            >
              Cancelar
            </Button>
          </Box>

        </Box>
      </Box>
    </Box>
  );
};

export default BadgeEdit;
