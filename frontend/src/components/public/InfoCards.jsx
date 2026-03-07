export default function InfoCards() {
  return (
    <section
      className="cards-section"
      style={{ paddingTop: "100px" }}
      aria-label="Secciones destacadas"
    >
      <div className="cards-grid">
        <article className="info-card">
          <img
            src="https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=900&q=80"
            alt="Estudiantes sonriendo en clase"
          />
          <div className="card-content">
            <h3 className="card-title">Estudiantes</h3>
            <p className="card-text">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras
              aliquet iaculis luctus. Mauris lacus mi, ornare vel nulla et,
              facilisis rutrum velit.
            </p>
          </div>
          <div className="card-overlay">
            <div className="card-links">
              <a href="#">Lorem Ipsum Sit Amet</a>
              <a href="#">Lorem Ipsum Sit Amet</a>
              <a href="#">Lorem Ipsum Sit Amet</a>
            </div>
          </div>
        </article>

        <article className="info-card">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80"
            alt="Docente frente a estudiantes"
          />
          <div className="card-content">
            <h3 className="card-title">Docentes</h3>
            <p className="card-text">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras
              aliquet iaculis luctus. Mauris lacus mi, ornare vel nulla et,
              facilisis rutrum velit.
            </p>
          </div>
          <div className="card-overlay">
            <div className="card-links">
              <a href="#">Lorem Ipsum Sit Amet</a>
              <a href="#">Lorem Ipsum Sit Amet</a>
              <a href="#">Lorem Ipsum Sit Amet</a>
            </div>
          </div>
        </article>

        <article className="info-card">
          <img
            src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=80"
            alt="Nina participando en actividad"
          />
          <div className="card-content">
            <h3 className="card-title">Encargados</h3>
            <p className="card-text">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras
              aliquet iaculis luctus. Mauris lacus mi, ornare vel nulla et,
              facilisis rutrum velit.
            </p>
          </div>
          <div className="card-overlay">
            <div className="card-links">
              <a href="#">Lorem Ipsum Sit Amet</a>
              <a href="#">Lorem Ipsum Sit Amet</a>
              <a href="#">Lorem Ipsum Sit Amet</a>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}