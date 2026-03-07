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
import CategoryIcon from "@mui/icons-material/Category";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { API_URL_IMG } from "@/config/config"; 
const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/categories/all");
      setCategories(res.data);
    } catch {
      Swal.fire("Error", "No se pudieron cargar las categorias", "error");
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
      await axiosInstance.post(`/categories/delete/${uuid}`);
      fetchCategories();
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
        <Typography variant="h4">Categorías</Typography>

        <Button
          variant="contained"
          startIcon={<CategoryIcon />}
          onClick={() => navigate("/admin/mantenimientos/categorias/nuevo")}
        >
          Nueva Categoría
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
              {categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No hay categorias registradas
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category) => (
                  <TableRow key={category.uuid}>
                    <TableCell>{category.nombre}</TableCell>
                    <TableCell>
                        {category.imagen ? (
                            <Box
                            component="img"
                            src={`${API_URL_IMG}${category.imagen}`}
                            alt={category.nombre || "Category"}
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

                    <TableCell>{category.estado_catalogo}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Editar">
                        <IconButton
                          color="primary"
                          onClick={() =>
                            navigate(`/admin/mantenimientos/categorias/${category.uuid}`)
                          }
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Eliminar">
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(category.uuid)}
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

export default Categories;
