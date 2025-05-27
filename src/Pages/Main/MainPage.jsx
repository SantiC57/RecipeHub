import React, { useEffect, useState } from "react";
import { Navbar } from "../../components/Navbar/Navbar";
import { Footer } from "../../components/footer/Footer";
import { Link, useNavigate } from "react-router-dom";
import FoodCategoryBar from "../../components/FoodCategoryBar/FoodCategoryBar";
import FloatingButton from "../../components/FloatingButton/FloatingButton.jsx";
import "./Mp.css";

export default function MainPage() {
  const [recetasPublicadas, setRecetasPublicadas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const featuredRecipe = recetasPublicadas.length > 0 ? recetasPublicadas[0] : null;

  const categoryMap = {
    pastas: "/pastas",
    carnes: "/carnes",
    mariscos: "/mariscos",
    postres: "/postres",
    sopas: "/sopas"
  };

  const categories = Object.keys(categoryMap);
;

  useEffect(() => {
    fetch("https://crud-production-b855.up.railway.app/api/recetas")
      .then((res) => res.json())
      .then((data) => setRecetasPublicadas(data))
      .catch((err) => console.error("Error al cargar recetas:", err));
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const term = searchTerm.toLowerCase().trim();
      if (categoryMap[term]) {
        navigate(categoryMap[term]);
      } else {
        alert("Categoría no encontrada");
      }
    }
  };

  const filteredCategories = categories.filter((cat) =>
    cat.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-wrapper">
      <Navbar />

      <div className="main-container">
        <main className="main-content">
          <h1 className="title">Categorías Disponibles</h1>
          <FoodCategoryBar />

          <div className="parent">
            {/* Buscador y botones filtrados */}
            <div className="div1">
              <input
                type="text"
                placeholder="🔍 Buscar categoría..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              {filteredCategories.length > 0 && (
                <>
                  <h3>Categorías</h3>
                  {filteredCategories.map((category, index) => (
                    <button
                      key={index}
                      className="category-button"
                      onClick={() => navigate(categoryMap[category])}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                  ))}
                </>
              )}
            </div>

            {/* Receta destacada */}
            <div className="div2">
              {featuredRecipe ? (
                <Link to={`/recipes/${featuredRecipe.id}`} className="featured-link">
                  <h3 className="destacada-titulo">Receta destacada</h3>
                  <img
                    className="destacada-imagen"
                    src={featuredRecipe.imagen || Spaghetti}
                    alt={featuredRecipe.titulo}
                  />
                  <div className="destacada-info">{featuredRecipe.titulo}</div>
                </Link>
              ) : (
                <>
                  <h3 className="destacada-titulo">Receta destacada</h3>
                  <img
                    className="destacada-imagen"
                    alt="Receta destacada"
                  />
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
                  src={receta.imagen || Spaghetti}
                  alt={receta.titulo}
                  onClick={() => openRecipeGuide(receta.id)}
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