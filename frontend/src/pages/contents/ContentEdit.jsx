import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Chip,
  Button,
  Box,
  CircularProgress,
  Typography,
  IconButton,
  Tooltip,
  Divider
} from "@mui/material";
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatListBulleted,
  FormatListNumbered,
  FormatQuote,
  Undo,
  Redo,
  Code
} from "@mui/icons-material";
import Autocomplete from "@mui/material/Autocomplete";
import Swal from "sweetalert2";
import axiosInstance from "@/api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useQueries } from "@tanstack/react-query";
import { useEffect, useState, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useDropzone } from "react-dropzone";
import { useParams } from "react-router-dom";
import { API_URL_IMG } from "@/config/config";

const ContentEdit = ({ initialData = null, isEdit = false }) => {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
const { uuid } = useParams();

  useEffect(() => {
    if (!uuid) return;

    const fetchData = async () => {
      try {
        const { data } = await axiosInstance.get(`/contents/get/${uuid}`);

        setForm((prev) => ({
          ...prev,
          ...data.contenido,
          categorias: data.categorias?.map((c) => c.id) || [],
          centros: data.centros?.map((c) => c.id) || [],
          estudiantes: data.estudiantes?.map((s) => s.id) || [],
          trivias: data.trivias?.map((t) => t.id) || [],
          tags: data.tags?.map((t) => t.nombre) || [],
          imagen: data.contenido.imagen || "",
 existingFiles: data.files || [],
newFiles: [],
  imagen_principal: null,
        }));
      } catch (error) {
        Swal.fire("Error", "No se pudo cargar el contenido", "error");
      }
    };

    fetchData();
  }, [uuid]);
  /*=================
     FORM STATE
  ========================= */
  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    youtube_url: "",
    vimeo_url: "",
    tipo_contenido_id: "",
    rango_edad_id: "",
    contexto_id: "",
    estado_id: "",
    abordaje_id: "",
    tags: [],
    categorias: [],
    estudiantes: [],
    trivias: [],
    centros: [],
    existingFiles: [],   // 🔥 AGREGAR
  newFiles: [], 
    imagen: "",              // ← ruta existente
  imagen_principal: null
  });

  /* =========================
     CARGAR DATOS INICIALES SI ES EDICIÓN
  ========================= */

  useEffect(() => {
    if (initialData) {
      setForm((prev) => ({
        ...prev,
        ...initialData,
        existingFiles: initialData.files || [],
        imagen_principal: null,
      }));
    }
  }, [initialData]);

  /* =========================
     TIPTAP EDITOR
  ========================= */
   const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    onUpdate: ({ editor }) => {
      handleChange("descripcion", editor.getHTML());
    },
  });
   useEffect(() => {
    if (editor && form.descripcion) {
      editor.commands.setContent(form.descripcion);
    }
  }, [form.descripcion, editor]);



  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  /* =========================
     VALIDACIÓN IMAGEN PRINCIPAL
  ========================= */
  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      Swal.fire("Solo se permiten imágenes");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      Swal.fire("La imagen no debe superar 2MB");
      return;
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = function () {
      if (img.width < 500 || img.height < 500) {
        Swal.fire(
          "Dimensiones insuficientes",
          "La imagen debe ser mínimo 500x500px (Recomendado 700x700px)",
          "warning"
        );
        URL.revokeObjectURL(objectUrl);
        return;
      }

      handleChange("imagen_principal", file);
    };

    img.src = objectUrl;
  };

  /* =========================
     DROPZONE PARA ARCHIVOS
  ========================= */
  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length + form.existingFiles.length + form.newFiles.length > 5) {
      Swal.fire("Máximo 5 archivos permitidos");
      return;
    }
    handleChange("newFiles", [...form.newFiles, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [],
      "image/jpeg": [],
      "image/png": [],
      "application/msword": [],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [],
    },
  });

  /* =========================
     CONSULTAS DE CATALOGOS
  ========================= */
  const fetchCatalog = async (endpoint) => {
    const { data } = await axiosInstance.get(endpoint);
    return data;
  };

  const queries = useQueries({
    queries: [
      { queryKey: ["statuses"], queryFn: () => fetchCatalog("/content-status/active") },
      { queryKey: ["approaches"], queryFn: () => fetchCatalog("/content-approaches/active") },
      { queryKey: ["contentTypes"], queryFn: () => fetchCatalog("/content-types/active") },
      { queryKey: ["ageRanges"], queryFn: () => fetchCatalog("/content-ageRanges/active") },
      { queryKey: ["contexts"], queryFn: () => fetchCatalog("/content-context/active") },
      { queryKey: ["tags"], queryFn: () => fetchCatalog("/content-tags/active") },
      { queryKey: ["categories"], queryFn: () => fetchCatalog("/categories/active") },
      { queryKey: ["students"], queryFn: () => fetchCatalog("/students/active") },
      { queryKey: ["trivias"], queryFn: () => fetchCatalog("/trivias/active") },
      { queryKey: ["centers"], queryFn: () => fetchCatalog("/centers/active") },
    ],
  });

  const isLoading = queries.some((q) => q.isLoading);
  const isError = queries.some((q) => q.isError);

  const [
    statuses,
    approaches,
    contentTypes,
    ageRanges,
    contexts,
    tagsData,
    categories,
    students,
    trivias,
    centers,
  ] = queries.map((q) => q.data ?? []);

  /* =========================
     FILTRADO DE ESTUDIANTES POR CENTRO
  ========================= */
  const filteredStudents = students.filter((student) => {
  if (!form.centros.length) return true; // 🔥 importante
  const centros = JSON.parse(student.centros_educativos_json || "[]");
  return centros.some((c) =>
    form.centros.includes(String(c.centro_educativo_id))
  );
});


  /* =========================
     SUBMIT
  ========================= */
