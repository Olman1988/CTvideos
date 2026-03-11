import { useSelector } from "react-redux";

export default function UploadStep3Publish({ goBack, publish }) {

const video = useSelector((state) => state.videoUpload);

return (
<div className="page-upload">
<section className="profile-detail" aria-label="Paso final de publicacion">

<div className="profile-detail-inner">
<div className="profile-main">

<section className="upload-video upload-video-studio">

<header className="upload-video-header upload-video-header-pro">

<div className="upload-title-block">
<p className="upload-kicker">Paso 3 de 3</p>
<h2>Listo para compartir</h2>
<p>Haz una ultima confirmacion y publica tu video.</p>
</div>

<div className="upload-status-badge">
<i className="fa-solid fa-rocket"></i>
<span>Paso final</span>
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

<div className="upload-step is-complete">
<span className="upload-step-number">
<i className="fa-solid fa-check"></i>
</span>

<div className="upload-step-text">
<strong>Revisión</strong>
<small>Vista previa y checklist</small>
</div>
</div>

<div className="upload-step is-active">
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

<div className="upload-form upload-publish-flow">

<section className="upload-form-section upload-publish-highlight">

<div className="upload-section-head">
<h3>Tu video esta listo</h3>
<p>Todo esta preparado para publicarse.</p>
</div>


<div className="publish-highlight-body">

<div className="publish-highlight-icon">
<i className="fa-solid fa-circle-check"></i>
</div>

<div>

<strong>{video.titulo || "Sin titulo"}</strong>

<p>
Categoria: {video.categoria || "-"} · 
Centro: {video.centro || "-"} · 
Visibilidad: {video.visibilidad || "publico"}
</p>

</div>

</div>

</section>



<section className="upload-form-section">

<div className="upload-section-head">
<h3>Opciones de publicacion</h3>
<p>Define como quieres compartir tu contenido.</p>
</div>


<div className="publish-setting-list">

<div className="publish-setting-item">
<div>
<strong>Notificar a mi centro educativo</strong>
<p>Enviar notificación a estudiantes.</p>
</div>

<button className="publish-toggle is-on" type="button">
<span></span>
</button>

</div>


<div className="publish-setting-item">
<div>
<strong>Permitir comentarios</strong>
<p>La comunidad podrá comentar.</p>
</div>

<button className="publish-toggle is-on" type="button">
<span></span>
</button>

</div>


<div className="publish-setting-item">
<div>
<strong>Destacar en perfil</strong>
<p>Mostrar como contenido destacado.</p>
</div>

<button className="publish-toggle" type="button">
<span></span>
</button>

</div>

</div>

</section>
<section className="upload-form-section" aria-labelledby="publish-next-title">
  <div className="upload-section-head">
    <h3 id="publish-next-title">Despues de publicar</h3>
    <p>Acciones rapidas para compartir tu trabajo con mas personas.</p>
  </div>

  <div className="publish-next-grid">
    <div className="publish-next-card">
      <i className="fa-solid fa-share-nodes" aria-hidden="true"></i>
      <strong>Compartir</strong>
      <p>Comparte el link en tus redes o grupos.</p>
    </div>

    <div className="publish-next-card">
      <i className="fa-solid fa-comments" aria-hidden="true"></i>
      <strong>Recibir comentarios</strong>
      <p>Lee opiniones y responde a tu comunidad.</p>
    </div>

    <div className="publish-next-card">
      <i className="fa-solid fa-chart-line" aria-hidden="true"></i>
      <strong>Ver rendimiento</strong>
      <p>Revisa vistas, reacciones y favoritos.</p>
    </div>
  </div>
</section>


<div className="upload-actions upload-review-actions">

<button
className="upload-secondary"
onClick={goBack}
>

<i className="fa-solid fa-arrow-left"></i>
<span>Volver a revisión</span>

</button>


<button
className="register-submit"
onClick={publish}
>

<i className="fa-solid fa-paper-plane"></i>
<span>Publicar ahora</span>

</button>

</div>


</div>
</div>



{/* PANEL DERECHO */}

<div className="upload-side-panel">

<section className="upload-preview-panel">

<div className="upload-preview-header">

<div>
<p className="upload-preview-kicker">Vista final</p>
<h3>Asi se vera en la galeria</h3>
</div>

<span className="upload-preview-pill">
Publicar
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
<h3>Checklist de publicacion</h3>
<span>OK</span>
</header>

<ul className="review-check-list">

<li className="is-ok">
<i className="fa-solid fa-circle-check"></i>
Datos completos y revisados.
</li>

<li className="is-ok">
<i className="fa-solid fa-circle-check"></i>
Visibilidad configurada.
</li>

<li className="is-ok">
<i className="fa-solid fa-circle-check"></i>
Comentarios habilitados.
</li>

<li className="is-ok">
<i className="fa-solid fa-circle-check"></i>
Todo listo para publicar.
</li>

</ul>

</section>
<section className="upload-guide-card upload-guide-card-accent" aria-label="Atajo despues de publicar">
  <div className="upload-tip-icon" aria-hidden="true">
    <i className="fa-solid fa-bullseye"></i>
  </div>

  <div>
    <h3>Siguiente paso</h3>
    <p>
      Despues de publicar, comparte el video con tu grupo o centro para recibir
      mas vistas y comentarios.
    </p>

    <div className="publish-side-links">
      <a href="lista-videos.html">Ir a lista de videos</a>
      <a href="perfil.html">Ir a mi perfil</a>
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