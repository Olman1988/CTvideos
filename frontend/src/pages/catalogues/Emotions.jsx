import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  IconButton,
  Tooltip,
  Chip,
} from "@mui/material";
import * as Icons from "@mui/icons-material"; // <- importa todos los iconos dinámicamente
import Swal from "sweetalert2";
import axiosInstance from "@/api/axiosInstance";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";

const Emotions = () => {
  const [emotions, setEmotions] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchEmotions();
  }, []);

  const fetchEmotions = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/emotions/all");
      setEmotions(res.data);
    } catch {
      Swal.fire("Error", "No se pudieron cargar las emociones", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar emoción?",
      text: "Esta acción cambiará el estado a inactivo",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/emotions/delete/${id}`);
        fetchEmotions();
        Swal.fire("Eliminado", "Emoción eliminada correctamente", "success");
      } catch {
        Swal.fire("Error", "No se pudo eliminar la emoción", "error");
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* HEADER */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4">Emociones</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/admin/mantenimientos/emociones/nuevo")}
        >
          Nueva Emoción
        </Button>
      </Box>

      {/* LOADING */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Color</TableCell>
                <TableCell>Icono</TableCell>
                <TableCell>Sinónimos</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {emotions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No hay emociones registradas
                  </TableCell>
                </TableRow>
              ) : (
                emotions.map((emotion) => (
                  <TableRow key={emotion.id}>
                    <TableCell>{emotion.nombre}</TableCell>

                    {/* Color */}
                    <TableCell>
                      <Box
                        sx={{
                          width: 30,
                          height: 30,
                          borderRadius: "50%",
                          bgcolor: emotion.color || "#000",
                          border: "1px solid #ddd",
                        }}
                      />
                    </TableCell>

                    {/* Icono dinámico */}
                    <TableCell>
                      {emotion.icono && Icons[emotion.icono] ? (
                        <Box sx={{ fontSize: 30 }}>
                          {React.createElement(Icons[emotion.icono])}
                        </Box>
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          Sin icono
                        </Typography>
                      )}
                    </TableCell>

                    {/* Sinónimos */}
                    <TableCell>
                      {emotion.sinonimos && emotion.sinonimos.length > 0
                        ? emotion.sinonimos.split(",").map((s, i) => (
                            <Chip key={i} label={s.trim()} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                          ))
                        : <Typography variant="caption" color="text.secondary">Sin sinónimos</Typography>
                      }
                    </TableCell>

                    {/* Estado */}
                    <TableCell>
                       {emotion.estado_id === "1" ? (
                        <Chip label={emotion.estado} color="success" size="small" />
                        ) : emotion.estado_id === "3" ? (
                        <Chip label={emotion.estado} color="default" size="small" />
                        ) : (
                        <Chip label={emotion.estado} color="error" size="small" />
                        )}

                        
                    </TableCell>

                    {/* Acciones */}
                    <TableCell align="right">
                      <Tooltip title="Editar">
                        <IconButton
                          color="primary"
                          onClick={() =>
                            navigate(`/admin/mantenimientos/emociones/${emotion.uuid}`)
                          }
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Eliminar">
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(emotion.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default Emotions;