const handleSubmit = async () => {
  try {
    const formData = new FormData();

    // Campos normales
    Object.keys(form).forEach((key) => {
      if (key === "existingFiles" || key === "newFiles") return;

      if (Array.isArray(form[key])) {
        formData.append(key, JSON.stringify(form[key]));
      } else {
        formData.append(key, form[key]);
      }
    });

    // 🔥 Enviar IDs que se mantienen
    const existingIds = form.existingFiles.map(f => f.id);
    formData.append("existingFiles", JSON.stringify(existingIds));

    // 🔥 Enviar archivos nuevos
    form.newFiles.forEach(file => {
      formData.append("new_files[]", file);
    });

    await axiosInstance.post(`/contents/update/${uuid}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    Swal.fire("Éxito", "Guardado correctamente", "success");
    navigate("/admin/contenidos/lista");

  } catch (error) {
    Swal.fire("Error", "No se pudo guardar", "error");
  }
};

  /* =========================
     RENDER MULTISELECT
  ========================= */
  const renderMultiSelect = (label, field, options) => (
    <FormControl fullWidth sx={{ mb: 2 }}>
      <InputLabel>{label}</InputLabel>
      <Select
        multiple
        value={form[field]}
        onChange={(e) => handleChange(field, e.target.value)}
        input={<OutlinedInput label={label} />}
        renderValue={(selected) =>
          selected
            .map((id) => options.find((o) => o.id === id))
            .filter(Boolean)
            .map((o) => o.nombre)
            .join(", ")
        }
      >
        {options.map((option) => (
          <MenuItem key={option.id} value={option.id}>
            <Checkbox checked={form[field].includes(option.id)} />
            <ListItemText primary={option.nombre} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  if (isLoading) return <CircularProgress />;
  if (isError) return null;

  /* =========================
     RENDER
  ========================= */
 return (
  <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
    <Typography variant="h4" mb={3}>Subir Contenido</Typography>

    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
      {/* Título */}
      <Box sx={{ width: { xs: "100%", md: "100%" } }}>
        <TextField
          fullWidth
          label="Título"
          value={form.titulo}
          onChange={(e) => handleChange("titulo", e.target.value)}
        />
      </Box>

      {/* Imagen Principal */}
      <Box sx={{ width: { xs: "100%", md: "100%" } }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Imagen Principal
        </Typography>

        {!(form.imagen_principal || form.imagen) && (
  <>
    <Box
      onClick={() => fileInputRef.current?.click()}
      sx={{
        border: "2px dashed #ccc",
        borderRadius: 3,
        p: 4,
        textAlign: "center",
        cursor: "pointer",
        transition: "0.3s",
        "&:hover": {
          borderColor: "#1976d2",
          backgroundColor: "#f5faff"
        }
      }}
    >
      <Typography variant="h6" sx={{ mb: 1 }}>
        Arrastrar o seleccionar imagen
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Recomendado: 700x700px • Mínimo: 500x500px • Máx: 2MB
      </Typography>
    </Box>

    <input
      ref={fileInputRef}
      type="file"
      hidden
      accept="image/*"
      onChange={handleMainImageChange}
    />
  </>
)}

        {(form.imagen_principal || form.imagen) && (
  <Box
    sx={{
      mt: 2,
      position: "relative",
      width: 250,
      height: 250,
      borderRadius: 3,
      overflow: "hidden",
      boxShadow: 3
    }}
  >
    <img
      src={
        form.imagen_principal instanceof File
          ? URL.createObjectURL(form.imagen_principal)
          : `${API_URL_IMG}${form.imagen}`
      }
      alt="Imagen Principal"
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />

    <Box
      sx={{
        position: "absolute",
        bottom: 0,
        width: "100%",
        background: "rgba(0,0,0,0.5)",
        textAlign: "center",
        p: 1
      }}
    >
      <Button
        size="small"
        variant="contained"
        color="error"
        onClick={() => {
          handleChange("imagen_principal", null);
          handleChange("imagen", "");
        }}
      >
        Eliminar
      </Button>
    </Box>
  </Box>
)}
      </Box>

      {/* YouTube / Vimeo */}
      <Box sx={{ width: { xs: "100%", md: "48%" } }}>
        <TextField
          fullWidth
          label="YouTube URL"
          value={form.youtube_url}
          onChange={(e) => handleChange("youtube_url", e.target.value)}
        />
      </Box>
      <Box sx={{ width: { xs: "100%", md: "48%" } }}>
        <TextField
          fullWidth
          label="Vimeo URL"
          value={form.vimeo_url}
          onChange={(e) => handleChange("vimeo_url", e.target.value)}
        />
      </Box>

      {/* Estado / Enfoque */}
      <Box sx={{ width: { xs: "100%", md: "48%" } }}>
        <FormControl fullWidth>
          <InputLabel>Estado</InputLabel>
          <Select
            value={form.estado_id}
            label="Estado"
            onChange={(e) => handleChange("estado_id", e.target.value)}
          >
            {statuses.map((o) => (
              <MenuItem key={o.id} value={o.id}>{o.nombre}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ width: { xs: "100%", md: "48%" } }}>
        <FormControl fullWidth>
          <InputLabel>Enfoque</InputLabel>
          <Select
            value={form.abordaje_id}
            label="Enfoque"
            onChange={(e) => handleChange("abordaje_id", e.target.value)}
          >
            {approaches.map((o) => (
              <MenuItem key={o.id} value={o.id}>{o.nombre}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Tipo Contenido / Rango Edad / Contexto */}
      <Box sx={{ width: { xs: "100%", md: "48%" } }}>
        <FormControl fullWidth>
          <InputLabel>Tipo de Contenido</InputLabel>
          <Select
            value={form.tipo_contenido_id}
            label="Tipo de Contenido"
            onChange={(e) => handleChange("tipo_contenido_id", e.target.value)}
          >
            {contentTypes.map((o) => (
              <MenuItem key={o.id} value={o.id}>{o.nombre}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ width: { xs: "100%", md: "48%" } }}>
        <FormControl fullWidth>
          <InputLabel>Rango Edad</InputLabel>
          <Select
            value={form.rango_edad_id}
            label="Rango Edad"
            onChange={(e) => handleChange("rango_edad_id", e.target.value)}
          >
            {ageRanges.map((o) => (
              <MenuItem key={o.id} value={o.id}>{o.nombre}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ width: { xs: "100%", md: "48%" } }}>
        <FormControl fullWidth>
          <InputLabel>Contexto</InputLabel>
          <Select
            value={form.contexto_id}
            label="Contexto"
            onChange={(e) => handleChange("contexto_id", e.target.value)}
          >
            {contexts.map((o) => (
              <MenuItem key={o.id} value={o.id}>{o.nombre}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Tags / Categorías / Centros */}
      <Box sx={{ width: { xs: "100%", md: "48%" } }}>
        <Autocomplete
          multiple
          freeSolo
          options={tagsData.map((t) => t.nombre)}
          value={form.tags}
          onChange={(e, newValue) => handleChange("tags", newValue)}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => <Chip label={option} {...getTagProps({ index })} />)
          }
          renderInput={(params) => <TextField {...params} label="Tags" />}
        />
      </Box>
      <Box sx={{ width: { xs: "100%", md: "48%" } }}>
        {renderMultiSelect("Categorías", "categorias", categories)}
      </Box>
      <Box sx={{ width: { xs: "100%", md: "48%" } }}>
        {renderMultiSelect("Centros", "centros", centers)}
      </Box>

      {/* Estudiantes */}
      <Box sx={{ width: { xs: "100%", md: "48%" } }}>
        <Autocomplete
          multiple
          options={filteredStudents}
          disableCloseOnSelect
          getOptionLabel={(option) => `${option.nombre} ${option.primer_apellido} (${option.alias})`}
          value={filteredStudents.filter((s) => form.estudiantes.includes(s.id))}
          onChange={(e, newValue) =>
            handleChange("estudiantes", newValue.map((v) => v.id))
          }
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox checked={selected} sx={{ mr: 1 }} />
              {option.nombre} {option.primer_apellido}
            </li>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Estudiantes"
              helperText={!form.centros.length ? "Seleccione primero un centro educativo" : ""}
            />
          )}
        />
      </Box>

      {/* Trivias */}
      <Box sx={{ width: { xs: "100%", md: "48%" } }}>
        {renderMultiSelect("Trivias", "trivias", trivias)}
      </Box>

      {/* Descripción */}
      <Box sx={{ width: "100%", mt: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>Descripción</Typography>
        {editor && (
          <>
            {/* Toolbar */}
             <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          border: "1px solid #ddd",
          borderRadius: 2,
          p: 1,
          mb: 1,
          gap: 0.5,
          backgroundColor: "#fafafa"
        }}
      >
        <Tooltip title="Negrita">
          <IconButton
            size="small"
            color={editor.isActive("bold") ? "primary" : "default"}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <FormatBold />
          </IconButton>
        </Tooltip>

        <Tooltip title="Cursiva">
          <IconButton
            size="small"
            color={editor.isActive("italic") ? "primary" : "default"}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <FormatItalic />
          </IconButton>
        </Tooltip>

        <Tooltip title="Subrayado">
          <IconButton
            size="small"
            onClick={() => editor.chain().focus().toggleUnderline?.().run()}
          >
            <FormatUnderlined />
          </IconButton>
        </Tooltip>

        <Divider orientation="vertical" flexItem />

        <Tooltip title="Lista con viñetas">
          <IconButton
            size="small"
            color={editor.isActive("bulletList") ? "primary" : "default"}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <FormatListBulleted />
          </IconButton>
        </Tooltip>

        <Tooltip title="Lista numerada">
          <IconButton
            size="small"
            color={editor.isActive("orderedList") ? "primary" : "default"}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <FormatListNumbered />
          </IconButton>
        </Tooltip>

        <Divider orientation="vertical" flexItem />

        <Tooltip title="Cita">
          <IconButton
            size="small"
            color={editor.isActive("blockquote") ? "primary" : "default"}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            <FormatQuote />
          </IconButton>
        </Tooltip>

        <Tooltip title="Código">
          <IconButton
            size="small"
            color={editor.isActive("code") ? "primary" : "default"}
            onClick={() => editor.chain().focus().toggleCode().run()}
          >
            <Code />
          </IconButton>
        </Tooltip>

        <Divider orientation="vertical" flexItem />

        <Tooltip title="Deshacer">
          <IconButton
            size="small"
            onClick={() => editor.chain().focus().undo().run()}
          >
            <Undo />
          </IconButton>
        </Tooltip>

        <Tooltip title="Rehacer">
          <IconButton
            size="small"
            onClick={() => editor.chain().focus().redo().run()}
          >
            <Redo />
          </IconButton>
        </Tooltip>
      </Box>
            <Box sx={{ border: "1px solid #ccc", borderRadius: 2, p: 2, minHeight: 200, "& .ProseMirror": { outline: "none", minHeight: 180 } }}>
              <EditorContent editor={editor} />
            </Box>
          </>
        )}
      </Box>

      {/* Subir Archivos */}
      <Box sx={{ width: "100%" }}>
        <Box {...getRootProps()} sx={{
          border: "2px dashed #ccc",
          borderRadius: 2,
          p: 4,
          textAlign: "center",
          cursor: "pointer",
          backgroundColor: isDragActive ? "#f5f5f5" : "transparent",
          transition: "0.3s"
        }}>
          <input {...getInputProps()} />
          {isDragActive ? <p>Suelta los archivos aquí...</p> : (
            <p>
              Arrastra y suelta archivos aquí, o haz clic para seleccionar <br />
              <strong>Permitidos:</strong> PDF, JPG, PNG, DOC, DOCX <br />
              Máximo 5 archivos
            </p>
          )}
        </Box>
      </Box>

      {/* Preview archivos */}
      <Box sx={{ width: "100%", mt: 2 }}>
        {form.existingFiles.map((file, index) => (
  <Chip
    key={`existing-${file.id}`}
    label={file.nombre}
    onDelete={() =>
      handleChange(
        "existingFiles",
        form.existingFiles.filter(f => f.id !== file.id)
      )
    }
  />
))}

{form.newFiles.map((file, index) => (
  <Chip
    key={`new-${index}`}
    label={file.name}
    onDelete={() =>
      handleChange(
        "newFiles",
        form.newFiles.filter((_, i) => i !== index)
      )
    }
  />
))}
      </Box>

      {/* Botones */}
      <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
        <Button onClick={handleSubmit} variant="contained">Guardar Contenido</Button>
        <Button variant="outlined" onClick={() => navigate("/admin/contenidos/lista")}>Cancelar</Button>
      </Box>
    </Box>
  </Box>
);
};

export default ContentEdit;