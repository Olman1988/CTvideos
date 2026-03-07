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
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { API_URL_IMG } from "@/config/config";

const Backgrounds = () => {
  const [backgrounds, setBackgrounds] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchBackgrounds();
  }, []);

  const fetchBackgrounds = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/backgrounds/all");
      setBackgrounds(res.data);
    } catch {
      Swal.fire("Error", "No se pudieron cargar los backgrounds", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (uuid) => {
    const result = await Swal.fire({
      title: "¿Eliminar background?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.post(`/backgrounds/delete/${uuid}`);
        fetchBackgrounds();
      } catch {
        Swal.fire("Error", "No se pudo eliminar el background", "error");
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
        <Typography variant="h4">Backgrounds</Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/admin/mantenimientos/backgrounds/nuevo")}
        >
          Nuevo Background
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
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {backgrounds.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No hay backgrounds registrados
                  </TableCell>
                </TableRow>
              ) : (
                backgrounds.map((bg) => (
                  <TableRow key={bg.uuid}>
                    <TableCell>{bg.nombre}</TableCell>

                    <TableCell>
                      {bg.imagen ? (
                        <Box
                          component="img"
                          src={`${API_URL_IMG}${bg.imagen}`}
                          alt={bg.nombre || "Background"}
                          sx={{
                            width: 120,
                            height: 60,
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

                    <TableCell>{bg.estado_catalogo}</TableCell>

                    <TableCell align="right">
                      <Tooltip title="Editar">
                        <IconButton
                          color="primary"
                          onClick={() =>
                            navigate(`/admin/mantenimientos/backgrounds/${bg.uuid}`)
                          }
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Eliminar">
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(bg.uuid)}
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

export default Backgrounds;