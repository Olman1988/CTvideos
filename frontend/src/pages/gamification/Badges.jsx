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

const Badges = () => {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchBadges();
  }, []);

  const fetchBadges = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/badges/all");
      setBadges(res.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar las insignias",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderEstado = (activo) => (
    <Chip
      label={activo ? "Activa" : "Inactiva"}
      color={activo ? "success" : "default"}
      size="small"
    />
  );

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
        <Typography variant="h4">Listado de insignias</Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/admin/insignias/nuevo")}
        >
          Nueva insignia
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
                <TableCell>Descripción</TableCell>
                <TableCell>Rango</TableCell>
                <TableCell>Multiplicador</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {badges.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No hay insignias registradas
                  </TableCell>
                </TableRow>
              ) : (
                badges.map((badge) => (
                  <TableRow key={badge.uuid}>
                    {/* NOMBRE */}
                    <TableCell>{badge.nombre}</TableCell>

                    {/* DESCRIPCIÓN */}
                    <TableCell>{badge.descripcion}</TableCell>

                    {/* RANGO */}
                    <TableCell>
                      {badge.rango_inicio} - {badge.rango_fin}
                    </TableCell>

                    {/* MULTIPLICADOR */}
                    <TableCell>x{badge.multiplicador}</TableCell>

                    {/* ESTADO */}
                    <TableCell>{renderEstado(badge.activo)}</TableCell>

                    {/* ACCIONES */}
                    <TableCell align="right">
                      <Tooltip title="Editar insignia">
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() =>
                            navigate(`/admin/insignias/${badge.uuid}`)
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

export default Badges;
