import React, { useEffect, useState } from "react";
import { Navbar } from "../../components/Navbar/Navbar";
import { Footer } from "../../components/footer/Footer";
import { Link, useNavigate } from "react-router-dom";
import FoodCategoryBar from "../../components/FoodCategoryBar/FoodCategoryBar";
import FloatingButton from "../../components/FloatingButton/FloatingButton.jsx";
import "./Mp.css";

export default function MainPage() {
  const [recetasPublicadas, setRecetasPublicadas] = useState([]);
  const [allCategories, setAllCategories] = useState([]); // Categorías dinámicas
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const slugify = (str) =>
    str
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');

  const featuredRecipe = recetasPublicadas.length > 0 ? recetasPublicadas[0] : null;

  useEffect(() => {
    fetch("https://crud-production-b855.up.railway.app/api/recetas")
      .then((res) => res.json())
      .then((data) => {
        setRecetasPublicadas(data);
        // Extraer categorías únicas y "slugificadas"
        const categoriesSet = new Set(
          data.map(receta => slugify(receta.categoria))
        );
        setAllCategories(Array.from(categoriesSet));
      })
      .catch((err) => console.error("Error al cargar recetas:", err));
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const term = slugify(searchTerm);
      if (allCategories.includes(term)) {
        navigate(`/${term}`);
      } else {
        alert("Categoría no encontrada");
      }
    }
  };

  // Filtrar categorías para mostrar sugerencias según búsqueda
  const filteredCategories = allCategories.filter(
    (cat) => cat.includes(slugify(searchTerm)) && searchTerm !== ""
  );

  return (
    <div className="page-wrapper">
      <Navbar />

      <div className="main-container">
        <main className="main-content">
          <h1 className="title">Categorías Disponibles</h1>
          <FoodCategoryBar />

          <div className="parent">
            <div className="div1">
              <input
                type="text"
                placeholder="🔍 Buscar categoría..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="off"
              />

              {/* Mostrar sugerencias solo si hay texto y coincidencias */}
              {filteredCategories.length > 0 && (
                <>
                  <h3>Sugerencias</h3>
                  {filteredCategories.map((cat, index) => (
                    <button
                      key={index}
                      className="category-button"
                      onClick={() => navigate(`/${cat}`)}
                    >
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </button>
                  ))}
                </>
              )}
            </div>

            {/* Receta destacada */}
            <div className="div2">
              {featuredRecipe ? (
                <Link to={`/receta/${featuredRecipe.id}`} className="featured-link">
                  <h3 className="destacada-titulo">Receta destacada</h3>
                  <img
                    className="destacada-imagen"
                    src={featuredRecipe.imagen}
                    alt={featuredRecipe.titulo}
                  />
                  <div className="destacada-info">{featuredRecipe.titulo}</div>
                </Link>
              ) : (
                <>
                  <h3 className="destacada-titulo">Receta destacada</h3>
                  <img className="destacada-imagen" alt="Receta destacada" />
                  <div className="destacada-info">Sin receta destacada</div>
                </>
              )}
            </div>

            {/* Resto de recetas */}
            {recetasPublicadas.slice(1, 7).map((receta) => (
              <Link
                key={receta.id}
                to={`/recipes/${receta.id}`}
                className="receta"
              >
                <img
                  className="imagen-circular"
                  src={receta.imagen}
                  alt={receta.titulo}
                />
                <p>{receta.titulo}</p>
              </Link>
            ))}
          </div>
        </main>

        <FloatingButton supportPageUrl="/support" />
      </div>

      <Footer />
    </div>
  );
}
