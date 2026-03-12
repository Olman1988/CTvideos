import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQueries } from "@tanstack/react-query";
import Select from "react-select";
import axiosInstance from "@/api/axiosInstance";
import Swal from "sweetalert2";
import {
  setTitulo,
  setDescripcion,
  setCategoria,
  setCentro,
  setYoutubeUrl,
  setEtiquetas,
  setEstudiantes,
} from "@/store/videoUploadSlice";
import Autocomplete from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";

export default function UploadStep1({ goNext }) {
  const dispatch = useDispatch();
  const video = useSelector((state) => state.videoUpload);
 const [thumbnailUrl, setThumbnailUrl] = useState("");

  useEffect(() => {
    const url = video.youtubeUrl;
    if (!url) {
      setThumbnailUrl("");
      return;
    }

    // Expresiones regulares para obtener el ID de YouTube
    const regex =
      /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|embed)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/;
    const match = url.match(regex);
    if (match && match[1]) {
      const videoId = match[1];
      setThumbnailUrl(`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`);
    } else {
      setThumbnailUrl("");
    }
  }, [video.youtubeUrl]);
const fetchCatalog = (url) => axiosInstance.get(url).then((res) => res.data);
  const queries = useQueries({
    queries: [
      { queryKey: ["categories"], queryFn: () => fetchCatalog("/categories/active") },
      { queryKey: ["centers"], queryFn: () => fetchCatalog("/centers/active") },
      { queryKey: ["tags"], queryFn: () => fetchCatalog("/content-tags/active") },
      { queryKey: ["students"], queryFn: () => fetchCatalog("/students/active") },
    ],
  });
   const categoriesData = queries[0].data;
  const centersData = queries[1].data;
  const tagsData = queries[2].data;
  const studentsData = queries[3].data;

  // === Handlers ===
  const handleTags = (e) => {
    const tags = e.target.value.split(",").map((t) => t.trim());
    dispatch(setEtiquetas(tags));
  };

  const handleStudents = (selectedOptions) => {
    const selected = selectedOptions ? selectedOptions.map((s) => s.value) : [];
    dispatch(setEstudiantes(selected));
  };

  const handleSubmit = (e) => {
  e.preventDefault();

  // Validación con SweetAlert
  if (!video.titulo.trim()) {
    Swal.fire({
      icon: "warning",
      title: "Falta título",
      text: "Por favor, ingresa un título para el video.",
    });
    return;
  }

  if (!video.categoria) {
    Swal.fire({
      icon: "warning",
      title: "Falta categoría",
      text: "Por favor, selecciona una categoría.",
    });
    return;
  }

  if (!video.centro) {
    Swal.fire({
      icon: "warning",
      title: "Falta centro educativo",
      text: "Por favor, selecciona un centro educativo.",
    });
    return;
  }

  if (!video.estudiantes || video.estudiantes.length === 0) {
    Swal.fire({
      icon: "warning",
      title: "Falta estudiante",
      text: "Por favor, selecciona al menos un estudiante.",
    });
    return;
  }

  // Si todo está bien, avanzar al siguiente paso
  goNext();
};
                                  return (
                                  <div className="page-upload">
                                  <section className="profile-detail" aria-label="Detalle del perfil">
                                  <div className="profile-detail-inner">

                                  <div className="profile-main" aria-label="Contenido principal">

                                  <section className="upload-video upload-video-studio" aria-label="Formulario para subir video">

                                  <header className="upload-video-header upload-video-header-pro">

                                  <div className="upload-title-block">
                                  <p className="upload-kicker">Estudio de creacion</p>
                                  <h2>Comparte tu video</h2>
                                  <p>
                                  Publica tu historia con una presentacion clara,
                                  atractiva y facil de descubrir para otros jovenes.
                                  </p>
                                  </div>

                                  <div className="upload-status-badge" aria-label="Publicacion guiada">
                                  <i className="fa-solid fa-shield-heart"></i>
                                  <span>Publicacion guiada</span>
                                  </div>

                                  </header>


                                  <div className="upload-stepper" aria-label="Progreso de publicacion">

                                  <div className="upload-step is-active">
                                  <span className="upload-step-number">1</span>
                                  <div className="upload-step-text">
                                  <strong>Datos</strong>
                                  <small>Titulo, link y etiquetas</small>
                                  </div>
                                  </div>

                                  <div className="upload-step">
                                  <span className="upload-step-number">2</span>
                                  <div className="upload-step-text">
                                  <strong>Revisión</strong>
                                  <small>Vista previa y checklist</small>
                                  </div>
                                  </div>

                                  <div className="upload-step">
                                  <span className="upload-step-number">3</span>
                                  <div className="upload-step-text">
                                  <strong>Publicar</strong>
                                  <small>Listo para compartir</small>
                                  </div>
                                  </div>

                                  </div>



                                  <div className="upload-studio-grid">


                                  <div className="upload-card">

                                  <form className="upload-form" onSubmit={handleSubmit}>

                                  <section className="upload-form-section" aria-labelledby="upload-info-title">

                                  <div className="upload-section-head">
                                  <h3 id="upload-info-title">Informacion del video</h3>
                                  <p>
                                  Estos datos ayudan a que tu video se entienda rapido
                                  y se vea profesional.
                                  </p>
                                  </div>

                                  <div className="upload-grid">


                                  <div className="upload-field upload-field-modern">
                                  <div className="upload-modern">

                                  <label className="upload-modern-label" htmlFor="upload-title">
                                  <i className="fa-solid fa-pen-to-square"></i>
                                  <span>Titulo del video</span>
                                  </label>

                                  <input
                                  className="upload-modern-input"
                                  id="upload-title"
                                  type="text"
                                  value={video.titulo}
                                  onChange={(e) => dispatch(setTitulo(e.target.value))}
                                  placeholder="Ej: Voces de mi comunidad"
                                  />

                                  <div className="upload-modern-meta">
                                  <span>
                                  Un titulo corto y claro ayuda a que mas personas lo encuentren.
                                  </span>
                                  <span className="upload-modern-chip">Max 80 caracteres</span>
                                  </div>

                                  </div>
                                  </div>


                                  <div className="upload-field upload-field-modern">
                                  <div className="upload-modern">

                                  <label className="upload-modern-label" htmlFor="upload-link">
                                  <i className="fa-solid fa-link"></i>
                                  <span>Link del video</span>
                                  </label>

                                  <input
                                  className="upload-modern-input"
                                  id="upload-link"
                                  type="url"
                                  value={video.youtubeUrl}
                                  onChange={(e) => dispatch(setYoutubeUrl(e.target.value))}
                                  placeholder="https://youtube.com/..."
                                  />

                                  <div className="upload-modern-meta">
                                  <span>Acepta YouTube, Vimeo o Drive publico.</span>
                                  <span className="upload-modern-chip">Opcional</span>
                                  </div>

                                  </div>
                                  </div>


                                  <div className="upload-field upload-field-modern">
                                  <div className="upload-modern">

                                  <label className="upload-modern-label" htmlFor="upload-category">
                                  <i className="fa-solid fa-folder-open"></i>
                                  <span>Categoria</span>
                                  </label>

                                  {/* Categorías */}
     <Select
  options={categoriesData?.map((cat) => ({ value: cat.id, label: cat.nombre }))}
  value={categoriesData
    ?.filter((cat) => cat.id === video.categoria)
    .map((cat) => ({ value: cat.id, label: cat.nombre }))}
  onChange={(selectedOption) => {
    dispatch(setCategoria(selectedOption?.value || ""));
  }}
  placeholder="Selecciona una categoría..."
  isClearable
/>

                                  <div className="upload-modern-meta">
                                  <span>Elige el tema principal de tu video.</span>
                                  <span className="upload-modern-chip">Obligatorio</span>
                                  </div>

                                  </div>
                                  </div>


                                  <div className="upload-field upload-field-modern">
                                  <div className="upload-modern">

                                  <label className="upload-modern-label" htmlFor="upload-school">
                                  <i className="fa-solid fa-school"></i>
                                  <span>Centro educativo</span>
                                  </label>

                                  {/* Centros */}
      <Select
  options={centersData?.map((c) => ({ value: c.id, label: c.nombre }))}
  value={centersData
    ?.filter((c) => c.id === video.centro)
    .map((c) => ({ value: c.id, label: c.nombre }))}
  onChange={(selectedOption) => {
    dispatch(setCentro(selectedOption?.value || ""));
  }}
  placeholder="Selecciona un centro educativo..."
  isClearable
/>
                    {/* === Estudiantes (multi-select) === */}
                  <div className="upload-field upload-field-modern">
                    <label className="upload-modern-label" htmlFor="upload-school">
                                  <i className="fa-solid fa-school"></i>
                                  <span>Estudiantes</span>
                                  </label>
                    <Autocomplete
  multiple
  options={studentsData || []}
  disableCloseOnSelect

  getOptionLabel={(option) => option.nombre}

  value={
    studentsData?.filter((s) =>
      video.estudiantes?.includes(s.id)
    ) || []
  }

  onChange={(event, newValue) => {
    const ids = newValue.map((v) => v.id);
    dispatch(setEstudiantes(ids));
  }}

  renderOption={(props, option, { selected }) => (
    <li {...props}>
      <Checkbox
        checked={selected}
        style={{ marginRight: 8 }}
      />
      {option.nombre}
    </li>
  )}

  renderInput={(params) => (
    <TextField
      {...params}
      label="Estudiantes"
      placeholder="Selecciona estudiantes"
    />
  )}
/>


                  </div>

                                  <div className="upload-modern-meta">
                                  <span>Ayuda a organizar publicaciones por institucion.</span>
                                  <span className="upload-modern-chip">Obligatorio</span>
                                  </div>

                                  </div>
                                  </div>

                                  </div>
                                  </section>



                                  <section className="upload-form-section" aria-labelledby="upload-desc-title">

                                  <div className="upload-section-head">
                                  <h3 id="upload-desc-title">Cuenta tu historia</h3>
                                  <p>
                                  Describe de que trata tu video, quienes participan
                                  y que mensaje quieres compartir.
                                  </p>
                                  </div>

                                  <div className="upload-field upload-field-modern">
                                  <div className="upload-modern">

                                  <label className="upload-modern-label" htmlFor="upload-desc">
                                  <i className="fa-solid fa-align-left"></i>
                                  <span>Descripcion</span>
                                  </label>

                                  <textarea
                                  className="upload-modern-textarea"
                                  id="upload-desc"
                                  rows="5"
                                  value={video.descripcion}
                                  onChange={(e) => dispatch(setDescripcion(e.target.value))}
                                  placeholder="Cuenta de que trata tu video"
                                  />

                                  <div className="upload-modern-meta">
                                  <span>Incluye contexto, protagonistas y objetivo del video.</span>
                                  <span className="upload-modern-chip">Recomendado</span>
                                  </div>

                                  </div>
                                  </div>

                                  </section>



                                  <section className="upload-form-section" aria-labelledby="upload-tags-title">

                                  <div className="upload-section-head">
                                  <h3 id="upload-tags-title">Etiquetas y descubrimiento</h3>
                                  <p>
                                  Las etiquetas correctas ayudan a que otros jovenes
                                  encuentren temas parecidos.
                                  </p>
                                  </div>

                                 <div className="upload-field upload-field-modern">
  <div className="upload-modern">

    <label className="upload-modern-label" htmlFor="upload-tags">
      <i className="fa-solid fa-hashtag"></i>
      <span>Etiquetas</span>
    </label>

    <Select
      id="upload-tags"
      isMulti
      // Convertimos las etiquetas seleccionadas en formato {value,label}
      value={video.etiquetas.map(tag => ({ value: tag, label: tag }))}
      // Opciones cargadas desde la base de datos
      options={tagsData?.map(tag => ({ value: tag.nombre, label: tag.nombre }))}
      onChange={(selectedOptions) => {
        const tags = selectedOptions ? selectedOptions.map(o => o.value) : [];
        dispatch(setEtiquetas(tags));
      }}
      
      placeholder="Escribe o selecciona etiquetas..."
      classNamePrefix="upload-tag-select"
      styles={{
        multiValue: (base) => ({
          ...base,
          backgroundColor: "#f0f0f0",
          borderRadius: "20px",
          padding: "2px 8px",
        }),
        multiValueLabel: (base) => ({
          ...base,
          color: "#333",
          fontSize: "0.85rem",
        }),
        multiValueRemove: (base) => ({
          ...base,
          color: "#888",
          ':hover': { backgroundColor: "#ccc", color: "#000" },
        }),
        control: (base) => ({
          ...base,
          minHeight: "40px",
          borderRadius: "10px",
          borderColor: "#ddd",
          boxShadow: "none",
        }),
        placeholder: (base) => ({ ...base, color: "#aaa" }),
      }}
    />
    {/* Botones predefinidos para agregar tags */}
    <div className="upload-tags">
  {tagsData?.map((tag) => (
    <button
      key={tag.id}
      className={`upload-tag ${video.etiquetas.includes(tag.nombre) ? "selected" : ""}`}
      type="button"
      onClick={() => {
        const newTags = video.etiquetas.includes(tag.nombre)
          ? video.etiquetas.filter(t => t !== tag.nombre) // quitar si ya estaba
          : [...video.etiquetas, tag.nombre]; // agregar si no estaba
        dispatch(setEtiquetas(newTags));
      }}
    >
      {tag.nombre}
    </button>
  ))}
</div>

    <div className="upload-modern-meta">
      <span>Escribe o selecciona hasta 6 etiquetas para mejorar el alcance.</span>
    </div>

  </div>
</div>

                                  </section>



                                  <div className="upload-actions">

                                  <button className="register-submit" type="submit">
                                  <i className="fa-solid fa-arrow-right"></i>
                                  <span>Continuar a revisión</span>
                                  </button>

                                  <button className="upload-secondary" type="button">
                                  <i className="fa-regular fa-floppy-disk"></i>
                                  <span>Guardar borrador</span>
                                  </button>

                                  </div>

                                  </form>
                                  </div>



                                  <div className="upload-side-panel" aria-label="Vista previa y ayuda">

                                  <section className="upload-preview-panel">

                                  <div className="upload-preview-header">
                                  <div>
                                  <p className="upload-preview-kicker">Vista previa</p>
                                  <h3>Asi se vera tu publicacion</h3>
                                  </div>

                                  <span className="upload-preview-pill">
                                  Modo creador
                                  </span>
                                  </div>

                                  <div className="upload-preview-card">

                                  <div className="upload-preview-thumb">
      <div className="upload-preview-play" style={{
    position: "absolute",
  }}>
        <i className="fa-solid fa-play"></i>
      </div>
      {thumbnailUrl ? (
        <img
          src={thumbnailUrl}
          alt="Miniatura del video"
          style={{ width: "100%", borderRadius: "8px" }}
        />
      ) : (
        <p>Pega un link para cargar una miniatura</p>
      )}
    </div>

                                  <div className="upload-preview-body">
                                  <h4>Tu historia aparecera aqui</h4>
                                  <p>
                                  Usa un titulo claro y una descripcion breve
                                  para que otros jovenes entiendan tu video en segundos.
                                  </p>

                                  <div className="upload-preview-tags">
                                  <span>#comunidad</span>
                                  <span>#cultura</span>
                                  <span>#juventud</span>
                                  </div>

                                  </div>

                                  </div>

                                  </section>


                                  <section className="upload-guide-card">

                                  <header className="upload-guide-header">
                                  <h3>Checklist rapido</h3>
                                  <span>Antes de publicar</span>
                                  </header>

                                  <ul className="upload-checklist">
                                  <li><i className="fa-solid fa-circle-check"></i> El titulo explica de que trata el video.</li>
                                  <li><i className="fa-solid fa-circle-check"></i> La descripcion cuenta el contexto y objetivo.</li>
                                  <li><i className="fa-solid fa-circle-check"></i> Las etiquetas ayudan a descubrir tu contenido.</li>
                                  <li><i className="fa-solid fa-circle-check"></i> El link es publico y funciona correctamente.</li>
                                  </ul>

                                  </section>


                                  <section className="upload-guide-card upload-guide-card-accent">

                                  <div className="upload-tip-icon">
                                  <i className="fa-solid fa-lightbulb"></i>
                                  </div>

                                  <div>
                                  <h3>Tip para creadores</h3>
                                  <p>
                                  Los videos con un titulo especifico, una descripcion corta
                                  y 3 a 5 etiquetas suelen generar mas vistas y comentarios.
                                  </p>
                                  </div>

                                  </section>

                                  </div>

                                  </div>
                                  </section>
                                  </div>
                                  </div>
                                  </section>
                                  </div>
                                  )

                                  }