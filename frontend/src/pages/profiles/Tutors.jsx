import React, { useEffect, useState } from "react";
import { API_URL_IMG } from "@/config/config";
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
  Avatar,
  IconButton,
  Tooltip
} from "@mui/material";
import Swal from "sweetalert2";
import axiosInstance from "@/api/axiosInstance";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";

const Tutors = () => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchTutors();
  }, []);

  const fetchTutors = async () => {
  try {
    setLoading(true);
    const { data } = await axiosInstance.get("/tutors/all");
    setTutors(data); // asegurarte que 'data' es un array
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudieron cargar los tutores",
    });
  } finally {
    setLoading(false);
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
        <Typography variant="h4">Listado de tutores</Typography>

        <Button
          variant="contained"
          startIcon={<AccountCircleIcon />}
          onClick={() => navigate("/admin/perfiles/tutores/nuevo")}
        >
          Nuevo tutor
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
                <TableCell>Nombre completo</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Creado en</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {tutors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No hay tutores registrados
                  </TableCell>
                </TableRow>
              ) : (
                tutors.map((tutor) => (
                  <TableRow key={tutor.uuid}>
                    {/* AVATAR */}
                    

                    {/* NOMBRE COMPLETO */}
                    <TableCell>
                      {tutor.nombre} {tutor.primer_apellido} {tutor.segundo_apellido}
                    </TableCell>

                    {/* ESTADO */}
                    <TableCell>
                      {tutor.estado_nombre ?? "—"}
                    </TableCell>

                    {/* FECHA DE CREACIÓN */}
                    <TableCell>
                      {tutor.creado_en
                        ? new Date(tutor.creado_en).toLocaleDateString()
                        : "—"}
                    </TableCell>

                    {/* ACCIONES */}
                    <TableCell align="right">
                      <Tooltip title="Editar tutor">
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() =>
                            navigate(`/admin/perfiles/tutores/${tutor.uuid}`)
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

export default Tutors;
