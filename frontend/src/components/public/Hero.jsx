import { URL_IMG } from "@/config/config"; 

export default function Hero({ title }) {
  return (
    
      <section className="video-hero" aria-label="Portada de inicio de sesion">
      <img
              className="hero-image"
              src={`${URL_IMG}${'images/slider/img1.jpg'}`}
              alt=""
            />
      <div className="video-hero-overlay" aria-hidden="true"></div>
      <div className="video-hero-content">
        <h1 className="video-hero-title">{title}</h1>
      </div>
    </section>
 
  );
}
