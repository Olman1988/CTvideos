import { useEffect, useState } from "react";
import {
  Box, TextField, Button, Typography, CircularProgress,
  FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import Swal from "sweetalert2";
import axiosInstance from "@/api/axiosInstance";
import { useNavigate } from "react-router-dom";

const CenterCreate = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [provincias, setProvincias] = useState([]);
  const [cantones, setCantones] = useState([]);
  const [distritos, setDistritos] = useState([]);

  const [form, setForm] = useState({
    nombre: "",
    provincia_id: "",
    canton_id: "",
    distrito_id: "",
    direccion: "",
    estado: 1,
    codsaber: "",
    codpres: "",
    tipo_institucion: "",
    telefono: "",
    correo: "",
    regional: "",
    circuito: ""
  });

  // 🔹 Listas exactas que me pasaste
  const regionales = [
    "DIRECCIÓN REGIONAL SAN CARLOS",
    "DIRECCIÓN REGIONAL ZONA NORTE NORTE",
    "DIRECCIÓN REGIONAL CARTAGO",
    "DIRECCIÓN REGIONAL HEREDIA",
    "DIRECCIÓN REGIONAL SAN JOSÉ NORTE",
    "DIRECCIÓN REGIONAL SAN JOSÉ CENTRAL",
    "DIRECCIÓN REGIONAL SAN JOSÉ OESTE",
    "DIRECCIÓN REGIONAL PÉREZ ZELEDÓN",
    "DIRECCIÓN REGIONAL OCCIDENTE",
    "DIRECCIÓN REGIONAL SARAPIQUÍ",
    "DIRECCIÓN REGIONAL NICOYA",
    "DIRECCIÓN REGIONAL DESAMPARADOS",
    "DIRECCIÓN REGIONAL ALAJUELA",
    "DIRECCIÓN REGIONAL LIBERIA",
    "DIRECCIÓN REGIONAL PUNTARENAS",
    "DIRECCIÓN REGIONAL COTO",
    "DIRECCIÓN REGIONAL LIMÓN",
    "DIRECCIÓN REGIONAL LOS SANTOS",
    "DIRECCIÓN REGIONAL PURISCAL",
    "DIRECCIÓN REGIONAL GRANDE DE TÉRRABA",
    "DIRECCIÓN REGIONAL TURRIALBA",
    "DIRECCIÓN REGIONAL SANTA CRUZ",
    "DIRECCIÓN REGIONAL CAÑAS",
    "DIRECCIÓN REGIONAL PENINSULAR",
    "DIRECCIÓN REGIONAL SULA",
    "DIRECCIÓN REGIONAL GUÁPILES",
    "DIRECCIÓN REGIONAL AGUIRRE"
  ];

  const circuitos = [
    "CIRCUITO 01","CIRCUITO 02","CIRCUITO 03","CIRCUITO 04","CIRCUITO 05",
    "CIRCUITO 06","CIRCUITO 07","CIRCUITO 08","CIRCUITO 09","CIRCUITO 10",
    "CIRCUITO 11","CIRCUITO 12","CIRCUITO 13","CIRCUITO 14"
  ];

  useEffect(() => {
    fetchProvincias();
  }, []);

  const fetchProvincias = async () => {
    const res = await axiosInstance.get("/provincias/all");
    setProvincias(res.data);
  };

  const fetchCantones = async (provincia_id) => {
    const res = await axiosInstance.get(`/cantones/byProvincia/${provincia_id}`);
    setCantones(res.data);
  };

  const fetchDistritos = async (canton_id) => {
    const res = await axiosInstance.get(`/distritos/byCanton/${canton_id}`);
    setDistritos(res.data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "provincia_id") {
      setForm({ ...form, provincia_id: value, canton_id: "", distrito_id: "" });
      fetchCantones(value);
      setDistritos([]);
    }

    if (name === "canton_id") {
      setForm({ ...form, canton_id: value, distrito_id: "" });
      fetchDistritos(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nombre || !form.provincia_id || !form.canton_id || !form.distrito_id || !form.tipo_institucion || !form.regional || !form.circuito) {
      Swal.fire("Atención", "Todos los campos obligatorios deben ser completados", "warning");
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.post("/centers/create", form);
      Swal.fire("Éxito", "Centro creado correctamente", "success");
      navigate("/admin/mantenimientos/centros-educativos");
    } catch {
      Swal.fire("Error", "No se pudo crear el centro", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      <Typography variant="h4" mb={3}>Nuevo Centro Educativo</Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>

          {/* Nombre */}
          <Box sx={{ width: { xs: "100%", md: "48%" } }}>
            <TextField label="Nombre" name="nombre" fullWidth value={form.nombre} onChange={handleChange} />
          </Box>

          {/* Provincia */}
          <Box sx={{ width: { xs: "100%", md: "48%" } }}>
            <FormControl fullWidth>
              <InputLabel>Provincia</InputLabel>
              <Select name="provincia_id" value={form.provincia_id} onChange={handleChange}>
                {provincias.map(p => <MenuItem key={p.id} value={p.id}>{p.nombre}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>

          {/* Cantón */}
          <Box sx={{ width: { xs: "100%", md: "48%" } }}>
            <FormControl fullWidth>
              <InputLabel>Cantón</InputLabel>
              <Select name="canton_id" value={form.canton_id} onChange={handleChange}>
                {cantones.map(c => <MenuItem key={c.id} value={c.id}>{c.nombre}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>

          {/* Distrito */}
          <Box sx={{ width: { xs: "100%", md: "48%" } }}>
            <FormControl fullWidth>
              <InputLabel>Distrito</InputLabel>
              <Select name="distrito_id" value={form.distrito_id} onChange={handleChange}>
                {distritos.map(d => <MenuItem key={d.id} value={d.id}>{d.nombre}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>

          {/* Dirección */}
          <Box sx={{ width: { xs: "100%", md: "48%" } }}>
            <TextField label="Dirección" name="direccion" fullWidth value={form.direccion} onChange={handleChange} />
          </Box>

          {/* Teléfono */}
          <Box sx={{ width: { xs: "100%", md: "48%" } }}>
            <TextField label="Teléfono" name="telefono" fullWidth value={form.telefono} onChange={handleChange} />
          </Box>

          {/* Correo */}
          <Box sx={{ width: { xs: "100%", md: "48%" } }}>
            <TextField label="Correo" name="correo" fullWidth value={form.correo} onChange={handleChange} />
          </Box>

          {/* Código SABER */}
          <Box sx={{ width: { xs: "100%", md: "48%" } }}>
            <TextField label="Código SABER" name="codsaber" fullWidth value={form.codsaber} onChange={handleChange} />
          </Box>

          {/* Código PRES */}
          <Box sx={{ width: { xs: "100%", md: "48%" } }}>
            <TextField label="Código PRES" name="codpres" fullWidth value={form.codpres} onChange={handleChange} />
          </Box>

          {/* Tipo Institución */}
          <Box sx={{ width: { xs: "100%", md: "48%" } }}>
            <FormControl fullWidth>
              <InputLabel>Tipo Institución</InputLabel>
              <Select name="tipo_institucion" value={form.tipo_institucion} onChange={handleChange}>
                <MenuItem value="1">Pública</MenuItem>
                <MenuItem value="2">Privada</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Regional */}
          <Box sx={{ width: { xs: "100%", md: "48%" } }}>
            <FormControl fullWidth>
              <InputLabel>Regional</InputLabel>
              <Select name="regional" value={form.regional} onChange={handleChange}>
                {regionales.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>

          {/* Circuito */}
          <Box sx={{ width: { xs: "100%", md: "48%" } }}>
            <FormControl fullWidth>
              <InputLabel>Circuito</InputLabel>
              <Select name="circuito" value={form.circuito} onChange={handleChange}>
                {circuitos.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>

          {/* Botones */}
          <Box sx={{ width: "100%", display: "flex", gap: 2, mt: 2 }}>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : "Crear"}
            </Button>
            <Button variant="outlined" onClick={() => navigate("/admin/centros_educativos")}>Cancelar</Button>
          </Box>

        </Box>
      </Box>
    </Box>
  );
};

export default CenterCreate;