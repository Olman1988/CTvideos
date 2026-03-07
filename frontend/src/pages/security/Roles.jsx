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
  CircularProgress
} from "@mui/material"; 
import Swal from "sweetalert2";
import axiosInstance from "@/api/axiosInstance";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton, Tooltip } from "@mui/material";
import LockIcon from '@mui/icons-material/Lock';  
 

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
const handleDelete = async (id) => {
  const result = await Swal.fire({
    title: "¿Eliminar rol?",
    text: "Esta acción no se puede deshacer",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
  });

  if (result.isConfirmed) {
    await axiosInstance.delete(`/roles/${id}`);
    fetchRoles();
  }
};
  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/roles/all");
      setRoles(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar los roles",
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
        <Typography variant="h4">
          Listado de Roles
        </Typography>

        <Button
          variant="contained"
          startIcon={<AccountCircleIcon />}
          onClick={() => navigate("/admin/seguridad/roles/nuevo")}
        >
          Nuevo rol
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
                <TableCell>Estado</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {roles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No hay roles registrados
                  </TableCell> 
                </TableRow>
              ) : (
                roles.map((rol) => (
                  <TableRow key={rol.uuid}>
                    <TableCell>{rol.nombre}</TableCell>
                    <TableCell>{rol.descripcion}</TableCell>
                    <TableCell>{rol.estado==1?"Activo":"Inactivo"}</TableCell>
                    <TableCell align="right">
                        <Tooltip title="Editar rol">
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => navigate(`/admin/seguridad/roles/${rol.uuid}`)}
                        >
                            <EditIcon />
                        </IconButton>
                        <IconButton
                            color="primary"
                            size="small"
                            onClick={() => navigate(`/admin/seguridad/permisos/${rol.uuid}`)}
                        >
                            <LockIcon />
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

export default Roles;
