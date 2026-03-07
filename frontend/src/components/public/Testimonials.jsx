import { useEffect, useState, useRef } from "react";
import axiosInstance from "@/api/axiosInstance";
import { API_URL_IMG } from "@/config/config";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const timerRef = useRef(null);

  // 🔹 Fetch testimonios
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await axiosInstance.get("/testimonies/active");
        const activos = res.data
          .filter(t => Number(t.activo) === 1)
          .map(t => ({
            text: t.mensaje,
            name: t.nombre,
            avatar: `${API_URL_IMG}${t.imagen}`
          }));
        setTestimonials(activos);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTestimonials();
  }, []);

  // 🔹 Autoplay solo móvil
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 640px)");

    const start = () => {
      if (timerRef.current) return;
      timerRef.current = setInterval(() => {
        changeSlide((prev) => (prev + 1) % testimonials.length);
      }, 4000);
    };

    const stop = () => {
      clearInterval(timerRef.current);
      timerRef.current = null;
    };

    const handleMedia = () => {
      stop();
      if (mediaQuery.matches && testimonials.length > 1) start();
    };

    mediaQuery.addEventListener("change", handleMedia);
    handleMedia();

    return () => {
      stop();
      mediaQuery.removeEventListener("change", handleMedia);
    };
  }, [testimonials]);

  // 🔹 Cambiar slide con transición
  const changeSlide = (newIndexOrFn) => {
    if (!testimonials.length) return;
    setVisible(false); // fade out
    setTimeout(() => {
      setIndex((prev) =>
        typeof newIndexOrFn === "function" ? newIndexOrFn(prev) : newIndexOrFn
      );
      setVisible(true); // fade in
    }, 300); // 300ms = duración de la transición CSS
  };

  if (!testimonials.length) return null;

  const current = testimonials[index];

  return (
    <section
      className="testimonials"
      aria-label="Testimonios"
      style={{ paddingTop: "150px", paddingBottom: "150px" }}
    >
      {/* Wave superior */}
      <svg
        className="testimonial-wave"
        viewBox="0 0 1200 70"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0,30 C200,60 400,60 600,30 C800,0 1000,0 1200,30 L1200,70 L0,70 Z"
          fill="#d39b2b"
        />
      </svg>

      <div className="testimonials-inner">
        <h2 className="testimonials-title">Que dicen los tutores</h2>
        <p className="testimonials-text" style={{ width: "400px" }}>
          Conozca la experiencia de nuestros tutores en la plataforma.
        </p>

        <div className="testimonial-card" style={{ position: "relative" }}>
          {/* Flecha anterior */}
          <button
            className="testimonial-nav prev"
            type="button"
            onClick={() =>
              changeSlide((index - 1 + testimonials.length) % testimonials.length)
            }
            aria-label="Anterior"
          >
            <ArrowBackIcon color="secondary" fontSize="small" />
          </button>

          {/* Flecha siguiente */}
          <button
            className="testimonial-nav next"
            type="button"
            onClick={() =>
              changeSlide((index + 1) % testimonials.length)
            }
            aria-label="Siguiente"
          >
            <ArrowForwardIcon color="secondary" fontSize="small" />
          </button>

          {/* Testimonio */}
          <div style={{ textAlign: "center", minHeight: "150px" }}>
            <p
              id="testimonial-text"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(20px)",
                transition: "opacity 0.3s ease-in-out, transform 0.3s ease-in-out",
                fontSize: "18px",
                marginBottom: "20px",
              }}
            >
              {current.text}
            </p>

            {/* Autor */}
            <div className="testimonial-author" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <img
                id="testimonial-avatar"
                src={current.avatar}
                alt={current.name}
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  marginBottom: "10px",
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(20px)",
                  transition: "opacity 0.3s ease-in-out, transform 0.3s ease-in-out",
                }}
              />
              <span
                id="testimonial-name"
                style={{
                  fontWeight: "bold",
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(20px)",
                  transition: "opacity 0.3s ease-in-out, transform 0.3s ease-in-out",
                }}
              >
                {current.name}
              </span>
            </div>
          </div>
        </div>

        {/* Dots */}
        <div className="testimonial-dots" style={{ marginTop: "20px" }}>
          {testimonials.map((_, i) => (
            <span
              key={i}
              className={i === index ? "is-active" : ""}
              onClick={() => changeSlide(i)}
              style={{
                display: "inline-block",
                width: "10px",
                height: "10px",
                margin: "0 5px",
                borderRadius: "50%",
                backgroundColor: i === index ? "#d39b2b" : "#ccc",
                cursor: "pointer",
                transition: "background-color 0.3s",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
