import { useDispatch, useSelector } from "react-redux";
import {
  setTitulo,
  setDescripcion,
  setCategoria,
  setCentro,
  setYoutubeUrl,
  setEtiquetas
} from "@/store/videoUploadSlice";

export default function UploadStep1({ goNext }) {

  const dispatch = useDispatch();
  const video = useSelector((state) => state.videoUpload);

  const handleTags = (e) => {
    const tags = e.target.value.split(",").map(t => t.trim());
    dispatch(setEtiquetas(tags));
  };
  const handleSubmit = (e) => {
  e.preventDefault();
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

<select
className="upload-modern-input upload-modern-select"
id="upload-category"
value={video.categoria}
onChange={(e) => dispatch(setCategoria(e.target.value))}
>

<option value="" disabled>Selecciona una categoria</option>
<option value="cultura">Cultura</option>
<option value="comunidad">Comunidad</option>
<option value="arte">Arte</option>
<option value="educacion">Educacion</option>
<option value="medio-ambiente">Medio ambiente</option>
<option value="tecnologia">Tecnologia</option>

</select>

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

<select
className="upload-modern-input upload-modern-select"
id="upload-school"
value={video.centro}
onChange={(e) => dispatch(setCentro(e.target.value))}
>

<option value="" disabled>Selecciona un centro educativo</option>
<option value="cetav">CETAV</option>
<option value="escuela-primaria">Escuela primaria</option>
<option value="colegio-secundaria">Colegio / secundaria</option>
<option value="tecnico">Centro tecnico</option>
<option value="universidad">Universidad</option>
<option value="otro">Otro centro educativo</option>

</select>

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

<input
className="upload-modern-input"
id="upload-tags"
type="text"
defaultValue={video.etiquetas.join(",")}
onBlur={handleTags}
placeholder="comunidad, entrevista, cultura"
/>

<div className="upload-modern-meta">
<span>Separa con comas para mejorar el alcance.</span>
<span className="upload-modern-chip">Hasta 6</span>
</div>

<div className="upload-tags">
<button className="upload-tag" type="button">Cultura</button>
<button className="upload-tag" type="button">Comunidad</button>
<button className="upload-tag" type="button">Historia</button>
<button className="upload-tag" type="button">Juventud</button>
<button className="upload-tag" type="button">Arte</button>
<button className="upload-tag" type="button">Aprendizaje</button>
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
<div className="upload-preview-play">
<i className="fa-solid fa-play"></i>
</div>
<p>Pega un link para cargar una miniatura</p>
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