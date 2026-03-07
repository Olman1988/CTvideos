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
const Avatars = () => {
  const [avatars, setAvatars] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchAvatars();
  }, []);

  const fetchAvatars = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/avatars/all");
      setAvatars(res.data);
    } catch {
      Swal.fire("Error", "No se pudieron cargar los avatares", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (uuid) => {
    const result = await Swal.fire({
      title: "¿Eliminar categoría?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
    });

    if (result.isConfirmed) {
      await axiosInstance.post(`/avatars/delete/${uuid}`);
      fetchAvatars();
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
        <Typography variant="h4">Avatares</Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/admin/mantenimientos/avatares/nuevo")}
        >
          Nuevo Avatar
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
              {avatars.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No hay avatares registradas
                  </TableCell>
                </TableRow>
              ) : (
                avatars.map((avatar) => (
                  <TableRow key={avatar.uuid}>
                    <TableCell>{avatar.nombre}</TableCell>
                    <TableCell>
                        {avatar.imagen ? (
                            <Box
                            component="img"
                            src={`${API_URL_IMG}${avatar.imagen}`}
                            alt={avatar.nombre || "Avatar"}
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

                    <TableCell>{avatar.estado_catalogo}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Editar">
                        <IconButton
                          color="primary"
                          onClick={() =>
                            navigate(`/admin/mantenimientos/avatares/${avatar.uuid}`)
                          }
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Eliminar">
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(avatar.uuid)}
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

export default Avatars;
