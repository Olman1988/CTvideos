import React from "react";
export default function LogoStrip() {
  const logos = [
    { src: "images/logos/log1.png", alt: "Logo Costa Rica" },
    { src: "images/logos/log2.png", alt: "Logo Ministerio de Cultura y Juventud" },
    { src: "images/logos/log3.png", alt: "Logo La Libertad" },
    { src: "images/logos/log4.png", alt: "Logo OEI" },
  ];

  return (
    <section className="logo-strip" aria-label="Aliados">
      <div className="logo-track">
        {logos.map((logo, index) => (
          <React.Fragment key={index}>
            <div className="logo-item">
              <img src={logo.src} alt={logo.alt} />
            </div>
            {/* Agregar separador entre logos, excepto después del último */}
            {index < logos.length - 1 && <div className="logo-divider" aria-hidden="true"></div>}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}
