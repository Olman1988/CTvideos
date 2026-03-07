import { useState, useEffect } from "react";
import axiosInstance from "@/api/axiosInstance";
import { API_URL_IMG } from "@/config/config"; 

export default function CategoriesSection() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/categories/active"); // tu endpoint
        setCategories(response.data); // asumimos que devuelve un array de objetos con uuid, nombre, descripcion, imagen, estado_catalogo
      } catch (error) {
        console.error("Error al traer las categorias:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="categories-section" aria-label="Categorias relevantes">
      <div className="categories-inner">
        <h2 className="categories-title">Categorias relevantes</h2>
        <p className="categories-text">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet iaculis luctus.
          Mauris lacus mi, ornare vel nulla et, facilisis rutrum velit.
        </p>

        <div className="categories-carousel">
          <div className="categories-track">
            {categories.map((cat) => (
              <article key={cat.uuid} className="category-card">
                <div className="category-media">
                  <img src={`${API_URL_IMG}${cat.imagen}`} alt={cat.nombre} />
                </div>
                <div className="category-name">{cat.nombre}</div>
                <div className="category-desc">{cat.descripcion}</div>
                <a className="category-btn" href="#">
                  Lorem Ipsum
                </a>
              </article>
            ))}
          </div>
        </div>

        <div className="carousel-dots" aria-label="Indicadores"></div>
      </div>
    </section>
  );
}
