import { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem
} from "@mui/material";
import Select from "react-select";
import Swal from "sweetalert2";
import axiosInstance from "@/api/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";

const GuardianEdit = () => {
  const { uuid } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [parentescos, setParentescos] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    primer_apellido: "",
    segundo_apellido: "",
    dni: "",
    telefono: "",
    email: "",
    estado_id: 1,
    estudiantes: [] // [{ estudiante_id, parentesco_id }]
  });

  /* ===================== LOAD DATA ===================== */
  useEffect(() => {
    fetchStudents();
    fetchParentescos();
    fetchGuardian();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axiosInstance.get("/students/active");
      setStudents(res.data);
    } catch {
      Swal.fire("Error", "No se pudieron cargar los estudiantes", "error");
    }
  };

  const fetchParentescos = async () => {
    try {
      const res = await axiosInstance.get("/relationship/all");
      setParentescos(res.data.map(p => ({ ...p, id: Number(p.id) })));
    } catch {
      Swal.fire("Error", "No se pudieron cargar los tipos de parentesco", "error");
    }
  };

  const fetchGuardian = async () => {
    try {
      const res = await axiosInstance.get(`/guardians/getByUuid/${uuid}`);
      const g = res.data;

      setForm({
        nombre: g.nombre,
        primer_apellido: g.primer_apellido,
        segundo_apellido: g.segundo_apellido,
        dni: g.dni,
        telefono: g.telefono,
        email: g.email,
        estado_id: Number(g.estado_id),
        estudiantes: g.estudiantes || []
      });
    } catch {
      Swal.fire("Error", "No se pudieron cargar los datos del encargado", "error");
    }
  };

  /* ===================== OPTIONS ===================== */
  const studentOptions = students.map((s) => ({
    value: Number(s.id),
    label: `${s.nombre} ${s.primer_apellido} ${s.segundo_apellido ?? ""}`
  }));

  /* ===================== HANDLERS ===================== */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleStudentSelect = (option) => {
    if (!option) return;

    const estudianteId = Number(option.value);

    if (form.estudiantes.some(s => s.estudiante_id === estudianteId)) {
      return;
    }

    setForm({
      ...form,
      estudiantes: [
        ...form.estudiantes,
        { estudiante_id: estudianteId, parentesco_id: "" }
      ]
    });
  };

  const handleRemoveStudent = (estudiante_id) => {
    setForm({
      ...form,
      estudiantes: form.estudiantes.filter(
        s => s.estudiante_id !== estudiante_id
      )
    });
  };

  const handleParentescoChange = (estudiante_id, parentesco_id) => {
    setForm({
      ...form,
      estudiantes: form.estudiantes.map((s) =>
        s.estudiante_id === estudiante_id
          ? { ...s, parentesco_id: Number(parentesco_id) }
          : s
      )
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nombre || !form.primer_apellido || !form.dni) {
      Swal.fire("Atención", "Complete los campos obligatorios", "warning");
      return;
    }

    if (
      form.estudiantes.length === 0 ||
      form.estudiantes.some(s => !s.parentesco_id)
    ) {
      Swal.fire(
        "Atención",
        "Debe asignar al menos un estudiante con su parentesco",
        "warning"
      );
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.post(`/guardians/update/${uuid}`, {
        ...form,
        estudiantes_json: JSON.stringify(form.estudiantes)
      });
      Swal.fire("Éxito", "Encargado actualizado correctamente", "success");
      navigate("/admin/perfiles/encargados");
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.error || "Error al actualizar encargado",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ===================== RENDER ===================== */
  return (
    <Box sx={{ maxWidth: 1200, mx: "auto" }}>
      <Typography variant="h4" mb={3}>
        Editar encargado
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          <Box sx={{ width: { xs: "100%", md: "48%" } }}>
            <TextField
              label="Nombre"
              name="nombre"
              fullWidth
              required
              value={form.nombre}
              onChange={handleChange}
            />
          </Box>

          <Box sx={{ width: { xs: "100%", md: "48%" } }}>
            <TextField
              label="Primer apellido"
              name="primer_apellido"
              fullWidth
              required
              value={form.primer_apellido}
              onChange={handleChange}
            />
          </Box>

          <Box sx={{ width: { xs: "100%", md: "48%" } }}>
            <TextField
              label="Segundo apellido"
              name="segundo_apellido"
              fullWidth
              value={form.segundo_apellido}
              onChange={handleChange}
            />
          </Box>

          <Box sx={{ width: { xs: "100%", md: "48%" } }}>
            <TextField
              label="DNI"
              name="dni"
              fullWidth
              required
              value={form.dni}
              onChange={handleChange}
            />
          </Box>

          <Box sx={{ width: { xs: "100%", md: "48%" } }}>
            <TextField
              label="Teléfono"
              name="telefono"
              fullWidth
              value={form.telefono}
              onChange={handleChange}
            />
          </Box>

          <Box sx={{ width: { xs: "100%", md: "48%" } }}>
            <TextField
              label="Email"
              name="email"
              fullWidth
              value={form.email}
              onChange={handleChange}
            />
          </Box>

          <Box sx={{ width: { xs: "100%", md: "48%" } }}>
            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <MuiSelect
                name="estado_id"
                value={form.estado_id}
                onChange={handleChange}
              >
                <MenuItem value={1}>Activo</MenuItem>
                <MenuItem value={2}>Inactivo</MenuItem>
                <MenuItem value={3}>Suspendido</MenuItem>
              </MuiSelect>
            </FormControl>
          </Box>

          {/* ESTUDIANTES */}
          <Box sx={{ width: { xs: "100%", md: "100%" } }}>
            <Typography variant="subtitle1" mb={1}>
              Estudiantes asignados
            </Typography>

            <Box sx={{ maxWidth: "100%", mb: 2 }}>
              <Select
                options={studentOptions}
                onChange={handleStudentSelect}
                isClearable
                placeholder="Buscar y agregar estudiante"
              />
            </Box>

            <Box sx={{ border: "1px solid #ccc", borderRadius: 1, p: 2 }}>
              {form.estudiantes.length === 0 && (
                <Typography color="gray">
                  No hay estudiantes asignados
                </Typography>
              )}

              {form.estudiantes.map((es) => {
                const student = students.find(
                  s => Number(s.id) === Number(es.estudiante_id)
                );

                return (
                  <Box
                    key={es.estudiante_id}
                    sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}
                  >
                    <Typography sx={{ minWidth: 220 }}>
                      {student
                        ? `${student.nombre} ${student.primer_apellido}`
                        : "Estudiante"}
                    </Typography>

                    <FormControl sx={{ minWidth: 180 }} size="small">
                      <MuiSelect
                        displayEmpty
                        value={es.parentesco_id}
                        onChange={(e) =>
                          handleParentescoChange(
                            es.estudiante_id,
                            e.target.value
                          )
                        }
                        renderValue={(value) => {
                          if (!value) {
                            return (
                              <Typography color="gray">
                                Seleccione parentesco
                              </Typography>
                            );
                          }
                          const parentesco = parentescos.find(
                            p => p.id === Number(value)
                          );
                          return parentesco?.nombre || "";
                        }}
                      >
                        <MenuItem disabled value="">
                          <em>Seleccione parentesco</em>
                        </MenuItem>
                        {parentescos.map((p) => (
                          <MenuItem key={p.id} value={p.id}>
                            {p.nombre}
                          </MenuItem>
                        ))}
                      </MuiSelect>
                    </FormControl>

                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleRemoveStudent(es.estudiante_id)}
                    >
                      Quitar
                    </Button>
                  </Box>
                );
              })}
            </Box>
          </Box>

          <Box sx={{ width: "100%", mt: 2, display: "flex", gap: 2 }}>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : "Guardar"}
            </Button>

            <Button
              variant="outlined"
              onClick={() => navigate("/admin/perfiles/encargados")}
            >
              Cancelar
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default GuardianEdit;
