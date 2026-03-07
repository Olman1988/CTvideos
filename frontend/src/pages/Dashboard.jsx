import { Box, Typography, Paper } from "@mui/material";

export default function Dashboard() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography>Bienvenido al sistema 👋</Typography>
        <Typography variant="body2" color="text.secondary">
          Aquí podrás ver resúmenes, métricas o accesos rápidos.
        </Typography>
      </Paper>
    </Box>
  );
}
