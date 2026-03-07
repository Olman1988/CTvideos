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

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
const formatFecha = (fecha) => {
  if (!fecha) return "";
  const d = new Date(fecha);
  return d.toLocaleDateString("es-CR");
};

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/campaigns/all");
      setCampaigns(res.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar las campañas",
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
        <Typography variant="h4">Listado de campañas</Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/admin/campanas/nuevo")}
        >
          Nueva campaña
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
                <TableCell>Estado</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {campaigns.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No hay campañas registradas
                  </TableCell>
                </TableRow>
              ) : (
                campaigns.map((campaign) => (
                  <TableRow key={campaign.uuid}>
                    {/* NOMBRE */}
                    <TableCell>{campaign.nombre}</TableCell>

                    {/* DESCRIPCIÓN */}
                    <TableCell>{campaign.descripcion}</TableCell>

                    {/* RANGO */}
                    <TableCell>
                      {formatFecha(campaign.fecha_inicio)} - {formatFecha(campaign.fecha_fin)}
                    </TableCell>

                    {/* MULTIPLICADOR */}

                    {/* ESTADO */}
                    <TableCell>{campaign.estado}</TableCell>

                    {/* ACCIONES */}
                    <TableCell align="right">
                      <Tooltip title="Editar campaña">
                        <IconButton 
                          color="primary"
                          size="small"
                          onClick={() =>
                            navigate(`/admin/campanas/${campaign.uuid}`)
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

export default Campaigns;
