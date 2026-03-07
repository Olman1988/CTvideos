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
  Tooltip
} from "@mui/material";
import Swal from "sweetalert2";
import axiosInstance from "@/api/axiosInstance";
import ViewCarouselIcon from "@mui/icons-material/ViewCarousel";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { API_URL_IMG } from "@/config/config"; 
const Sliders = () => {
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchSliders();
  }, []);

  const fetchSliders = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/sliders/all");
      setSliders(res.data);
    } catch {
      Swal.fire("Error", "No se pudieron cargar los sliders", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (uuid) => {
    const result = await Swal.fire({
      title: "¿Eliminar slider?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
    });

    if (result.isConfirmed) {
      await axiosInstance.post(`/sliders/delete/${uuid}`);
      fetchSliders();
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
        <Typography variant="h4">Sliders</Typography>

        <Button
          variant="contained"
          startIcon={<ViewCarouselIcon />}
          onClick={() => navigate("/admin/mantenimientos/sliders/nuevo")}
        >
          Nuevo slider
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
                <TableCell>Título</TableCell>
                <TableCell>Imagen</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Orden</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {sliders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No hay sliders registrados
                  </TableCell>
                </TableRow>
              ) : (
                sliders.map((slider) => (
                  <TableRow key={slider.uuid}>
                    <TableCell>{slider.titulo}</TableCell> 
                    <TableCell>
                        {slider.imagen_url ? (
                            <Box
                            component="img"
                            src={`${API_URL_IMG}${slider.imagen_url}`}
                            alt={slider.titulo || "Slider"}
                            sx={{
                                width: 80,
                                height: 50,
                                objectFit: "cover",
                                borderRadius: 1,
                                border: "1px solid #ddd",
                            }}
                            />
                        ) : (
                            <Typography variant="caption" color="text.secondary">
                            Sin imagen
                            </Typography>
                        )}
                        </TableCell>

                    <TableCell>{slider.estado_catalogo}</TableCell>
                    <TableCell>{slider.orden}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Editar">
                        <IconButton
                          color="primary"
                          onClick={() =>
                            navigate(`/admin/mantenimientos/sliders/${slider.uuid}`)
                          }
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Eliminar">
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(slider.uuid)}
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

export default Sliders;
