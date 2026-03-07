import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Forbidden = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Typography variant="h3" gutterBottom>
        🚫 Acceso denegado
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        No tienes permisos para acceder a esta sección.
      </Typography>

      <Button variant="contained" onClick={() => navigate("/admin/")}>
        Volver al dashboard
      </Button>
    </Box>
  );
};

export default Forbidden;
