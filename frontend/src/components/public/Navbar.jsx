import React from "react";

export default function Navbar() {
  return (
    <nav className="navbar" aria-label="Navegacion principal">
      <div className="brand">
        <div className="brand-logo" aria-label="Nuestras Voces">
          <img src="/images/logo.png" alt="Logo" width="70%" />
        </div>
      </div>

      <div className="nav-links">
        <a className="is-active" href="#">Inicio</a>
        <a href="#">Galeria</a>
        <a href="#">¿Quienes somos?</a>
        <a href="#">Retos y Trivias</a>
        <a href="#">Recursos</a>
      </div>

      <div className="nav-actions">
        <span className="icon icon-home" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
            <path d="M12 3l9 7v10a2 2 0 0 1-2 2h-4v-6H9v6H5a2 2 0 0 1-2-2V10l9-7z" />
          </svg>
        </span>

        <span className="search">
          <label className="search-field">
            <span className="icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input type="text" placeholder="Buscador" aria-label="Buscador" />
          </label>
        </span>

        <button className="menu-btn" type="button" aria-label="Menu" aria-expanded="false">
          <span></span>
        </button>
      </div>

      <div className="desktop-panel" aria-label="Menu escritorio">
        <a href="#">Registrarme</a>
        <a href="#">Login</a>
        <a href="#">Conocer mas</a>
      </div>

      <div className="mobile-panel" aria-label="Menu movil">
        <a href="#">Galeria</a>
        <a href="#">¿Quienes somos?</a>
        <a href="#">Retos y Trivias</a>
        <a href="#">Recursos</a>
        <span className="search">
          <label className="search-field">
            <span className="icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input type="text" placeholder="Buscador" aria-label="Buscador" />
          </label>
        </span>
      </div>
    </nav>
  );
}
