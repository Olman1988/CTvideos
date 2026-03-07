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
  Paper
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import Swal from "sweetalert2";
import axiosInstance from "@/api/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL_IMG } from "@/config/config"; 

const TriviaEdit = () => {
  const { uuid } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [statuses, setStatuses] = useState([]);

  const [imagen, setImagen] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);

  const [form, setForm] = useState({
    trivia: "",
    descripcion: "",
    estado_id: ""
  });

  const [preguntas, setPreguntas] = useState([]);

  /* ===================== LOAD ===================== */
  useEffect(() => {
    fetchStatuses();
    fetchTrivia();
  }, []);

  const fetchStatuses = async () => {
    try {
      const res = await axiosInstance.get("/trivias-status/all");
      setStatuses(res.data);
    } catch {
      Swal.fire("Error", "No se pudieron cargar los estados", "error");
    }
  };

 const fetchTrivia = async () => {
  try {
    setLoading(true);

    const res = await axiosInstance.get(
      `/trivias/getByUuid/${uuid}`
    );

    const data = res.data;

    setForm({
      trivia: data.trivia,
      descripcion: data.descripcion,
      estado_id: data.estado_id
    });

    // 🔥 NORMALIZAR es_correcta A BOOLEANO REAL
    const preguntasNormalizadas = (data.preguntas || []).map(p => ({
      ...p,
      respuestas: (p.respuestas || []).map(r => ({
        ...r,
        es_correcta:
  r.es_correcta === 1 ||
  r.es_correcta === "1" ||
  r.es_correcta === true
      }))
    }));

    setPreguntas(preguntasNormalizadas);
    setCurrentImage(data.imagen);

  } catch {
    Swal.fire("Error", "No se pudo cargar la trivia", "error");
    navigate("/admin/trivias");
  } finally {
    setLoading(false);
  }
};


  /* ===================== HANDLERS ===================== */

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImagen(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const addPregunta = () => {
    setPreguntas([
      ...preguntas,
      {
        pregunta: "",
        orden: preguntas.length + 1,
        respuestas: []
      }
    ]);
  };

  const removePregunta = (index) => {
    const updated = [...preguntas];
    updated.splice(index, 1);
    setPreguntas(updated);
  };

  const handlePreguntaChange = (index, value) => {
    const updated = [...preguntas];
    updated[index].pregunta = value;
    setPreguntas(updated);
  };

  const addRespuesta = (preguntaIndex) => {
    const updated = [...preguntas];
    updated[preguntaIndex].respuestas.push({
      respuesta: "",
      es_correcta: false
    });
    setPreguntas(updated);
  };

  const removeRespuesta = (preguntaIndex, respuestaIndex) => {
    const updated = [...preguntas];
    updated[preguntaIndex].respuestas.splice(respuestaIndex, 1);
    setPreguntas(updated);
  };

  const handleRespuestaChange = (
    preguntaIndex,
    respuestaIndex,
    field,
    value
  ) => {
    const updated = [...preguntas];

    if (field === "es_correcta") {
      updated[preguntaIndex].respuestas.forEach((r, i) => {
        r.es_correcta = i === respuestaIndex;
      });
    } else {
      updated[preguntaIndex].respuestas[respuestaIndex][field] = value;
    }

    setPreguntas(updated);
  };

  /* ===================== SUBMIT ===================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.trivia) {
      Swal.fire("Atención", "El nombre es obligatorio", "warning");
      return;
    }

    if (!form.estado_id) {
      Swal.fire("Atención", "Debe seleccionar un estado", "warning");
      return;
    }

    if (preguntas.length === 0) {
      Swal.fire("Atención", "Debe agregar al menos una pregunta", "warning");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("trivia", form.trivia);
      formData.append("descripcion", form.descripcion);
      formData.append("estado_id", form.estado_id);
      formData.append("preguntas", JSON.stringify(preguntas));

      if (imagen) {
        formData.append("imagen", imagen);
      }

      await axiosInstance.post(
        `/trivias/update/${uuid}`,
        formData
      );

      Swal.fire("Éxito", "Trivia actualizada correctamente", "success");
      navigate("/admin/trivias");

    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.error || "Error al actualizar trivia",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ===================== RENDER ===================== */

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto" }}>
      <Typography variant="h4" mb={3}>
        Editar Trivia
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>

          {/* Nombre */}
          <Box sx={{ width: "100%" }}>
            <TextField
              label="Nombre de la trivia"
              name="trivia"
              fullWidth
              value={form.trivia}
              onChange={handleChange}
            />
          </Box>

          {/* Estado */}
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

          {/* Descripción */}
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

          {/* Imagen actual */}
          {currentImage && !imagePreview && (
            <Box sx={{ width: "100%" }}>
              <Typography variant="subtitle2">
                Imagen actual
              </Typography>
              <Box
                component="img"
                src={`${API_URL_IMG}/${currentImage}`}
                sx={{
                  maxWidth: 250,
                  borderRadius: 2,
                  border: "1px solid #ddd",
                  mt: 1
                }}
              />
            </Box>
          )}

          {/* Nueva imagen */}
          <Box sx={{ width: "100%" }}>
            <Button variant="outlined" component="label">
              Reemplazar imagen
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>

            {imagePreview && (
              <Box mt={2}>
                <Box
                  component="img"
                  src={imagePreview}
                  sx={{
                    maxWidth: 250,
                    borderRadius: 2,
                    border: "1px solid #ddd"
                  }}
                />
              </Box>
            )}
          </Box>

          <Divider sx={{ width: "100%", my: 2 }} />

          {/* Preguntas */}
          <Box sx={{ width: "100%" }}>
            <Typography variant="h6">Preguntas</Typography>
            <Button
              startIcon={<AddIcon />}
              variant="outlined"
              onClick={addPregunta}
              sx={{ mt: 1 }}
            >
              Agregar pregunta
            </Button>
          </Box>

          {preguntas.map((pregunta, pIndex) => (
            <Paper key={pIndex} sx={{ p: 2, width: "100%", mt: 2 }}>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle1">
                  Pregunta #{pIndex + 1}
                </Typography>
                <IconButton
                  color="error"
                  onClick={() => removePregunta(pIndex)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>

              <TextField
                label="Texto de la pregunta"
                fullWidth
                sx={{ mt: 2 }}
                value={pregunta.pregunta}
                onChange={(e) =>
                  handlePreguntaChange(pIndex, e.target.value)
                }
              />

              <Box mt={2}>
                <Typography variant="subtitle2">
                  Respuestas
                </Typography>

                <Button
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={() => addRespuesta(pIndex)}
                >
                  Agregar respuesta
                </Button>
              </Box>

              {pregunta.respuestas.map((respuesta, rIndex) => (
                
                <Box
                  key={rIndex}
                  display="flex"
                  alignItems="center"
                  gap={2}
                  mt={1}
                >
                  <TextField
                    fullWidth
                    value={respuesta.respuesta}
                    onChange={(e) =>
                      handleRespuestaChange(
                        pIndex,
                        rIndex,
                        "respuesta",
                        e.target.value
                      )
                    }
                  />

                  <Button
                    variant={respuesta.es_correcta=="1" ? "contained" : "outlined"}
                    color="success"
                    onClick={() =>
                      handleRespuestaChange(
                        pIndex,
                        rIndex,
                        "es_correcta",
                        true
                      )
                    }
                  >
                    Correcta
                  </Button>

                  <IconButton
                    color="error"
                    onClick={() =>
                      removeRespuesta(pIndex, rIndex)
                    }
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
            </Paper>
          ))}

          {/* BOTONES */}
          <Box sx={{ width: "100%", mt: 3, display: "flex", gap: 2 }}>
            <Button type="submit" variant="contained">
              Guardar cambios
            </Button>

            <Button
              variant="outlined"
              onClick={() => navigate("/admin/trivias")}
            >
              Cancelar
            </Button>
          </Box>

        </Box>
      </Box>
    </Box>
  );
};

export default TriviaEdit;
