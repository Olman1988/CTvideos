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

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get("/students/all");
      setStudents(data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar los estudiantes",
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
          Listado de Estudiantes
        </Typography>

        <Button
          variant="contained"
          startIcon={<AccountCircleIcon />}
          onClick={() => navigate("/admin/perfiles/estudiantes/nuevo")}
        >
          Nuevo estudiante
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
                <TableCell>Avatar</TableCell>
                <TableCell>Nombre completo</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Centros educativos</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {students.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No hay estudiantes registrados
                  </TableCell>
                </TableRow>
              ) : (
                students.map((student) => (
                  <TableRow key={student.uuid}>
                    {/* AVATAR */}
                    <TableCell>
                      <Avatar
  src={`${API_URL_IMG}${student.avatar_image}`}
  alt={student.avatar_name}
/>
                    </TableCell>

                    {/* NAME */}
                    <TableCell>
                      {student.first_name} {student.last_name} {student.second_last_name}
                      <Typography variant="caption" display="block" color="text.secondary">
                        Alias: {student.alias}
                      </Typography>
                    </TableCell>

                    {/* STATUS */}
                    <TableCell>
                      {student.status_name}
                    </TableCell>

                    {/* CENTERS */}
                    <TableCell>
  {student.educational_centers ?? "—"}
</TableCell>

                    {/* ACTIONS */}
                    <TableCell align="right">
                      <Tooltip title="Editar estudiante">
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() =>
                            navigate(`/admin/perfiles/estudiantes/${student.uuid}`)
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

export default Students;
