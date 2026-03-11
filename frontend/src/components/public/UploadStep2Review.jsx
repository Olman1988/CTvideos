import { useDispatch, useSelector } from "react-redux";
import { setVisibilidad } from "@/store/videoUploadSlice";

export default function UploadStep2Review({ goNext, goBack }) {

const dispatch = useDispatch();
const video = useSelector((state) => state.videoUpload);

const handleVisibilidad = (value) => {
  dispatch(setVisibilidad(value));
};

return (

<div className="page-upload">

<section className="profile-detail" aria-label="Revisión del video">
<div className="profile-detail-inner">
<div className="profile-main">

<section className="upload-video upload-video-studio">

<header className="upload-video-header upload-video-header-pro">

<div className="upload-title-block">
<p className="upload-kicker">Paso 2 de 3</p>
<h2>Revisa tu publicacion</h2>
<p>Confirma que los datos estén listos antes de pasar al paso final.</p>
</div>

<div className="upload-status-badge">
<i className="fa-solid fa-eye"></i>
<span>Revisión activa</span>
</div>

</header>


<div className="upload-stepper">

<div className="upload-step is-complete">
<span className="upload-step-number">
<i className="fa-solid fa-check"></i>
</span>

<div className="upload-step-text">
<strong>Datos</strong>
<small>Titulo, link y etiquetas</small>
</div>
</div>

<div className="upload-step is-active">
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


{/* PANEL IZQUIERDO */}

<div className="upload-card">

<div className="upload-form upload-review-flow">

<section className="upload-form-section">

<div className="upload-section-head">
<h3>Resumen del video</h3>
<p>Verifica que la informacion principal este clara.</p>
</div>

<div className="review-summary-list">

<div className="review-summary-item">
<span className="review-summary-label">Titulo</span>
<p>{video.titulo || "Sin titulo"}</p>
</div>

<div className="review-summary-item">
<span className="review-summary-label">Categoria</span>
<p>{video.categoria || "-"}</p>
</div>

<div className="review-summary-item">
<span className="review-summary-label">Centro educativo</span>
<p>{video.centro || "-"}</p>
</div>

<div className="review-summary-item review-summary-item-wide">
<span className="review-summary-label">Link</span>
<p>{video.youtubeUrl || "-"}</p>
</div>

<div className="review-summary-item review-summary-item-wide">
<span className="review-summary-label">Descripcion</span>
<p>{video.descripcion || "-"}</p>
</div>

<div className="review-summary-item review-summary-item-wide">

<span className="review-summary-label">Etiquetas</span>

<div className="review-tag-list">

{video.etiquetas?.map((tag,i)=>(
<span key={i}>{tag}</span>
))}

</div>

</div>

</div>

</section>


{/* VISIBILIDAD */}

<section className="upload-form-section">

<div className="upload-section-head">
<h3>Visibilidad</h3>
<p>Elige quién podrá ver el video.</p>
</div>

<div className="review-option-grid">

<button
type="button"
className={`review-option-card ${video.visibilidad==="publico" ? "is-selected":""}`}
aria-pressed={video.visibilidad==="publico"}
onClick={()=>handleVisibilidad("publico")}
>

<span className="review-option-icon">
<i className="fa-solid fa-earth-americas"></i>
</span>

<span className="review-option-text">
<strong>Publico</strong>
<small>Visible para toda la comunidad</small>
</span>

</button>


<button
type="button"
className={`review-option-card ${video.visibilidad==="estudiantes" ? "is-selected":""}`}
aria-pressed={video.visibilidad==="estudiantes"}
onClick={()=>handleVisibilidad("estudiantes")}
>

<span className="review-option-icon">
<i className="fa-solid fa-users"></i>
</span>

<span className="review-option-text">
<strong>Solo estudiantes</strong>
<small>Visible para usuarios registrados</small>
</span>

</button>

</div>

</section>



<div className="upload-actions upload-review-actions">

<button
className="upload-secondary"
onClick={goBack}
>
<i className="fa-solid fa-pen"></i>
<span>Volver a editar</span>
</button>

<button
className="register-submit"
onClick={goNext}
>
<i className="fa-solid fa-arrow-right"></i>
<span>Continuar a publicar</span>
</button>

</div>

</div>
</div>



{/* PANEL DERECHO */}

<div className="upload-side-panel">

<section className="upload-preview-panel">

<div className="upload-preview-header">
<div>
<p className="upload-preview-kicker">Vista previa</p>
<h3>Asi se vera tu publicacion</h3>
</div>

<span className="upload-preview-pill">
Revisión
</span>

</div>


<div className="upload-preview-card">

<div className="upload-preview-thumb">

<div className="upload-preview-play">
<i className="fa-solid fa-play"></i>
</div>

<p>Miniatura del video</p>

</div>

<div className="upload-preview-body">

<h4>{video.titulo || "Titulo del video"}</h4>

<p>
{video.descripcion || "Descripcion del video"}
</p>

<div className="upload-preview-tags">

{video.etiquetas?.slice(0,3).map((tag,i)=>(
<span key={i}>#{tag}</span>
))}

</div>

</div>

</div>

</section>



<section className="upload-guide-card">

<header className="upload-guide-header">
<h3>Resumen rapido</h3>
<span>Listo</span>
</header>

<div className="review-stat-grid">

<div className="review-stat-box">
<small>Categoria</small>
<strong>{video.categoria || "-"}</strong>
</div>

<div className="review-stat-box">
<small>Centro</small>
<strong>{video.centro || "-"}</strong>
</div>

<div className="review-stat-box">
<small>Etiquetas</small>
<strong>{video.etiquetas?.length || 0}</strong>
</div>

<div className="review-stat-box">
<small>Visibilidad</small>
<strong>{video.visibilidad || "publico"}</strong>
</div>

</div>

</section>

</div>

</div>

</section>
</div>
</div>
</section>

</div>

);
}