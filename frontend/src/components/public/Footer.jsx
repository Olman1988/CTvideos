import React from "react";

export default function Footer() {
  return (
    <footer className="site-footer" aria-label="Pie de pagina" style={{ paddingTop: "120px", paddingBottom: "80px" }}>
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">
            Nuestras <span>VOCES</span>
          </div>
          <div className="footer-socials" aria-label="Redes sociales">
            <a href="#" aria-label="Facebook"><i className="fa-brands fa-facebook-f" aria-hidden="true"></i></a>
            <a href="#" aria-label="Instagram"><i className="fa-brands fa-instagram" aria-hidden="true"></i></a>
            <a href="#" aria-label="YouTube"><i className="fa-brands fa-youtube" aria-hidden="true"></i></a>
            <a href="#" aria-label="TikTok"><i className="fa-brands fa-tiktok" aria-hidden="true"></i></a>
          </div>
        </div>

        <div className="footer-col">
          <h4>Lorem ipsum</h4>
          <ul>
            <li>Lorem ipsum.</li>
            <li>Lorem ipsum.</li>
            <li>Lorem ipsum.</li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Lorem ipsum</h4>
          <ul>
            <li>Lorem ipsum.</li>
            <li>Lorem ipsum.</li>
            <li>Lorem ipsum.</li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Lorem ipsum</h4>
          <ul>
            <li>Lorem ipsum.</li>
            <li>Lorem ipsum.</li>
            <li>Lorem ipsum.</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">Lorem ipsum dolor amet consortium ist ameost</div>
    </footer>
  );
}
