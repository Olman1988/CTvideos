import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  IconButton,
  Tooltip,
  Button,
} from "@mui/material";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import Swal from "sweetalert2";
import axiosInstance from "@/api/axiosInstance";
import { useNavigate } from "react-router-dom";
import FolderIcon from "@mui/icons-material/Folder";

const ContentList = () => {
  const navigate = useNavigate();
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // Fetch contents
  // =========================
  const fetchContents = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get("/contents/all");
      setContents(data);
    } catch (error) {
      Swal.fire("Error", "No se pudieron cargar los contenidos", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContents();
  }, []);

  // =========================
  // Delete content
  // =========================
  const handleDelete = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esto",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.delete(`/contents/${id}`);
          Swal.fire("Eliminado", "El contenido fue eliminado", "success");
          fetchContents();
        } catch (error) {
          Swal.fire("Error", "No se pudo eliminar", "error");
        }
      }
    });
  };

  if (loading) return <CircularProgress />;

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      
        <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography variant="h4">    Lista de Contenidos</Typography>
        
                <Button
                  variant="contained"
                  startIcon={<FolderIcon />}
                  onClick={() => navigate("/admin/contenidos/nuevo")}
                >
                  Crear Nuevo Contenido
                </Button>
              </Box>
        
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Título</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Rango Edad</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Creado En</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contents.map((c) => (
              <TableRow key={c.id}>
                <TableCell>{c.titulo}</TableCell>
                <TableCell>{c.tipo}</TableCell>
                <TableCell>{c.rango}</TableCell>
                <TableCell>{c.estado}</TableCell>
                <TableCell>{new Date(c.creado_en).toLocaleString()}</TableCell>
                <TableCell>
                 
                  <Tooltip title="Editar">
                    <IconButton onClick={() => navigate(`/admin/contenidos/${c.uuid}`)}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton onClick={() => handleDelete(c.uuid)}>
                      <Delete color="error" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {contents.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No hay contenidos
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ContentList;