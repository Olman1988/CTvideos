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
  IconButton,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";
import axiosInstance from "@/api/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL_IMG } from "@/config/config"; 

const CampaignEdit = () => {
  const { uuid } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [statuses, setStatuses] = useState([]);
  const [actions, setActions] = useState([]);

  const [imagen, setImagen] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    fecha_inicio: "",
    fecha_fin: "",
    estado_id: ""
  });

  const [actionForm, setActionForm] = useState({
    accion_id: "",
    accion_nombre: "",
    multiplicador: "",
    puntaje: ""
  });

  const [acciones, setAcciones] = useState([]);

  /* ===================== LOAD DATA ===================== */
  useEffect(() => {
    fetchStatuses();
    fetchActions();
    fetchCampaign();
  }, []);

  const fetchStatuses = async () => {
    const res = await axiosInstance.get("/campaigns-status/all");
    setStatuses(res.data);
  };

  const fetchActions = async () => {
    const res = await axiosInstance.get("/actions/active");
    setActions(res.data);
  };

  const fetchCampaign = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/campaigns/getByUuid/${uuid}`);
      const c = res.data;

      setForm({
        nombre: c.nombre,
        descripcion: c.descripcion || "",
        fecha_inicio: fromBackendDate(c.fecha_inicio),
        fecha_fin: fromBackendDate(c.fecha_fin),
        estado_id: c.estado_id
      });

      setAcciones(c.acciones || []);

      if (c.imagen) {
        setImagePreview(`${API_URL_IMG}/${c.imagen}`);
      }
    } catch {
      Swal.fire("Error", "No se pudo cargar la campaña", "error");
      navigate("/admin/campanas");
    } finally {
      setLoading(false);
    }
  };

  /* ===================== HELPERS ===================== */
  const toBackendDate = (value) =>
    value ? value.replace("T", " ") + ":00" : null;

  const fromBackendDate = (value) =>
    value ? value.replace(" ", "T").slice(0, 16) : "";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleActionChange = (e) => {
    setActionForm({ ...actionForm, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImagen(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const addAction = () => {
    const { accion_id, accion_nombre, multiplicador, puntaje } = actionForm;

    if (!accion_id || !multiplicador || !puntaje) {
      Swal.fire("Atención", "Complete todos los campos", "warning");
      return;
    }

    if (acciones.some((a) => a.accion_id === accion_id)) {
      Swal.fire("Atención", "Esta acción ya fue agregada", "warning");
      return;
    }

    setAcciones([
      ...acciones,
      { accion_id, accion_nombre, multiplicador, puntaje }
    ]);

    setActionForm({
      accion_id: "",
      accion_nombre: "",
      multiplicador: "",
      puntaje: ""
    });
  };

  const removeAction = (accion_id) => {
    setAcciones(acciones.filter((a) => a.accion_id !== accion_id));
  };

  /* ===================== UPDATE ===================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nombre || !form.fecha_inicio || !form.fecha_fin || !form.estado_id) {
      Swal.fire("Atención", "Complete los campos obligatorios", "warning");
      return;
    }

    if (new Date(form.fecha_fin) <= new Date(form.fecha_inicio)) {
      Swal.fire("Atención", "Fecha fin inválida", "warning");
      return;
    }

    if (acciones.length === 0) {
      Swal.fire("Atención", "Debe agregar al menos una acción", "warning");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("nombre", form.nombre);
      formData.append("descripcion", form.descripcion);
      formData.append("fecha_inicio", toBackendDate(form.fecha_inicio));
      formData.append("fecha_fin", toBackendDate(form.fecha_fin));
      formData.append("estado_id", form.estado_id);
      formData.append("acciones", JSON.stringify(acciones));

      if (imagen) formData.append("imagen", imagen);

      await axiosInstance.post(`/campaigns/update/${uuid}`, formData);

      Swal.fire("Éxito", "Campaña actualizada correctamente", "success");
      navigate("/admin/campanas");
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.error || "Error al actualizar campaña",
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
        Editar campaña
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>

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

          <Box sx={{ width: { xs: "100%", md: "48%" } }}>
            <TextField
              label="Fecha inicio"
              name="fecha_inicio"
              type="datetime-local"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={form.fecha_inicio}
              onChange={handleChange}
            />
          </Box>

          <Box sx={{ width: { xs: "100%", md: "48%" } }}>
            <TextField
              label="Fecha fin"
              name="fecha_fin"
              type="datetime-local"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={form.fecha_fin}
              onChange={handleChange}
            />
          </Box>

          <Box sx={{ width: { xs: "100%", md: "48%" } }}>
            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <MuiSelect
                name="estado_id"
                value={form.estado_id}
                onChange={handleChange}
              >
                {statuses.map((s) => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.nombre}
                  </MenuItem>
                ))}
              </MuiSelect>
            </FormControl>
          </Box>

          <Box sx={{ width: "100%" }}>
            <TextField
              label="Descripción"
              name="descripcion"
              multiline
              rows={3}
              fullWidth
              value={form.descripcion}
              onChange={handleChange}
            />
          </Box>

          {/* IMAGEN */}
          <Box sx={{ width: "100%" }}>
            <Typography variant="subtitle1" mb={1}>
              Imagen de la campaña
            </Typography>

            <Button variant="outlined" component="label">
              Cambiar imagen
              <input hidden type="file" accept="image/*" onChange={handleImageChange} />
            </Button>

            {imagePreview && (
              <Box mt={2}>
                <Box
                  component="img"
                  src={imagePreview}
                  sx={{ maxWidth: 250, borderRadius: 2, border: "1px solid #ddd" }}
                />
              </Box>
            )}
          </Box>

          <Divider sx={{ width: "100%", my: 2 }} />

          {/* ACCIONES */}
          <Box sx={{ width: "100%" }}>
            <Typography variant="h6">Acciones</Typography>
          </Box>

          <Box sx={{ width: { xs: "100%", md: "48%" } }}>
            <FormControl fullWidth>
              <InputLabel>Acción</InputLabel>
              <MuiSelect
                value={actionForm.accion_id}
                onChange={(e) => {
                  const accionId = e.target.value;
                  const accion = actions.find((a) => a.id === accionId);
                  setActionForm({
                    ...actionForm,
                    accion_id: accionId,
                    accion_nombre: accion?.nombre || ""
                  });
                }}
              >
                {actions.map((a) => (
                  <MenuItem key={a.id} value={a.id}>
                    {a.nombre}
                  </MenuItem>
                ))}
              </MuiSelect>
            </FormControl>
          </Box>

          <Box sx={{ width: { xs: "100%", md: "48%" } }}>
            <TextField
              label="Multiplicador"
              name="multiplicador"
              type="number"
              fullWidth
              value={actionForm.multiplicador}
              onChange={handleActionChange}
            />
          </Box>

          <Box sx={{ width: { xs: "100%", md: "48%" } }}>
            <TextField
              label="Puntaje"
              name="puntaje"
              type="number"
              fullWidth
              value={actionForm.puntaje}
              onChange={handleActionChange}
            />
          </Box>

          <Button variant="outlined" onClick={addAction}>
            Agregar acción
          </Button>

          {acciones.length > 0 && (
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Acción</TableCell>
                    <TableCell>Multiplicador</TableCell>
                    <TableCell>Puntaje</TableCell>
                    <TableCell align="center">Eliminar</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {acciones.map((a) => (
                    <TableRow key={a.accion_id}>
                      <TableCell>{a.accion_nombre}</TableCell>
                      <TableCell>{a.multiplicador}</TableCell>
                      <TableCell>{a.puntaje}</TableCell>
                      <TableCell align="center">
                        <IconButton color="error" onClick={() => removeAction(a.accion_id)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <Box sx={{ width: "100%", mt: 3, display: "flex", gap: 2 }}>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : "Actualizar"}
            </Button>

            <Button variant="outlined" onClick={() => navigate("/admin/campanas")}>
              Cancelar
            </Button>
          </Box>

        </Box>
      </Box>
    </Box>
  );
};

export default CampaignEdit;
