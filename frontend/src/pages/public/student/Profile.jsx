import { Link } from "react-router-dom";
import { URL_IMG } from "@/config/config";
import Hero from "@/components/public/Hero"; 

export default function Profile() {
  // Nota: En un caso real, estos datos vendrían del localStorage o una API
  const user = JSON.parse(localStorage.getItem("user")) || {};
    console.log(user);
  return (
    <>
    <Hero title={user.nombre}/>
      <section className="profile-detail" aria-label="Detalle del perfil">
        <div className="profile-detail-inner">
          
          {/* SIDEBAR */}
          <aside className="profile-sidebar" aria-label="Resumen del perfil">
            <article className="profile-summary"> 
              <div className="profile-summary-cover">
                <img 
                  className="profile-summary-cover-image" 
                  src={`${URL_IMG}images/slider/img1.jpg`} 
                  alt="Patron morado" 
                />
                <div className="profile-summary-avatar">
                  <img src={`${URL_IMG}images/assets/avatar.png`} alt="Avatar" />
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
                {[1, 2, 3].map((video) => (
                  <article className="profile-video-card" key={video}>
                    <div className="profile-video-thumb">
                      <img src={`${URL_IMG}images/slider/img1.jpg`} alt="Miniatura" />
                      <span className="profile-video-avatar">
                        <img src={`${URL_IMG}images/assets/avatar.png`} alt="Avatar" />
                      </span>
                    </div>
                    <h3>Título Video {video}</h3>
                    <span className="profile-video-pill">Categoría</span>
                  </article>
                ))}
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
                {[1, 2, 3, 4].map((badge) => (
                  <article className="profile-badge-card" key={badge}>
                    <div className="profile-badge-thumb">
                      <img src={`${URL_IMG}images/assets/farol.png`} alt="Insignia" />
                    </div>
                    <h3>Insignia {badge}</h3>
                    <p>Logro obtenido</p>
                  </article>
                ))}
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
                <div className="profile-avatars-list" aria-label="Listado de avatars">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                    <button key={num} className="profile-avatar-btn" type="button" aria-label={`Avatar ${num}`}>
                    <img src={`${URL_IMG}images/assets/avatar.png`} alt={`Avatar ${num}`} />
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
                <div className="profile-avatars-list" aria-label="Listado de marcos">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                    <button key={num} className="profile-avatar-btn" type="button" aria-label={`Marco ${num}`}>
                    <img src={`${URL_IMG}images/assets/avatar.png`} alt={`Marco ${num}`} />
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