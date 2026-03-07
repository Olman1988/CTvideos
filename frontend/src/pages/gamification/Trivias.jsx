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
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";

const Trivias = () => {
  const [trivias, setTrivias] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchTrivias();
  }, []);

  const fetchTrivias = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/trivias/all");
      setTrivias(res.data);
    } catch (error) {
      Swal.fire("Error", "No se pudieron cargar las trivias", "error");
    } finally {
      setLoading(false);
    }
  };

  const renderEstado = (estado) => (
    <Chip
      label={estado}
      color={estado === "Activo" ? "success" : "default"}
      size="small"
    />
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4">Listado de Trivias</Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/admin/trivias/nuevo")}
        >
          Nueva Trivia
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
                <TableCell>Descripción</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {trivias.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No hay trivias registradas
                  </TableCell>
                </TableRow>
              ) : (
                trivias.map((trivia) => (
                  <TableRow key={trivia.uuid}>
                    <TableCell>{trivia.trivia}</TableCell>
                    <TableCell>{trivia.descripcion}</TableCell>
                    <TableCell>{renderEstado(trivia.estado)}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Editar trivia">
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() =>
                            navigate(`/admin/trivias/${trivia.uuid}`)
                          }
                        >
                          <EditIcon />
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

export default Trivias;
