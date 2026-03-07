import React from "react";

export default function AboutSection() {
  return (
    <section className="about-section" aria-label="Sobre nosotros">
      <div className="about-decoration" aria-hidden="true"></div>
      <div className="about-layout">
        <div className="about-texts">
          <h2 className="about-title">Sobre el programa</h2>
          <p className="about-text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet iaculis luctus.
            Mauris lacus mi, ornare vel nulla et, facilisis rutrum velit.
          </p>
          <p className="about-text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet iaculis luctus.
            Mauris lacus mi, ornare vel nulla et, facilisis rutrum velit.
          </p>
          <p className="about-text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet iaculis luctus.
            Mauris lacus mi, ornare vel nulla et, facilisis rutrum velit.
          </p>
          <p className="about-text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet iaculis luctus.
            Mauris lacus mi, ornare vel nulla et, facilisis rutrum velit.
          </p>
          <div className="about-actions">
            <button className="btn about" type="button">Lorem Ipsum</button>
          </div>
        </div>

        <div className="about-visual">
          <div className="about-ring">
            <img
              src="images/general/nosotros.jpg"
              alt="Grupo de jovenes en circulo"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
