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
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";

const Guardians = () => {
  const [guardians, setGuardians] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchGuardians();
  }, []);

  const fetchGuardians = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/guardians/all");
    const data = res.data.map(g => ({
      ...g,
      estudiantes_json: JSON.parse(g.estudiantes_json) // convertir JSON string a array
    }));
      
      setGuardians(data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar los encargados",
      });
    } finally {
      setLoading(false);
    }
  };

  // Función para mostrar los estudiantes asociados
  const renderEstudiantes = (estudiantesJson) => {
  // Si estudiantesJson es string, convertirlo
  const estudiantes = typeof estudiantesJson === 'string' ? JSON.parse(estudiantesJson) : estudiantesJson;

  return estudiantes.map((e) => (
    <div key={e.estudiante_id}>
           {e.estudiante_nombre} {e.estudiante_apellido} - {e.parentesco_nombre}
    </div>
  ));
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
        <Typography variant="h4">Listado de encargados</Typography>

        <Button
          variant="contained"
          startIcon={<AccountCircleIcon />}
          onClick={() => navigate("/admin/perfiles/encargados/nuevo")}
        >
          Nuevo encargado
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
                <TableCell>DNI</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Estudiantes</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {guardians.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No hay encargados registrados
                  </TableCell>
                </TableRow>
              ) : (
                guardians.map((guardian) => (
                  <TableRow key={guardian.uuid}>
                    {/* NOMBRE COMPLETO */}
                    <TableCell>
                      {guardian.nombre} {guardian.primer_apellido} {guardian.segundo_apellido ?? ""}
                    </TableCell>

                    {/* DNI */}
                    <TableCell>{guardian.dni}</TableCell>

                    {/* ESTADO */}
                    <TableCell>{guardian.estado_nombre}</TableCell>

                    {/* ESTUDIANTES */}
                    <TableCell>
                      {renderEstudiantes(guardian.estudiantes_json)}
                    </TableCell>

                    {/* ACCIONES */}
                    <TableCell align="right">
                      <Tooltip title="Editar encargado">
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() =>
                            navigate(`/admin/perfiles/encargados/${guardian.uuid}`)
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

export default Guardians;
