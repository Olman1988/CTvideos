export default function TriviaCTA() {
  return (
    <section className="cta-hero" aria-label="Trivias">
      <svg
        className="cta-wave"
        viewBox="0 0 1200 80"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0,40 C200,70 400,70 600,40 C800,10 1000,10 1200,40 L1200,0 L0,0 Z"
          fill="#f2f2f2"
        />
      </svg>
      <div className="cta-inner" style={{ paddingTop: "100px", paddingBottom: "60px" }}>
        <div className="cta-texts">
          <h2 className="cta-title">¡Jugá con nuestras trivias!</h2>
          <p className="cta-text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet iaculis luctus.
            Mauris lacus mi, ornare vel nulla et, facilisis rutrum velit. Vivamus ut dui molestie.
          </p>
          <button className="cta-button" type="button">
            Lorem Ipsum
          </button>
        </div>
        <div className="cta-visual">
          <div className="cta-kite" aria-hidden="true"></div>
          <div className="cta-card">
            <img src="images/general/trivia.jpg" alt="Vista previa de trivia" />
          </div>
          <div className="cta-deco" aria-hidden="true"></div>
        </div>
      </div>
    </section>
  );
}