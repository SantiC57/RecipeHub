import React, { useEffect, useState, useContext } from "react";
import { Navbar } from "../../components/Navbar/Navbar";
import { Footer } from "../../components/footer/Footer";
import { Link, useNavigate } from "react-router-dom";
import FoodCategoryBar from "../../components/FoodCategoryBar/FoodCategoryBar";
import FloatingButton from "../../components/FloatingButton/FloatingButton.jsx";
import Add from "../../assets/Add.ico";
import { UserContext } from "../../Pages/context/UserContext"; 
import "./Mp.css";

export default function MainPage() {
  const [recetasPublicadas, setRecetasPublicadas] = useState([]);
  const [userRecipes, setUserRecipes] = useState([]);
  const [loadingUserRecipes, setLoadingUserRecipes] = useState(false);
  const [allCategories, setAllCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const slugify = (str) =>
    str
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");

  useEffect(() => {
    fetch("https://pfv4sj6v-5000.use2.devtunnels.ms/api/recetas")
      .then((res) => res.json())
      .then((data) => {
        const sortedData = data.sort((a, b) => b.id - a.id); // ordenar por ID descendente
        setRecetasPublicadas(sortedData);

        const categoriesSet = new Set(
          sortedData.map((receta) => slugify(receta.categoria))
        );
        setAllCategories(Array.from(categoriesSet));
      })
      .catch((err) => console.error("Error al cargar recetas:", err));
  }, []);

  useEffect(() => {
    if (user && user.id) {
      setLoadingUserRecipes(true);
      fetch(`https://pfv4sj6v-5000.use2.devtunnels.ms/api/usuarios/${user.id}/recetas`)
        .then((res) => res.json())
        .then((data) => {
          // Ordenar por fecha de creación o ID descendente para obtener la más reciente
          const sortedUserRecipes = data.sort((a, b) => b.id - a.id);
          setUserRecipes(sortedUserRecipes);
        })
        .catch((err) => {
          console.error("Error al cargar recetas del usuario:", err);
          setUserRecipes([]);
        })
        .finally(() => {
          setLoadingUserRecipes(false);
        });
    }
  }, [user]);

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

  const filteredCategories = allCategories.filter(
    (cat) => cat.includes(slugify(searchTerm)) && searchTerm !== ""
  );

  const latestUserRecipe = userRecipes.length > 0 ? userRecipes[0] : null;
  const featuredRecipe = recetasPublicadas.length > 0 ? recetasPublicadas[0] : null;

  return (
    <div className="page-wrapper">
      <Navbar />

      <div className="main-container">
        <main className="main-content">
          <h1 className="title">Categorías Principales</h1>
          <FoodCategoryBar />

          <div className="content-grid">
            <div className="div1">
              <input
                type="text"
                placeholder="🔍 Buscar categoría..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="off"
              />

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

            <div className="div2">
              {user && (
                <>
                  {loadingUserRecipes ? (
                    <div className="loading-state">
                      <p>Cargando tus recetas...</p>
                    </div>
                  ) : latestUserRecipe ? (
                    <Link to={`/recipes/${latestUserRecipe.id}`} className="featured-link">
                      <h3 className="destacada-titulo">Mis Recetas</h3>
                      <img
                        className="destacada-imagen"
                        src={latestUserRecipe.imagen}
                        alt={latestUserRecipe.titulo}
                        loading="lazy"
                      />
                      <div className="featured-overlay">
                        <span className="featured-badge">¡Tu Receta!</span>
                      </div>
                      <div className="destacada-info">{latestUserRecipe.titulo}</div>
                    </Link>
                  ) : (
                    <section className="start-cooking">
                      <img src={Add} alt="Icono de agregar receta" />
                      <h2 className="start-cooking__title">¿Listo para Cocinar?</h2>
                      <p className="start-cooking__subtitle">Comienza creando tu primera receta</p>
                      <Link to="/publication">
                        <button className="start-cooking__button">Crear Receta</button>
                      </Link>
                    </section>
                  )}
                </>
              )}

              {!user && (
                <>
                  {featuredRecipe ? (
                    <Link to={`/recipes/${featuredRecipe.id}`} className="featured-link">
                      <h3 className="destacada-titulo">Receta Destacada</h3>
                      <img
                        className="destacada-imagen"
                        src={featuredRecipe.imagen}
                        alt={featuredRecipe.titulo}
                        loading="lazy"
                      />
                      <div className="featured-overlay">
                        <span className="featured-badge">¡Nueva!</span>
                      </div>
                      <div className="destacada-info">{featuredRecipe.titulo}</div>
                    </Link>
                  ) : (
                    <div className="no-featured-recipe">
                      <h3 className="destacada-titulo">Receta destacada</h3>
                      <div className="destacada-imagen-placeholder">
                        <span>Sin imagen disponible</span>
                      </div>
                      <div className="destacada-info">Sin receta destacada</div>
                    </div>
                  )}
                </>

              )}

            </div>
          </div>
          <div className="recent-section">
            <h2 className="recent-title">Recetas Recientes</h2>
            <div className="recetas-grid">
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
          </div>

        </main>

        <FloatingButton supportPageUrl="/support" />
      </div>

      <Footer />
    </div>
  );
}