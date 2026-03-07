import React, { useState } from "react";
import { TextField, Button, Typography, Box } from "@mui/material";
import Swal from "sweetalert2";
import axiosInstance from "@/api/axiosInstance";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      Swal.fire("Error", "Todos los campos son obligatorios", "error");
      return;
    }

    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password
      });

      const { token, user } = response.data;

      // Guardar token y usuario completo
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      Swal.fire("Éxito", "Has iniciado sesión correctamente", "success");

      // Redirigir
      navigate("/admin");

    } catch (error) {
      const mensaje =
        error.response?.data?.error || "Email o contraseña incorrectos";

      Swal.fire("Error", mensaje, "error");
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Box
        sx={{
          width: 350,
          p: 4,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: "white",
          textAlign: "center",
        }}
      >
        <AccountCircleIcon sx={{ fontSize: 80, color: "primary.main", mb: 2 }} />

        <Typography variant="h5" component="h1" gutterBottom>
          Iniciar Sesión
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            label="Contraseña"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Iniciar Sesión
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default Login;
