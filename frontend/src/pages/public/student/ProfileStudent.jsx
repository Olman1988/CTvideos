import { Link } from "react-router-dom";
import { URL_IMG } from "@/config/config";
import { API_URL_IMG } from "@/config/config";
import Hero from "@/components/public/Hero"; 
import axiosInstance from "@/api/axiosInstance";
import { useQueries } from "@tanstack/react-query";
import Loader from "@/components/ui/Loader";
import { useState, useEffect } from "react";

export default function ProfileStudent({ user }) {
  // Nota: En un caso real, estos datos vendrían del localStorage o una API
const estudiante = user?.perfiles?.estudiante ?? {};
const [selectedAvatar, setSelectedAvatar] = useState(null);
const [selectedFrame, setSelectedFrame] = useState(null);

const uuid = estudiante?.uuid;
console.log(user);
const fetchCatalog = async (endpoint) => {
  const { data } = await axiosInstance.get(endpoint);
  return data;
};

const results = useQueries({
  queries: [
    {
      queryKey: ["profile", uuid, "videos"],
      queryFn: () => fetchCatalog(`/profiles/${uuid}/videos`),
      enabled: !!uuid,
    },
    {
      queryKey: ["profile", uuid, "badges"],
      queryFn: () => fetchCatalog(`/profiles/${uuid}/badges`),
      enabled: !!uuid,
    },
    {
      queryKey: ["catalog", uuid,"avatars"],
      queryFn: () => fetchCatalog(`/profiles/${uuid}/avatars`),
    },
    {
      queryKey: ["catalog",uuid, "frames"],
      queryFn: () => fetchCatalog(`/profiles/${uuid}/frames`),
    },
  ], 
});
const updateAvatar = async (avatar_uuid) => {
  try {
    setSelectedAvatar(avatar_uuid);

    await axiosInstance.post(`/profiles/${uuid}/avatar`, {
      avatar_uuid
    });

  } catch (err) {
    console.error(err);
  }
};
const updateFrame = async (frame_uuid) => {
  try {
    setSelectedFrame(frame_uuid);

    await axiosInstance.post(`/profiles/${uuid}/frame`, {
      frame_uuid
    });

  } catch (err) {
    console.error(err);
  }
};
useEffect(() => {
  if (estudiante?.avatar?.uuid) {
    setSelectedAvatar(estudiante.avatar.uuid);
  }

  if (estudiante?.marco?.uuid) {
    setSelectedFrame(estudiante.marco.uuid);
  }
}, [estudiante]);
// separar resultados
const [videosQuery, badgesQuery, avatarsQuery, framesQuery] = results;

// datos finales
const videos = videosQuery.data ?? [];
const badges = badgesQuery.data ?? [];
const avatars = avatarsQuery.data ?? [];
const frames = framesQuery.data ?? [];

// estados
const isLoading =
  videosQuery.isLoading ||
  badgesQuery.isLoading ||
  avatarsQuery.isLoading ||
  framesQuery.isLoading;

console.log({
  estudiante,
  videos,
  badges,
  avatars,
  frames
});
const currentAvatar =
  avatars.find((a) => a.uuid === selectedAvatar) || estudiante?.avatar;

const currentFrame =
  frames.find((f) => f.uuid === selectedFrame) || estudiante?.marco;
if (isLoading) {
  return <Loader text="Cargando perfil..." />;
}
    return (
        <>
        <Hero title={estudiante.alias!=''?estudiante.alias:user.nombre}/>
        <section className="profile-detail" aria-label="Detalle del perfil">
            <div className="profile-detail-inner">
            
            {/* SIDEBAR */}
            <aside className="profile-sidebar" aria-label="Resumen del perfil">
                <article className="profile-summary"> 
                <div className="profile-summary-cover">
                    <img 
                    className="profile-summary-cover-image" 
                    src={
  currentFrame?.imagen
    ? `${API_URL_IMG}${currentFrame.imagen}`
    : `${URL_IMG}images/slider/img1.jpg`
}
                    alt="Patron morado" 
                    />
                    <div className="profile-summary-avatar">
                    <img
    src={
  currentAvatar?.imagen
    ? `${API_URL_IMG}${currentAvatar.imagen}`
    : `${URL_IMG}images/assets/avatar.png`
}
    />
                    </div>
                </div>
                
                <div className="profile-summary-body">
                    <h2 className="profile-summary-name">{user.nombre || "Usuario"}</h2>
                    <p className="profile-summary-desc">{user.email}</p>
                    <p className="profile-summary-intro">
                    Estudiante de CETAV con interés en producción audiovisual y creación de contenido.
                    </p>
                    
                    <div className="profile-summary-stats">
                    <div className="profile-stat">
                        <span className="profile-stat-value">10</span>
                        <span className="profile-stat-label">Videos</span>
                    </div>
                    <div className="profile-stat">
                        <span className="profile-stat-value">3</span>
                        <span className="profile-stat-label">Listas</span>
                    </div>
                    <div className="profile-stat">
                        <span className="profile-stat-value">15</span>
                        <span className="profile-stat-label">Favs</span>
                    </div>
                    </div>

                    
                    {/* PROMEDIO DE INTERACCIÓN */}
                        <div className="profile-summary-average">
                        <p className="profile-summary-average-title">Promedio de Interacción</p>
                        <div className="profile-summary-average-score">
                            <span>8.5</span>
                            <small>Total</small>
                        </div>
                        </div>

                        {/* MÉTRICAS DETALLADAS */}
                        <div className="profile-summary-metrics">
                        <div className="profile-metric">
                            <span className="profile-metric-value">5</span>
                            <span className="profile-metric-label">Trivias</span>
                        </div>
                        <div className="profile-metric">
                            <span className="profile-metric-value">9</span>
                            <span className="profile-metric-label">Reacciones</span>
                        </div>
                        <div className="profile-metric">
                            <span className="profile-metric-value">8.5</span>
                            <span className="profile-metric-label">Comentarios</span>
                        </div>
                        </div>

                    <button className="profile-summary-action" type="button">Editar Perfil</button>
                </div>
                </article>

                {/* SECCIÓN AMIGOS */}
                <section className="profile-friends" aria-label="Amigos">
                <header className="profile-friends-header">
                    <h2>Amigos</h2>
                </header>
                <div className="profile-videos-divider" aria-hidden="true"></div>
                <div className="profile-friends-list">
                    {[1, 2, 3].map((item) => (
                    <article className="profile-friend-card" key={item}>
                        <img className="profile-friend-avatar" src={`${URL_IMG}images/assets/avatar.png`} alt="Avatar amigo" />
                        <div className="profile-friend-info">
                        <h3>Amigo {item}</h3>
                        <p>Estudiante Audiovisual</p>
                        </div>
                        <button className="profile-friend-action" type="button" aria-label="Ver perfil">
                        <i className="fa-solid fa-user" aria-hidden="true"></i>
                        </button>
                    </article>
                    ))}
                </div>
                </section>
                {/* INVITAR AMIGOS */}
                <section className="profile-invite" aria-label="Invitar amigos">
                <header className="profile-invite-header">
                    <h2>Invitar amigos</h2>
                </header>
                
                <div className="profile-videos-divider" aria-hidden="true"></div>
                
                <div className="profile-invite-body">
                    <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                    Cras aliquet iaculis luctus.
                    </p>
                    
                    <label className="profile-invite-label" htmlFor="invite-code">
                    Código de invitación
                    </label>
                    
                    <input 
                    className="profile-invite-input" 
                    id="invite-code" 
                    type="text" 
                    placeholder="Introduce el código aquí..." 
                    />
                    
                    <button className="profile-invite-button" type="button">
                    Enviar Invitación
                    </button>
                </div>
                </section>
            </aside>

            {/* CONTENIDO PRINCIPAL */}
            <div className="profile-main" aria-label="Contenido principal">
                
                {/* MIS VIDEOS */}
                <section className="profile-videos" aria-label="Mis videos">
                <header className="profile-videos-header">
                    <h2>Mis videos</h2>
                </header>
                <div className="profile-videos-divider" aria-hidden="true"></div>
                <div className="profile-carousel">
{videos.length > 0 ? videos.map((video) => (
    <article className="profile-video-card" key={video.uuid}>
        <div className="profile-video-thumb">
            <img 
                src={
                    video.imagen
                    ? `${API_URL_IMG}${video.imagen}`
                    : `${URL_IMG}images/slider/img1.jpg`
                } 
                alt="Miniatura" 
            />
            <span className="profile-video-avatar">
                <img 
                    src={
                        estudiante?.avatar?.imagen
                        ? `${API_URL_IMG}${estudiante.avatar.imagen}`
                        : `${URL_IMG}images/assets/avatar.png`
                    } 
                    alt="Avatar" 
                />
            </span>
        </div>
        <h3>{video.titulo}</h3>
        <span className="profile-video-pill">{video.categoria || "Categoría"}</span>
    </article>
)) : (
    <p>No hay videos todavía</p>
)}
</div>
                <div className="profile-videos-link">
                    <Link to="/subir-video">Subir video</Link>
                </div>
                </section>
                {/* MIS LISTAS */}
                <section className="profile-lists" aria-label="Mis listas">
                <header className="profile-lists-header">
                    <h2>Mis listas</h2>
                    <Link className="profile-lists-link" to="/mis-listas">Ver todos</Link>
                </header>
                
                <div className="profile-videos-divider" aria-hidden="true"></div>
                
                <div className="profile-list-carousel" aria-label="Carrusel de listas">
                    {/* Renderizamos 3 listas de ejemplo */}
                    {[1, 2, 3].map((lista) => (
                    <article className="profile-list-card" key={lista}>
                        <div className="profile-list-thumb">
                        <img 
                            src={`${URL_IMG}images/slider/img1.jpg`} 
                            alt="Miniatura de lista" 
                        />
                        <span className="profile-list-avatar">
                            <img src={`${URL_IMG}images/assets/avatar.png`} alt="Avatar" />
                        </span>
                        </div>
                    </article>
                    ))}

                    {/* BOTÓN PARA AGREGAR LISTA (is-add) */}
                    <article className="profile-list-card is-add">
                    <button 
                        className="profile-list-thumb is-add" 
                        onClick={() => console.log("Crear nueva lista")}
                        type="button"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', width: '100%', height: '100%' }}
                    >
                        <span className="profile-list-plus">+</span>
                    </button>
                    </article>
                </div>
                </section>
                {/* MIS INSIGNIAS */}
                <section className="profile-badges" aria-label="Mis insignias">
                <header className="profile-badges-header">
                    <h2>Mis insignias</h2>
                </header>
                <div className="profile-videos-divider" aria-hidden="true"></div>
                <div className="profile-badges-grid">
{badges.length > 0 ? badges.map((badge) => (
    <article className="profile-badge-card" key={badge.uuid}>
        <div className="profile-badge-thumb">
            <img 
                src={
                    badge.imagen
                    ? `${API_URL_IMG}${badge.imagen}`
                    : `${URL_IMG}images/assets/farol.png`
                } 
                alt="Insignia" 
            />
        </div>
        <h3>{badge.nombre}</h3>
        <p>{badge.descripcion || "Logro obtenido"}</p>
    </article>
)) : (
    <p>No hay insignias todavía</p>
)}
</div>
                </section>
                {/* MIS VIDEOS FAVORITOS */}
                <section className="profile-favorites" aria-label="Mis videos favoritos">
                <header className="profile-favorites-header">
                    <h2>Mis videos favoritos</h2>
                    <Link className="profile-favorites-link" to="/favoritos">Ver todos</Link>
                </header>
                <div className="profile-videos-divider" aria-hidden="true"></div>
                <div className="profile-favorites-carousel" aria-label="Carrusel de favoritos">
                    {[1, 2, 3, 4, 5, 6].map((fav) => (
                    <article className="profile-favorite-card" key={fav}>
                        <div className="profile-favorite-thumb">
                        <img src={`${URL_IMG}images/slider/img1.jpg`} alt="Miniatura de favorito" />
                        <span className="profile-favorite-avatar">
                            <img src={`${URL_IMG}images/assets/avatar.png`} alt="Avatar" />
                        </span>
                        </div>
                    </article>
                    ))}
                </div>
                </section>

                {/* EXPLORAR AVATARS */}
                <section className="profile-avatars" aria-label="Explorar avatars">
                <header className="profile-avatars-header">
                    <h2>Explorar avatars</h2>
                </header>
                <div className="profile-avatars-bar">
                    <div className="profile-avatars-list">
                        {avatars.map((avatar) => (
                            <button 
    key={avatar.uuid} 
    className={`profile-avatar-btn ${selectedAvatar === avatar.uuid ? "is-selected" : ""}`}
    type="button"
    onClick={() => updateAvatar(avatar.uuid)}
>
                                <img 
                                    src={`${API_URL_IMG}${avatar.imagen}`} 
                                    alt={avatar.nombre} 
                                />
                            </button>
                        ))}
                        </div>
                    <Link className="profile-avatars-link" to="/avatars">Ver más</Link>
                </div>
                </section>

                {/* EXPLORAR MARCOS */}
                <section className="profile-avatars" aria-label="Explorar marcos">
                <header className="profile-avatars-header">
                    <h2>Explorar marcos</h2>
                </header>
                <div className="profile-avatars-bar">
                    <div className="profile-avatars-list">
                        {frames.map((frame) => (
                            <button 
    key={frame.uuid} 
    className={`profile-avatar-btn ${selectedFrame === frame.uuid ? "is-selected" : ""}`}
    type="button"
    onClick={() => updateFrame(frame.uuid)}
                            >
                                <img 
                                    src={`${API_URL_IMG}${frame.imagen}`} 
                                    alt={frame.nombre} 
                                />
                            </button>
                        ))}
                        </div>
                    <Link className="profile-avatars-link" to="/marcos">Ver más</Link>
                </div>
                </section>

            </div>
            </div>
        </section>

        <div className="footer-divider" aria-hidden="true">
            <img src={`${URL_IMG}images/divider.png`} alt="" />
        </div>
        </>
    );
    }