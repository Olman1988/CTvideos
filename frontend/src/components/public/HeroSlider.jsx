import { useState, useEffect } from "react";
import axiosInstance from "@/api/axiosInstance";
import { API_URL_IMG } from "@/config/config"; 

export default function HeroSlider() {
  const [slides, setSlides] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await axiosInstance.get("/sliders/active"); // tu endpoint
        setSlides(response.data); // asumimos que devuelve un array de objetos con los campos de la DB
      } catch (error) {
        console.error("Error al traer los sliders:", error);
      }
    };

    fetchSlides();
  }, []);

  const prevSlide = () => {
    setActiveIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setActiveIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="hero reveal is-visible" aria-label="Slider principal">
      <div className="hero-slides">
        {slides.map((slide, index) => (
          <div
            key={slide.uuid}
            className={`hero-slide ${index === activeIndex ? "is-active" : ""}`}
          >
            <img
              className="hero-image"
              src={`${API_URL_IMG}${slide.imagen_url}`}
              alt={slide.titulo}
            />
            <div className="hero-overlay" aria-hidden="true"></div>
            <div className="hero-content">
              <h2 className="hero-title">{slide.titulo}</h2>
              <p className="hero-text">{slide.descripcion}</p>
              <div className="hero-actions">
                {slide.boton1_texto && (
                  <a
                    className="btn primary"
                    href={slide.boton1_enlace || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {slide.boton1_texto}
                  </a>
                )}
                {slide.boton2_texto && (
                  <a
                    className="btn"
                    href={slide.boton2_enlace || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {slide.boton2_texto}
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        className="hero-arrow prev"
        type="button"
        aria-label="Anterior"
        onClick={prevSlide}
      >
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M15 18l-6-6 6-6"></path>
        </svg>
      </button>

      <button
        className="hero-arrow next"
        type="button"
        aria-label="Siguiente"
        onClick={nextSlide}
      >
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M9 6l6 6-6 6"></path>
        </svg>
      </button>

      <img className="hero-curve-img" src="/images/curve.png" alt="" aria-hidden="true" />
    </section>
  );
}
