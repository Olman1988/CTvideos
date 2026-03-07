import { useEffect, useState } from "react";
import {
  Box, TextField, Button, Typography, CircularProgress,
  FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import Swal from "sweetalert2";
import axiosInstance from "@/api/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";

const CenterEdit = () => {
  const navigate = useNavigate();
  const { uuid } = useParams(); // ID del centro a editar

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

  // 🔹 Cargar datos del centro y provincias al montar
  useEffect(() => {
    const fetchProvincias = async () => {
      try {
        const res = await axiosInstance.get("/provincias/all");
        setProvincias(res.data);
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "No se pudieron cargar las provincias", "error");
      }
    };

    const fetchCenter = async () => {
      try {
        const res = await axiosInstance.get(`/centers/getByUuid/${uuid}`);
        const data = res.data;
        setForm({
          nombre: data.nombre || "",
          provincia_id: data.provincia_id || "",
          canton_id: data.canton_id || "",
          distrito_id: data.distrito_id || "",
          direccion: data.direccion || "",
          estado: data.estado ?? 1,
          codsaber: data.codsaber || "",
          codpres: data.codpres || "",
          tipo_institucion: data.tipo_institucion || "",
          telefono: data.telefono || "",
          correo: data.correo || "",
          regional: data.regional || "",
          circuito: data.circuito || ""
        });

        // Cargar cantones y distritos del centro
        if (data.provincia_id) await fetchCantones(data.provincia_id);
        if (data.canton_id) await fetchDistritos(data.canton_id);

      } catch (err) {
        console.error(err);
        Swal.fire("Error", "No se pudieron cargar los datos del centro", "error");
      }
    };

    fetchProvincias();
    fetchCenter();
  }, [uuid]);

  const fetchCantones = async (provincia_id) => {
    try {
      const res = await axiosInstance.get(`/cantones/byProvincia/${provincia_id}`);
      setCantones(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudieron cargar los cantones", "error");
    }
  };

  const fetchDistritos = async (canton_id) => {
    try {
      const res = await axiosInstance.get(`/distritos/byCanton/${canton_id}`);
      setDistritos(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudieron cargar los distritos", "error");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    if (name === "provincia_id") {
      setForm(prev => ({ ...prev, canton_id: "", distrito_id: "" }));
      setCantones([]);
      setDistritos([]);
      fetchCantones(value);
    }

    if (name === "canton_id") {
      setForm(prev => ({ ...prev, distrito_id: "" }));
      setDistritos([]);
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
      await axiosInstance.post(`/centers/update/${uuid}`, form, {
        headers: { "Content-Type": "application/json" }
      });
      Swal.fire("Éxito", "Centro actualizado correctamente", "success");
      navigate("/admin/mantenimientos/centros-educativos");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo actualizar el centro", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      <Typography variant="h4" mb={3}>Editar Centro Educativo</Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>

          {/* Nombre */}
          <TextField label="Nombre" name="nombre" fullWidth sx={{ flex: "1 1 48%" }} value={form.nombre} onChange={handleChange} />

          {/* Provincia */}
          <FormControl fullWidth sx={{ flex: "1 1 48%" }}>
            <InputLabel>Provincia</InputLabel>
            <Select name="provincia_id" value={form.provincia_id} onChange={handleChange}>
              {provincias.map(p => <MenuItem key={p.id} value={p.id}>{p.nombre}</MenuItem>)}
            </Select>
          </FormControl>

          {/* Cantón */}
          <FormControl fullWidth sx={{ flex: "1 1 48%" }}>
            <InputLabel>Cantón</InputLabel>
            <Select name="canton_id" value={form.canton_id} onChange={handleChange}>
              {cantones.map(c => <MenuItem key={c.id} value={c.id}>{c.nombre}</MenuItem>)}
            </Select>
          </FormControl>

          {/* Distrito */}
          <FormControl fullWidth sx={{ flex: "1 1 48%" }}>
            <InputLabel>Distrito</InputLabel>
            <Select name="distrito_id" value={form.distrito_id} onChange={handleChange}>
              {distritos.map(d => <MenuItem key={d.id} value={d.id}>{d.nombre}</MenuItem>)}
            </Select>
          </FormControl>

          {/* Dirección */}
          <TextField label="Dirección" name="direccion" fullWidth sx={{ flex: "1 1 48%" }} value={form.direccion} onChange={handleChange} />

          {/* Teléfono */}
          <TextField label="Teléfono" name="telefono" fullWidth sx={{ flex: "1 1 48%" }} value={form.telefono} onChange={handleChange} />

          {/* Correo */}
          <TextField label="Correo" name="correo" fullWidth sx={{ flex: "1 1 48%" }} value={form.correo} onChange={handleChange} />

          {/* Código SABER */}
          <TextField label="Código SABER" name="codsaber" fullWidth sx={{ flex: "1 1 48%" }} value={form.codsaber} onChange={handleChange} />

          {/* Código PRES */}
          <TextField label="Código PRES" name="codpres" fullWidth sx={{ flex: "1 1 48%" }} value={form.codpres} onChange={handleChange} />

          {/* Tipo Institución */}
          <FormControl fullWidth sx={{ flex: "1 1 48%" }}>
            <InputLabel>Tipo Institución</InputLabel>
            <Select name="tipo_institucion" value={form.tipo_institucion} onChange={handleChange}>
              <MenuItem value="1">Pública</MenuItem>
              <MenuItem value="2">Privada</MenuItem>
            </Select>
          </FormControl>

          {/* Regional */}
          <FormControl fullWidth sx={{ flex: "1 1 48%" }}>
            <InputLabel>Regional</InputLabel>
            <Select name="regional" value={form.regional} onChange={handleChange}>
              {regionales.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
            </Select>
          </FormControl>

          {/* Circuito */}
          <FormControl fullWidth sx={{ flex: "1 1 48%" }}>
            <InputLabel>Circuito</InputLabel>
            <Select name="circuito" value={form.circuito} onChange={handleChange}>
              {circuitos.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </Select>
          </FormControl>

          {/* Botones */}
          <Box sx={{ width: "100%", display: "flex", gap: 2, mt: 2 }}>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : "Actualizar"}
            </Button>
            <Button variant="outlined" onClick={() => navigate("/admin/mantenimientos/centros-educativos")}>Cancelar</Button>
          </Box>

        </Box>
      </Box>
    </Box>
  );
};

export default CenterEdit;