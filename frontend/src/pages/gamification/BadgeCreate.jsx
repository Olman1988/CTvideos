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
import { useNavigate } from "react-router-dom";

const BadgeCreate = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [actions, setActions] = useState([]);
  const [hasCampaign, setHasCampaign] = useState(false);
  const [imagen, setImagen] = useState(null);

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    activo: 1,
    multiplicador: "",
    rango_inicio: "",
    rango_fin: "",
    campana_id: "",
    accion_id:""
  });

  /* ===================== LOAD DATA ===================== */
  useEffect(() => {
    fetchCampaigns();
  }, []);
   useEffect(() => {
    fetchActions();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const res = await axiosInstance.get("/campaigns/active");
      setCampaigns(res.data);
    } catch {
      Swal.fire("Error", "No se pudieron cargar las campañas", "error");
    }
  };
  const fetchActions = async () => {
    try {
      const res = await axiosInstance.get("/actions/active");
      setActions(res.data);
    } catch {
      Swal.fire("Error", "No se pudieron cargar las campañas", "error");
    }
  };

  /* ===================== HANDLERS ===================== */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCampaignToggle = (checked) => {
    setHasCampaign(checked);

    if (checked) {
      // Limpia campos que no aplican si hay campaña
      setForm(prev => ({
        ...prev,
        multiplicador: "",
        rango_inicio: "",
        rango_fin: "",
        accion_id:""
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
        Swal.fire(
          "Atención",
          "Multiplicador y rangos son obligatorios si no hay campaña",
          "warning"
        );
        return;
      }

      if (Number(form.rango_fin) < Number(form.rango_inicio)) {
        Swal.fire(
          "Atención",
          "El rango fin no puede ser menor al inicio",
          "warning"
        );
        return;
      }
    }

    if (hasCampaign && !form.campana_id) {
      Swal.fire("Atención", "Debe seleccionar una campaña", "warning");
      return;
    }

    if (!imagen) {
      Swal.fire("Atención", "La imagen es obligatoria", "warning");
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
      formData.append("imagen", imagen);

      await axiosInstance.post("/badges/create", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      Swal.fire("Éxito", "Insignia creada correctamente", "success");
      navigate("/admin/insignias");
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.error || "Error al crear insignia",
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
        Crear insignia
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>

          {/* Nombre */}
          <Box sx={{ width: { xs: "100%", md: "48%" } }}>
            <TextField
              label="Nombre"
              name="nombre"
              fullWidth
              required
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
          {/* CAMPAÑA */}
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
                  {campaigns.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.nombre}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
            </Box>
          )}

          {/* Multiplicador */}
          {!hasCampaign && (
            <Box sx={{ width: { xs: "100%", md: "48%" } }}>
              <TextField
                label="Multiplicador"
                name="multiplicador"
                type="number"
                fullWidth
                required
                value={form.multiplicador}
                onChange={handleChange}
              />
            </Box>
          )}

          {/* Rangos */}
          {!hasCampaign && (
            <>
              <Box sx={{ width: { xs: "100%", md: "48%" } }}>
                <TextField
                  label="Rango inicio"
                  name="rango_inicio"
                  type="number"
                  fullWidth
                  required
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
                  required
                  value={form.rango_fin}
                  onChange={handleChange}
                />
              </Box>
            </>
          )}
          {!hasCampaign && (
          <Box sx={{ width: { xs: "100%", md: "48%" } }}>
              <FormControl fullWidth>
                <InputLabel>Tipos de Acción</InputLabel>
                <MuiSelect
                  name="accion_id"
                  value={form.accion_id}
                  onChange={handleChange}
                >
                  {actions.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.nombre}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
            </Box>
          )}

          {/* Descripción */}
          <Box sx={{ width: "100%" }}>
            <TextField
              label="Descripción"
              name="descripcion"
              fullWidth
              multiline
              rows={3}
              value={form.descripcion}
              onChange={handleChange}
            />
          </Box>

          

          {/* Imagen */}
          <Box sx={{ width: { xs: "100%", md: "48%" } }}>
            <Button variant="outlined" component="label" fullWidth>
                Subir imagen
                <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                    setImagen(e.target.files[0]);
                    }
                }}
                />
            </Button>

            {imagen && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                Archivo seleccionado: <strong>{imagen.name}</strong>
                </Typography>
            )}
            </Box>

          

          {/* BOTONES */}
          <Box sx={{ width: "100%", mt: 2, display: "flex", gap: 2 }}>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : "Guardar"}
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

export default BadgeCreate;
