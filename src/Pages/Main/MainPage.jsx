import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

// Components
import { Navbar } from "../../components/Navbar/Navbar";
import { Footer } from "../../components/footer/Footer";
import SearchBar from "../../components/Search/SearchBar.jsx";
import FoodCategoryBar from "../../components/FoodCategoryBar/FoodCategoryBar";
import FloatingButton from "../../components/FloatingButton/FloatingButton.jsx";

// Hooks
import { useSearch } from "../../hooks/useSearch.js";
import { useRecipes } from "../../hooks/useRecipes.js";
import { useRecipeDetails } from "../../hooks/useRecipeDetails.js";

// Context
import { UserContext } from "../../Pages/context/UserContext"; 
import { useFavorites } from "../context/FavoriteContext";

// Utils
import { slugify, getAvatarUrl } from "../../lib/utils";

// Assets
import Add from "../../assets/Add.ico";

// Styles
import "./Mp.css";

function MainPage() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const { user } = useContext(UserContext);
  const { toggleLike, isLiked } = useFavorites();
  const navigate = useNavigate();

  // Custom hooks
  const {
    recetasPublicadas,
    allUsers,
    allCategories,
    loadingUserRecipes,
    getLatestUserRecipe,
    getFeaturedRecipe,
    getRecentRecipes
  } = useRecipes(user);

  const {
    searchTerm,
    searchResults,
    isSearching,
    handleSearch,
    hasResults,
    getFirstResult
  } = useSearch(recetasPublicadas, allCategories, allUsers);

  const {
    hoveredRecipe,
    recipeDetails,
    loadingDetails,
    handleRecipeHover,
    handleRecipeLeave
  } = useRecipeDetails();


  // Función para manejar el toggle de likes
  const handleToggleLike = async (recipeId, event) => {
    event.preventDefault();
    event.stopPropagation();
    
    // Verificar si el usuario está logueado
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    
    // Encontrar la receta completa para pasarla al contexto
    const recipe = recetasPublicadas.find(r => r.id === recipeId);
    
    // Pasar tanto el ID como los datos completos de la receta
    await toggleLike(recipeId, recipe);
  };

  // Función para cerrar el modal
  const closeAuthModal = () => {
    setShowAuthModal(false);
  };

  // Función para manejar click en el overlay del modal
  const handleModalOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeAuthModal();
    }
  };

  // Componente del corazón SVG
  const HeartIcon = ({ recipeId, className = "" }) => {
    const liked = user ? isLiked(recipeId) : false;
    
    return (
      <button 
        className={`heart-button ${className} ${liked ? 'liked' : ''}`}
        onClick={(e) => handleToggleLike(recipeId, e)}
        aria-label={liked ? "Quitar de favoritos" : "Agregar a favoritos"}
      >
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill={liked ? "#e53e3e" : "none"} 
          stroke={liked ? "#e53e3e" : "currentColor"} 
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </button>
    );
  };

  // Componente del Modal de Autenticación
  const AuthModal = () => {
    return (
      <div className="auth-modal-overlay" onClick={handleModalOverlayClick}>
        <div className="auth-modal">
          <button 
            className="auth-modal-close" 
            onClick={closeAuthModal}
            aria-label="Cerrar modal"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
          
          <div className="auth-modal-content">
            <div className="auth-modal-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="#e53e3e" stroke="#e53e3e" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            
            <h2 className="auth-modal-title">
              ¿Quieres tener una lista de tus recetas favoritas?
            </h2>
            
            <p className="auth-modal-description">
              Inicia sesión para guardar tus recetas favoritas y acceder a ellas en cualquier momento. 
              ¡Crea tu colección personal de recetas deliciosas!
            </p>
            
            <div className="auth-modal-features">
              <div className="auth-feature">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e8b44a" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                <span>Guarda tus recetas favoritas</span>
              </div>
              
              <div className="auth-feature">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e8b44a" strokeWidth="2">
                  <path d="M9 11H1v6h8v-6z"/>
                  <path d="m15 11l-8 0"/>
                  <path d="m20 4l-8 0"/>
                  <path d="M7 4h1v3H7V4z"/>
                  <circle cx="20" cy="11" r="2"/>
                </svg>
                <span>Organiza tu colección personal</span>
              </div>
              
              <div className="auth-feature">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e8b44a" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                <span>Comparte y descubre nuevas recetas</span>
              </div>
            </div>
            
            <div className="auth-modal-actions">
              <Link 
                to="/login" 
                className="auth-modal-button auth-modal-button--primary"
                onClick={closeAuthModal}
              >
                Iniciar Sesión
              </Link>
              
              <Link 
                to="/signup" 
                className="auth-modal-button auth-modal-button--secondary"
                onClick={closeAuthModal}
              >
                Crear Cuenta
              </Link>
            </div>
            
            <button 
              className="auth-modal-skip" 
              onClick={closeAuthModal}
            >
              Continuar sin cuenta
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Componente del Tooltip de Recetas
  const RecipeTooltip = ({ recipe, details, isLoading, isFeatured = false }) => {
    if (isLoading) {
      return (
        <div className={`recipe-tooltip ${isFeatured ? 'featured-tooltip' : ''}`}>
          <div className="tooltip-loading">
            <div className="loading-spinner"></div>
            <span>Cargando detalles...</span>
          </div>
        </div>
      );
    }

    if (!details) return null;

    return (
      <div className={`recipe-tooltip ${isFeatured ? 'featured-tooltip' : ''}`}>
        <div className="tooltip-header">
          <h4 className="tooltip-title">{details.titulo}</h4>
          <span className="tooltip-category">{details.categoria}</span>
        </div>
        
        <div className="tooltip-author">
          <img 
            src={getAvatarUrl(details.autor)} 
            alt={details.autor?.name || 'Usuario'} 
            className="author-avatar"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=U&background=e8b44a&color=fff&size=40&font-size=0.6`;
            }}
          />
          <span className="author-name">Por: {details.autor?.name || 'Usuario'}</span>
        </div>

        <div className="tooltip-times">
          <div className="time-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12,6 12,12 16,14"/>
            </svg>
            <span>Prep: {details.tiempo || 'No especificado'}</span>
          </div>
          {details.coccion && (
            <div className="time-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6.13 1L6 16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V1"/>
                <path d="M10 18v3"/>
                <path d="M14 18v3"/>
                <path d="M4 18h16"/>
              </svg>
              <span>Cocción: {details.coccion}</span>
            </div>
          )}
        </div>

        <div className="tooltip-ingredients">
          <h5>Ingredientes principales:</h5>
          <p>{details.ingredientes ? details.ingredientes.substring(0, 100) + '...' : 'No especificados'}</p>
        </div>

        <div className="tooltip-footer">
          <span className="tooltip-hint">Click para ver receta completa</span>
        </div>
      </div>
    );
  };

  return (
    <div className="page-wrapper">
      <Navbar />

      <div className="main-container">
        <main className="main-content">
          <h1 className="title">Categorías Principales</h1>
          <FoodCategoryBar />

          <div className="content-grid">
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={handleSearch}
              searchResults={searchResults}
              isSearching={isSearching}
              hasResults={hasResults}
              getFirstResult={getFirstResult}
            />

            <div className="recipe-card">
              {user ? (
                <>
                  {loadingUserRecipes ? (
                    <div className="loading-state">
                      <p>Cargando tus recetas...</p>
                    </div>
                  ) : getLatestUserRecipe ? (
                    <Link to={`/myrecipes/${user.id}`} className="featured-link">
                      <h3 className="destacada-titulo">Mis Recetas</h3>
                      <img
                        className="destacada-imagen"
                        src={getLatestUserRecipe.imagen}
                        alt={getLatestUserRecipe.titulo}
                        loading="lazy"
                      />
                      <div className="featured-overlay">
                        <span className="featured-badge">¡Tu Receta!</span>
                      </div>
                      <div className="destacada-info">{getLatestUserRecipe.titulo}</div>
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
              ) : (
                <>
                  {getFeaturedRecipe ? (
                    <div className="featured-recipe-wrapper">
                      <Link 
                        to={`/recipes/${getFeaturedRecipe.id}`} 
                        className="featured-link"
                        onMouseEnter={() => handleRecipeHover(getFeaturedRecipe.id)}
                        onMouseLeave={handleRecipeLeave}
                      >
                        <h3 className="destacada-titulo">Receta Destacada</h3>
                        <img
                          className="destacada-imagen"
                          src={getFeaturedRecipe.imagen}
                          alt={getFeaturedRecipe.titulo}
                          loading="lazy"
                        />
                        <div className="featured-overlay">
                          <span className="featured-badge">¡Nueva!</span>
                        </div>
                        <div className="destacada-info">{getFeaturedRecipe.titulo}</div>
                      </Link>
                      
                      {/* Corazón para receta destacada */}
                      <HeartIcon recipeId={getFeaturedRecipe.id} className="featured-heart" />
                      
                      {hoveredRecipe === getFeaturedRecipe.id && (
                        <RecipeTooltip 
                          recipe={getFeaturedRecipe}
                          details={recipeDetails[getFeaturedRecipe.id]}
                          isLoading={loadingDetails[getFeaturedRecipe.id]}
                          isFeatured={true}
                        />
                      )}
                    </div>
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
            {user ? (
              <> 
                <h2 className="recent-title">Otras Recetas Recientes</h2>
                <div className="recetas-grid">
                  {getRecentRecipes.length > 0 ? (
                    getRecentRecipes.slice(0, 7).map((receta) => (
                      <div key={receta.id} className="recipe-wrapper">
                        <Link
                          to={`/recipes/${receta.id}`}
                          className="receta"
                          onMouseEnter={() => handleRecipeHover(receta.id)}
                          onMouseLeave={handleRecipeLeave}
                        >
                          <img
                            className="imagen-circular"
                            src={receta.imagen}
                            alt={receta.titulo}
                            loading="lazy"
                          />
                          <p>{receta.titulo}</p>
                        </Link>
                        
                        {/* Corazón para recetas del grid */}
                        <HeartIcon recipeId={receta.id} className="grid-heart" />
                        
                        {hoveredRecipe === receta.id && (
                          <RecipeTooltip 
                            recipe={receta}
                            details={recipeDetails[receta.id]}
                            isLoading={loadingDetails[receta.id]}
                          />
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="no-recipes-message">
                      <p>No hay más recetas disponibles</p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <h2 className="recent-title">Recetas Recientes</h2>
                <div className="recetas-grid">
                  {getRecentRecipes.length > 0 ? (
                    getRecentRecipes.slice(1, 7).map((receta) => (
                      <div key={receta.id} className="recipe-wrapper">
                        <Link
                          to={`/recipes/${receta.id}`}
                          className="receta"
                          onMouseEnter={() => handleRecipeHover(receta.id)}
                          onMouseLeave={handleRecipeLeave}
                        >
                          <img
                            className="imagen-circular"
                            src={receta.imagen}
                            alt={receta.titulo}
                            loading="lazy"
                          />
                          <p>{receta.titulo}</p>
                        </Link>
                        
                        {/* Corazón para recetas del grid */}
                        <HeartIcon recipeId={receta.id} className="grid-heart" />
                        
                        {hoveredRecipe === receta.id && (
                          <RecipeTooltip 
                            recipe={receta}
                            details={recipeDetails[receta.id]}
                            isLoading={loadingDetails[receta.id]}
                          />
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="no-recipes-message">
                      <p>No hay más recetas disponibles</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </main>

        <FloatingButton supportPageUrl="/support" />
      </div>

      <Footer />
      
      {/* Modal de Autenticación */}
      {showAuthModal && <AuthModal />}
    </div>
  );
}

export default MainPage;