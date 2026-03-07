import React, { useEffect, useState } from "react";
import {
  Box, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, CircularProgress,
  IconButton, Tooltip
} from "@mui/material";
import Swal from "sweetalert2";
import axiosInstance from "@/api/axiosInstance";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";

const Centers = () => {
  const [centros, setCentros] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCentros();
  }, []);

  const fetchCentros = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/centers/all");
      setCentros(res.data);
    } catch {
      Swal.fire("Error", "No se pudieron cargar los centros educativos", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (uuid) => {
    const result = await Swal.fire({
      title: "¿Eliminar centro educativo?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.post(`/centers/delete/${uuid}`);
        fetchCentros();
      } catch {
        Swal.fire("Error", "No se pudo eliminar el centro", "error");
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4">Centros Educativos</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/admin/mantenimientos/centros-educativos/nuevo")}
        >
          Nuevo Centro
        </Button>
      </Box>

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
                <TableCell>Provincia</TableCell>
                <TableCell>Cantón</TableCell>
                <TableCell>Distrito</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {centros.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No hay centros registrados
                  </TableCell>
                </TableRow>
              ) : (
                centros.map((c) => (
                  <TableRow key={c.uuid}>
                    <TableCell>{c.nombre}</TableCell>
                    <TableCell>{c.provincia_nombre}</TableCell>
                    <TableCell>{c.canton_nombre}</TableCell>
                    <TableCell>{c.distrito_nombre}</TableCell>
                    <TableCell>{c.estado_nombre}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Editar">
                        <IconButton color="primary" onClick={() => navigate(`/admin/mantenimientos/centros-educativos/${c.uuid}`)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton color="error" onClick={() => handleDelete(c.uuid)}>
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

export default Centers;