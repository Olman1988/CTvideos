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
  Chip
} from "@mui/material";
import Swal from "sweetalert2";
import axiosInstance from "@/api/axiosInstance";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RateReviewIcon from "@mui/icons-material/RateReview";
import { useNavigate } from "react-router-dom";
import { API_URL_IMG } from "@/config/config";
const Testimonies = () => {
  const [testimonies, setTestimonies] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchTestimonies();
  }, []);

  const fetchTestimonies = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/testimonies/all");
      setTestimonies(res.data);
    } catch {
      Swal.fire("Error", "No se pudieron cargar los testimonios", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (uuid) => {
    const result = await Swal.fire({
      title: "¿Eliminar testimonio?",
      text: "Esta acción desactivará el testimonio",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/testimonies/delete/${uuid}`);
        fetchTestimonies();
        Swal.fire("Eliminado", "Testimonio eliminado correctamente", "success");
      } catch {
        Swal.fire("Error", "No se pudo eliminar el testimonio", "error");
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4">Testimonios</Typography>

        <Button
          variant="contained"
          startIcon={<RateReviewIcon />}
          onClick={() =>
            navigate("/admin/mantenimientos/testimonios/nuevo")
          }
        >
          Nuevo Testimonio
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
                <TableCell>Mensaje</TableCell>
                <TableCell>Imagen</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {testimonies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No hay testimonios registrados
                  </TableCell>
                </TableRow>
              ) : (
                testimonies.map((testimony) => (
                  <TableRow key={testimony.uuid}>
                    <TableCell>{testimony.nombre}</TableCell>

                    <TableCell>
                      {testimony.mensaje.length > 80
                        ? testimony.mensaje.substring(0, 80) + "..."
                        : testimony.mensaje}
                    </TableCell>

                    <TableCell>
                      {testimony.imagen ? (
                        <Box
                          component="img"
                          src={`${API_URL_IMG}${testimony.imagen}`}
                          alt={testimony.nombre}
                          sx={{
                            width: 80,
                            height: 50,
                            objectFit: "cover",
                            borderRadius: 1,
                            border: "1px solid #ddd",
                          }}
                        />
                      ) : (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          Sin imagen
                        </Typography>
                      )}
                    </TableCell>

                    <TableCell>
                      {testimony.activo==1 ? (
                        <Chip label="Activo" color="success" size="small" />
                      ) : (
                        <Chip label="Inactivo" color="default" size="small" />
                      )}
                    </TableCell>

                    <TableCell align="right">
                      <Tooltip title="Editar">
                        <IconButton
                          color="primary"
                          onClick={() =>
                            navigate(
                              `/admin/mantenimientos/testimonios/${testimony.uuid}`
                            )
                          }
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Eliminar">
                        <IconButton
                          color="error"
                          onClick={() =>
                            handleDelete(testimony.uuid)
                          }
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

export default Testimonies;
